// ─── State ──────────────────────────────────────────────
const state = {
  meta: {
    title: '', date: '', location: '', camera: '',
    cover: '', ratio: '3/2', intro: '', translation: '',
    permalink: '', hideTitle: true, extra: []
  },
  nodes: [],
  shelf: [] // { filename, location, ratio, objectUrl, camera }
};

function uid() { return crypto.randomUUID(); }

// ─── Icons ──────────────────────────────────────────────
const SVG_ATTRS = 'width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  grip: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.6"/><circle cx="15" cy="5" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="19" r="1.6"/><circle cx="15" cy="19" r="1.6"/></svg>',
  up: `<svg ${SVG_ATTRS}><polyline points="18 15 12 9 6 15"/></svg>`,
  down: `<svg ${SVG_ATTRS}><polyline points="6 9 12 15 18 9"/></svg>`,
  plus: `<svg ${SVG_ATTRS}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x: `<svg ${SVG_ATTRS}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  dots: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
  chevron: `<svg ${SVG_ATTRS}><polyline points="9 18 15 12 9 6"/></svg>`,
  info: `<svg ${SVG_ATTRS}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  caption: `<svg ${SVG_ATTRS}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
};

// ─── Selection ──────────────────────────────────────────
let selectedNodeId = null;

// Node/shelf ids that have already been rendered once — used to play the
// entrance animation only for genuinely new elements, not on every re-render
const renderedNodeIds = new Set();
const renderedShelfNames = new Set();

function selectNode(id, opts = {}) {
  selectedNodeId = id;
  document.querySelectorAll('.node.is-selected').forEach(el => el.classList.remove('is-selected'));
  document.querySelectorAll('.outline__row.is-selected').forEach(el => el.classList.remove('is-selected'));
  if (!id) return;
  const el = document.querySelector(`.node[data-id="${id}"]`);
  if (el) {
    el.classList.add('is-selected');
    if (opts.scroll) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  const row = document.querySelector(`.outline__row[data-id="${id}"]`);
  if (row) row.classList.add('is-selected');
}

function flattenNodeIds(nodes = state.nodes, out = []) {
  for (const n of nodes) {
    out.push(n.id);
    if (n.children) flattenNodeIds(n.children, out);
  }
  return out;
}

function navigateSelection(dir) {
  const ids = flattenNodeIds();
  if (!ids.length) return;
  let idx = ids.indexOf(selectedNodeId);
  if (idx === -1) idx = dir > 0 ? -1 : ids.length;
  idx = Math.min(ids.length - 1, Math.max(0, idx + dir));
  selectNode(ids[idx], { scroll: true });
}

function nudgeSelected(dir) {
  if (!selectedNodeId) return;
  const info = findParent(selectedNodeId);
  if (!info) return;
  const idx = info.list.findIndex(n => n.id === selectedNodeId);
  const to = idx + dir;
  if (idx < 0 || to < 0 || to >= info.list.length) return;
  [info.list[idx], info.list[to]] = [info.list[to], info.list[idx]];
  renderCanvas();
  const el = document.querySelector(`.node[data-id="${selectedNodeId}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function moveNodeToEdge(id, edge) {
  const info = findParent(id);
  if (!info) return;
  const idx = info.list.findIndex(n => n.id === id);
  if (idx < 0) return;
  const [node] = info.list.splice(idx, 1);
  if (edge === 'top') info.list.unshift(node); else info.list.push(node);
  renderCanvas();
  const el = document.querySelector(`.node[data-id="${id}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Brief yellow flash to point at a node after navigating to it
function flashNode(id) {
  const el = document.querySelector(`.node[data-id="${id}"]`);
  if (!el) return;
  el.classList.remove('is-flashed');
  void el.offsetWidth;
  el.classList.add('is-flashed');
  setTimeout(() => el.classList.remove('is-flashed'), 1100);
}

let toastTimer = null;
function showToast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 4000);
}

// ─── Keyboard shortcuts ─────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // Staged: menus first, then modals, then selection
    if (closeMenus()) return;
    if (closeModals()) return;
    if (selectedNodeId) selectNode(null);
    return;
  }

  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;

  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    if (e.shiftKey) redo(); else undo();
    return;
  }

  if (e.metaKey || e.ctrlKey) return;
  if (document.querySelector('.modal-overlay.is-open')) return;

  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    const dir = e.key === 'ArrowUp' ? -1 : 1;
    if (e.altKey) nudgeSelected(dir); else navigateSelection(dir);
    return;
  }

  if (e.altKey) return;

  if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNodeId) {
    e.preventDefault();
    removeNode(selectedNodeId);
    return;
  }

  switch (e.key.toLowerCase()) {
    case 't': e.preventDefault(); toggleShelf(); break;
    case 'm': e.preventDefault(); toggleMetaPopover(); break;
    case 'o': e.preventDefault(); toggleOutline(); break;
    case 'e': e.preventDefault(); openMarkdownModal(); break;
    case 'n': e.preventDefault(); newReportage(); break;
  }
});

function closeMenus() {
  let closed = false;
  const ctx = document.getElementById('contextMenu');
  if (ctx.classList.contains('is-open')) { closeContextMenu(); closed = true; }
  const tm = document.getElementById('toolbarMenu');
  if (tm.classList.contains('is-open')) { tm.classList.remove('is-open'); closed = true; }
  const mp = document.getElementById('metaPopover');
  if (mp.classList.contains('is-open')) {
    mp.classList.remove('is-open');
    document.getElementById('titleBtn').classList.remove('is-active');
    closed = true;
  }
  document.querySelectorAll('.node__menu.is-open').forEach(m => { m.classList.remove('is-open'); closed = true; });
  if (document.querySelector('.node.has-controls-open')) { closeAllNodeControls(); closed = true; }
  return closed;
}

function closeModals() {
  let closed = false;
  const cm = document.getElementById('confirmModal');
  if (cm.classList.contains('is-open')) { cm.classList.remove('is-open'); closed = true; }
  const om = document.getElementById('openModal');
  if (om.classList.contains('is-open')) { om.classList.remove('is-open'); closed = true; }
  const cap = document.getElementById('captionModal');
  if (cap.classList.contains('is-open')) { closeCaptionDialog(); closed = true; }
  const mm = document.getElementById('markdownModal');
  if (mm.classList.contains('is-open')) { closeMarkdownModal(); closed = true; }
  return closed;
}

function confirmDialog(message, onConfirm, opts = {}) {
  const modal = document.getElementById('confirmModal');
  document.getElementById('confirmMessage').textContent = message;
  const ok = document.getElementById('confirmOkBtn');
  ok.textContent = opts.confirmLabel || 'Confirm';
  ok.onclick = () => {
    modal.classList.remove('is-open');
    onConfirm();
  };
  modal.classList.add('is-open');
  ok.focus();
}

