// ─── State ──────────────────────────────────────────────
const state = {
  meta: {
    title: '', date: '', location: '', camera: '',
    cover: '', ratio: '3/2', intro: '', translation: '',
    permalink: '', hideTitle: true
  },
  nodes: [],
  shelf: [] // { filename, location, ratio, objectUrl, camera }
};

function uid() { return crypto.randomUUID(); }

// ─── Keyboard shortcuts ─────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMarkdownModal();
    return;
  }

  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  switch (e.key.toLowerCase()) {
    case 't': e.preventDefault(); toggleShelf(); break;
    case 'm': e.preventDefault(); toggleSidebar(); break;
    case 'e': e.preventDefault(); openMarkdownModal(); break;
    case 'n': e.preventDefault(); newReportage(); break;
  }
});

function newReportage() {
  if (!confirm('Start a new reportage? This will clear everything.')) return;
  // Revoke object URLs
  state.shelf.forEach(s => { if (s.objectUrl) URL.revokeObjectURL(s.objectUrl); });
  state.meta = {
    title: '', date: '', location: '', camera: '',
    cover: '', ratio: '3/2', intro: '', translation: '',
    permalink: '', hideTitle: true
  };
  state.nodes = [];
  state.shelf = [];
  localStorage.removeItem('reportage-editor-state');
  localStorage.removeItem('reportage-editor-images');
  syncMetaUI();
  renderShelf();
  renderCanvas();
}

function getAllPhotos(nodes) {
  const photos = [];
  for (const n of (nodes || state.nodes)) {
    if (n.type === 'photo') photos.push(n);
    else if (n.children) photos.push(...getAllPhotos(n.children));
  }
  return photos;
}

function findNode(id, nodes) {
  for (const n of (nodes || state.nodes)) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(id, n.children);
      if (found) return found;
    }
  }
  return null;
}

function findParent(id, nodes, parent) {
  for (const n of (nodes || state.nodes)) {
    if (n.id === id) return { parent, list: nodes || state.nodes };
    if (n.children) {
      const found = findParent(id, n.children, n);
      if (found) return found;
    }
  }
  return null;
}

function isDescendantOf(nodeId, ancestorId) {
  const ancestor = findNode(ancestorId);
  if (!ancestor || !ancestor.children) return false;
  for (const child of ancestor.children) {
    if (child.id === nodeId) return true;
    if (child.children && isDescendantOf(nodeId, child.id)) return true;
  }
  return false;
}

function animateOut(el, callback) {
  let called = false;
  const done = () => { if (!called) { called = true; callback(); } };
  el.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out';
  el.style.opacity = '0';
  el.style.transform = 'scale(0.97)';
  el.addEventListener('transitionend', done, { once: true });
  setTimeout(done, 180);
}

function removeNode(id) {
  const el = document.querySelector(`.node[data-id="${id}"]`);
  const doRemove = () => {
    const node = findNode(id);
    const info = findParent(id);
    if (!info) return;
    const idx = info.list.findIndex(n => n.id === id);
    if (idx >= 0) info.list.splice(idx, 1);
    // If the parent container is now empty, remove it too (but only one level up)
    if (info.parent && info.list.length === 0) {
      const grandparent = findParent(info.parent.id);
      if (grandparent) {
        const pIdx = grandparent.list.findIndex(n => n.id === info.parent.id);
        if (pIdx >= 0) grandparent.list.splice(pIdx, 1);
      }
    }
    renderCanvas();
  };
  if (el) {
    animateOut(el, doRemove);
  } else {
    doRemove();
  }
}

// ─── Persistence (IndexedDB for images, localStorage for state) ───
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('reportage-editor', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('images');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveImage(filename, blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    tx.objectStore('images').put(blob, filename);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function loadImage(filename) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readonly');
    const req = tx.objectStore('images').get(filename);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteImage(filename) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    tx.objectStore('images').delete(filename);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function saveState() {
  const data = JSON.parse(JSON.stringify(state));
  data.shelf.forEach(s => delete s.objectUrl);
  localStorage.setItem('reportage-editor-state', JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem('reportage-editor-state');
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    Object.assign(state.meta, data.meta || {});
    state.nodes = data.nodes || [];
    state.shelf = (data.shelf || []).map(s => ({ ...s, objectUrl: null }));
    return true;
  } catch { return false; }
}

async function restoreImages() {
  for (const entry of state.shelf) {
    const blob = await loadImage(entry.filename);
    if (blob) {
      entry.objectUrl = URL.createObjectURL(blob);
    }
  }
  renderShelf();
  renderCanvas();
}

// ─── Meta ───────────────────────────────────────────────
function updateMeta(key, value) {
  state.meta[key] = value;
  if (key === 'cover' && value) {
    // Auto-set ratio from the cover photo's ratio
    const photo = getShelfPhoto(value) || getAllPhotos().find(p => p.filename === value);
    if (photo && photo.ratio) {
      state.meta.ratio = photo.ratio;
      document.getElementById('meta-ratio').value = photo.ratio;
    }
  }
  saveState();
  if (key === 'cover') return;
  updateCoverDropdown();
}

function syncMetaUI() {
  document.getElementById('meta-title').value = state.meta.title;
  document.getElementById('meta-date').value = state.meta.date;
  document.getElementById('meta-location').value = state.meta.location;
  document.getElementById('meta-camera').value = state.meta.camera;
  document.getElementById('meta-ratio').value = state.meta.ratio;
  document.getElementById('meta-intro').value = state.meta.intro;
  document.getElementById('meta-translation').value = state.meta.translation;
  updateCoverDropdown();
}

function updateCoverDropdown() {
  const sel = document.getElementById('meta-cover');
  const photos = getAllPhotos();
  const current = state.meta.cover;
  sel.innerHTML = '<option value="">— Select —</option>' +
    photos.map(p => `<option value="${p.filename}"${p.filename === current ? ' selected' : ''}>${p.filename}</option>`).join('');
}

function toggleMeta() {
  toggleSidebar();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('sidebarToggleBtn');
  sidebar.classList.toggle('is-open');
  btn.classList.toggle('is-active', sidebar.classList.contains('is-open'));
  localStorage.setItem('reportage-editor-sidebar', sidebar.classList.contains('is-open') ? 'open' : 'collapsed');
}

function toggleShelf() {
  const panel = document.getElementById('shelfPanel');
  const btn = document.getElementById('shelfToggleBtn');
  panel.classList.toggle('is-open');
  const isOpen = panel.classList.contains('is-open');
  btn.classList.toggle('is-active', isOpen);
  localStorage.setItem('reportage-editor-shelf', isOpen ? 'open' : 'collapsed');
}

(function initShelf() {
  if (localStorage.getItem('reportage-editor-shelf') !== 'collapsed') {
    document.getElementById('shelfPanel').classList.add('is-open');
    document.getElementById('shelfToggleBtn').classList.add('is-active');
  }
})();

(function initSidebar() {
  if (localStorage.getItem('reportage-editor-sidebar') === 'open') {
    document.getElementById('sidebar').classList.add('is-open');
    document.getElementById('sidebarToggleBtn').classList.add('is-active');
  }
})();

// Shelf resize (horizontal)
(function() {
  const handle = document.getElementById('shelfResize');
  const panel = document.getElementById('shelfPanel');
  let startX, startW;

  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    startX = e.clientX;
    startW = panel.offsetWidth;
    panel.style.transition = 'none';
    handle.classList.add('is-active');
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  function onMove(e) {
    const w = Math.max(120, startW + (e.clientX - startX));
    panel.style.width = w + 'px';
  }

  function onUp() {
    panel.style.transition = '';
    handle.classList.remove('is-active');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
})();

// ─── Photo Shelf ────────────────────────────────────────

function shelfDragOver(e) {
  e.preventDefault();
  document.getElementById('shelf').classList.add('is-dragover');
}
function shelfDragLeave(e) {
  const shelf = document.getElementById('shelf');
  if (!shelf.contains(e.relatedTarget)) {
    shelf.classList.remove('is-dragover');
    shelf.querySelectorAll('.shelf__reorder-indicator').forEach(el => el.remove());
  }
}
function shelfDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('shelf').classList.remove('is-dragover');
  // Only handle file drops from OS, not internal drags
  if (e.dataTransfer.files && e.dataTransfer.files.length) {
    handleFiles(e.dataTransfer.files);
  }
}

let _ratioRenderTimer = null;
function scheduleRatioRender() {
  if (_ratioRenderTimer) clearTimeout(_ratioRenderTimer);
  _ratioRenderTimer = setTimeout(() => {
    _ratioRenderTimer = null;
    renderShelf();
    renderCanvas();
    saveState();
  }, 300);
}

async function handleFiles(files) {
  const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    const name = file.name.replace(/\.[^.]+$/, '');
    if (state.shelf.find(s => s.filename === name)) continue;

    const objectUrl = URL.createObjectURL(file);
    const loc = inferLocation(name);
    const cam = inferCamera(name);

    state.shelf.push({ filename: name, location: loc, ratio: '3/2', objectUrl, camera: cam });
    saveImage(name, file);

    // Detect ratio from image dimensions (debounced render)
    const img = new Image();
    img.onload = () => {
      const ratio = img.width >= img.height ? '3/2' : '2/3';
      const entry = state.shelf.find(s => s.filename === name);
      if (entry) entry.ratio = ratio;
      for (const p of getAllPhotos()) {
        if (p.filename === name) p.ratio = ratio;
      }
      scheduleRatioRender();
    };
    img.src = objectUrl;

    // Render shelf in batches of 10 for smooth loading
    if ((i + 1) % 10 === 0 || i === fileArray.length - 1) {
      renderShelf();
      saveState();
      // Yield to browser so it can paint
      await new Promise(r => requestAnimationFrame(r));
    }
  }

  // Auto-detect camera for meta
  const cameras = [...new Set(state.shelf.map(s => s.camera).filter(Boolean))];
  if (cameras.length && !state.meta.camera) {
    state.meta.camera = cameras.join(', ');
    document.getElementById('meta-camera').value = state.meta.camera;
  }
}

function inferLocation(filename) {
  // Pattern: YYYY-MM-DD-Location-CameraID
  const m = filename.match(/^\d{4}-\d{2}-\d{2}-([A-Za-z]+)-/);
  return m ? m[1].toLowerCase() : state.meta.location || '';
}

function inferCamera(filename) {
  if (/DSCF/i.test(filename)) return 'Fuji X-T5';
  if (/R00/i.test(filename)) return 'Ricoh GR IIIx';
  return '';
}

function addFilesToNewStack(files, stack) {
  state.nodes.push(stack);
  addFilesToContainer(files, stack);
}

function addFilesToContainer(files, containerNode) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const name = file.name.replace(/\.[^.]+$/, '');
    const loc = inferLocation(name);
    const cam = inferCamera(name);

    // Add to shelf if not already there
    if (!state.shelf.find(s => s.filename === name)) {
      const objectUrl = URL.createObjectURL(file);
      state.shelf.push({ filename: name, location: loc, ratio: '3/2', objectUrl, camera: cam });
      saveImage(name, file);

      // Detect ratio (debounced render)
      const img = new Image();
      img.onload = () => {
        const ratio = img.width >= img.height ? '3/2' : '2/3';
        const entry = state.shelf.find(s => s.filename === name);
        if (entry) entry.ratio = ratio;
        for (const p of getAllPhotos()) {
          if (p.filename === name) p.ratio = ratio;
        }
        scheduleRatioRender();
      };
      img.src = objectUrl;
    }

    const shelfEntry = state.shelf.find(s => s.filename === name);
    containerNode.children.push({
      id: uid(), type: 'photo',
      location: loc, filename: name,
      ratio: shelfEntry?.ratio || '3/2',
      caption: '', alt: '', classes: []
    });
  }

  // Auto-detect camera for meta
  const cameras = [...new Set(state.shelf.map(s => s.camera).filter(Boolean))];
  if (cameras.length && !state.meta.camera) {
    state.meta.camera = cameras.join(', ');
    document.getElementById('meta-camera').value = state.meta.camera;
  }

  renderShelf();
  renderCanvas();
  saveState();
}