function newReportage() {
  if (!state.nodes.length && !state.shelf.length) { doNewReportage(); return; }
  confirmDialog('Start a new reportage? This will clear everything.', doNewReportage, { confirmLabel: 'Clear' });
}

function doNewReportage() {
  // Revoke object URLs
  state.shelf.forEach(s => { if (s.objectUrl) URL.revokeObjectURL(s.objectUrl); });
  state.meta = {
    title: '', date: '', location: '', camera: '',
    cover: '', ratio: '3/2', intro: '', translation: '',
    permalink: '', hideTitle: true, extra: []
  };
  state.nodes = [];
  state.shelf = [];
  selectNode(null);
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
    if (selectedNodeId && !findNode(selectedNodeId)) selectedNodeId = null;
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

// Blobs are never deleted while editing so undo can always restore a
// removed photo. Orphans are pruned here on startup instead — the undo
// history doesn't survive a reload, so nothing can still reference them.
async function pruneStoredImages() {
  try {
    const db = await openDB();
    const keep = new Set(state.shelf.map(s => s.filename));
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const req = store.getAllKeys();
    req.onsuccess = () => {
      req.result.forEach(key => {
        if (!keep.has(key)) store.delete(key);
      });
    };
  } catch (err) {
    console.warn('Could not prune stored images:', err);
  }
}

// ─── Undo history ───────────────────────────────────────
const UNDO_LIMIT = 50;
let undoStack = [];
let redoStack = [];
let lastSavedJson = null;
let lastPushTime = 0;
let isRestoring = false;

// Pass coalesce=true for per-keystroke saves so a typing burst
// becomes a single undo step; discrete actions always get their own.
function saveState(coalesce = false) {
  const data = JSON.parse(JSON.stringify(state));
  data.shelf.forEach(s => delete s.objectUrl);
  const json = JSON.stringify(data);
  if (json === lastSavedJson) return;
  if (!isRestoring && lastSavedJson != null) {
    const now = Date.now();
    if (!coalesce || now - lastPushTime > 800) {
      undoStack.push(lastSavedJson);
      if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    }
    lastPushTime = coalesce ? now : 0;
    redoStack = [];
  }
  lastSavedJson = json;
  localStorage.setItem('reportage-editor-state', json);
  updateUndoUI();
}

// Persist without creating an undo step — for background mutations
// (like async ratio detection) that shouldn't pollute the history
function saveStateQuiet() {
  const data = JSON.parse(JSON.stringify(state));
  data.shelf.forEach(s => delete s.objectUrl);
  lastSavedJson = JSON.stringify(data);
  localStorage.setItem('reportage-editor-state', lastSavedJson);
}

function updateUndoUI() {
  const u = document.getElementById('undoBtn');
  const r = document.getElementById('redoBtn');
  if (!u || !r) return;
  u.disabled = !undoStack.length;
  r.disabled = !redoStack.length;
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(lastSavedJson);
  restoreFromJson(undoStack.pop());
  updateUndoUI();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(lastSavedJson);
  restoreFromJson(redoStack.pop());
  updateUndoUI();
}

function restoreFromJson(json) {
  const urls = new Map(state.shelf.map(s => [s.filename, s.objectUrl]));
  const data = JSON.parse(json);
  isRestoring = true;
  state.meta = data.meta || {};
  state.nodes = data.nodes || [];
  state.shelf = (data.shelf || []).map(s => ({ ...s, objectUrl: urls.get(s.filename) || null }));
  // Revoke URLs of entries that don't exist in the restored snapshot
  const kept = new Set(state.shelf.map(s => s.objectUrl).filter(Boolean));
  urls.forEach(url => {
    if (url && !kept.has(url)) URL.revokeObjectURL(url);
  });
  if (selectedNodeId && !findNode(selectedNodeId)) selectedNodeId = null;
  syncMetaUI();
  renderShelf();
  renderCanvas();
  isRestoring = false;
  lastPushTime = 0;
  if (state.shelf.some(s => !s.objectUrl)) restoreImages();
}

function loadState() {
  const raw = localStorage.getItem('reportage-editor-state');
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    Object.assign(state.meta, data.meta || {});
    state.nodes = data.nodes || [];
    state.shelf = (data.shelf || []).map(s => ({ ...s, objectUrl: null }));
    lastSavedJson = raw;
    return true;
  } catch { return false; }
}

async function restoreImages() {
  for (const entry of state.shelf) {
    if (entry.objectUrl) continue;
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
  if (key === 'title') {
    const el = document.getElementById('meta-title');
    if (el && document.activeElement !== el) el.value = value;
    updateTitleButton();
  }
  if (key === 'cover' && value) {
    // Auto-set ratio from the cover photo's ratio
    const photo = getShelfPhoto(value) || getAllPhotos().find(p => p.filename === value);
    if (photo && photo.ratio) {
      state.meta.ratio = photo.ratio;
      document.getElementById('meta-ratio').value = photo.ratio;
    }
  }
  saveState(true);
  if (key === 'cover') return;
  updateCoverPicker();
}

function updateTitleButton() {
  const el = document.getElementById('toolbar-title-text');
  el.textContent = state.meta.title || 'Untitled';
  el.classList.toggle('is-placeholder', !state.meta.title);
}

function syncMetaUI() {
  updateTitleButton();
  document.getElementById('meta-title').value = state.meta.title;
  document.getElementById('meta-date').value = state.meta.date;
  document.getElementById('meta-location').value = state.meta.location;
  document.getElementById('meta-camera').value = state.meta.camera;
  document.getElementById('meta-ratio').value = state.meta.ratio;
  document.getElementById('meta-intro').value = state.meta.intro;
  document.getElementById('meta-translation').value = state.meta.translation;
  updateCoverPicker();
}

function photoThumbSrc(p) {
  return getShelfPhoto(p.filename)?.objectUrl || `https://img.javier.computer/${p.location}/${p.filename}_2880.jpg`;
}

function updateCoverPicker() {
  const btn = document.getElementById('coverPickerBtn');
  const grid = document.getElementById('coverGrid');
  if (!btn || !grid) return;

  const photos = [];
  const seen = new Set();
  getAllPhotos().forEach(p => {
    if (!seen.has(p.filename)) { seen.add(p.filename); photos.push(p); }
  });

  const cover = state.meta.cover;
  const coverPhoto = photos.find(p => p.filename === cover);

  btn.innerHTML = '';
  if (coverPhoto) {
    const img = document.createElement('img');
    img.src = photoThumbSrc(coverPhoto);
    img.alt = '';
    btn.appendChild(img);
    const label = document.createElement('span');
    label.className = 'cover-picker__label';
    label.textContent = coverPhoto.filename;
    btn.appendChild(label);
  } else {
    const empty = document.createElement('span');
    empty.className = 'cover-picker__empty';
    empty.textContent = photos.length ? 'Choose a cover…' : 'Add photos to the canvas first';
    btn.appendChild(empty);
  }
  btn.disabled = !photos.length;

  grid.innerHTML = '';
  photos.forEach(p => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cover-grid__cell' + (p.filename === cover ? ' is-selected' : '');
    cell.title = p.filename;
    const img = document.createElement('img');
    img.src = photoThumbSrc(p);
    img.alt = p.filename;
    img.loading = 'lazy';
    cell.appendChild(img);
    cell.onclick = () => {
      updateMeta('cover', p.filename);
      updateCoverPicker();
      grid.classList.remove('is-open');
    };
    grid.appendChild(cell);
  });
}