function renderShelf() {
  const shelf = document.getElementById('shelf');
  const hint = document.getElementById('shelfHint');

  // Remove old thumbnails (keep hint and file input)
  shelf.querySelectorAll('.shelf__photo').forEach(el => el.remove());

  if (state.shelf.length) {
    hint.textContent = '+';
    hint.style.cursor = 'pointer';
  } else {
    hint.textContent = 'Drop photos here or click to browse';
    hint.style.cursor = '';
  }

  state.shelf.forEach(photo => {
    const div = document.createElement('div');
    const orient = photo.ratio === '2/3' ? 'is-portrait' : 'is-landscape';
    div.className = `shelf__photo ${orient}`;
    div.draggable = true;
    div.dataset.filename = photo.filename;
    const imgSrc = photo.objectUrl || `https://img.javier.computer/${photo.location}/${photo.filename}_2880.jpg`;

    div.addEventListener('click', e => {
      e.stopPropagation();
      // Scroll to this photo in the canvas if it's used
      const filename = photo.filename;
      const canvasPhotos = document.querySelectorAll('#canvas .node[data-type="photo"]');
      for (const w of canvasPhotos) {
        const id = w.dataset.id;
        const n = findNode(id);
        if (n && n.filename === filename) {
          w.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const photoItem = w.querySelector('.photo-item');
          if (photoItem) {
            photoItem.classList.remove('is-highlighted');
            void photoItem.offsetWidth;
            photoItem.classList.add('is-highlighted');
            photoItem.addEventListener('animationend', () => photoItem.classList.remove('is-highlighted'), { once: true });
          }
          return;
        }
      }
    });
    div.addEventListener('dragstart', e => {
      e.stopPropagation();
      div.classList.add('is-dragging');
      const preview = createDragPreview(imgSrc);
      e.dataTransfer.setDragImage(preview, 30, 30);
      e.dataTransfer.effectAllowed = 'copyMove';
      e.dataTransfer.setData('text/plain', JSON.stringify({
        source: 'shelf',
        filename: photo.filename,
        location: photo.location,
        ratio: photo.ratio
      }));
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('is-dragging');
      removeDragPreview();
      // Remove any lingering reorder indicators
      shelf.querySelectorAll('.shelf__reorder-indicator').forEach(el => el.remove());
    });
    div.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
      // Only show reorder indicator for shelf-to-shelf drags
      try {
        const rect = div.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        const side = e.clientX < midX ? 'left' : 'right';
        // Remove old indicators
        shelf.querySelectorAll('.shelf__reorder-indicator').forEach(el => el.remove());
        const ind = document.createElement('div');
        ind.className = 'shelf__reorder-indicator';
        if (side === 'left') {
          div.parentNode.insertBefore(ind, div);
        } else {
          div.parentNode.insertBefore(ind, div.nextSibling);
        }
      } catch {}
    });
    div.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
      shelf.querySelectorAll('.shelf__reorder-indicator').forEach(el => el.remove());
      // Handle shelf reorder
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.source === 'shelf') {
          const fromIdx = state.shelf.findIndex(s => s.filename === data.filename);
          const toFilename = div.dataset.filename;
          if (fromIdx >= 0 && data.filename !== toFilename) {
            const rect = div.getBoundingClientRect();
            const midX = rect.left + rect.width / 2;
            const [moved] = state.shelf.splice(fromIdx, 1);
            let toIdx = state.shelf.findIndex(s => s.filename === toFilename);
            if (e.clientX >= midX) toIdx++;
            state.shelf.splice(toIdx, 0, moved);
            saveState();
            renderShelf();
          }
          return;
        }
      } catch {}
    });
    div.title = photo.filename;
    div.innerHTML = `
      <img src="${imgSrc}" alt="${photo.filename}" onerror="this.style.background='var(--editor-photo-fallback)'">
      <div class="shelf__remove" onclick="event.stopPropagation(); removeFromShelf('${photo.filename}')">✕</div>
    `;
    // Insert before the hint
    shelf.insertBefore(div, hint);
  });
}

function removeFromShelf(filename, skipCanvas) {
  const doRemove = () => {
    const idx = state.shelf.findIndex(s => s.filename === filename);
    if (idx >= 0) {
      if (state.shelf[idx].objectUrl) URL.revokeObjectURL(state.shelf[idx].objectUrl);
      state.shelf.splice(idx, 1);
    }
    deleteImage(filename);
    if (!skipCanvas) {
      removePhotoNodes(filename, state.nodes);
      renderCanvas();
    }
    renderShelf();
    saveState();
  };

  const el = document.querySelector(`.shelf__photo[data-filename="${filename}"]`);
  if (el && !skipCanvas) {
    animateOut(el, doRemove);
  } else {
    doRemove();
  }
}

function removePhotoNodes(filename, nodes) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (n.type === 'photo' && n.filename === filename) {
      nodes.splice(i, 1);
    } else if (n.children) {
      removePhotoNodes(filename, n.children);
    }
  }
}

// ─── Drop indicator helpers ─────────────────────────────
// Single global indicator element — only one can exist at a time
let globalIndicator = null;

function showIndicatorIn(container, index, isVertical, skipId) {
  if (!globalIndicator) {
    globalIndicator = document.createElement('div');
    globalIndicator.className = 'drop-indicator';
  }
  container.appendChild(globalIndicator);
  positionIndicator(container, globalIndicator, index, isVertical, skipId);
}

function removeDropIndicator() {
  if (globalIndicator) { globalIndicator.remove(); }
}

function getDropIndex(container, event, isVertical, skipId) {
  const children = Array.from(container.querySelectorAll(':scope > .node'));
  const mousePos = isVertical ? event.clientY : event.clientX;
  const visible = [];

  for (let i = 0; i < children.length; i++) {
    if (skipId && children[i].dataset.id === skipId) continue;
    visible.push(children[i]);
  }

  for (let i = 0; i < visible.length; i++) {
    const rect = visible[i].getBoundingClientRect();
    const isLast = i === visible.length - 1;
    // Use 2/3 threshold for last item so "after last" zone is easier to reach
    const fraction = isLast ? 0.67 : 0.5;
    const threshold = isVertical
      ? rect.top + rect.height * fraction
      : rect.left + rect.width * fraction;
    if (mousePos < threshold) return i;
  }
  return visible.length;
}

function positionIndicator(container, indicator, index, isVertical, skipId) {
  const children = Array.from(container.querySelectorAll(':scope > .node'))
    .filter(c => !skipId || c.dataset.id !== skipId);
  const PAD = 4;

  if (isVertical) {
    let top;
    if (children.length === 0) {
      top = 0;
    } else if (index >= children.length) {
      const last = children[children.length - 1];
      top = last.offsetTop + last.offsetHeight + PAD;
    } else if (index > 0) {
      if (skipId) {
        top = children[index].offsetTop - PAD;
      } else {
        const prev = children[index - 1];
        top = Math.round((prev.offsetTop + prev.offsetHeight + children[index].offsetTop) / 2);
      }
    } else {
      top = children[index].offsetTop - PAD;
    }
    indicator.style.top = top + 'px';
    indicator.style.left = '0';
    indicator.style.right = '0';
    indicator.style.width = '';
    indicator.style.height = '2px';
    indicator.style.bottom = '';
  } else {
    let left;
    if (children.length === 0) {
      left = 0;
    } else if (index >= children.length) {
      const last = children[children.length - 1];
      left = last.offsetLeft + last.offsetWidth + PAD;
    } else if (index > 0) {
      if (skipId) {
        left = children[index].offsetLeft - PAD;
      } else {
        const prev = children[index - 1];
        left = Math.round((prev.offsetLeft + prev.offsetWidth + children[index].offsetLeft) / 2);
      }
    } else {
      left = children[index].offsetLeft - PAD;
    }
    indicator.style.left = left + 'px';
    indicator.style.top = '0';
    indicator.style.bottom = '0';
    indicator.style.height = '';
    indicator.style.width = '2px';
    indicator.style.right = '';
  }
}

function addFilesToContainerAt(files, containerNode, insertIdx) {
  const newNodes = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const name = file.name.replace(/\.[^.]+$/, '');
    const loc = inferLocation(name);
    const cam = inferCamera(name);

    if (!state.shelf.find(s => s.filename === name)) {
      const objectUrl = URL.createObjectURL(file);
      state.shelf.push({ filename: name, location: loc, ratio: '3/2', objectUrl, camera: cam });
      saveImage(name, file);

      const img = new Image();
      img.onload = () => {
        const ratio = img.width >= img.height ? '3/2' : '2/3';
        const entry = state.shelf.find(s => s.filename === name);
        if (entry) entry.ratio = ratio;
        for (const p of getAllPhotos()) {
          if (p.filename === name) p.ratio = ratio;
        }
        scheduleRatioRender();
      };
      img.src = objectUrl;
    }

    const shelfEntry = state.shelf.find(s => s.filename === name);
    newNodes.push({
      id: uid(), type: 'photo',
      location: loc, filename: name,
      ratio: shelfEntry?.ratio || '3/2',
      caption: '', alt: '', classes: []
    });
  }

  containerNode.children.splice(insertIdx, 0, ...newNodes);

  const cameras = [...new Set(state.shelf.map(s => s.camera).filter(Boolean))];
  if (cameras.length && !state.meta.camera) {
    state.meta.camera = cameras.join(', ');
    document.getElementById('meta-camera').value = state.meta.camera;
  }

  renderShelf();
  renderCanvas();
  saveState();
}

function getShelfPhoto(filename) {
  return state.shelf.find(s => s.filename === filename);
}

// ─── Canvas Inserter ────────────────────────────────────
function createInserter(index) {
  const inserter = document.createElement('div');
  inserter.className = 'canvas__inserter';

  const line = document.createElement('div');
  line.className = 'canvas__inserter-line';
  inserter.appendChild(line);

  const btn = document.createElement('button');
  btn.className = 'canvas__inserter-btn';
  btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  btn.onclick = (e) => {
    e.stopPropagation();
    showInsertMenu(e, index);
  };
  inserter.appendChild(btn);

  return inserter;
}

function showInsertMenu(e, index) {
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = '';

  // Add photos option
  const photosBtn = document.createElement('button');
  photosBtn.className = 'context-menu__item';
  photosBtn.textContent = 'Add photos…';
  photosBtn.onclick = () => {
    closeContextMenu();
    const input = document.getElementById('fileInput');
    input.onchange = function() {
      const stackNode = { id: uid(), type: 'stack', classes: [], children: [] };
      state.nodes.splice(index, 0, stackNode);
      addFilesToContainer(this.files, stackNode);
      this.onchange = originalFileInputHandler;
    };
    input.click();
  };
  menu.appendChild(photosBtn);

  const sep = document.createElement('div');
  sep.className = 'context-menu__sep';
  menu.appendChild(sep);

  ['stack', 'row', 'grid', 'single', 'text'].forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'context-menu__item';
    btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    btn.onclick = () => {
      insertNodeAt(type, index);
      closeContextMenu();
    };
    menu.appendChild(btn);
  });

  showContextMenuAt(menu, e);
}

function insertNodeAt(type, index) {
  const node = type === 'text'
    ? { id: uid(), type: 'text', classes: [], html: '<p></p>' }
    : { id: uid(), type, classes: [], children: [] };
  state.nodes.splice(index, 0, node);
  renderCanvas();
}

// ─── Canvas Rendering ───────────────────────────────────
function renderCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';

  if (state.nodes.length === 0) {
    // no empty message, just show the + button
  } else {
    state.nodes.forEach((node, i) => {
      // Inserter before each node
      canvas.appendChild(createInserter(i));
      canvas.appendChild(renderNode(node));
    });
    // Inserter after last node
    canvas.appendChild(createInserter(state.nodes.length));
  }

  updateCoverDropdown();
  updateShelfUsedState();
  saveState();
}

function updateShelfUsedState() {
  const usedFilenames = new Set(getAllPhotos().map(p => p.filename));
  document.querySelectorAll('.shelf__photo').forEach(el => {
    el.classList.toggle('is-used', usedFilenames.has(el.dataset.filename));
  });
}

// Track canvas drag source globally
let canvasDragNodeId = null;