function toggleCoverGrid(e) {
  e.stopPropagation();
  document.getElementById('coverGrid').classList.toggle('is-open');
}

function toggleMetaPopover(e) {
  if (e) e.stopPropagation();
  const pop = document.getElementById('metaPopover');
  const willOpen = !pop.classList.contains('is-open');
  closeMenus();
  if (willOpen) {
    pop.classList.add('is-open');
    document.getElementById('titleBtn').classList.add('is-active');
    const title = document.getElementById('meta-title');
    title.focus();
    title.select();
  }
}

function toggleOutline() {
  const panel = document.getElementById('outlinePanel');
  const btn = document.getElementById('outlineToggleBtn');
  const willOpen = !panel.classList.contains('is-open');
  panel.classList.toggle('is-open', willOpen);
  btn.classList.toggle('is-active', willOpen);
  localStorage.setItem('reportage-editor-outline', willOpen ? 'open' : 'collapsed');
  if (willOpen) renderOutline();
}

(function initOutline() {
  if (localStorage.getItem('reportage-editor-outline') === 'open') {
    document.getElementById('outlinePanel').classList.add('is-open');
    document.getElementById('outlineToggleBtn').classList.add('is-active');
  }
})();

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
    // Quiet save first so renderCanvas's saveState sees no change and the
    // async ratio detection doesn't become a phantom undo step
    saveStateQuiet();
    renderShelf();
    renderCanvas();
  }, 300);
}

// Add a file to the shelf (persisting the blob and detecting its ratio),
// or return the existing entry with the same basename.
function ensureShelfEntry(file) {
  const name = file.name.replace(/\.[^.]+$/, '');
  const existing = state.shelf.find(s => s.filename === name);
  if (existing) return existing;

  const objectUrl = URL.createObjectURL(file);
  const entry = {
    filename: name, location: inferLocation(name),
    ratio: '3/2', objectUrl, camera: inferCamera(name)
  };
  state.shelf.push(entry);

  saveImage(name, file).catch(err => {
    console.error(`Could not persist ${name}:`, err);
    showToast(`Could not save “${name}” in the browser — it may not survive a reload`);
  });

  // Detect ratio from image dimensions (debounced render)
  const img = new Image();
  img.onload = () => {
    const ratio = img.width >= img.height ? '3/2' : '2/3';
    entry.ratio = ratio;
    for (const p of getAllPhotos()) {
      if (p.filename === name) p.ratio = ratio;
    }
    scheduleRatioRender();
  };
  img.src = objectUrl;
  return entry;
}

function autoDetectCamera() {
  const cameras = [...new Set(state.shelf.map(s => s.camera).filter(Boolean))];
  if (cameras.length && !state.meta.camera) {
    state.meta.camera = cameras.join(', ');
    document.getElementById('meta-camera').value = state.meta.camera;
  }
}

async function handleFiles(files) {
  const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
  let skipped = 0;

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    const name = file.name.replace(/\.[^.]+$/, '');
    if (state.shelf.find(s => s.filename === name)) { skipped++; continue; }

    ensureShelfEntry(file);

    // Render shelf in batches of 10 for smooth loading
    if ((i + 1) % 10 === 0 || i === fileArray.length - 1) {
      renderShelf();
      saveState();
      // Yield to browser so it can paint
      await new Promise(r => requestAnimationFrame(r));
    }
  }

  autoDetectCamera();
  if (skipped) {
    showToast(`${skipped} photo${skipped === 1 ? '' : 's'} skipped — same name already on the shelf`);
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
    const entry = ensureShelfEntry(file);
    containerNode.children.push({
      id: uid(), type: 'photo',
      location: entry.location, filename: entry.filename,
      ratio: entry.ratio || '3/2',
      caption: '', alt: '', classes: []
    });
  }

  convertSingleIfCrowded(containerNode);
  autoDetectCamera();
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
    if (!renderedShelfNames.has(photo.filename)) {
      renderedShelfNames.add(photo.filename);
      div.classList.add('is-entering');
      div.addEventListener('animationend', () => div.classList.remove('is-entering'), { once: true });
    }
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
      document.getElementById('shelf').classList.remove('is-dragover');
      // OS files dropped on top of an existing thumbnail still get added
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
        return;
      }
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
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = photo.filename;
    img.addEventListener('error', () => { img.style.background = 'var(--editor-photo-fallback)'; });
    const removeBtn = document.createElement('div');
    removeBtn.className = 'shelf__remove';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      removeFromShelf(photo.filename);
    });
    div.append(img, removeBtn);
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
    // The IndexedDB blob is intentionally kept so undo can restore the
    // photo; pruneStoredImages() cleans up orphans on next startup
    if (!skipCanvas) {
      removePhotoNodes(filename, state.nodes);
      renderCanvas();
    }
    renderShelf();
    saveState();
  };

  const el = document.querySelector(`.shelf__photo[data-filename="${CSS.escape(filename)}"]`);
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
    const entry = ensureShelfEntry(file);
    newNodes.push({
      id: uid(), type: 'photo',
      location: entry.location, filename: entry.filename,
      ratio: entry.ratio || '3/2',
      caption: '', alt: '', classes: []
    });
  }

  containerNode.children.splice(insertIdx, 0, ...newNodes);

  convertSingleIfCrowded(containerNode);
  autoDetectCamera();
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
      const files = Array.from(this.files).filter(f => f.type.startsWith('image/'));
      if (files.length) {
        const stackNode = { id: uid(), type: 'stack', classes: [], children: [] };
        state.nodes.splice(index, 0, stackNode);
        addFilesToContainer(files, stackNode);
      }
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

  updateCoverPicker();
  updateShelfUsedState();
  renderOutline();
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

  canvas.addEventListener('click', e => {
    if (e.target === canvas) selectNode(null);
  });

  canvas.addEventListener('dragover', e => {
    canvas.classList.add('is-dragging');
    // Only handle on the canvas itself, not inside containers
    if (e.target !== canvas && !e.target.closest('.canvas__inserter')) {
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
    if (e.target !== canvas && !e.target.closest('.canvas__inserter')) {
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

  if (node.id === selectedNodeId) wrapper.classList.add('is-selected');
  if (!renderedNodeIds.has(node.id)) {
    renderedNodeIds.add(node.id);
    wrapper.classList.add('is-entering');
    wrapper.addEventListener('animationend', () => wrapper.classList.remove('is-entering'), { once: true });
  }

  wrapper.addEventListener('click', e => {
    if (e.target.closest('button, input, textarea, select, .text-editable, .node__menu, .node__controls, .node__trigger')) return;
    e.stopPropagation();
    selectNode(node.id);
  });

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
  moveGroup.innerHTML = `<span class="node__handle" data-tip="Drag to reorder">${ICONS.grip}</span>`;
  controls.appendChild(moveGroup);

  // Label (appended after arrows below)
  const label = document.createElement('span');
  label.className = 'node__label';
  label.dataset.tip = 'Change type';
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
  upBtn.innerHTML = ICONS.up;
  upBtn.dataset.tip = 'Move up';
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
  downBtn.innerHTML = ICONS.down;
  downBtn.dataset.tip = 'Move down';
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
    menuBtn.innerHTML = ICONS.dots;
    menuBtn.dataset.tip = 'Options';

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

    const moveSep = document.createElement('div');
    moveSep.className = 'node__menu-sep';
    menu.appendChild(moveSep);

    [['Move to top', 'top'], ['Move to bottom', 'bottom']].forEach(([text, edge]) => {
      const b = document.createElement('button');
      b.className = 'node__menu-action';
      b.textContent = text;
      b.onclick = (e) => {
        e.stopPropagation();
        menu.classList.remove('is-open');
        moveNodeToEdge(node.id, edge);
      };
      menu.appendChild(b);
    });

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
  addBtn.innerHTML = ICONS.plus;
  addBtn.dataset.tip = 'Add item';
  addBtn.onclick = (e) => { e.stopPropagation(); showAddChildMenu(e, node); };
  controls.appendChild(addBtn);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'node__btn is-delete';
  delBtn.innerHTML = ICONS.x;
  delBtn.dataset.tip = 'Delete';
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
  triggerHandle.innerHTML = ICONS.grip;
  triggerHandle.dataset.tip = 'Drag to reorder';
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

  // Type badge so it's clear the trigger belongs to this whole group,
  // not to the child it happens to visually sit on
  const triggerLabel = document.createElement('span');
  triggerLabel.className = 'node__trigger-label';
  triggerLabel.textContent = node.type;
  trigger.appendChild(triggerLabel);

  const triggerExpand = document.createElement('button');
  triggerExpand.className = 'node__trigger-expand';
  triggerExpand.innerHTML = ICONS.chevron;
  triggerExpand.dataset.tip = 'Show controls';
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
        convertSingleIfCrowded(node);
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
        convertSingleIfCrowded(node);
        renderCanvas();
      }
    } catch {}
  });

  wrapper.appendChild(container);

  return wrapper;
}

function renderPhotoNode(node, wrapper) {
  wrapper.classList.add('photo-item-wrapper');
  const div = document.createElement('div');
  div.className = 'photo-item';

  const shelf = getShelfPhoto(node.filename);
  const imgSrc = shelf?.objectUrl || `https://img.javier.computer/${node.location}/${node.filename}_2880.jpg`;

  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = node.alt || node.filename;
  // In a single container the photo shows at its natural ratio (the
  // stylesheet handles sizing); elsewhere the ratio crop is enforced inline
  const inSingle = findParent(node.id)?.parent?.type === 'single';
  if (node.ratio && !inSingle) {
    img.style.aspectRatio = node.ratio;
    img.style.objectFit = 'cover';
  }
  img.addEventListener('error', () => { img.dataset.failed = 'true'; img.alt = node.filename; });
  img.draggable = false; // prevent native image drag

  const removeBtn = document.createElement('button');
  removeBtn.className = 'photo-remove';
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', () => removeNode(node.id));

  const actions = document.createElement('div');
  actions.className = 'photo-actions';

  const captionBtn = document.createElement('button');
  captionBtn.className = 'photo-action' + (node.caption ? ' has-caption' : '');
  captionBtn.innerHTML = ICONS.caption;
  captionBtn.dataset.tip = node.caption ? `“${node.caption}”` : 'Add caption';
  captionBtn.addEventListener('click', e => {
    e.stopPropagation();
    openCaptionDialog(node.id);
  });
  actions.appendChild(captionBtn);

  const infoBtn = document.createElement('button');
  infoBtn.className = 'photo-action';
  infoBtn.innerHTML = ICONS.info;
  infoBtn.dataset.tip = `${node.location}/${node.filename}`;
  actions.appendChild(infoBtn);

  div.append(img, removeBtn, actions);

  // Make photos natively draggable
  wrapper.draggable = true;
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
  moveGroup.innerHTML = `<span class="node__handle" data-tip="Drag to reorder">${ICONS.grip}</span>`;
  controls.appendChild(moveGroup);

  // Move up
  const upBtn = document.createElement('button');
  upBtn.className = 'node__btn is-move';
  upBtn.innerHTML = ICONS.up;
  upBtn.dataset.tip = 'Move up';
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
  downBtn.innerHTML = ICONS.down;
  downBtn.dataset.tip = 'Move down';
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
  translationBtn.dataset.tip = 'Toggle translation';
  translationBtn.onclick = () => {
    if (node.translation != null) {
      // Stash the text so toggling off (or off+on by accident) isn't
      // destructive — the draft is ignored by the exporter
      if (node.translation) node.translationDraft = node.translation;
      delete node.translation;
    } else {
      node.translation = node.translationDraft || '';
      delete node.translationDraft;
    }
    renderCanvas();
    saveState();
  };
  controls.appendChild(translationBtn);

  const delBtn = document.createElement('button');
  delBtn.className = 'node__btn is-delete';
  delBtn.innerHTML = ICONS.x;
  delBtn.dataset.tip = 'Delete';
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
  trigger.innerHTML = ICONS.grip + '<span class="node__trigger-label">text</span>';
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

function getClassOptions(type) {
  switch (type) {
    case 'stack': return ['has-margin-top', 'has-margin-bottom', 'with-caption'];
    case 'row': return ['has-one', 'has-two', 'has-margin-bottom'];
    case 'grid': return ['is-square', 'is-vertical', 'is-half', 'has-margin-bottom'];
    case 'single': return ['left', 'center', 'right'];
    default: return [];
  }
}

// A single holds one photo — when a second one lands in it, convert it
// to a row (singles are horizontal flex, so that's what the gesture reads as)
function convertSingleIfCrowded(node) {
  if (node.type !== 'single') return;
  const photoCount = (node.children || []).filter(c => c.type === 'photo').length;
  if (photoCount <= 1) return;
  node.type = 'row';
  const validClasses = getClassOptions('row');
  node.classes = node.classes.filter(c => validClasses.includes(c));
  showToast('Single became a row');
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
  // Update the DOM in place instead of re-rendering, so the options
  // menu stays open and several classes can be toggled in a row
  const wrapper = document.querySelector(`.node[data-id="${node.id}"]`);
  if (wrapper) {
    const container = wrapper.querySelector(':scope > [data-parent-id]');
    if (container) {
      let className = `${node.type}-container ${node.classes.join(' ')}`.trim();
      if (!node.children || node.children.length === 0) className += ' is-empty';
      container.className = className;
    }
    wrapper.querySelectorAll(':scope > .node__controls .class-toggle').forEach(btn => {
      btn.classList.toggle('is-active', node.classes.includes(btn.textContent));
    });
    saveState();
  } else {
    renderCanvas();
  }
}

function updatePhotoField(id, field, value) {
  const node = findNode(id);
  if (node) {
    node[field] = value;
    saveState();
  }
}

// ─── Caption dialog ─────────────────────────────────────
let captionNodeId = null;

function openCaptionDialog(id) {
  const node = findNode(id);
  if (!node) return;
  captionNodeId = id;
  document.getElementById('captionFilename').textContent = `${node.location}/${node.filename}`;
  const input = document.getElementById('captionInput');
  input.value = node.caption || '';
  document.getElementById('altInput').value = node.alt || '';
  document.getElementById('captionModal').classList.add('is-open');
  input.focus();
  input.select();
}

function closeCaptionDialog() {
  document.getElementById('captionModal').classList.remove('is-open');
  captionNodeId = null;
}

function saveCaptionDialog() {
  const node = findNode(captionNodeId);
  if (node) {
    node.caption = document.getElementById('captionInput').value.trim();
    node.alt = document.getElementById('altInput').value.trim();
    saveState();
    renderCanvas(); // refresh the caption indicator
  }
  closeCaptionDialog();
}

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
      const files = Array.from(this.files).filter(f => f.type.startsWith('image/'));
      if (files.length) {
        const stackNode = { id: uid(), type: 'stack', classes: [], children: [] };
        state.nodes.push(stackNode);
        addFilesToContainer(files, stackNode);
      }
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

  // Containers and text first
  ['row', 'grid', 'stack', 'text'].forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'context-menu__item';
    btn.textContent = type.charAt(0).toUpperCase() + type.slice(1);
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

  const sep1 = document.createElement('div');
  sep1.className = 'context-menu__sep';
  menu.appendChild(sep1);

  // Add photo from file
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
    const sep2 = document.createElement('div');
    sep2.className = 'context-menu__sep';
    menu.appendChild(sep2);

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
        convertSingleIfCrowded(parentNode);
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
  menu.scrollTop = 0;
  menu.classList.add('is-open');
  const menuHeight = menu.offsetHeight;
  const spaceBelow = window.innerHeight - rect.bottom - 4;

  if (spaceBelow < menuHeight) {
    // Open upward
    menu.dataset.flip = 'up';
    menu.style.top = (rect.top - menuHeight - 4) + 'px';
  } else {
    menu.dataset.flip = 'down';
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
  confirmDialog('Import this markdown? This will replace the current reportage.', () => {
    closeMarkdownModal();
    doImportText(input);
  }, { confirmLabel: 'Import' });
}

function copyMarkdownToClipboard() {
  navigator.clipboard.writeText(generateMarkdown()).then(
    () => showToast('Markdown copied to clipboard'),
    () => showToast('Could not copy — use the markdown modal instead')
  );
}

// Double-quoted YAML scalar with escaped backslashes and quotes
function yamlQuote(str) {
  return '"' + String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// Double-quoted Liquid tag param. The tag parser can't handle escaped
// quotes, so encode them as &quot; (rendered back to " in the HTML output).
function liquidQuote(str) {
  return '"' + String(str || '').replace(/"/g, '&quot;') + '"';
}

// UTC offset for Europe/Madrid at midnight of the given date (+0100 / +0200)
function tzOffsetFor(dateStr) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Madrid', timeZoneName: 'longOffset'
    }).formatToParts(new Date(dateStr + 'T00:00:00Z'));
    const name = parts.find(p => p.type === 'timeZoneName').value;
    const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
    if (m) return m[1] + m[2] + m[3];
  } catch {}
  return '+0100';
}