// Canvas-level drop (registered once, outside renderCanvas)
(function() {
  const canvas = document.getElementById('canvas');
  canvas.style.position = 'relative';

  canvas.addEventListener('dragover', e => {
    canvas.classList.add('is-dragging');
    // Only handle on the canvas itself, not inside containers
    if (e.target !== canvas && !e.target.classList.contains('canvas__empty') && !e.target.closest('.canvas__inserter')) {
      if (e.target.closest('[data-parent-id]') || e.target.closest('.node')) { removeDropIndicator(); return; }
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = canvasDragNodeId ? 'move' : 'copy';
    // Clean up any shelf indicators when dragging over canvas
    document.querySelectorAll('.shelf__reorder-indicator').forEach(el => el.remove());

    const insertIdx = getDropIndex(canvas, e, true, canvasDragNodeId);
    showIndicatorIn(canvas, insertIdx, true, canvasDragNodeId);
  });

  canvas.addEventListener('dragleave', e => {
    if (!canvas.contains(e.relatedTarget)) {
      removeDropIndicator();
      canvas.classList.remove('is-dragging');
    }
  });

  canvas.addEventListener('drop', e => {
    // Only handle if dropped on the canvas itself, not inside a container node
    if (e.target !== canvas && !e.target.classList.contains('canvas__empty') && !e.target.closest('.canvas__inserter')) {
      if (e.target.closest('[data-parent-id]') || e.target.closest('.node')) { removeDropIndicator(); return; }
    }
    e.preventDefault();
    e.stopPropagation();

    const insertIdx = getDropIndex(canvas, e, true, canvasDragNodeId);
    removeDropIndicator();
    canvas.classList.remove('is-dragging');

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const stack = { id: uid(), type: 'stack', classes: [], children: [] };
      addFilesToNewStack(e.dataTransfer.files, stack);
      return;
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));

      if (data.source === 'canvas') {
        const info = findParent(data.nodeId);
        if (!info) return;
        const idx = info.list.findIndex(n => n.id === data.nodeId);
        if (idx < 0) return;
        const [moved] = info.list.splice(idx, 1);
        // Wrap in a stack if it's a photo
        const toInsert = moved.type === 'photo'
          ? { id: uid(), type: 'stack', classes: [], children: [moved] }
          : moved;
        // getDropIndex already skips the dragged item, so insertIdx
        // is relative to the array without it — no adjustment needed
        state.nodes.splice(insertIdx, 0, toInsert);
        renderCanvas();
        return;
      }

      if (data.source === 'shelf') {
        const stack = { id: uid(), type: 'stack', classes: [], children: [] };
        stack.children.push({
          id: uid(), type: 'photo',
          location: data.location, filename: data.filename,
          ratio: data.ratio || '3/2', caption: '', alt: '', classes: []
        });
        state.nodes.splice(insertIdx, 0, stack);
        renderCanvas();
      }
    } catch {}
  });
})();

function renderNode(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'node';
  wrapper.dataset.type = node.type;
  wrapper.dataset.id = node.id;

  if (node.type === 'photo') return renderPhotoNode(node, wrapper);
  if (node.type === 'text') return renderTextNode(node, wrapper);
  return renderContainerNode(node, wrapper);
}

function renderContainerNode(node, wrapper) {
  // Controls
  const controls = document.createElement('div');
  controls.className = 'node__controls';
  const moveGroup = document.createElement('div');
  moveGroup.className = 'node__move-group';
  moveGroup.innerHTML = `<span class="node__handle" title="Drag to reorder">⠿</span>`;
  controls.appendChild(moveGroup);

  // Label (appended after arrows below)
  const label = document.createElement('span');
  label.className = 'node__label';
  label.title = 'Click to change type';
  label.style.cursor = 'pointer';
  label.textContent = node.type;

  // Click label to open type picker menu
  label.addEventListener('click', (e) => {
    e.stopPropagation();
    const photoCount = (node.children || []).filter(c => c.type === 'photo').length;
    const types = ['stack', 'row', 'grid'];
    if (photoCount <= 1 || node.type === 'single') types.push('single');
    const menu = document.getElementById('contextMenu');
    menu.innerHTML = '';
    types.forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'context-menu__item' + (type === node.type ? ' is-active' : '');
      btn.textContent = type;
      btn.onclick = () => {
        if (type !== node.type) {
          node.type = type;
          const validClasses = getClassOptions(type);
          node.classes = node.classes.filter(c => validClasses.includes(c));
          renderCanvas();
        }
        closeContextMenu();
      };
      menu.appendChild(btn);
    });
    wrapper.classList.add('has-menu-open');
    showContextMenuAt(menu, e);
  });

  // Move up button
  const upBtn = document.createElement('button');
  upBtn.className = 'node__btn is-move';
  upBtn.innerHTML = '↑';
  upBtn.title = 'Move up';
  upBtn.onclick = (e) => {
    e.stopPropagation();
    const info = findParent(node.id);
    if (!info) return;
    const idx = info.list.findIndex(n => n.id === node.id);
    if (idx > 0) {
      const oldRect = wrapper.getBoundingClientRect();
      const offsetFromBottom = window.innerHeight - oldRect.top;
      [info.list[idx - 1], info.list[idx]] = [info.list[idx], info.list[idx - 1]];
      renderCanvas();
      const el = document.querySelector(`.node[data-id="${node.id}"]`);
      if (el) {
        const newRect = el.getBoundingClientRect();
        const drift = newRect.top - (window.innerHeight - offsetFromBottom);
        window.scrollBy({ top: drift, behavior: 'smooth' });
      }
    }
  };
  moveGroup.appendChild(upBtn);

  // Move down button
  const downBtn = document.createElement('button');
  downBtn.className = 'node__btn is-move';
  downBtn.innerHTML = '↓';
  downBtn.title = 'Move down';
  downBtn.onclick = (e) => {
    e.stopPropagation();
    const info = findParent(node.id);
    if (!info) return;
    const idx = info.list.findIndex(n => n.id === node.id);
    if (idx < info.list.length - 1) {
      const oldRect = wrapper.getBoundingClientRect();
      const offsetFromBottom = window.innerHeight - oldRect.top;
      [info.list[idx], info.list[idx + 1]] = [info.list[idx + 1], info.list[idx]];
      renderCanvas();
      const el = document.querySelector(`.node[data-id="${node.id}"]`);
      if (el) {
        const newRect = el.getBoundingClientRect();
        const drift = newRect.top - (window.innerHeight - offsetFromBottom);
        window.scrollBy({ top: drift, behavior: 'smooth' });
      }
    }
  };
  moveGroup.appendChild(downBtn);

  // Label (after move group)
  controls.appendChild(label);

  // Ellipsis menu with class toggles
  const classOpts = getClassOptions(node.type);
  if (classOpts.length) {
    const menuWrap = document.createElement('div');
    menuWrap.className = 'node__menu-wrap';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'node__menu-btn';
    menuBtn.innerHTML = '···';
    menuBtn.title = 'Options';

    const menu = document.createElement('div');
    menu.className = 'node__menu';

    const classDiv = document.createElement('div');
    classDiv.className = 'node__classes';
    classOpts.forEach(cls => {
      const btn = document.createElement('button');
      btn.className = 'class-toggle' + (node.classes.includes(cls) ? ' is-active' : '');
      btn.textContent = cls;
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleClass(node, cls);
      };
      classDiv.appendChild(btn);
    });
    menu.appendChild(classDiv);

    menuBtn.onclick = (e) => {
      e.stopPropagation();
      // Close any other open menus
      document.querySelectorAll('.node__menu.is-open').forEach(m => {
        if (m !== menu) m.classList.remove('is-open');
      });
      menu.classList.toggle('is-open');
    };

    menuWrap.appendChild(menuBtn);
    menuWrap.appendChild(menu);
    controls.appendChild(menuWrap);
  }

  // Add child button
  const addBtn = document.createElement('button');
  addBtn.className = 'node__btn is-add';
  addBtn.innerHTML = '+';
  addBtn.title = 'Add item';
  addBtn.onclick = (e) => { e.stopPropagation(); showAddChildMenu(e, node); };
  controls.appendChild(addBtn);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'node__btn is-delete';
  delBtn.innerHTML = '✕';
  delBtn.title = 'Delete';
  delBtn.onclick = (e) => { e.stopPropagation(); removeNode(node.id); };
  controls.appendChild(delBtn);

  // Make container draggable via handle
  const handle = controls.querySelector('.node__handle');
  handle.draggable = true;
  handle.addEventListener('dragstart', e => {
    e.stopPropagation();
    canvasDragNodeId = node.id;
    wrapper.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'canvas', nodeId: node.id
    }));
  });
  handle.addEventListener('dragend', () => {
    canvasDragNodeId = null;
    wrapper.classList.remove('is-dragging');
  });

  wrapper.appendChild(controls);

  // Trigger bar for nested nodes (CSS hides it at top level)
  const trigger = document.createElement('div');
  trigger.className = 'node__trigger';

  const triggerHandle = document.createElement('span');
  triggerHandle.className = 'node__trigger-handle';
  triggerHandle.innerHTML = '⠿';
  triggerHandle.title = 'Drag to reorder';
  triggerHandle.draggable = true;
  triggerHandle.addEventListener('dragstart', e => {
    e.stopPropagation();
    canvasDragNodeId = node.id;
    wrapper.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'canvas', nodeId: node.id
    }));
  });
  triggerHandle.addEventListener('dragend', () => {
    canvasDragNodeId = null;
    wrapper.classList.remove('is-dragging');
  });
  trigger.appendChild(triggerHandle);

  const triggerExpand = document.createElement('button');
  triggerExpand.className = 'node__trigger-expand';
  triggerExpand.innerHTML = '›';
  triggerExpand.title = 'Show controls';
  triggerExpand.onclick = (e) => {
    e.stopPropagation();
    closeAllNodeControls();
    wrapper.classList.add('has-controls-open');
  };
  trigger.appendChild(triggerExpand);

  wrapper.appendChild(trigger);

  // Container
  const containerClass = `${node.type}-container ${node.classes.join(' ')}`.trim();
  const container = document.createElement('div');
  container.className = containerClass;
  container.dataset.parentId = node.id;

  if (node.children) {
    node.children.forEach(child => {
      container.appendChild(renderNode(child));
    });
  }

  if (!node.children || node.children.length === 0) {
    container.classList.add('is-empty');
  }

  // Enable drop from shelf, Finder, or canvas photos — with indicator
  container.style.position = 'relative';

  container.addEventListener('dragover', e => {
    // If dragging a container node, only stacks can accept it — let others bubble
    if (canvasDragNodeId && node.type !== 'stack') {
      const draggedNode = findNode(canvasDragNodeId);
      if (draggedNode && draggedNode.children) return; // it's a container, skip
    }
    // Prevent dropping a node into itself or its own descendants
    if (canvasDragNodeId && isDescendantOf(node.id, canvasDragNodeId)) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = canvasDragNodeId ? 'move' : 'copy';
    container.classList.add('is-dragover');

    const isVertical = node.type === 'stack';
    const insertIdx = getDropIndex(container, e, isVertical, canvasDragNodeId);
    showIndicatorIn(container, insertIdx, isVertical, canvasDragNodeId);
  });

  container.addEventListener('dragleave', e => {
    if (!container.contains(e.relatedTarget)) {
      container.classList.remove('is-dragover');
      removeDropIndicator();
    }
  });

  container.addEventListener('drop', e => {
    // Same guard as dragover
    if (canvasDragNodeId && node.type !== 'stack') {
      const draggedNode = findNode(canvasDragNodeId);
      if (draggedNode && draggedNode.children) return;
    }
    if (canvasDragNodeId && isDescendantOf(node.id, canvasDragNodeId)) return;

    e.preventDefault();
    e.stopPropagation();
    container.classList.remove('is-dragover');

    const isVertical = node.type === 'stack';
    const insertIdx = getDropIndex(container, e, isVertical, canvasDragNodeId);
    removeDropIndicator();

    // Files from Finder
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFilesToContainerAt(e.dataTransfer.files, node, insertIdx);
      return;
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));

      // From canvas (reorder within/between containers)
      if (data.source === 'canvas') {
        const info = findParent(data.nodeId);
        if (!info) return;
        const idx = info.list.findIndex(n => n.id === data.nodeId);
        if (idx < 0) return;
        const [moved] = info.list.splice(idx, 1);
        // getDropIndex already skips the dragged item, so insertIdx
        // is relative to the array without it — no adjustment needed
        node.children.splice(insertIdx, 0, moved);
        renderCanvas();
        return;
      }

      // From shelf
      if (data.source === 'shelf') {
        const photoNode = {
          id: uid(), type: 'photo',
          location: data.location, filename: data.filename,
          ratio: data.ratio || '3/2', caption: '', alt: '', classes: []
        };
        node.children.splice(insertIdx, 0, photoNode);
        renderCanvas();
      }
    } catch {}
  });

  function removeIndicator() {
    if (indicator) { indicator.remove(); indicator = null; }
  }

  wrapper.appendChild(container);

  return wrapper;
}

function renderPhotoNode(node, wrapper) {
  wrapper.classList.add('photo-item-wrapper');
  const div = document.createElement('div');
  div.className = 'photo-item';

  const shelf = getShelfPhoto(node.filename);
  const imgSrc = shelf?.objectUrl || `https://img.javier.computer/${node.location}/${node.filename}_2880.jpg`;

  const ratioStyle = node.ratio ? `aspect-ratio: ${node.ratio}; object-fit: cover;` : '';

  div.innerHTML = `
    <img src="${imgSrc}" alt="${node.alt || node.filename}" style="${ratioStyle}"
         onerror="this.dataset.failed='true'; this.alt='${node.filename}'">
    <button class="photo-remove" onclick="removeNode('${node.id}')">✕</button>
    <div class="photo-overlay">
      <div class="photo-overlay__info">
        <div class="photo-overlay__filename">${node.location}/${node.filename}</div>
        <div class="photo-overlay__fields">
          <input placeholder="Caption" value="${escAttr(node.caption)}"
                 onchange="updatePhotoField('${node.id}', 'caption', this.value)">
        </div>
      </div>
    </div>
  `;

  // Make photos natively draggable
  wrapper.draggable = true;
  div.querySelector('img').draggable = false; // prevent native image drag
  wrapper.addEventListener('dragstart', e => {
    e.stopPropagation();
    canvasDragNodeId = node.id;
    wrapper.classList.add('is-dragging');
    const preview = createDragPreview(imgSrc);
    e.dataTransfer.setDragImage(preview, 30, 30);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'canvas', nodeId: node.id
    }));
  });
  wrapper.addEventListener('dragend', () => {
    canvasDragNodeId = null;
    wrapper.classList.remove('is-dragging');
    removeDragPreview();
  });

  wrapper.appendChild(div);
  return wrapper;
}