function generateMarkdown() {
  const m = state.meta;
  const photos = getAllPhotos();

  let yaml = '---\n';
  yaml += `layout: reportage\n`;
  yaml += `title: ${yamlQuote(m.title)}\n`;
  if (m.hideTitle) yaml += `hide_title: true\n`;
  yaml += `date: "${m.date ? m.date + ' 00:00:00 ' + tzOffsetFor(m.date) : ''}"\n`;
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

  // Frontmatter keys the editor doesn't know about, preserved verbatim from import
  (m.extra || []).forEach(block => { yaml += block + '\n'; });

  // Filenames
  yaml += `filenames:\n`;
  photos.forEach(p => {
    yaml += `  - filename: ${p.filename}\n`;
    if (p.location && p.location !== m.location) {
      yaml += `    location: ${p.location}\n`;
    }
    if (p.ratio) yaml += `    ratio: ${p.ratio}\n`;
    if (p.caption) yaml += `    caption: ${yamlQuote(p.caption)}\n`;
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
    if (node.classes && node.classes.length) tag += ` class:"${node.classes.join(' ')}"`;
    if (node.caption) tag += ` caption:${liquidQuote(node.caption)}`;
    if (node.alt) tag += ` alt:${liquidQuote(node.alt)}`;
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

    // Rebuild the shelf from the document's filenames; drop stale entries
    // from previous work (their blobs stay in IndexedDB untouched)
    state.shelf.forEach(s => { if (s.objectUrl) URL.revokeObjectURL(s.objectUrl); });
    state.shelf = [];
    getAllPhotos().forEach(p => {
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

    selectNode(null);
    syncMetaUI();
    renderShelf();
    renderCanvas();
    restoreImages(); // reattach any locally stored blobs for these filenames
  } catch (err) {
    showToast('Parse error: ' + err.message);
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
    permalink: '', hideTitle: false, extra: []
  };

  // Keys the exporter always regenerates itself
  const REGENERATED = ['layout', 'category', 'tag', 'filenames'];

  // Group lines into top-level blocks: a key line plus its indented continuation
  const blocks = [];
  for (const line of yaml.split('\n')) {
    if (/^\S/.test(line) || !blocks.length) blocks.push([line]);
    else blocks[blocks.length - 1].push(line);
  }

  for (const block of blocks) {
    const kv = block[0].match(/^(\w[\w_]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];

    let raw = kv[2].trim();
    // Multi-line quoted scalar: fold indented continuation lines so the
    // closing quote is found (YAML folds these newlines into spaces)
    if (/^["']/.test(raw) && !/^(["']).*\1$/.test(raw)) {
      const cont = block.slice(1).map(l => l.trim()).filter(Boolean);
      if (cont.length) raw = [raw, ...cont].join(' ');
    }
    let val;
    if (/^".*"$/.test(raw)) {
      val = raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } else if (/^'.*'$/.test(raw)) {
      val = raw.slice(1, -1).replace(/''/g, "'");
    } else {
      // Unterminated quote (continuation not recoverable): strip stray
      // leading/trailing quotes like the old parser did
      val = raw.replace(/^["']|["']$/g, '');
    }

    if (REGENERATED.includes(key)) continue;

    if (key === 'hide_title') {
      meta.hideTitle = val === 'true';
    } else if (key === 'date') {
      meta.date = val.substring(0, 10); // Just the date part
    } else if (key === 'camera') {
      meta.camera = val || block.slice(1)
        .filter(l => /^\s*-\s*\S/.test(l))
        .map(l => l.replace(/^\s*-\s*/, '').trim())
        .join(', ');
    } else if (key === 'intro' || key === 'translation') {
      if (val === '>' || val === '|' || val === '') {
        meta[key] = block.slice(1).map(l => l.replace(/^ {2}/, '')).join('\n').replace(/\s+$/, '');
      } else {
        meta[key] = val;
      }
    } else if (key in meta) {
      meta[key] = val;
    } else {
      // Unknown key — keep the raw block so exporting doesn't lose it
      meta.extra.push(block.join('\n').replace(/\s+$/, ''));
    }
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
      nodes.push({ id: uid(), type: 'text', classes: [], html: tok.content });
    }
  }

  return nodes;
}

function parsePhotoTag(params) {
  let location = '', filename = '', ratio = '', caption = '', alt = '', cls = '';

  const assign = (k, v) => {
    if (k === 'caption') caption = v;
    else if (k === 'alt') alt = v;
    else if (k === 'class') cls = v;
    else if (k === 'ratio') ratio = v;
    else if (k === 'filename') filename = v;
    else if (k === 'location') location = v;
  };

  // Named params: key:"value", key:'value', key:bare_value (same as _plugins/photo.rb)
  let remaining = params;
  remaining = remaining.replace(/(\w+):"([^"]*)"/g, (_, k, v) => { assign(k, v); return ''; });
  remaining = remaining.replace(/(\w+):'([^']*)'/g, (_, k, v) => { assign(k, v); return ''; });
  remaining = remaining.replace(/(\w+):(\S+)/g, (_, k, v) => { assign(k, v); return ''; });

  // Undo the exporter's quote encoding
  caption = caption.replace(/&quot;/g, '"');
  alt = alt.replace(/&quot;/g, '"');

  // Remaining tokens are positional: location filename [ratio]
  const parts = remaining.trim().split(/\s+/).filter(Boolean);
  if (!location) location = parts[0] || '';
  if (!filename) filename = parts[1] || '';
  if (!ratio && parts[2] && /^\d+\/\d+$/.test(parts[2])) ratio = parts[2];

  return {
    id: uid(), type: 'photo',
    location, filename, ratio: ratio || '3/2',
    caption, alt, classes: cls ? cls.split(/\s+/).filter(Boolean) : []
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
  const menu = document.getElementById('toolbarMenu');
  const willOpen = !menu.classList.contains('is-open');
  closeMenus();
  if (willOpen) menu.classList.add('is-open');
}

(function initTheme() {
  const saved = localStorage.getItem('reportage-editor-theme') || 'system';
  applyTheme(saved);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('reportage-editor-theme') === 'system') applyTheme('system');
  });
})();

// ─── Close menus on outside click or scroll ─────────────
document.addEventListener('click', () => {
  closeMenus();
});

document.addEventListener('scroll', (e) => {
  const menu = document.getElementById('contextMenu');
  if (!menu.classList.contains('is-open')) return;
  if (e.target === menu || (e.target.closest && e.target.closest('.context-menu'))) return;
  closeContextMenu();
}, true);

// ─── Reportage loader ────────────────────────────────────
let reportageIndex = [];

async function fetchReportageIndex() {
  try {
    const res = await fetch('/tools/reportages.json');
    if (!res.ok) return;
    reportageIndex = await res.json();
  } catch (e) {
    console.warn('Could not load reportage index:', e);
  }
}

function openReportageModal() {
  closeMenus();
  document.getElementById('openModal').classList.add('is-open');
  const filter = document.getElementById('openFilter');
  filter.value = '';
  renderOpenList('');
  filter.focus();
}

function closeOpenModal() {
  document.getElementById('openModal').classList.remove('is-open');
}

function renderOpenList(filter) {
  const list = document.getElementById('openList');
  list.innerHTML = '';
  const q = (filter || '').trim().toLowerCase();
  const items = reportageIndex
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => !q || `${item.title} ${item.date}`.toLowerCase().includes(q));

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'open-modal__empty';
    empty.textContent = reportageIndex.length ? 'No matches' : 'No reportages found';
    list.appendChild(empty);
    return;
  }

  items.forEach(({ item, i }) => {
    const btn = document.createElement('button');
    btn.className = 'open-modal__item';
    const title = document.createElement('span');
    title.className = 'open-modal__item-title';
    title.textContent = item.title || 'Untitled';
    const date = document.createElement('span');
    date.className = 'open-modal__item-date';
    date.textContent = item.date || '';
    btn.append(title, date);
    btn.onclick = () => {
      closeOpenModal();
      loadReportage(i);
    };
    list.appendChild(btn);
  });
}

function loadReportage(index) {
  const item = reportageIndex[index];
  if (!item) return;
  const doLoad = () => {
    doImportText(item.raw);
    showToast(`Loaded “${item.title || 'Untitled'}”`);
  };
  if (state.nodes.length || state.shelf.length) {
    confirmDialog('Load this reportage? Current work will be replaced.', doLoad, { confirmLabel: 'Load' });
  } else {
    doLoad();
  }
}

// ─── Outline ────────────────────────────────────────────
const outlineCollapsed = new Set();
let outlineDrag = null; // { node, row, ghost, target }
let outlineDragEndedAt = 0;

function renderOutline() {
  const list = document.getElementById('outlineList');
  if (!list || !document.getElementById('outlinePanel').classList.contains('is-open')) return;
  list.innerHTML = '';

  if (!state.nodes.length) {
    const empty = document.createElement('div');
    empty.className = 'outline__empty';
    empty.textContent = 'Nothing on the canvas yet';
    list.appendChild(empty);
    return;
  }

  const walk = (nodes, depth) => {
    nodes.forEach(node => {
      list.appendChild(createOutlineRow(node, depth));
      if (node.children && node.children.length && !outlineCollapsed.has(node.id)) {
        walk(node.children, depth + 1);
      }
    });
  };
  walk(state.nodes, 0);

  // Rows were rebuilt — recompute the "you are here" marker
  currentOutlineId = null;
  updateOutlineCurrent();
}