function renderTextNode(node, wrapper) {
  const controls = document.createElement('div');
  controls.className = 'node__controls';
  const moveGroup = document.createElement('div');
  moveGroup.className = 'node__move-group';
  moveGroup.innerHTML = `<span class="node__handle" title="Drag to reorder">⠿</span>`;
  controls.appendChild(moveGroup);

  // Move up
  const upBtn = document.createElement('button');
  upBtn.className = 'node__btn is-move';
  upBtn.innerHTML = '↑';
  upBtn.title = 'Move up';
  upBtn.onclick = (e) => {
    e.stopPropagation();
    const info = findParent(node.id);
    if (!info) return;
    const idx = info.list.findIndex(n => n.id === node.id);
    if (idx > 0) {
      [info.list[idx - 1], info.list[idx]] = [info.list[idx], info.list[idx - 1]];
      renderCanvas();
    }
  };
  moveGroup.appendChild(upBtn);

  // Move down
  const downBtn = document.createElement('button');
  downBtn.className = 'node__btn is-move';
  downBtn.innerHTML = '↓';
  downBtn.title = 'Move down';
  downBtn.onclick = (e) => {
    e.stopPropagation();
    const info = findParent(node.id);
    if (!info) return;
    const idx = info.list.findIndex(n => n.id === node.id);
    if (idx < info.list.length - 1) {
      [info.list[idx], info.list[idx + 1]] = [info.list[idx + 1], info.list[idx]];
      renderCanvas();
    }
  };
  moveGroup.appendChild(downBtn);

  const label = document.createElement('span');
  label.className = 'node__label';
  label.textContent = 'text';
  controls.appendChild(label);

  const translationBtn = document.createElement('button');
  translationBtn.className = 'node__btn is-translation' + (node.translation != null ? ' is-active' : '');
  translationBtn.innerHTML = '译';
  translationBtn.title = 'Toggle translation';
  translationBtn.onclick = () => {
    if (node.translation != null) {
      delete node.translation;
    } else {
      node.translation = '';
    }
    renderCanvas();
    saveState();
  };
  controls.appendChild(translationBtn);

  const delBtn = document.createElement('button');
  delBtn.className = 'node__btn is-delete';
  delBtn.innerHTML = '✕';
  delBtn.onclick = () => { removeNode(node.id); };
  controls.appendChild(delBtn);

  // Make text node draggable via handle
  const handle = controls.querySelector('.node__handle');
  handle.draggable = true;
  handle.addEventListener('dragstart', e => {
    e.stopPropagation();
    canvasDragNodeId = node.id;
    wrapper.classList.add('is-dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'canvas', nodeId: node.id
    }));
  });
  handle.addEventListener('dragend', () => {
    canvasDragNodeId = null;
    wrapper.classList.remove('is-dragging');
    removeDropIndicator();
  });

  wrapper.appendChild(controls);

  // Trigger dot for nested nodes
  const trigger = document.createElement('button');
  trigger.className = 'node__trigger';
  trigger.innerHTML = '⠿';
  trigger.onclick = (e) => {
    e.stopPropagation();
    closeAllNodeControls();
    wrapper.classList.add('has-controls-open');
  };
  wrapper.appendChild(trigger);

  const container = document.createElement('div');
  container.className = 'text-container';

  const editable = document.createElement('div');
  editable.className = 'text-editable';
  editable.contentEditable = true;

  // Ensure content is wrapped in <p> tags
  let html = node.html || '';
  if (html && !html.trim().startsWith('<')) {
    html = html.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('');
  }
  editable.innerHTML = html;

  // Force paragraph mode: Enter creates <p>, not <br>
  // Markdown shortcuts: Cmd+B for bold, Cmd+I for italic
  editable.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertParagraph', false);
      return;
    }

    if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'i')) {
      e.preventDefault();
      const sel = window.getSelection();
      if (!sel.rangeCount || sel.isCollapsed) return;
      const text = sel.getRangeAt(0).toString();
      const marker = e.key === 'b' ? '**' : '*';
      document.execCommand('insertText', false, `${marker}${text}${marker}`);
      return;
    }
  });

  // Paste: if text is a URL and there's a selection, wrap as markdown link
  // Paste: always strip formatting; wrap as markdown link if pasting a URL over a selection
  editable.addEventListener('paste', e => {
    e.preventDefault();
    const clipboard = e.clipboardData.getData('text/plain');
    const sel = window.getSelection();
    const hasSelection = sel.rangeCount && !sel.isCollapsed;
    const trimmed = clipboard.trim();
    if (hasSelection && trimmed.match(/^https?:\/\/\S+$/)) {
      const text = sel.getRangeAt(0).toString();
      document.execCommand('insertText', false, `[${text}](${trimmed})`);
    } else {
      document.execCommand('insertText', false, clipboard);
    }
  });

  // On focus, ensure there's at least one <p> to type into
  editable.addEventListener('focus', () => {
    if (!editable.querySelector('p')) {
      editable.innerHTML = '<p><br></p>';
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStart(editable.querySelector('p'), 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  editable.addEventListener('blur', () => {
    // Clean up: convert any stray text nodes or <br>s into <p>s
    cleanUpContentEditable(editable);
    node.html = editable.innerHTML;
    saveState();
  });

  container.appendChild(editable);

  if (node.translation != null) {
    const translationEditable = document.createElement('div');
    translationEditable.className = 'text-editable text-translation';
    translationEditable.contentEditable = true;

    let thtml = node.translation || '';
    if (thtml && !thtml.trim().startsWith('<')) {
      thtml = thtml.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('');
    }
    translationEditable.innerHTML = thtml;

    translationEditable.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertParagraph', false);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'i')) {
        e.preventDefault();
        const sel = window.getSelection();
        if (!sel.rangeCount || sel.isCollapsed) return;
        const text = sel.getRangeAt(0).toString();
        const marker = e.key === 'b' ? '**' : '*';
        document.execCommand('insertText', false, `${marker}${text}${marker}`);
        return;
      }
    });

    translationEditable.addEventListener('paste', e => {
      e.preventDefault();
      const clipboard = e.clipboardData.getData('text/plain');
      const sel = window.getSelection();
      const hasSelection = sel.rangeCount && !sel.isCollapsed;
      const trimmed = clipboard.trim();
      if (hasSelection && trimmed.match(/^https?:\/\/\S+$/)) {
        const text = sel.getRangeAt(0).toString();
        document.execCommand('insertText', false, `[${text}](${trimmed})`);
      } else {
        document.execCommand('insertText', false, clipboard);
      }
    });

    translationEditable.addEventListener('focus', () => {
      if (!translationEditable.querySelector('p')) {
        translationEditable.innerHTML = '<p><br></p>';
        const sel = window.getSelection();
        const range = document.createRange();
        range.setStart(translationEditable.querySelector('p'), 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });

    translationEditable.addEventListener('blur', () => {
      cleanUpContentEditable(translationEditable);
      node.translation = translationEditable.innerHTML;
      saveState();
    });

    container.appendChild(translationEditable);
  }

  wrapper.appendChild(container);
  return wrapper;
}

function cleanUpContentEditable(el) {
  // Wrap any bare text nodes in <p>
  Array.from(el.childNodes).forEach(child => {
    if (child.nodeType === 3 && child.textContent.trim()) {
      const p = document.createElement('p');
      child.replaceWith(p);
      p.textContent = child.textContent;
    }
    // Convert <div> to <p> (some browsers insert <div> instead)
    if (child.nodeName === 'DIV') {
      const p = document.createElement('p');
      p.innerHTML = child.innerHTML;
      child.replaceWith(p);
    }
    // Remove bare <br> between paragraphs
    if (child.nodeName === 'BR') {
      child.remove();
    }
  });
  // Remove empty <p> tags (but keep at least one)
  const paras = el.querySelectorAll('p');
  paras.forEach(p => {
    if (!p.textContent.trim() && !p.querySelector('img') && paras.length > 1) {
      p.remove();
    }
  });
}

function escAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getClassOptions(type) {
  switch (type) {
    case 'stack': return ['has-margin-top', 'has-margin-bottom', 'with-caption'];
    case 'row': return ['has-one', 'has-two', 'has-margin-bottom'];
    case 'grid': return ['is-square', 'is-vertical', 'is-half', 'has-margin-bottom'];
    case 'single': return ['left', 'center', 'right'];
    default: return [];
  }
}

const EXCLUSIVE_CLASSES = ['left', 'center', 'right'];

function toggleClass(node, cls) {
  const idx = node.classes.indexOf(cls);
  if (idx >= 0) {
    node.classes.splice(idx, 1);
  } else {
    if (EXCLUSIVE_CLASSES.includes(cls)) {
      node.classes = node.classes.filter(c => !EXCLUSIVE_CLASSES.includes(c));
    }
    node.classes.push(cls);
  }
  renderCanvas();
}

function updatePhotoField(id, field, value) {
  const node = findNode(id);
  if (node) {
    node[field] = value;
    saveState();
  }
}



// Remove empty containers without cascading — only removes containers
// that are already empty, then stops. A parent that becomes empty because


// ─── Add containers ─────────────────────────────────────
function showAddMenu(e) {
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = '';

  // Add photos option — creates a new stack with the selected photos
  const photosBtn = document.createElement('button');
  photosBtn.className = 'context-menu__item';
  photosBtn.textContent = 'Add photos…';
  photosBtn.onclick = () => {
    closeContextMenu();
    const input = document.getElementById('fileInput');
    input.onchange = function() {
      const stackNode = { id: uid(), type: 'stack', classes: [], children: [] };
      state.nodes.push(stackNode);
      addFilesToContainer(this.files, stackNode);
      this.onchange = originalFileInputHandler;
    };
    input.click();
  };
  menu.appendChild(photosBtn);

  const sep = document.createElement('div');
  sep.className = 'context-menu__sep';
  menu.appendChild(sep);

  ['stack', 'row', 'grid', 'text'].forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'context-menu__item';
    btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    btn.onclick = () => {
      addTopLevelNode(type);
      closeContextMenu();
    };
    menu.appendChild(btn);
  });

  showContextMenuAt(menu, e);
}

function showAddChildMenu(e, parentNode) {
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = '';

  // Add photo directly into this container
  const addBtn = document.createElement('button');
  addBtn.className = 'context-menu__item';
  addBtn.textContent = 'Add photo…';
  addBtn.onclick = () => {
    closeContextMenu();
    const input = document.getElementById('fileInput');
    input.onchange = function() {
      addFilesToContainer(this.files, parentNode);
      this.onchange = originalFileInputHandler;
    };
    input.click();
  };
  menu.appendChild(addBtn);

  // Photos from shelf
  if (state.shelf.length) {
    const sep = document.createElement('div');
    sep.className = 'context-menu__sep';
    menu.appendChild(sep);

    const header = document.createElement('div');
    header.style.cssText = 'padding:4px 12px; font-size:0.65rem; opacity:0.4; text-transform:uppercase;';
    header.textContent = 'From shelf';
    menu.appendChild(header);

    state.shelf.forEach(photo => {
      const btn = document.createElement('button');
      btn.className = 'context-menu__item';
      btn.textContent = photo.filename.substring(photo.filename.lastIndexOf('-') + 1);
      btn.title = photo.filename;
      btn.onclick = () => {
        parentNode.children.push({
          id: uid(), type: 'photo',
          location: photo.location, filename: photo.filename,
          ratio: photo.ratio || '3/2', caption: '', alt: '', classes: []
        });
        closeContextMenu();
        renderCanvas();
      };
      menu.appendChild(btn);
    });
  }

  // Nested containers (only in stacks)
  if (parentNode.type === 'stack' || parentNode.type === 'single') {
    const sep = document.createElement('div');
    sep.className = 'context-menu__sep';
    menu.appendChild(sep);

    ['row', 'grid', 'stack', 'text'].forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'context-menu__item';
      btn.textContent = '+ ' + type;
      btn.onclick = () => {
        const node = type === 'text'
          ? { id: uid(), type: 'text', classes: [], html: '<p></p>' }
          : { id: uid(), type, classes: [], children: [] };
        parentNode.children.push(node);
        closeContextMenu();
        renderCanvas();
      };
      menu.appendChild(btn);
    });
  }

  showContextMenuAt(menu, e);
}

function showContextMenuAt(menu, e) {
  const rect = e.target.getBoundingClientRect();
  menu.style.left = rect.left + 'px';
  // Temporarily show off-screen to measure height
  menu.style.top = '-9999px';
  menu.classList.add('is-open');
  const menuHeight = menu.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom - 4;

  if (spaceBelow < menuHeight) {
    // Open upward
    menu.style.top = (rect.top - menuHeight - 4) + 'px';
  } else {
    menu.style.top = (rect.bottom + 4) + 'px';
  }

  setTimeout(() => {
    document.addEventListener('click', closeContextMenu, { once: true });
  }, 0);
}

function closeAllNodeControls() {
  document.querySelectorAll('.node.has-controls-open').forEach(n => n.classList.remove('has-controls-open'));
}

function closeContextMenu() {
  document.getElementById('contextMenu').classList.remove('is-open');
  const active = document.querySelector('.node.has-menu-open');
  if (active) active.classList.remove('has-menu-open');
}

function addTopLevelNode(type) {
  if (type === 'text') {
    state.nodes.push({ id: uid(), type: 'text', classes: [], html: '<p></p>' });
  } else {
    state.nodes.push({ id: uid(), type, classes: [], children: [] });
  }
  renderCanvas();
}

// ─── Export ─────────────────────────────────────────────
let markdownOriginal = '';

function openMarkdownModal() {
  const ta = document.getElementById('markdownOutput');
  markdownOriginal = generateMarkdown();
  ta.value = markdownOriginal;
  document.getElementById('markdownModal').classList.add('is-open');
  document.getElementById('importBtn').disabled = true;
}

document.getElementById('markdownOutput').addEventListener('input', () => {
  document.getElementById('importBtn').disabled = document.getElementById('markdownOutput').value === markdownOriginal;
});

function closeMarkdownModal() {
  document.getElementById('markdownModal').classList.remove('is-open');
}

function copyMarkdown() {
  const ta = document.getElementById('markdownOutput');
  navigator.clipboard.writeText(ta.value).then(() => {
    const btn = ta.closest('.modal').querySelector('.is-primary');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
}

function doImportFromModal() {
  const input = document.getElementById('markdownOutput').value.trim();
  if (!input) return;
  if (!confirm('Import this markdown? This will replace the current reportage.')) return;
  closeMarkdownModal();
  doImportText(input);
}

function generateMarkdown() {
  const m = state.meta;
  const photos = getAllPhotos();

  let yaml = '---\n';
  yaml += `layout: reportage\n`;
  yaml += `title: "${m.title}"\n`;
  if (m.hideTitle) yaml += `hide_title: true\n`;
  yaml += `date: "${m.date ? m.date + ' 00:00:00 +0200' : ''}"\n`;
  yaml += `category: reportage\n`;
  yaml += `tag: photo\n`;
  yaml += `location: ${m.location}\n`;

  if (m.camera) {
    const cams = m.camera.split(',').map(c => c.trim()).filter(Boolean);
    if (cams.length === 1) {
      yaml += `camera: ${cams[0]}\n`;
    } else {
      yaml += `camera:\n`;
      cams.forEach(c => yaml += `  - ${c}\n`);
    }
  }

  yaml += `cover: ${m.cover || (photos[0]?.filename || '')}\n`;
  yaml += `ratio: ${m.ratio}\n`;

  if (m.intro) {
    yaml += `intro: >\n`;
    m.intro.split('\n').forEach(line => yaml += `  ${line}\n`);
  }
  if (m.translation) {
    yaml += `translation: >\n`;
    m.translation.split('\n').forEach(line => yaml += `  ${line}\n`);
  }
  if (m.permalink) yaml += `permalink: ${m.permalink}\n`;

  // Filenames
  yaml += `filenames:\n`;
  photos.forEach(p => {
    yaml += `  - filename: ${p.filename}\n`;
    if (p.location && p.location !== m.location) {
      yaml += `    location: ${p.location}\n`;
    }
    if (p.ratio) yaml += `    ratio: ${p.ratio}\n`;
    if (p.caption) yaml += `    caption: ${p.caption}\n`;
  });

  yaml += '---\n';

  // Body
  let body = '\n';
  state.nodes.forEach(node => {
    body += renderNodeToLiquid(node, 0);
    body += '\n';
  });

  return yaml + body;
}

function renderNodeToLiquid(node, depth) {
  const indent = '    '.repeat(depth);

  if (node.type === 'photo') {
    let tag = `${indent}{% photo ${node.location} ${node.filename}`;
    if (node.ratio) tag += ` ${node.ratio}`;
    if (node.caption) tag += ` caption:"${node.caption}"`;
    if (node.alt) tag += ` alt:"${node.alt}"`;
    tag += ` %}\n`;
    return tag;
  }

  if (node.type === 'text') {
    // Clean up the HTML: remove empty tags, normalize whitespace
    const div = document.createElement('div');
    div.innerHTML = node.html;
    // Remove empty paragraphs
    div.querySelectorAll('p, div').forEach(el => {
      if (!el.textContent.trim() && !el.querySelector('img, br')) el.remove();
    });
    const cleaned = div.innerHTML.trim();

    // Clean translation HTML if present
    let translationCleaned = '';
    if (node.translation != null) {
      const tdiv = document.createElement('div');
      tdiv.innerHTML = node.translation;
      tdiv.querySelectorAll('p, div').forEach(el => {
        if (!el.textContent.trim() && !el.querySelector('img, br')) el.remove();
      });
      // Add is-light class to each <p> in the translation
      tdiv.querySelectorAll('p').forEach(p => p.classList.add('is-light'));
      translationCleaned = tdiv.innerHTML.trim();
    }

    if (!cleaned && !translationCleaned) return '';

    // Indent the HTML content
    const innerIndent = indent + '    ';
    const allHtml = [cleaned, translationCleaned].filter(Boolean).join('\n');
    const indented = allHtml.split('\n').map(line => {
      const trimmed = line.trim();
      return trimmed ? innerIndent + trimmed : '';
    }).filter(Boolean).join('\n');

    let out = `${indent}{% text %}\n`;
    out += indented + '\n';
    out += `${indent}{% endtext %}\n`;
    return out;
  }

  // Container — strip "center" from single since it's the default (no class needed)
  const exportClasses = node.type === 'single'
    ? node.classes.filter(c => c !== 'center')
    : node.classes;
  const classes = exportClasses.length ? ' ' + exportClasses.join(' ') : '';
  let out = `${indent}{% ${node.type}${classes} %}\n`;
  (node.children || []).forEach(child => {
    out += renderNodeToLiquid(child, depth + 1);
  });
  out += `${indent}{% end${node.type} %}\n`;
  return out;
}

// ─── Import ─────────────────────────────────────────────
function doImportText(input) {
  try {
    const parsed = parseMarkdown(input);
    Object.assign(state.meta, parsed.meta);
    state.nodes = parsed.nodes;

    // Build shelf from filenames in the document
    const photos = getAllPhotos();
    photos.forEach(p => {
      if (!state.shelf.find(s => s.filename === p.filename)) {
        state.shelf.push({
          filename: p.filename,
          location: p.location,
          ratio: p.ratio,
          objectUrl: null,
          camera: inferCamera(p.filename)
        });
      }
    });

    syncMetaUI();
    renderShelf();
    renderCanvas();
  } catch (err) {
    alert('Parse error: ' + err.message);
    console.error(err);
  }
}

function parseMarkdown(input) {
  // Split frontmatter and body
  const parts = input.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!parts) throw new Error('No frontmatter found');

  const meta = parseFrontmatter(parts[1]);
  const nodes = parseBody(parts[2]);
  return { meta, nodes };
}

function parseFrontmatter(yaml) {
  const meta = {
    title: '', date: '', location: '', camera: '',
    cover: '', ratio: '3/2', intro: '', translation: '',
    permalink: '', hideTitle: false
  };

  let currentKey = null;
  let multilineValue = '';
  let inArray = false;
  let arrayValues = [];

  const lines = yaml.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Multiline scalar (>) continuation
    if (currentKey && (currentKey === 'intro' || currentKey === 'translation') && /^ {2}\S/.test(line)) {
      multilineValue += (multilineValue ? '\n' : '') + line.substring(2);
      continue;
    } else if (currentKey && multilineValue) {
      meta[currentKey] = multilineValue;
      multilineValue = '';
      currentKey = null;
    }

    // Array item
    if (inArray && /^ {2}-/.test(line)) {
      const val = line.replace(/^ {2}- ?/, '').trim();
      arrayValues.push(val);
      continue;
    } else if (inArray) {
      meta.camera = arrayValues.join(', ');
      inArray = false;
      arrayValues = [];
    }

    // Key: value
    const kv = line.match(/^(\w[\w_]*)\s*:\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1];
    let val = kv[2].trim().replace(/^["']|["']$/g, '');

    if (key === 'hide_title') {
      meta.hideTitle = val === 'true';
    } else if (key === 'date') {
      meta.date = val.substring(0, 10); // Just the date part
    } else if (key === 'camera' && !val) {
      inArray = true;
      arrayValues = [];
    } else if (key === 'camera') {
      meta.camera = val;
    } else if ((key === 'intro' || key === 'translation') && val === '>') {
      currentKey = key;
      multilineValue = '';
    } else if (key === 'filenames') {
      // Skip — we'll rebuild from body
    } else if (key in meta) {
      meta[key] = val;
    }
  }

  if (currentKey && multilineValue) {
    meta[currentKey] = multilineValue;
  }
  if (inArray) {
    meta.camera = arrayValues.join(', ');
  }

  return meta;
}

function parseBody(body) {
  const tokens = tokenize(body);
  return parseTokens(tokens, null);
}

function tokenize(body) {
  const tokens = [];
  const re = /\{%[-\s]*(end)?(stack|row|grid|single|text|photo)\s*([\s\S]*?)[-\s]*%\}/g;
  let match;
  let lastIdx = 0;

  while ((match = re.exec(body)) !== null) {
    // Capture any HTML between tags
    if (match.index > lastIdx) {
      const html = body.substring(lastIdx, match.index).trim();
      if (html) tokens.push({ type: 'html', content: html });
    }

    const isEnd = !!match[1];
    const tag = match[2];
    const params = match[3].trim();

    if (tag === 'photo') {
      tokens.push({ type: 'photo', params });
    } else if (isEnd) {
      tokens.push({ type: 'close', tag });
    } else {
      tokens.push({ type: 'open', tag, params });
    }

    lastIdx = re.lastIndex;
  }

  // Trailing HTML
  const trailing = body.substring(lastIdx).trim();
  if (trailing) tokens.push({ type: 'html', content: trailing });

  return tokens;
}

function parseTokens(tokens, closeTag) {
  const nodes = [];

  while (tokens.length) {
    const tok = tokens[0];

    if (tok.type === 'close') {
      if (tok.tag === closeTag) {
        tokens.shift();
        return nodes;
      }
      // Unexpected close — stop
      break;
    }

    tokens.shift();

    if (tok.type === 'photo') {
      nodes.push(parsePhotoTag(tok.params));
    } else if (tok.type === 'open') {
      if (tok.tag === 'text') {
        // Collect HTML until endtext
        let html = '';
        while (tokens.length && !(tokens[0].type === 'close' && tokens[0].tag === 'text')) {
          const t = tokens.shift();
          if (t.type === 'html') html += t.content;
        }
        if (tokens.length) tokens.shift(); // consume endtext
        const classes = tok.params ? tok.params.split(/\s+/).filter(Boolean) : [];
        // Separate translation paragraphs (class="is-light") from main text
        const tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = html;
        const lightParas = tmpDiv.querySelectorAll('p.is-light');
        let translation = undefined;
        if (lightParas.length) {
          const tDiv = document.createElement('div');
          lightParas.forEach(p => {
            p.classList.remove('is-light');
            tDiv.appendChild(p);
          });
          translation = tDiv.innerHTML;
          html = tmpDiv.innerHTML;
        }
        const textNode = { id: uid(), type: 'text', classes, html };
        if (translation != null) textNode.translation = translation;
        nodes.push(textNode);
      } else {
        const classes = tok.params ? tok.params.split(/\s+/).filter(Boolean) : [];
        const children = parseTokens(tokens, tok.tag);
        nodes.push({ id: uid(), type: tok.tag, classes, children });
      }
    } else if (tok.type === 'html') {
      // Standalone HTML outside containers — wrap in text
      if (tok.content.length > 10) {
        nodes.push({ id: uid(), type: 'text', classes: [], html: tok.content });
      }
    }
  }

  return nodes;
}

function parsePhotoTag(params) {
  let location = '', filename = '', ratio = '', caption = '', alt = '', cls = '';

  // Extract named params first
  let remaining = params;
  remaining = remaining.replace(/(\w+):"([^"]*)"/g, (_, k, v) => {
    if (k === 'caption') caption = v;
    else if (k === 'alt') alt = v;
    else if (k === 'class') cls = v;
    else if (k === 'ratio') ratio = v;
    return '';
  });
  remaining = remaining.replace(/(\w+):'([^']*)'/g, (_, k, v) => {
    if (k === 'caption') caption = v;
    else if (k === 'alt') alt = v;
    return '';
  });

  const parts = remaining.trim().split(/\s+/).filter(Boolean);
  location = parts[0] || '';
  filename = parts[1] || '';
  if (parts[2] && /^\d+\/\d+$/.test(parts[2])) ratio = parts[2];

  return {
    id: uid(), type: 'photo',
    location, filename, ratio: ratio || '3/2',
    caption, alt, classes: cls ? [cls] : []
  };
}