function createOutlineRow(node, depth) {
  const row = document.createElement('div');
  row.className = 'outline__row';
  row.dataset.id = node.id;
  row.dataset.depth = depth;
  row.style.paddingLeft = (6 + depth * 16) + 'px';
  row.style.setProperty('--indent', (6 + depth * 16) + 'px');
  if (node.id === selectedNodeId) row.classList.add('is-selected');

  if (node.children) {
    const toggle = document.createElement('button');
    toggle.className = 'outline__toggle' + (outlineCollapsed.has(node.id) ? ' is-collapsed' : '');
    toggle.innerHTML = ICONS.chevron;
    if (!node.children.length) toggle.style.visibility = 'hidden';
    toggle.onclick = e => {
      e.stopPropagation();
      if (outlineCollapsed.has(node.id)) outlineCollapsed.delete(node.id);
      else outlineCollapsed.add(node.id);
      renderOutline();
    };
    row.appendChild(toggle);

    const badge = document.createElement('span');
    badge.className = 'outline__badge';
    badge.dataset.type = node.type;
    badge.textContent = node.type;
    row.appendChild(badge);

    const count = document.createElement('span');
    count.className = 'outline__count';
    count.textContent = node.children.length;
    row.appendChild(count);

    const filler = document.createElement('span');
    filler.className = 'outline__label';
    row.appendChild(filler);
  } else if (node.type === 'photo') {
    const pad = document.createElement('span');
    pad.className = 'outline__toggle';
    pad.style.visibility = 'hidden';
    row.appendChild(pad);

    const img = document.createElement('img');
    img.className = 'outline__thumb';
    const shelf = getShelfPhoto(node.filename);
    // Same URL as the canvas so the browser cache is reused
    img.src = shelf?.objectUrl || `https://img.javier.computer/${node.location}/${node.filename}_2880.jpg`;
    img.alt = '';
    img.draggable = false;
    img.loading = 'lazy';
    row.appendChild(img);

    const label = document.createElement('span');
    label.className = 'outline__label';
    label.textContent = node.filename.substring(node.filename.lastIndexOf('-') + 1) || node.filename;
    label.title = node.filename;
    row.appendChild(label);
  } else {
    const pad = document.createElement('span');
    pad.className = 'outline__toggle';
    pad.style.visibility = 'hidden';
    row.appendChild(pad);

    const badge = document.createElement('span');
    badge.className = 'outline__badge';
    badge.dataset.type = 'text';
    badge.textContent = '¶';
    row.appendChild(badge);

    const tmp = document.createElement('div');
    tmp.innerHTML = node.html || '';
    const label = document.createElement('span');
    label.className = 'outline__label';
    label.textContent = tmp.textContent.trim().slice(0, 60) || 'Empty text';
    row.appendChild(label);
  }

  row.addEventListener('click', () => {
    if (Date.now() - outlineDragEndedAt < 200) return;
    selectNode(node.id);
    const el = document.querySelector(`.node[data-id="${node.id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flashNode(node.id);
    }
  });

  row.addEventListener('pointerdown', e => outlinePointerDown(e, node, row));
  return row;
}

// Can `dragNode` live inside `container`? Same rules as canvas drag &
// drop: containers only nest inside stacks, leaves can go anywhere.
function canNest(dragNode, container) {
  if (dragNode.id === container.id) return false;
  if (dragNode.children) return container.type === 'stack';
  return true;
}

function canPlaceIn(dragNode, parentNode) {
  if (!parentNode) return true; // top level
  return canNest(dragNode, parentNode);
}

function outlinePointerDown(e, node, row) {
  if (e.button !== 0) return;
  if (e.target.closest('.outline__toggle')) return;
  const startX = e.clientX, startY = e.clientY;
  const list = document.getElementById('outlineList');
  let started = false;

  const onMove = ev => {
    if (!started) {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return;
      started = true;
      outlineDrag = { node, row, ghost: null, target: null };
      row.classList.add('is-dragging');
      const ghost = document.createElement('div');
      ghost.className = 'outline__ghost';
      ghost.innerHTML = row.innerHTML;
      ghost.querySelector('.outline__toggle')?.remove();
      document.body.appendChild(ghost);
      outlineDrag.ghost = ghost;
      document.body.classList.add('is-outline-dragging');
    }
    outlineDrag.ghost.style.transform = `translate(${ev.clientX + 12}px, ${ev.clientY + 8}px)`;

    // Autoscroll the panel near its edges — the point of the outline is
    // that long-distance moves don't require fighting the scroll
    const rect = list.getBoundingClientRect();
    if (ev.clientY < rect.top + 48) list.scrollTop -= 10;
    else if (ev.clientY > rect.bottom - 48) list.scrollTop += 10;

    updateOutlineDropTarget(ev);
  };

  const onUp = () => {
    row.removeEventListener('pointermove', onMove);
    row.removeEventListener('pointerup', onUp);
    row.removeEventListener('pointercancel', onUp);
    if (started) finishOutlineDrag();
  };

  row.setPointerCapture(e.pointerId);
  row.addEventListener('pointermove', onMove);
  row.addEventListener('pointerup', onUp);
  row.addEventListener('pointercancel', onUp);
}

function clearOutlineDropUI(list) {
  list.querySelectorAll('.outline__indicator').forEach(el => el.remove());
  list.querySelectorAll('.outline__row.is-drop-into').forEach(el => el.classList.remove('is-drop-into'));
}

function showOutlineGapIndicator(list, row, before) {
  const ind = document.createElement('div');
  ind.className = 'outline__indicator';
  ind.style.left = (parseInt(row.style.paddingLeft, 10) || 6) + 'px';
  ind.style.top = (before ? row.offsetTop - 2 : row.offsetTop + row.offsetHeight) + 'px';
  list.appendChild(ind);
}

function updateOutlineDropTarget(ev) {
  const list = document.getElementById('outlineList');
  const dragNode = outlineDrag.node;
  const rows = Array.from(list.querySelectorAll('.outline__row')).filter(r => {
    const id = r.dataset.id;
    if (id === dragNode.id) return false;
    if (dragNode.children && isDescendantOf(id, dragNode.id)) return false;
    return true;
  });

  clearOutlineDropUI(list);
  let target = null;

  // Hovering the middle band of a container row drops *into* it
  for (const r of rows) {
    const rect = r.getBoundingClientRect();
    if (ev.clientY >= rect.top && ev.clientY <= rect.bottom) {
      const inBand = ev.clientY >= rect.top + rect.height * 0.3 && ev.clientY <= rect.bottom - rect.height * 0.3;
      if (inBand) {
        const n = findNode(r.dataset.id);
        if (n && n.children && canNest(dragNode, n)) {
          target = { type: 'into', id: n.id };
          r.classList.add('is-drop-into');
        }
      }
      break;
    }
  }

  if (!target) {
    // Otherwise: the gap before the first row whose midpoint is below the pointer
    let beforeRow = null;
    for (const r of rows) {
      const rect = r.getBoundingClientRect();
      if (ev.clientY < rect.top + rect.height / 2) { beforeRow = r; break; }
    }
    if (beforeRow) {
      const beforeNode = findNode(beforeRow.dataset.id);
      const info = beforeNode && findParent(beforeNode.id);
      if (info && canPlaceIn(dragNode, info.parent)) {
        target = { type: 'before', id: beforeNode.id };
        showOutlineGapIndicator(list, beforeRow, true);
      }
    } else {
      target = { type: 'end' };
      const last = rows[rows.length - 1];
      if (last) showOutlineGapIndicator(list, last, false);
    }
  }

  outlineDrag.target = target;
}

function finishOutlineDrag() {
  const { node, row, ghost, target } = outlineDrag;
  const list = document.getElementById('outlineList');
  clearOutlineDropUI(list);
  if (ghost) ghost.remove();
  row.classList.remove('is-dragging');
  document.body.classList.remove('is-outline-dragging');
  outlineDragEndedAt = Date.now();
  outlineDrag = null;
  if (!target) return;

  const info = findParent(node.id);
  if (!info) return;
  const fromIdx = info.list.findIndex(n => n.id === node.id);
  if (fromIdx < 0) return;
  info.list.splice(fromIdx, 1);

  const wrapIfLoosePhoto = n => n.type === 'photo'
    ? { id: uid(), type: 'stack', classes: [], children: [n] }
    : n;

  if (target.type === 'into') {
    const container = findNode(target.id);
    if (container) {
      container.children.push(node);
      outlineCollapsed.delete(target.id);
      convertSingleIfCrowded(container);
    } else {
      info.list.splice(fromIdx, 0, node); // container vanished — put it back
    }
  } else if (target.type === 'before') {
    const beforeInfo = findParent(target.id);
    if (beforeInfo) {
      const idx = beforeInfo.list.findIndex(n => n.id === target.id);
      const toInsert = beforeInfo.parent ? node : wrapIfLoosePhoto(node);
      beforeInfo.list.splice(idx, 0, toInsert);
    } else {
      info.list.splice(fromIdx, 0, node);
    }
  } else { // end of document, top level
    state.nodes.push(wrapIfLoosePhoto(node));
  }

  renderCanvas();
}

// ─── Outline scroll-spy ─────────────────────────────────
// Marks the outline row for the node currently in view, so you always
// know where you are in the document
let currentOutlineId = null;
let spyTicking = false;

function updateOutlineCurrent() {
  const panel = document.getElementById('outlinePanel');
  if (!panel.classList.contains('is-open')) return;
  const refY = window.innerHeight * 0.35;
  const nodes = document.querySelectorAll('#canvas .node');
  let best = null;
  // Last match in document order = the innermost node under the line
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    if (r.top <= refY && r.bottom >= refY) best = el;
  }
  if (!best) {
    let minDist = Infinity;
    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      const d = Math.min(Math.abs(r.top - refY), Math.abs(r.bottom - refY));
      if (d < minDist) { minDist = d; best = el; }
    }
  }
  const id = best ? best.dataset.id : null;
  if (id === currentOutlineId) return;
  currentOutlineId = id;

  const list = document.getElementById('outlineList');
  list.querySelectorAll('.outline__row.is-current').forEach(r => r.classList.remove('is-current'));
  if (!id) return;

  // If the node's row is hidden inside a collapsed container, mark the
  // nearest visible ancestor instead
  let lookupId = id;
  let row = null;
  while (lookupId) {
    row = list.querySelector(`.outline__row[data-id="${lookupId}"]`);
    if (row) break;
    const info = findParent(lookupId);
    lookupId = info && info.parent ? info.parent.id : null;
  }
  if (row) row.classList.add('is-current');
}

document.addEventListener('scroll', () => {
  if (spyTicking) return;
  spyTicking = true;
  requestAnimationFrame(() => {
    spyTicking = false;
    updateOutlineCurrent();
  });
}, { passive: true });

// ─── Canvas → shelf hover sync ──────────────────────────
// Hovering a photo on the canvas highlights its thumbnail on the shelf
(function initCanvasHoverSync() {
  const canvas = document.getElementById('canvas');
  let hoveredFilename = null;

  const clear = () => {
    hoveredFilename = null;
    document.querySelectorAll('.shelf__photo.is-hovered').forEach(p => p.classList.remove('is-hovered'));
  };

  canvas.addEventListener('mouseover', e => {
    const el = e.target.closest('.node[data-type="photo"]');
    const node = el ? findNode(el.dataset.id) : null;
    const filename = node ? node.filename : null;
    if (filename === hoveredFilename) return;
    clear();
    if (!filename) return;
    hoveredFilename = filename;
    const thumb = document.querySelector(`.shelf__photo[data-filename="${CSS.escape(filename)}"]`);
    if (thumb) thumb.classList.add('is-hovered');
  });

  canvas.addEventListener('mouseleave', clear);
})();

// ─── Tooltips ───────────────────────────────────────────
// Custom tooltips for [data-tip] elements: delayed on first hover,
// instant when moving between adjacent controls
(function initTooltips() {
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  document.body.appendChild(tip);
  let showTimer = null;
  let lastHide = 0;
  let current = null;

  function show(el) {
    tip.innerHTML = '';
    tip.append(document.createTextNode(el.dataset.tip));
    if (el.dataset.tipKbd) {
      const k = document.createElement('span');
      k.className = 'tooltip__kbd';
      k.textContent = el.dataset.tipKbd;
      tip.appendChild(k);
    }
    tip.classList.add('is-visible');
    const r = el.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = r.left + r.width / 2 - tw / 2;
    x = Math.max(6, Math.min(x, window.innerWidth - tw - 6));
    let y = r.bottom + 6;
    if (y + th > window.innerHeight - 6) y = r.top - th - 6;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  function hide() {
    clearTimeout(showTimer);
    showTimer = null;
    current = null;
    if (tip.classList.contains('is-visible')) {
      lastHide = Date.now();
      tip.classList.remove('is-visible');
    }
  }

  document.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-tip]');
    if (!el) return;
    if (el === current) return;
    const wasVisible = tip.classList.contains('is-visible');
    hide();
    current = el;
    const delay = (wasVisible || Date.now() - lastHide < 400) ? 0 : 500;
    showTimer = setTimeout(() => show(el), delay);
  });

  document.addEventListener('mouseout', e => {
    const el = e.target.closest('[data-tip]');
    if (el && el === current && (!e.relatedTarget || !el.contains(e.relatedTarget))) hide();
  });

  document.addEventListener('mousedown', hide, true);
})();

// ─── Init ───────────────────────────────────────────────
const loaded = loadState();
if (loaded) {
  syncMetaUI();
  renderShelf();
  restoreImages();
}
renderCanvas();
updateUndoUI();
pruneStoredImages();
fetchReportageIndex();