// ─── Sync header height with layout padding ────────────
(function() {
  const header = document.getElementById('header');
  function syncHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
  syncHeaderHeight();
  new ResizeObserver(syncHeaderHeight).observe(header);
})();


// ─── Drag preview ───────────────────────────────────────
let dragPreview = null;
function createDragPreview(imgSrc) {
  if (dragPreview) dragPreview.remove();
  dragPreview = document.createElement('div');
  dragPreview.className = 'drag-preview';
  dragPreview.innerHTML = `<img src="${imgSrc}">`;
  document.body.appendChild(dragPreview);
  return dragPreview;
}
function removeDragPreview() {
  if (dragPreview) { dragPreview.remove(); dragPreview = null; }
}

// ─── File input ─────────────────────────────────────────
const originalFileInputHandler = function() { handleFiles(this.files); };
document.getElementById('fileInput').onchange = originalFileInputHandler;

// ─── Theme ──────────────────────────────────────────────
function applyTheme(mode) {
  let effective = mode;
  if (mode === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', effective);
  // Update checkmarks in menu
  document.querySelectorAll('.toolbar__menu-item[data-theme]').forEach(item => {
    item.classList.toggle('is-active', item.dataset.theme === mode);
  });
}

function setTheme(mode) {
  localStorage.setItem('reportage-editor-theme', mode);
  applyTheme(mode);
}

function toggleToolbarMenu(e) {
  e.stopPropagation();
  document.getElementById('toolbarMenu').classList.toggle('is-open');
}

(function initTheme() {
  const saved = localStorage.getItem('reportage-editor-theme') || 'light';
  applyTheme(saved);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('reportage-editor-theme') === 'system') applyTheme('system');
  });
})();

// ─── Close menus on outside click or scroll ─────────────
document.addEventListener('click', () => {
  document.querySelectorAll('.node__menu.is-open').forEach(m => m.classList.remove('is-open'));
  document.getElementById('toolbarMenu').classList.remove('is-open');
  closeAllNodeControls();
});

document.addEventListener('scroll', (e) => {
  if (e.target.closest && e.target.closest('.context-menu')) return;
  closeContextMenu();
}, true);

// ─── Reportage loader ────────────────────────────────────
let reportageIndex = [];

async function fetchReportageIndex() {
  try {
    const res = await fetch('/tools/reportages.json');
    if (!res.ok) return;
    reportageIndex = await res.json();
    const select = document.getElementById('reportageSelect');
    reportageIndex.forEach((item, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${item.date} — ${item.title}`;
      select.appendChild(opt);
    });
  } catch (e) {
    console.warn('Could not load reportage index:', e);
  }
}

function loadReportage(index) {
  if (index === '') return;
  const item = reportageIndex[index];
  if (!item) return;
  if (state.nodes.length && !confirm('Load this reportage? Current work will be replaced.')) {
    document.getElementById('reportageSelect').value = '';
    return;
  }
  doImportText(item.raw);
  document.getElementById('reportageSelect').value = '';
}

// ─── Init ───────────────────────────────────────────────
const loaded = loadState();
if (loaded) {
  syncMetaUI();
  renderShelf();
  restoreImages();
}
renderCanvas();
fetchReportageIndex();
