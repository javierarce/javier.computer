'use strict';

var obsidian = require('obsidian');
var child_process_1 = require('child_process');
var fs_1 = require('fs');
var tty = require('tty');
var util$1 = require('util');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var child_process_1__default = /*#__PURE__*/_interopDefaultLegacy(child_process_1);
var fs_1__default = /*#__PURE__*/_interopDefaultLegacy(fs_1);
var tty__default = /*#__PURE__*/_interopDefaultLegacy(tty);
var util__default = /*#__PURE__*/_interopDefaultLegacy(util$1);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

var ChangedFilesModal = /** @class */ (function (_super) {
    __extends(ChangedFilesModal, _super);
    function ChangedFilesModal(plugin, changedFiles) {
        var _this = _super.call(this, plugin.app) || this;
        _this.plugin = plugin;
        _this.changedFiles = changedFiles;
        _this.setPlaceholder("Not supported files will be opened by default app!");
        return _this;
    }
    ChangedFilesModal.prototype.getItems = function () {
        return this.changedFiles;
    };
    ChangedFilesModal.prototype.getItemText = function (item) {
        if (item.index == "?" && item.working_dir == "?") {
            return "Untracked | " + item.path;
        }
        var working_dir = "";
        var index = "";
        if (item.working_dir != " ")
            working_dir = "Working dir: " + item.working_dir + " ";
        if (item.index != " ")
            index = "Index: " + item.index;
        return "" + working_dir + index + " | " + item.path;
    };
    ChangedFilesModal.prototype.onChooseItem = function (item, _) {
        if (this.plugin.app.metadataCache.getFirstLinkpathDest(item.path, "") == null) {
            this.app.openWithDefaultApp(item.path);
        }
        else {
            this.plugin.app.workspace.openLinkText(item.path, "/");
        }
    };
    return ChangedFilesModal;
}(obsidian.FuzzySuggestModal));

var CustomMessageModal = /** @class */ (function (_super) {
    __extends(CustomMessageModal, _super);
    function CustomMessageModal(plugin) {
        var _this = _super.call(this, plugin.app) || this;
        _this.plugin = plugin;
        _this.setPlaceholder("Type your message and select optional the version with the added date.");
        return _this;
    }
    CustomMessageModal.prototype.getSuggestions = function (query) {
        var date = window.moment().format(this.plugin.settings.commitDateFormat);
        if (query == "")
            query = "...";
        return [query, date + ": " + query, query + ": " + date];
    };
    CustomMessageModal.prototype.renderSuggestion = function (value, el) {
        el.innerText = value;
    };
    CustomMessageModal.prototype.onChooseSuggestion = function (item, _) {
        var _this = this;
        this.plugin.promiseQueue.addTask(function () { return _this.plugin.createBackup(false, item); });
    };
    return CustomMessageModal;
}(obsidian.SuggestModal));

var PromiseQueue = /** @class */ (function () {
    function PromiseQueue() {
        this.tasks = [];
    }
    PromiseQueue.prototype.addTask = function (task) {
        this.tasks.push(task);
        if (this.tasks.length === 1) {
            this.handleTask();
        }
    };
    PromiseQueue.prototype.handleTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.tasks.length > 0) {
                    this.tasks[0]().finally(function () {
                        _this.tasks.shift();
                        _this.handleTask();
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    return PromiseQueue;
}());

var ObsidianGitSettingsTab = /** @class */ (function (_super) {
    __extends(ObsidianGitSettingsTab, _super);
    function ObsidianGitSettingsTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObsidianGitSettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Git Backup settings" });
        new obsidian.Setting(containerEl)
            .setName("Vault backup interval (minutes)")
            .setDesc("Commit and push changes every X minutes. To disable automatic backup, specify negative value or zero (default)")
            .addText(function (text) {
            return text
                .setValue(String(plugin.settings.autoSaveInterval))
                .onChange(function (value) {
                if (!isNaN(Number(value))) {
                    plugin.settings.autoSaveInterval = Number(value);
                    plugin.saveSettings();
                    if (plugin.settings.autoSaveInterval > 0) {
                        plugin.clearAutoBackup();
                        plugin.startAutoBackup(plugin.settings.autoSaveInterval);
                        new obsidian.Notice("Automatic backup enabled! Every " + plugin.settings.autoSaveInterval + " minutes.");
                    }
                    else if (plugin.settings.autoSaveInterval <= 0 &&
                        plugin.timeoutIDBackup) {
                        plugin.clearAutoBackup() &&
                            new obsidian.Notice("Automatic backup disabled!");
                    }
                }
                else {
                    new obsidian.Notice("Please specify a valid number.");
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Auto pull interval (minutes)")
            .setDesc("Pull changes every X minutes. To disable automatic pull, specify negative value or zero (default)")
            .addText(function (text) {
            return text
                .setValue(String(plugin.settings.autoPullInterval))
                .onChange(function (value) {
                if (!isNaN(Number(value))) {
                    plugin.settings.autoPullInterval = Number(value);
                    plugin.saveSettings();
                    if (plugin.settings.autoPullInterval > 0) {
                        plugin.clearAutoPull();
                        plugin.startAutoPull(plugin.settings.autoPullInterval);
                        new obsidian.Notice("Automatic pull enabled! Every " + plugin.settings.autoPullInterval + " minutes.");
                    }
                    else if (plugin.settings.autoPullInterval <= 0 &&
                        plugin.timeoutIDPull) {
                        plugin.clearAutoPull() &&
                            new obsidian.Notice("Automatic pull disabled!");
                    }
                }
                else {
                    new obsidian.Notice("Please specify a valid number.");
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Commit message")
            .setDesc("Specify custom commit message. Available placeholders: {{date}}" +
            " (see below) and {{numFiles}} (number of changed files in the commit)")
            .addText(function (text) {
            return text
                .setPlaceholder("vault backup")
                .setValue(plugin.settings.commitMessage
                ? plugin.settings.commitMessage
                : "")
                .onChange(function (value) {
                plugin.settings.commitMessage = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("{{date}} placeholder format")
            .setDesc('Specify custom date format. E.g. "YYYY-MM-DD HH:mm:ss"')
            .addText(function (text) {
            return text
                .setPlaceholder(plugin.settings.commitDateFormat)
                .setValue(plugin.settings.commitDateFormat)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            plugin.settings.commitDateFormat = value;
                            return [4 /*yield*/, plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("Preview commit message")
            .addButton(function (button) {
            return button.setButtonText("Preview").onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                var commitMessagePreview;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, plugin.gitManager.formatCommitMessage()];
                        case 1:
                            commitMessagePreview = _a.sent();
                            new obsidian.Notice("" + commitMessagePreview);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName("List filenames affected by commit in the commit body")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.listChangedFilesInMessageBody)
                .onChange(function (value) {
                plugin.settings.listChangedFilesInMessageBody = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Current branch")
            .setDesc("Switch to a different branch")
            .addDropdown(function (dropdown) { return __awaiter(_this, void 0, void 0, function () {
            var branchInfo, _i, _a, branch;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, plugin.gitManager.branchInfo()];
                    case 1:
                        branchInfo = _b.sent();
                        for (_i = 0, _a = branchInfo.branches; _i < _a.length; _i++) {
                            branch = _a[_i];
                            dropdown.addOption(branch, branch);
                        }
                        dropdown.setValue(branchInfo.current);
                        dropdown.onChange(function (option) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, plugin.gitManager.checkout(option)];
                                    case 1:
                                        _a.sent();
                                        new obsidian.Notice("Checked out to " + option);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
        new obsidian.Setting(containerEl)
            .setName("Pull updates on startup")
            .setDesc("Automatically pull updates when Obsidian starts")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.autoPullOnBoot)
                .onChange(function (value) {
                plugin.settings.autoPullOnBoot = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Disable push")
            .setDesc("Do not push changes to the remote repository")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.disablePush)
                .onChange(function (value) {
                plugin.settings.disablePush = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Pull changes before push")
            .setDesc("Commit -> pull -> push (Only if pushing is enabled)")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.pullBeforePush)
                .onChange(function (value) {
                plugin.settings.pullBeforePush = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Update submodules")
            .setDesc('"Create backup" and "pull" takes care of submodules. Missing features: Conflicted files, count of pulled/pushed/committed files. Tracking branch needs to be set for each submodule')
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.updateSubmodules)
                .onChange(function (value) {
                plugin.settings.updateSubmodules = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Disable notifications")
            .setDesc("Disable notifications for git operations to minimize distraction (refer to status bar for updates)")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.disablePopups)
                .onChange(function (value) {
                plugin.settings.disablePopups = value;
                plugin.saveSettings();
            });
        });
        new obsidian.Setting(containerEl)
            .setName("Show status bar")
            .setDesc("Obsidian must be restarted for the changes to take affect")
            .addToggle(function (toggle) {
            return toggle
                .setValue(plugin.settings.showStatusBar)
                .onChange(function (value) {
                plugin.settings.showStatusBar = value;
                plugin.saveSettings();
            });
        });
    };
    return ObsidianGitSettingsTab;
}(obsidian.PluginSettingTab));

var PluginState;
(function (PluginState) {
    PluginState[PluginState["idle"] = 0] = "idle";
    PluginState[PluginState["status"] = 1] = "status";
    PluginState[PluginState["pull"] = 2] = "pull";
    PluginState[PluginState["add"] = 3] = "add";
    PluginState[PluginState["commit"] = 4] = "commit";
    PluginState[PluginState["push"] = 5] = "push";
    PluginState[PluginState["conflicted"] = 6] = "conflicted";
})(PluginState || (PluginState = {}));

var StatusBar = /** @class */ (function () {
    function StatusBar(statusBarEl, plugin) {
        this.messages = [];
        this.statusBarEl = statusBarEl;
        this.plugin = plugin;
    }
    StatusBar.prototype.displayMessage = function (message, timeout) {
        this.messages.push({
            message: "git: " + message.slice(0, 100),
            timeout: timeout,
        });
        this.display();
    };
    StatusBar.prototype.display = function () {
        if (this.messages.length > 0 && !this.currentMessage) {
            this.currentMessage = this.messages.shift();
            this.statusBarEl.setText(this.currentMessage.message);
            this.lastMessageTimestamp = Date.now();
        }
        else if (this.currentMessage) {
            var messageAge = Date.now() - this.lastMessageTimestamp;
            if (messageAge >= this.currentMessage.timeout) {
                this.currentMessage = null;
                this.lastMessageTimestamp = null;
            }
        }
        else {
            this.displayState();
        }
    };
    StatusBar.prototype.displayState = function () {
        switch (this.plugin.state) {
            case PluginState.idle:
                this.displayFromNow(this.plugin.lastUpdate);
                break;
            case PluginState.status:
                this.statusBarEl.setText("git: checking repo status...");
                break;
            case PluginState.add:
                this.statusBarEl.setText("git: adding files to repo...");
                break;
            case PluginState.commit:
                this.statusBarEl.setText("git: committing changes...");
                break;
            case PluginState.push:
                this.statusBarEl.setText("git: pushing changes...");
                break;
            case PluginState.pull:
                this.statusBarEl.setText("git: pulling changes...");
                break;
            case PluginState.conflicted:
                this.statusBarEl.setText("git: you have conflict files...");
                break;
            default:
                this.statusBarEl.setText("git: failed on initialization!");
                break;
        }
    };
    StatusBar.prototype.displayFromNow = function (timestamp) {
        if (timestamp) {
            var moment_1 = window.moment;
            var fromNow = moment_1(timestamp).fromNow();
            this.statusBarEl.setText("git: last update " + fromNow);
        }
        else {
            this.statusBarEl.setText("git: ready");
        }
    };
    return StatusBar;
}());

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var gitError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitError = void 0;
/**
 * The `GitError` is thrown when the underlying `git` process throws a
 * fatal exception (eg an `ENOENT` exception when attempting to use a
 * non-writable directory as the root for your repo), and acts as the
 * base class for more specific errors thrown by the parsing of the
 * git response or errors in the configuration of the task about to
 * be run.
 *
 * When an exception is thrown, pending tasks in the same instance will
 * not be executed. The recommended way to run a series of tasks that
 * can independently fail without needing to prevent future tasks from
 * running is to catch them individually:
 *
 * ```typescript
 import { gitP, SimpleGit, GitError, PullResult } from 'simple-git';

 function catchTask (e: GitError) {
   return e.
 }

 const git = gitP(repoWorkingDir);
 const pulled: PullResult | GitError = await git.pull().catch(catchTask);
 const pushed: string | GitError = await git.pushTags().catch(catchTask);
 ```
 */
class GitError extends Error {
    constructor(task, message) {
        super(message);
        this.task = task;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.GitError = GitError;

});

var gitResponseError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitResponseError = void 0;

/**
 * The `GitResponseError` is the wrapper for a parsed response that is treated as
 * a fatal error, for example attempting a `merge` can leave the repo in a corrupted
 * state when there are conflicts so the task will reject rather than resolve.
 *
 * For example, catching the merge conflict exception:
 *
 * ```typescript
 import { gitP, SimpleGit, GitResponseError, MergeSummary } from 'simple-git';

 const git = gitP(repoRoot);
 const mergeOptions: string[] = ['--no-ff', 'other-branch'];
 const mergeSummary: MergeSummary = await git.merge(mergeOptions)
      .catch((e: GitResponseError<MergeSummary>) => e.git);

 if (mergeSummary.failed) {
   // deal with the error
 }
 ```
 */
class GitResponseError extends gitError.GitError {
    constructor(
    /**
     * `.git` access the parsed response that is treated as being an error
     */
    git, message) {
        super(undefined, message || String(git));
        this.git = git;
    }
}
exports.GitResponseError = GitResponseError;

});

var gitConstructError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitConstructError = void 0;

/**
 * The `GitConstructError` is thrown when an error occurs in the constructor
 * of the `simple-git` instance itself. Most commonly as a result of using
 * a `baseDir` option that points to a folder that either does not exist,
 * or cannot be read by the user the node script is running as.
 *
 * Check the `.message` property for more detail including the properties
 * passed to the constructor.
 */
class GitConstructError extends gitError.GitError {
    constructor(config, message) {
        super(undefined, message);
        this.config = config;
    }
}
exports.GitConstructError = GitConstructError;

});

var gitPluginError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitPluginError = void 0;

class GitPluginError extends gitError.GitError {
    constructor(task, plugin, message) {
        super(task, message);
        this.task = task;
        this.plugin = plugin;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.GitPluginError = GitPluginError;

});

var taskConfigurationError = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskConfigurationError = void 0;

/**
 * The `TaskConfigurationError` is thrown when a command was incorrectly
 * configured. An error of this kind means that no attempt was made to
 * run your command through the underlying `git` binary.
 *
 * Check the `.message` property for more detail on why your configuration
 * resulted in an error.
 */
class TaskConfigurationError extends gitError.GitError {
    constructor(message) {
        super(undefined, message);
    }
}
exports.TaskConfigurationError = TaskConfigurationError;

});

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

var browser = createCommonjsModule(function (module, exports) {
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
});

var hasFlag = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os__default['default'].release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty__default['default'].isatty(1))),
	stderr: translateLevel(supportsColor(true, tty__default['default'].isatty(2)))
};

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util__default['default'].deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = supportsColor_1;

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty__default['default'].isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util__default['default'].format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util__default['default'].inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util__default['default'].inspect(v, this.inspectOpts);
};
});

var src$2 = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = browser;
} else {
	module.exports = node;
}
});

var src$1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const debug_1 = __importDefault(src$2);
const log = debug_1.default('@kwsites/file-exists');
function check(path, isFile, isDirectory) {
    log(`checking %s`, path);
    try {
        const stat = fs_1__default['default'].statSync(path);
        if (stat.isFile() && isFile) {
            log(`[OK] path represents a file`);
            return true;
        }
        if (stat.isDirectory() && isDirectory) {
            log(`[OK] path represents a directory`);
            return true;
        }
        log(`[FAIL] path represents something other than a file or directory`);
        return false;
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            log(`[FAIL] path is not accessible: %o`, e);
            return false;
        }
        log(`[FATAL] %o`, e);
        throw e;
    }
}
/**
 * Synchronous validation of a path existing either as a file or as a directory.
 *
 * @param {string} path The path to check
 * @param {number} type One or both of the exported numeric constants
 */
function exists(path, type = exports.READABLE) {
    return check(path, (type & exports.FILE) > 0, (type & exports.FOLDER) > 0);
}
exports.exists = exists;
/**
 * Constant representing a file
 */
exports.FILE = 1;
/**
 * Constant representing a folder
 */
exports.FOLDER = 2;
/**
 * Constant representing either a file or a folder
 */
exports.READABLE = exports.FILE + exports.FOLDER;

});

var dist$1 = createCommonjsModule(function (module, exports) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(src$1);

});

var util = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = exports.bufferToString = exports.prefixedArray = exports.asNumber = exports.asStringArray = exports.asArray = exports.objectToString = exports.remove = exports.including = exports.append = exports.folderExists = exports.forEachLineWithContent = exports.toLinesWithContent = exports.last = exports.first = exports.splitOn = exports.isUserFunction = exports.asFunction = exports.NOOP = void 0;

const NOOP = () => {
};
exports.NOOP = NOOP;
/**
 * Returns either the source argument when it is a `Function`, or the default
 * `NOOP` function constant
 */
function asFunction(source) {
    return typeof source === 'function' ? source : exports.NOOP;
}
exports.asFunction = asFunction;
/**
 * Determines whether the supplied argument is both a function, and is not
 * the `NOOP` function.
 */
function isUserFunction(source) {
    return (typeof source === 'function' && source !== exports.NOOP);
}
exports.isUserFunction = isUserFunction;
function splitOn(input, char) {
    const index = input.indexOf(char);
    if (index <= 0) {
        return [input, ''];
    }
    return [
        input.substr(0, index),
        input.substr(index + 1),
    ];
}
exports.splitOn = splitOn;
function first(input, offset = 0) {
    return isArrayLike(input) && input.length > offset ? input[offset] : undefined;
}
exports.first = first;
function last(input, offset = 0) {
    if (isArrayLike(input) && input.length > offset) {
        return input[input.length - 1 - offset];
    }
}
exports.last = last;
function isArrayLike(input) {
    return !!(input && typeof input.length === 'number');
}
function toLinesWithContent(input, trimmed = true, separator = '\n') {
    return input.split(separator)
        .reduce((output, line) => {
        const lineContent = trimmed ? line.trim() : line;
        if (lineContent) {
            output.push(lineContent);
        }
        return output;
    }, []);
}
exports.toLinesWithContent = toLinesWithContent;
function forEachLineWithContent(input, callback) {
    return toLinesWithContent(input, true).map(line => callback(line));
}
exports.forEachLineWithContent = forEachLineWithContent;
function folderExists(path) {
    return dist$1.exists(path, dist$1.FOLDER);
}
exports.folderExists = folderExists;
/**
 * Adds `item` into the `target` `Array` or `Set` when it is not already present and returns the `item`.
 */
function append(target, item) {
    if (Array.isArray(target)) {
        if (!target.includes(item)) {
            target.push(item);
        }
    }
    else {
        target.add(item);
    }
    return item;
}
exports.append = append;
/**
 * Adds `item` into the `target` `Array` when it is not already present and returns the `target`.
 */
function including(target, item) {
    if (Array.isArray(target) && !target.includes(item)) {
        target.push(item);
    }
    return target;
}
exports.including = including;
function remove(target, item) {
    if (Array.isArray(target)) {
        const index = target.indexOf(item);
        if (index >= 0) {
            target.splice(index, 1);
        }
    }
    else {
        target.delete(item);
    }
    return item;
}
exports.remove = remove;
exports.objectToString = Object.prototype.toString.call.bind(Object.prototype.toString);
function asArray(source) {
    return Array.isArray(source) ? source : [source];
}
exports.asArray = asArray;
function asStringArray(source) {
    return asArray(source).map(String);
}
exports.asStringArray = asStringArray;
function asNumber(source, onNaN = 0) {
    if (source == null) {
        return onNaN;
    }
    const num = parseInt(source, 10);
    return isNaN(num) ? onNaN : num;
}
exports.asNumber = asNumber;
function prefixedArray(input, prefix) {
    const output = [];
    for (let i = 0, max = input.length; i < max; i++) {
        output.push(prefix, input[i]);
    }
    return output;
}
exports.prefixedArray = prefixedArray;
function bufferToString(input) {
    return (Array.isArray(input) ? Buffer.concat(input) : input).toString('utf-8');
}
exports.bufferToString = bufferToString;
/**
 * Get a new object from a source object with only the listed properties.
 */
function pick(source, properties) {
    return Object.assign({}, ...properties.map((property) => property in source ? { [property]: source[property] } : {}));
}
exports.pick = pick;

});

var argumentFilters = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHasLength = exports.filterFunction = exports.filterPlainObject = exports.filterStringOrStringArray = exports.filterStringArray = exports.filterString = exports.filterPrimitives = exports.filterArray = exports.filterType = void 0;

function filterType(input, filter, def) {
    if (filter(input)) {
        return input;
    }
    return (arguments.length > 2) ? def : undefined;
}
exports.filterType = filterType;
const filterArray = (input) => {
    return Array.isArray(input);
};
exports.filterArray = filterArray;
function filterPrimitives(input, omit) {
    return /number|string|boolean/.test(typeof input) && (!omit || !omit.includes((typeof input)));
}
exports.filterPrimitives = filterPrimitives;
const filterString = (input) => {
    return typeof input === 'string';
};
exports.filterString = filterString;
const filterStringArray = (input) => {
    return Array.isArray(input) && input.every(exports.filterString);
};
exports.filterStringArray = filterStringArray;
const filterStringOrStringArray = (input) => {
    return exports.filterString(input) || (Array.isArray(input) && input.every(exports.filterString));
};
exports.filterStringOrStringArray = filterStringOrStringArray;
function filterPlainObject(input) {
    return !!input && util.objectToString(input) === '[object Object]';
}
exports.filterPlainObject = filterPlainObject;
function filterFunction(input) {
    return typeof input === 'function';
}
exports.filterFunction = filterFunction;
const filterHasLength = (input) => {
    if (input == null || 'number|boolean|function'.includes(typeof input)) {
        return false;
    }
    return Array.isArray(input) || typeof input === 'string' || typeof input.length === 'number';
};
exports.filterHasLength = filterHasLength;

});

var exitCodes = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitCodes = void 0;
(function (ExitCodes) {
    ExitCodes[ExitCodes["SUCCESS"] = 0] = "SUCCESS";
    ExitCodes[ExitCodes["ERROR"] = 1] = "ERROR";
    ExitCodes[ExitCodes["UNCLEAN"] = 128] = "UNCLEAN";
})(exports.ExitCodes || (exports.ExitCodes = {}));

});

var gitOutputStreams = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitOutputStreams = void 0;
class GitOutputStreams {
    constructor(stdOut, stdErr) {
        this.stdOut = stdOut;
        this.stdErr = stdErr;
    }
    asStrings() {
        return new GitOutputStreams(this.stdOut.toString('utf8'), this.stdErr.toString('utf8'));
    }
}
exports.GitOutputStreams = GitOutputStreams;

});

var lineParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteLineParser = exports.LineParser = void 0;
class LineParser {
    constructor(regExp, useMatches) {
        this.matches = [];
        this.parse = (line, target) => {
            this.resetMatches();
            if (!this._regExp.every((reg, index) => this.addMatch(reg, index, line(index)))) {
                return false;
            }
            return this.useMatches(target, this.prepareMatches()) !== false;
        };
        this._regExp = Array.isArray(regExp) ? regExp : [regExp];
        if (useMatches) {
            this.useMatches = useMatches;
        }
    }
    // @ts-ignore
    useMatches(target, match) {
        throw new Error(`LineParser:useMatches not implemented`);
    }
    resetMatches() {
        this.matches.length = 0;
    }
    prepareMatches() {
        return this.matches;
    }
    addMatch(reg, index, line) {
        const matched = line && reg.exec(line);
        if (matched) {
            this.pushMatch(index, matched);
        }
        return !!matched;
    }
    pushMatch(_index, matched) {
        this.matches.push(...matched.slice(1));
    }
}
exports.LineParser = LineParser;
class RemoteLineParser extends LineParser {
    addMatch(reg, index, line) {
        return /^remote:\s/.test(String(line)) && super.addMatch(reg, index, line);
    }
    pushMatch(index, matched) {
        if (index > 0 || matched.length > 1) {
            super.pushMatch(index, matched);
        }
    }
}
exports.RemoteLineParser = RemoteLineParser;

});

var simpleGitOptions = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstanceConfig = void 0;
const defaultOptions = {
    binary: 'git',
    maxConcurrentProcesses: 5,
    config: [],
};
function createInstanceConfig(...options) {
    const baseDir = process.cwd();
    const config = Object.assign(Object.assign({ baseDir }, defaultOptions), ...(options.filter(o => typeof o === 'object' && o)));
    config.baseDir = config.baseDir || baseDir;
    return config;
}
exports.createInstanceConfig = createInstanceConfig;

});

var taskOptions = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.trailingFunctionArgument = exports.trailingOptionsArgument = exports.getTrailingOptions = exports.appendTaskOptions = void 0;


function appendTaskOptions(options, commands = []) {
    if (!argumentFilters.filterPlainObject(options)) {
        return commands;
    }
    return Object.keys(options).reduce((commands, key) => {
        const value = options[key];
        if (argumentFilters.filterPrimitives(value, ['boolean'])) {
            commands.push(key + '=' + value);
        }
        else {
            commands.push(key);
        }
        return commands;
    }, commands);
}
exports.appendTaskOptions = appendTaskOptions;
function getTrailingOptions(args, initialPrimitive = 0, objectOnly = false) {
    const command = [];
    for (let i = 0, max = initialPrimitive < 0 ? args.length : initialPrimitive; i < max; i++) {
        if ('string|number'.includes(typeof args[i])) {
            command.push(String(args[i]));
        }
    }
    appendTaskOptions(trailingOptionsArgument(args), command);
    if (!objectOnly) {
        command.push(...trailingArrayArgument(args));
    }
    return command;
}
exports.getTrailingOptions = getTrailingOptions;
function trailingArrayArgument(args) {
    const hasTrailingCallback = typeof util.last(args) === 'function';
    return argumentFilters.filterType(util.last(args, hasTrailingCallback ? 1 : 0), argumentFilters.filterArray, []);
}
/**
 * Given any number of arguments, returns the trailing options argument, ignoring a trailing function argument
 * if there is one. When not found, the return value is null.
 */
function trailingOptionsArgument(args) {
    const hasTrailingCallback = argumentFilters.filterFunction(util.last(args));
    return argumentFilters.filterType(util.last(args, hasTrailingCallback ? 1 : 0), argumentFilters.filterPlainObject);
}
exports.trailingOptionsArgument = trailingOptionsArgument;
/**
 * Returns either the source argument when it is a `Function`, or the default
 * `NOOP` function constant
 */
function trailingFunctionArgument(args, includeNoop = true) {
    const callback = util.asFunction(util.last(args));
    return includeNoop || util.isUserFunction(callback) ? callback : undefined;
}
exports.trailingFunctionArgument = trailingFunctionArgument;

});

var taskParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStringResponse = exports.callTaskParser = void 0;

function callTaskParser(parser, streams) {
    return parser(streams.stdOut, streams.stdErr);
}
exports.callTaskParser = callTaskParser;
function parseStringResponse(result, parsers, ...texts) {
    texts.forEach(text => {
        for (let lines = util.toLinesWithContent(text), i = 0, max = lines.length; i < max; i++) {
            const line = (offset = 0) => {
                if ((i + offset) >= max) {
                    return;
                }
                return lines[i + offset];
            };
            parsers.some(({ parse }) => parse(line, result));
        }
    });
    return result;
}
exports.parseStringResponse = parseStringResponse;

});

var utils = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(argumentFilters, exports);
__exportStar(exitCodes, exports);
__exportStar(gitOutputStreams, exports);
__exportStar(lineParser, exports);
__exportStar(simpleGitOptions, exports);
__exportStar(taskOptions, exports);
__exportStar(taskParser, exports);
__exportStar(util, exports);

});

var checkIsRepo = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsBareRepoTask = exports.checkIsRepoRootTask = exports.checkIsRepoTask = exports.CheckRepoActions = void 0;

var CheckRepoActions;
(function (CheckRepoActions) {
    CheckRepoActions["BARE"] = "bare";
    CheckRepoActions["IN_TREE"] = "tree";
    CheckRepoActions["IS_REPO_ROOT"] = "root";
})(CheckRepoActions = exports.CheckRepoActions || (exports.CheckRepoActions = {}));
const onError = ({ exitCode }, error, done, fail) => {
    if (exitCode === utils.ExitCodes.UNCLEAN && isNotRepoMessage(error)) {
        return done(Buffer.from('false'));
    }
    fail(error);
};
const parser = (text) => {
    return text.trim() === 'true';
};
function checkIsRepoTask(action) {
    switch (action) {
        case CheckRepoActions.BARE:
            return checkIsBareRepoTask();
        case CheckRepoActions.IS_REPO_ROOT:
            return checkIsRepoRootTask();
    }
    const commands = ['rev-parse', '--is-inside-work-tree'];
    return {
        commands,
        format: 'utf-8',
        onError,
        parser,
    };
}
exports.checkIsRepoTask = checkIsRepoTask;
function checkIsRepoRootTask() {
    const commands = ['rev-parse', '--git-dir'];
    return {
        commands,
        format: 'utf-8',
        onError,
        parser(path) {
            return /^\.(git)?$/.test(path.trim());
        },
    };
}
exports.checkIsRepoRootTask = checkIsRepoRootTask;
function checkIsBareRepoTask() {
    const commands = ['rev-parse', '--is-bare-repository'];
    return {
        commands,
        format: 'utf-8',
        onError,
        parser,
    };
}
exports.checkIsBareRepoTask = checkIsBareRepoTask;
function isNotRepoMessage(error) {
    return /(Not a git repository|Kein Git-Repository)/i.test(String(error));
}

});

var CleanSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSummaryParser = exports.CleanResponse = void 0;

class CleanResponse {
    constructor(dryRun) {
        this.dryRun = dryRun;
        this.paths = [];
        this.files = [];
        this.folders = [];
    }
}
exports.CleanResponse = CleanResponse;
const removalRegexp = /^[a-z]+\s*/i;
const dryRunRemovalRegexp = /^[a-z]+\s+[a-z]+\s*/i;
const isFolderRegexp = /\/$/;
function cleanSummaryParser(dryRun, text) {
    const summary = new CleanResponse(dryRun);
    const regexp = dryRun ? dryRunRemovalRegexp : removalRegexp;
    utils.toLinesWithContent(text).forEach(line => {
        const removed = line.replace(regexp, '');
        summary.paths.push(removed);
        (isFolderRegexp.test(removed) ? summary.folders : summary.files).push(removed);
    });
    return summary;
}
exports.cleanSummaryParser = cleanSummaryParser;

});

var task = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyTask = exports.isBufferTask = exports.straightThroughBufferTask = exports.straightThroughStringTask = exports.configurationErrorTask = exports.adhocExecTask = exports.EMPTY_COMMANDS = void 0;

exports.EMPTY_COMMANDS = [];
function adhocExecTask(parser) {
    return {
        commands: exports.EMPTY_COMMANDS,
        format: 'empty',
        parser,
    };
}
exports.adhocExecTask = adhocExecTask;
function configurationErrorTask(error) {
    return {
        commands: exports.EMPTY_COMMANDS,
        format: 'empty',
        parser() {
            throw typeof error === 'string' ? new taskConfigurationError.TaskConfigurationError(error) : error;
        }
    };
}
exports.configurationErrorTask = configurationErrorTask;
function straightThroughStringTask(commands, trimmed = false) {
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return trimmed ? String(text).trim() : text;
        },
    };
}
exports.straightThroughStringTask = straightThroughStringTask;
function straightThroughBufferTask(commands) {
    return {
        commands,
        format: 'buffer',
        parser(buffer) {
            return buffer;
        },
    };
}
exports.straightThroughBufferTask = straightThroughBufferTask;
function isBufferTask(task) {
    return task.format === 'buffer';
}
exports.isBufferTask = isBufferTask;
function isEmptyTask(task) {
    return task.format === 'empty' || !task.commands.length;
}
exports.isEmptyTask = isEmptyTask;

});

var clean = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCleanOptionsArray = exports.cleanTask = exports.cleanWithOptionsTask = exports.CleanOptions = exports.CONFIG_ERROR_UNKNOWN_OPTION = exports.CONFIG_ERROR_MODE_REQUIRED = exports.CONFIG_ERROR_INTERACTIVE_MODE = void 0;



exports.CONFIG_ERROR_INTERACTIVE_MODE = 'Git clean interactive mode is not supported';
exports.CONFIG_ERROR_MODE_REQUIRED = 'Git clean mode parameter ("n" or "f") is required';
exports.CONFIG_ERROR_UNKNOWN_OPTION = 'Git clean unknown option found in: ';
/**
 * All supported option switches available for use in a `git.clean` operation
 */
var CleanOptions;
(function (CleanOptions) {
    CleanOptions["DRY_RUN"] = "n";
    CleanOptions["FORCE"] = "f";
    CleanOptions["IGNORED_INCLUDED"] = "x";
    CleanOptions["IGNORED_ONLY"] = "X";
    CleanOptions["EXCLUDING"] = "e";
    CleanOptions["QUIET"] = "q";
    CleanOptions["RECURSIVE"] = "d";
})(CleanOptions = exports.CleanOptions || (exports.CleanOptions = {}));
const CleanOptionValues = new Set(['i', ...utils.asStringArray(Object.values(CleanOptions))]);
function cleanWithOptionsTask(mode, customArgs) {
    const { cleanMode, options, valid } = getCleanOptions(mode);
    if (!cleanMode) {
        return task.configurationErrorTask(exports.CONFIG_ERROR_MODE_REQUIRED);
    }
    if (!valid.options) {
        return task.configurationErrorTask(exports.CONFIG_ERROR_UNKNOWN_OPTION + JSON.stringify(mode));
    }
    options.push(...customArgs);
    if (options.some(isInteractiveMode)) {
        return task.configurationErrorTask(exports.CONFIG_ERROR_INTERACTIVE_MODE);
    }
    return cleanTask(cleanMode, options);
}
exports.cleanWithOptionsTask = cleanWithOptionsTask;
function cleanTask(mode, customArgs) {
    const commands = ['clean', `-${mode}`, ...customArgs];
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return CleanSummary.cleanSummaryParser(mode === CleanOptions.DRY_RUN, text);
        }
    };
}
exports.cleanTask = cleanTask;
function isCleanOptionsArray(input) {
    return Array.isArray(input) && input.every(test => CleanOptionValues.has(test));
}
exports.isCleanOptionsArray = isCleanOptionsArray;
function getCleanOptions(input) {
    let cleanMode;
    let options = [];
    let valid = { cleanMode: false, options: true };
    input.replace(/[^a-z]i/g, '').split('').forEach(char => {
        if (isCleanMode(char)) {
            cleanMode = char;
            valid.cleanMode = true;
        }
        else {
            valid.options = valid.options && isKnownOption(options[options.length] = (`-${char}`));
        }
    });
    return {
        cleanMode,
        options,
        valid,
    };
}
function isCleanMode(cleanMode) {
    return cleanMode === CleanOptions.FORCE || cleanMode === CleanOptions.DRY_RUN;
}
function isKnownOption(option) {
    return /^-[a-z]$/i.test(option) && CleanOptionValues.has(option.charAt(1));
}
function isInteractiveMode(option) {
    if (/^-[^\-]/.test(option)) {
        return option.indexOf('i') > 0;
    }
    return option === '--interactive';
}

});

var ConfigList_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.configListParser = exports.ConfigList = void 0;

class ConfigList {
    constructor() {
        this.files = [];
        this.values = Object.create(null);
    }
    get all() {
        if (!this._all) {
            this._all = this.files.reduce((all, file) => {
                return Object.assign(all, this.values[file]);
            }, {});
        }
        return this._all;
    }
    addFile(file) {
        if (!(file in this.values)) {
            const latest = utils.last(this.files);
            this.values[file] = latest ? Object.create(this.values[latest]) : {};
            this.files.push(file);
        }
        return this.values[file];
    }
    addValue(file, key, value) {
        const values = this.addFile(file);
        if (!values.hasOwnProperty(key)) {
            values[key] = value;
        }
        else if (Array.isArray(values[key])) {
            values[key].push(value);
        }
        else {
            values[key] = [values[key], value];
        }
        this._all = undefined;
    }
}
exports.ConfigList = ConfigList;
function configListParser(text) {
    const config = new ConfigList();
    const lines = text.split('\0');
    for (let i = 0, max = lines.length - 1; i < max;) {
        const file = configFilePath(lines[i++]);
        const [key, value] = utils.splitOn(lines[i++], '\n');
        config.addValue(file, key, value);
    }
    return config;
}
exports.configListParser = configListParser;
function configFilePath(filePath) {
    return filePath.replace(/^(file):/, '');
}

});

var config = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitConfigScope = void 0;


var GitConfigScope;
(function (GitConfigScope) {
    GitConfigScope["system"] = "system";
    GitConfigScope["global"] = "global";
    GitConfigScope["local"] = "local";
    GitConfigScope["worktree"] = "worktree";
})(GitConfigScope = exports.GitConfigScope || (exports.GitConfigScope = {}));
function asConfigScope(scope, fallback) {
    if (typeof scope === 'string' && GitConfigScope.hasOwnProperty(scope)) {
        return scope;
    }
    return fallback;
}
function addConfigTask(key, value, append, scope) {
    const commands = ['config', `--${scope}`];
    if (append) {
        commands.push('--add');
    }
    commands.push(key, value);
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return text;
        }
    };
}
function listConfigTask(scope) {
    const commands = ['config', '--list', '--show-origin', '--null'];
    if (scope) {
        commands.push(`--${scope}`);
    }
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return ConfigList_1.configListParser(text);
        },
    };
}
function default_1() {
    return {
        addConfig(key, value, ...rest) {
            return this._runTask(addConfigTask(key, value, rest[0] === true, asConfigScope(rest[1], GitConfigScope.local)), utils.trailingFunctionArgument(arguments));
        },
        listConfig(...rest) {
            return this._runTask(listConfigTask(asConfigScope(rest[0], undefined)), utils.trailingFunctionArgument(arguments));
        },
    };
}
exports.default = default_1;

});

var reset = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResetMode = exports.resetTask = exports.ResetMode = void 0;

var ResetMode;
(function (ResetMode) {
    ResetMode["MIXED"] = "mixed";
    ResetMode["SOFT"] = "soft";
    ResetMode["HARD"] = "hard";
    ResetMode["MERGE"] = "merge";
    ResetMode["KEEP"] = "keep";
})(ResetMode = exports.ResetMode || (exports.ResetMode = {}));
const ResetModes = Array.from(Object.values(ResetMode));
function resetTask(mode, customArgs) {
    const commands = ['reset'];
    if (isValidResetMode(mode)) {
        commands.push(`--${mode}`);
    }
    commands.push(...customArgs);
    return task.straightThroughStringTask(commands);
}
exports.resetTask = resetTask;
function getResetMode(mode) {
    if (isValidResetMode(mode)) {
        return mode;
    }
    switch (typeof mode) {
        case 'string':
        case 'undefined':
            return ResetMode.SOFT;
    }
    return;
}
exports.getResetMode = getResetMode;
function isValidResetMode(mode) {
    return ResetModes.includes(mode);
}

});

var api_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });









const api = {
    CheckRepoActions: checkIsRepo.CheckRepoActions,
    CleanOptions: clean.CleanOptions,
    GitConfigScope: config.GitConfigScope,
    GitConstructError: gitConstructError.GitConstructError,
    GitError: gitError.GitError,
    GitPluginError: gitPluginError.GitPluginError,
    GitResponseError: gitResponseError.GitResponseError,
    ResetMode: reset.ResetMode,
    TaskConfigurationError: taskConfigurationError.TaskConfigurationError,
};
exports.default = api;

});

var commandConfigPrefixingPlugin_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandConfigPrefixingPlugin = void 0;

function commandConfigPrefixingPlugin(configuration) {
    const prefix = utils.prefixedArray(configuration, '-c');
    return {
        type: 'spawn.args',
        action(data) {
            return [...prefix, ...data];
        },
    };
}
exports.commandConfigPrefixingPlugin = commandConfigPrefixingPlugin;

});

var errorDetection_plugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorDetectionPlugin = exports.errorDetectionHandler = void 0;

function isTaskError(result) {
    return !!(result.exitCode && result.stdErr.length);
}
function getErrorMessage(result) {
    return Buffer.concat([...result.stdOut, ...result.stdErr]);
}
function errorDetectionHandler(overwrite = false, isError = isTaskError, errorMessage = getErrorMessage) {
    return (error, result) => {
        if ((!overwrite && error) || !isError(result)) {
            return error;
        }
        return errorMessage(result);
    };
}
exports.errorDetectionHandler = errorDetectionHandler;
function errorDetectionPlugin(config) {
    return {
        type: 'task.error',
        action(data, context) {
            const error = config(data.error, {
                stdErr: context.stdErr,
                stdOut: context.stdOut,
                exitCode: context.exitCode
            });
            if (Buffer.isBuffer(error)) {
                return { error: new gitError.GitError(undefined, error.toString('utf-8')) };
            }
            return {
                error
            };
        },
    };
}
exports.errorDetectionPlugin = errorDetectionPlugin;

});

var pluginStore = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginStore = void 0;

class PluginStore {
    constructor() {
        this.plugins = new Set();
    }
    add(plugin) {
        const plugins = [];
        utils.asArray(plugin).forEach(plugin => plugin && this.plugins.add(utils.append(plugins, plugin)));
        return () => {
            plugins.forEach(plugin => this.plugins.delete(plugin));
        };
    }
    exec(type, data, context) {
        let output = data;
        const contextual = Object.freeze(Object.create(context));
        for (const plugin of this.plugins) {
            if (plugin.type === type) {
                output = plugin.action(output, contextual);
            }
        }
        return output;
    }
}
exports.PluginStore = PluginStore;

});

var progressMonitorPlugin_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressMonitorPlugin = void 0;

function progressMonitorPlugin(progress) {
    const progressCommand = '--progress';
    const progressMethods = ['checkout', 'clone', 'fetch', 'pull', 'push'];
    const onProgress = {
        type: 'spawn.after',
        action(_data, context) {
            var _a;
            if (!context.commands.includes(progressCommand)) {
                return;
            }
            (_a = context.spawned.stderr) === null || _a === void 0 ? void 0 : _a.on('data', (chunk) => {
                const message = /^([a-zA-Z ]+):\s*(\d+)% \((\d+)\/(\d+)\)/.exec(chunk.toString('utf8'));
                if (!message) {
                    return;
                }
                progress({
                    method: context.method,
                    stage: progressEventStage(message[1]),
                    progress: utils.asNumber(message[2]),
                    processed: utils.asNumber(message[3]),
                    total: utils.asNumber(message[4]),
                });
            });
        }
    };
    const onArgs = {
        type: 'spawn.args',
        action(args, context) {
            if (!progressMethods.includes(context.method)) {
                return args;
            }
            return utils.including(args, progressCommand);
        }
    };
    return [onArgs, onProgress];
}
exports.progressMonitorPlugin = progressMonitorPlugin;
function progressEventStage(input) {
    return String(input.toLowerCase().split(' ', 1)) || 'unknown';
}

});

var simpleGitPlugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

});

var spawnOptionsPlugin_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnOptionsPlugin = void 0;

function spawnOptionsPlugin(spawnOptions) {
    const options = utils.pick(spawnOptions, ['uid', 'gid']);
    return {
        type: 'spawn.options',
        action(data) {
            return Object.assign(Object.assign({}, options), data);
        },
    };
}
exports.spawnOptionsPlugin = spawnOptionsPlugin;

});

var timoutPlugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutPlugin = void 0;

function timeoutPlugin({ block }) {
    if (block > 0) {
        return {
            type: 'spawn.after',
            action(_data, context) {
                var _a, _b;
                let timeout;
                function wait() {
                    timeout && clearTimeout(timeout);
                    timeout = setTimeout(kill, block);
                }
                function stop() {
                    var _a, _b;
                    (_a = context.spawned.stdout) === null || _a === void 0 ? void 0 : _a.off('data', wait);
                    (_b = context.spawned.stderr) === null || _b === void 0 ? void 0 : _b.off('data', wait);
                    context.spawned.off('exit', stop);
                    context.spawned.off('close', stop);
                }
                function kill() {
                    stop();
                    context.kill(new gitPluginError.GitPluginError(undefined, 'timeout', `block timeout reached`));
                }
                (_a = context.spawned.stdout) === null || _a === void 0 ? void 0 : _a.on('data', wait);
                (_b = context.spawned.stderr) === null || _b === void 0 ? void 0 : _b.on('data', wait);
                context.spawned.on('exit', stop);
                context.spawned.on('close', stop);
                wait();
            }
        };
    }
}
exports.timeoutPlugin = timeoutPlugin;

});

var plugins = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(commandConfigPrefixingPlugin_1, exports);
__exportStar(errorDetection_plugin, exports);
__exportStar(pluginStore, exports);
__exportStar(progressMonitorPlugin_1, exports);
__exportStar(simpleGitPlugin, exports);
__exportStar(spawnOptionsPlugin_1, exports);
__exportStar(timoutPlugin, exports);

});

var gitLogger = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLogger = exports.createLogger = void 0;


src$2.default.formatters.L = (value) => String(utils.filterHasLength(value) ? value.length : '-');
src$2.default.formatters.B = (value) => {
    if (Buffer.isBuffer(value)) {
        return value.toString('utf8');
    }
    return utils.objectToString(value);
};
function createLog() {
    return src$2.default('simple-git');
}
function prefixedLogger(to, prefix, forward) {
    if (!prefix || !String(prefix).replace(/\s*/, '')) {
        return !forward ? to : (message, ...args) => {
            to(message, ...args);
            forward(message, ...args);
        };
    }
    return (message, ...args) => {
        to(`%s ${message}`, prefix, ...args);
        if (forward) {
            forward(message, ...args);
        }
    };
}
function childLoggerName(name, childDebugger, { namespace: parentNamespace }) {
    if (typeof name === 'string') {
        return name;
    }
    const childNamespace = childDebugger && childDebugger.namespace || '';
    if (childNamespace.startsWith(parentNamespace)) {
        return childNamespace.substr(parentNamespace.length + 1);
    }
    return childNamespace || parentNamespace;
}
function createLogger(label, verbose, initialStep, infoDebugger = createLog()) {
    const labelPrefix = label && `[${label}]` || '';
    const spawned = [];
    const debugDebugger = (typeof verbose === 'string') ? infoDebugger.extend(verbose) : verbose;
    const key = childLoggerName(utils.filterType(verbose, utils.filterString), debugDebugger, infoDebugger);
    return step(initialStep);
    function sibling(name, initial) {
        return utils.append(spawned, createLogger(label, key.replace(/^[^:]+/, name), initial, infoDebugger));
    }
    function step(phase) {
        const stepPrefix = phase && `[${phase}]` || '';
        const debug = debugDebugger && prefixedLogger(debugDebugger, stepPrefix) || utils.NOOP;
        const info = prefixedLogger(infoDebugger, `${labelPrefix} ${stepPrefix}`, debug);
        return Object.assign(debugDebugger ? debug : info, {
            label,
            sibling,
            info,
            step,
        });
    }
}
exports.createLogger = createLogger;
/**
 * The `GitLogger` is used by the main `SimpleGit` runner to handle logging
 * any warnings or errors.
 */
class GitLogger {
    constructor(_out = createLog()) {
        this._out = _out;
        this.error = prefixedLogger(_out, '[ERROR]');
        this.warn = prefixedLogger(_out, '[WARN]');
    }
    silent(silence = false) {
        if (silence !== this._out.enabled) {
            return;
        }
        const { namespace } = this._out;
        const env = (process.env.DEBUG || '').split(',').filter(s => !!s);
        const hasOn = env.includes(namespace);
        const hasOff = env.includes(`-${namespace}`);
        // enabling the log
        if (!silence) {
            if (hasOff) {
                utils.remove(env, `-${namespace}`);
            }
            else {
                env.push(namespace);
            }
        }
        else {
            if (hasOn) {
                utils.remove(env, namespace);
            }
            else {
                env.push(`-${namespace}`);
            }
        }
        src$2.default.enable(env.join(','));
    }
}
exports.GitLogger = GitLogger;

});

var tasksPendingQueue = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksPendingQueue = void 0;


class TasksPendingQueue {
    constructor(logLabel = 'GitExecutor') {
        this.logLabel = logLabel;
        this._queue = new Map();
    }
    withProgress(task) {
        return this._queue.get(task);
    }
    createProgress(task) {
        const name = TasksPendingQueue.getName(task.commands[0]);
        const logger = gitLogger.createLogger(this.logLabel, name);
        return {
            task,
            logger,
            name,
        };
    }
    push(task) {
        const progress = this.createProgress(task);
        progress.logger('Adding task to the queue, commands = %o', task.commands);
        this._queue.set(task, progress);
        return progress;
    }
    fatal(err) {
        for (const [task, { logger }] of Array.from(this._queue.entries())) {
            if (task === err.task) {
                logger.info(`Failed %o`, err);
                logger(`Fatal exception, any as-yet un-started tasks run through this executor will not be attempted`);
            }
            else {
                logger.info(`A fatal exception occurred in a previous task, the queue has been purged: %o`, err.message);
            }
            this.complete(task);
        }
        if (this._queue.size !== 0) {
            throw new Error(`Queue size should be zero after fatal: ${this._queue.size}`);
        }
    }
    complete(task) {
        const progress = this.withProgress(task);
        if (progress) {
            this._queue.delete(task);
        }
    }
    attempt(task) {
        const progress = this.withProgress(task);
        if (!progress) {
            throw new gitError.GitError(undefined, 'TasksPendingQueue: attempt called for an unknown task');
        }
        progress.logger('Starting task');
        return progress;
    }
    static getName(name = 'empty') {
        return `task:${name}:${++TasksPendingQueue.counter}`;
    }
}
exports.TasksPendingQueue = TasksPendingQueue;
TasksPendingQueue.counter = 0;

});

var gitExecutorChain = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitExecutorChain = void 0;





class GitExecutorChain {
    constructor(_executor, _scheduler, _plugins) {
        this._executor = _executor;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = Promise.resolve();
        this._queue = new tasksPendingQueue.TasksPendingQueue();
    }
    get binary() {
        return this._executor.binary;
    }
    get cwd() {
        return this._cwd || this._executor.cwd;
    }
    set cwd(cwd) {
        this._cwd = cwd;
    }
    get env() {
        return this._executor.env;
    }
    get outputHandler() {
        return this._executor.outputHandler;
    }
    chain() {
        return this;
    }
    push(task) {
        this._queue.push(task);
        return this._chain = this._chain.then(() => this.attemptTask(task));
    }
    attemptTask(task$1) {
        return __awaiter(this, void 0, void 0, function* () {
            const onScheduleComplete = yield this._scheduler.next();
            const onQueueComplete = () => this._queue.complete(task$1);
            try {
                const { logger } = this._queue.attempt(task$1);
                return yield (task.isEmptyTask(task$1)
                    ? this.attemptEmptyTask(task$1, logger)
                    : this.attemptRemoteTask(task$1, logger));
            }
            catch (e) {
                throw this.onFatalException(task$1, e);
            }
            finally {
                onQueueComplete();
                onScheduleComplete();
            }
        });
    }
    onFatalException(task, e) {
        const gitError$1 = (e instanceof gitError.GitError) ? Object.assign(e, { task }) : new gitError.GitError(task, e && String(e));
        this._chain = Promise.resolve();
        this._queue.fatal(gitError$1);
        return gitError$1;
    }
    attemptRemoteTask(task$1, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = this._plugins.exec('spawn.args', [...task$1.commands], pluginContext(task$1, task$1.commands));
            const raw = yield this.gitResponse(task$1, this.binary, args, this.outputHandler, logger.step('SPAWN'));
            const outputStreams = yield this.handleTaskData(task$1, args, raw, logger.step('HANDLE'));
            logger(`passing response to task's parser as a %s`, task$1.format);
            if (task.isBufferTask(task$1)) {
                return utils.callTaskParser(task$1.parser, outputStreams);
            }
            return utils.callTaskParser(task$1.parser, outputStreams.asStrings());
        });
    }
    attemptEmptyTask(task, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger(`empty task bypassing child process to call to task's parser`);
            return task.parser(this);
        });
    }
    handleTaskData(task, args, result, logger) {
        const { exitCode, rejection, stdOut, stdErr } = result;
        return new Promise((done, fail) => {
            logger(`Preparing to handle process response exitCode=%d stdOut=`, exitCode);
            const { error } = this._plugins.exec('task.error', { error: rejection }, Object.assign(Object.assign({}, pluginContext(task, args)), result));
            if (error && task.onError) {
                logger.info(`exitCode=%s handling with custom error handler`);
                return task.onError(result, error, (newStdOut) => {
                    logger.info(`custom error handler treated as success`);
                    logger(`custom error returned a %s`, utils.objectToString(newStdOut));
                    done(new utils.GitOutputStreams(Array.isArray(newStdOut) ? Buffer.concat(newStdOut) : newStdOut, Buffer.concat(stdErr)));
                }, fail);
            }
            if (error) {
                logger.info(`handling as error: exitCode=%s stdErr=%s rejection=%o`, exitCode, stdErr.length, rejection);
                return fail(error);
            }
            logger.info(`retrieving task output complete`);
            done(new utils.GitOutputStreams(Buffer.concat(stdOut), Buffer.concat(stdErr)));
        });
    }
    gitResponse(task, command, args, outputHandler, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputLogger = logger.sibling('output');
            const spawnOptions = this._plugins.exec('spawn.options', {
                cwd: this.cwd,
                env: this.env,
                windowsHide: true,
            }, pluginContext(task, task.commands));
            return new Promise((done) => {
                const stdOut = [];
                const stdErr = [];
                let attempted = false;
                let rejection;
                function attemptClose(exitCode, event = 'retry') {
                    // closing when there is content, terminate immediately
                    if (attempted || stdErr.length || stdOut.length) {
                        logger.info(`exitCode=%s event=%s rejection=%o`, exitCode, event, rejection);
                        done({
                            stdOut,
                            stdErr,
                            exitCode,
                            rejection,
                        });
                        attempted = true;
                    }
                    // first attempt at closing but no content yet, wait briefly for the close/exit that may follow
                    if (!attempted) {
                        attempted = true;
                        setTimeout(() => attemptClose(exitCode, 'deferred'), 50);
                        logger('received %s event before content on stdOut/stdErr', event);
                    }
                }
                logger.info(`%s %o`, command, args);
                logger('%O', spawnOptions);
                const spawned = child_process_1__default['default'].spawn(command, args, spawnOptions);
                spawned.stdout.on('data', onDataReceived(stdOut, 'stdOut', logger, outputLogger.step('stdOut')));
                spawned.stderr.on('data', onDataReceived(stdErr, 'stdErr', logger, outputLogger.step('stdErr')));
                spawned.on('error', onErrorReceived(stdErr, logger));
                spawned.on('close', (code) => attemptClose(code, 'close'));
                spawned.on('exit', (code) => attemptClose(code, 'exit'));
                if (outputHandler) {
                    logger(`Passing child process stdOut/stdErr to custom outputHandler`);
                    outputHandler(command, spawned.stdout, spawned.stderr, [...args]);
                }
                this._plugins.exec('spawn.after', undefined, Object.assign(Object.assign({}, pluginContext(task, args)), { spawned, kill(reason) {
                        if (spawned.killed) {
                            return;
                        }
                        rejection = reason;
                        spawned.kill('SIGINT');
                    } }));
            });
        });
    }
}
exports.GitExecutorChain = GitExecutorChain;
function pluginContext(task, commands) {
    return {
        method: utils.first(task.commands) || '',
        commands,
    };
}
function onErrorReceived(target, logger) {
    return (err) => {
        logger(`[ERROR] child process exception %o`, err);
        target.push(Buffer.from(String(err.stack), 'ascii'));
    };
}
function onDataReceived(target, name, logger, output) {
    return (buffer) => {
        logger(`%s received %L bytes`, name, buffer);
        output(`%B`, buffer);
        target.push(buffer);
    };
}

});

var gitExecutor = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitExecutor = void 0;

class GitExecutor {
    constructor(binary = 'git', cwd, _scheduler, _plugins) {
        this.binary = binary;
        this.cwd = cwd;
        this._scheduler = _scheduler;
        this._plugins = _plugins;
        this._chain = new gitExecutorChain.GitExecutorChain(this, this._scheduler, this._plugins);
    }
    chain() {
        return new gitExecutorChain.GitExecutorChain(this, this._scheduler, this._plugins);
    }
    push(task) {
        return this._chain.push(task);
    }
}
exports.GitExecutor = GitExecutor;

});

var taskCallback_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskCallback = void 0;


function taskCallback(task, response, callback = utils.NOOP) {
    const onSuccess = (data) => {
        callback(null, data);
    };
    const onError = (err) => {
        if ((err === null || err === void 0 ? void 0 : err.task) === task) {
            if (err instanceof gitResponseError.GitResponseError) {
                return callback(addDeprecationNoticeToError(err));
            }
            callback(err);
        }
    };
    response.then(onSuccess, onError);
}
exports.taskCallback = taskCallback;
function addDeprecationNoticeToError(err) {
    let log = (name) => {
        console.warn(`simple-git deprecation notice: accessing GitResponseError.${name} should be GitResponseError.git.${name}, this will no longer be available in version 3`);
        log = utils.NOOP;
    };
    return Object.create(err, Object.getOwnPropertyNames(err.git).reduce(descriptorReducer, {}));
    function descriptorReducer(all, name) {
        if (name in err) {
            return all;
        }
        all[name] = {
            enumerable: false,
            configurable: false,
            get() {
                log(name);
                return err.git[name];
            },
        };
        return all;
    }
}

});

var changeWorkingDirectory = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeWorkingDirectoryTask = void 0;


function changeWorkingDirectoryTask(directory, root) {
    return task.adhocExecTask((instance) => {
        if (!utils.folderExists(directory)) {
            throw new Error(`Git.cwd: cannot change to non-directory "${directory}"`);
        }
        return ((root || instance).cwd = directory);
    });
}
exports.changeWorkingDirectoryTask = changeWorkingDirectoryTask;

});

var hashObject = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashObjectTask = void 0;

/**
 * Task used by `git.hashObject`
 */
function hashObjectTask(filePath, write) {
    const commands = ['hash-object', filePath];
    if (write) {
        commands.push('-w');
    }
    return task.straightThroughStringTask(commands, true);
}
exports.hashObjectTask = hashObjectTask;

});

var InitSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInit = exports.InitSummary = void 0;
class InitSummary {
    constructor(bare, path, existing, gitDir) {
        this.bare = bare;
        this.path = path;
        this.existing = existing;
        this.gitDir = gitDir;
    }
}
exports.InitSummary = InitSummary;
const initResponseRegex = /^Init.+ repository in (.+)$/;
const reInitResponseRegex = /^Rein.+ in (.+)$/;
function parseInit(bare, path, text) {
    const response = String(text).trim();
    let result;
    if ((result = initResponseRegex.exec(response))) {
        return new InitSummary(bare, path, false, result[1]);
    }
    if ((result = reInitResponseRegex.exec(response))) {
        return new InitSummary(bare, path, true, result[1]);
    }
    let gitDir = '';
    const tokens = response.split(' ');
    while (tokens.length) {
        const token = tokens.shift();
        if (token === 'in') {
            gitDir = tokens.join(' ');
            break;
        }
    }
    return new InitSummary(bare, path, /^re/i.test(response), gitDir);
}
exports.parseInit = parseInit;

});

var init = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTask = void 0;

const bareCommand = '--bare';
function hasBareCommand(command) {
    return command.includes(bareCommand);
}
function initTask(bare = false, path, customArgs) {
    const commands = ['init', ...customArgs];
    if (bare && !hasBareCommand(commands)) {
        commands.splice(1, 0, bareCommand);
    }
    return {
        commands,
        format: 'utf-8',
        parser(text) {
            return InitSummary_1.parseInit(commands.includes('--bare'), path, text);
        }
    };
}
exports.initTask = initTask;

});

var DiffSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffSummary = void 0;
/***
 * The DiffSummary is returned as a response to getting `git().status()`
 */
class DiffSummary {
    constructor() {
        this.changed = 0;
        this.deletions = 0;
        this.insertions = 0;
        this.files = [];
    }
}
exports.DiffSummary = DiffSummary;

});

var parseDiffSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDiffResult = void 0;

function parseDiffResult(stdOut) {
    const lines = stdOut.trim().split('\n');
    const status = new DiffSummary_1.DiffSummary();
    readSummaryLine(status, lines.pop());
    for (let i = 0, max = lines.length; i < max; i++) {
        const line = lines[i];
        textFileChange(line, status) || binaryFileChange(line, status);
    }
    return status;
}
exports.parseDiffResult = parseDiffResult;
function readSummaryLine(status, summary) {
    (summary || '')
        .trim()
        .split(', ')
        .forEach(function (text) {
        const summary = /(\d+)\s([a-z]+)/.exec(text);
        if (!summary) {
            return;
        }
        summaryType(status, summary[2], parseInt(summary[1], 10));
    });
}
function summaryType(status, key, value) {
    const match = (/([a-z]+?)s?\b/.exec(key));
    if (!match || !statusUpdate[match[1]]) {
        return;
    }
    statusUpdate[match[1]](status, value);
}
const statusUpdate = {
    file(status, value) {
        status.changed = value;
    },
    deletion(status, value) {
        status.deletions = value;
    },
    insertion(status, value) {
        status.insertions = value;
    }
};
function textFileChange(input, { files }) {
    const line = input.trim().match(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/);
    if (line) {
        var alterations = (line[3] || '').trim();
        files.push({
            file: line[1].trim(),
            changes: parseInt(line[2], 10),
            insertions: alterations.replace(/-/g, '').length,
            deletions: alterations.replace(/\+/g, '').length,
            binary: false
        });
        return true;
    }
    return false;
}
function binaryFileChange(input, { files }) {
    const line = input.match(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)$/);
    if (line) {
        files.push({
            file: line[1].trim(),
            before: +line[2],
            after: +line[3],
            binary: true
        });
        return true;
    }
    return false;
}

});

var parseListLogSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListLogSummaryParser = exports.SPLITTER = exports.COMMIT_BOUNDARY = exports.START_BOUNDARY = void 0;


exports.START_BOUNDARY = 'òòòòòò ';
exports.COMMIT_BOUNDARY = ' òò';
exports.SPLITTER = ' ò ';
const defaultFieldNames = ['hash', 'date', 'message', 'refs', 'author_name', 'author_email'];
function lineBuilder(tokens, fields) {
    return fields.reduce((line, field, index) => {
        line[field] = tokens[index] || '';
        return line;
    }, Object.create({ diff: null }));
}
function createListLogSummaryParser(splitter = exports.SPLITTER, fields = defaultFieldNames) {
    return function (stdOut) {
        const all = utils.toLinesWithContent(stdOut, true, exports.START_BOUNDARY)
            .map(function (item) {
            const lineDetail = item.trim().split(exports.COMMIT_BOUNDARY);
            const listLogLine = lineBuilder(lineDetail[0].trim().split(splitter), fields);
            if (lineDetail.length > 1 && !!lineDetail[1].trim()) {
                listLogLine.diff = parseDiffSummary.parseDiffResult(lineDetail[1]);
            }
            return listLogLine;
        });
        return {
            all,
            latest: all.length && all[0] || null,
            total: all.length,
        };
    };
}
exports.createListLogSummaryParser = createListLogSummaryParser;

});

var log = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTask = exports.parseLogOptions = void 0;



var excludeOptions;
(function (excludeOptions) {
    excludeOptions[excludeOptions["--pretty"] = 0] = "--pretty";
    excludeOptions[excludeOptions["max-count"] = 1] = "max-count";
    excludeOptions[excludeOptions["maxCount"] = 2] = "maxCount";
    excludeOptions[excludeOptions["n"] = 3] = "n";
    excludeOptions[excludeOptions["file"] = 4] = "file";
    excludeOptions[excludeOptions["format"] = 5] = "format";
    excludeOptions[excludeOptions["from"] = 6] = "from";
    excludeOptions[excludeOptions["to"] = 7] = "to";
    excludeOptions[excludeOptions["splitter"] = 8] = "splitter";
    excludeOptions[excludeOptions["symmetric"] = 9] = "symmetric";
    excludeOptions[excludeOptions["multiLine"] = 10] = "multiLine";
    excludeOptions[excludeOptions["strictDate"] = 11] = "strictDate";
})(excludeOptions || (excludeOptions = {}));
function prettyFormat(format, splitter) {
    const fields = [];
    const formatStr = [];
    Object.keys(format).forEach((field) => {
        fields.push(field);
        formatStr.push(String(format[field]));
    });
    return [
        fields, formatStr.join(splitter)
    ];
}
function userOptions(input) {
    const output = Object.assign({}, input);
    Object.keys(input).forEach(key => {
        if (key in excludeOptions) {
            delete output[key];
        }
    });
    return output;
}
function parseLogOptions(opt = {}, customArgs = []) {
    const splitter = opt.splitter || parseListLogSummary.SPLITTER;
    const format = opt.format || {
        hash: '%H',
        date: opt.strictDate === false ? '%ai' : '%aI',
        message: '%s',
        refs: '%D',
        body: opt.multiLine ? '%B' : '%b',
        author_name: '%aN',
        author_email: '%ae'
    };
    const [fields, formatStr] = prettyFormat(format, splitter);
    const suffix = [];
    const command = [
        `--pretty=format:${parseListLogSummary.START_BOUNDARY}${formatStr}${parseListLogSummary.COMMIT_BOUNDARY}`,
        ...customArgs,
    ];
    const maxCount = opt.n || opt['max-count'] || opt.maxCount;
    if (maxCount) {
        command.push(`--max-count=${maxCount}`);
    }
    if (opt.from && opt.to) {
        const rangeOperator = (opt.symmetric !== false) ? '...' : '..';
        suffix.push(`${opt.from}${rangeOperator}${opt.to}`);
    }
    if (opt.file) {
        suffix.push('--follow', opt.file);
    }
    utils.appendTaskOptions(userOptions(opt), command);
    return {
        fields,
        splitter,
        commands: [
            ...command,
            ...suffix,
        ],
    };
}
exports.parseLogOptions = parseLogOptions;
function logTask(splitter, fields, customArgs) {
    return {
        commands: ['log', ...customArgs],
        format: 'utf-8',
        parser: parseListLogSummary.createListLogSummaryParser(splitter, fields),
    };
}
exports.logTask = logTask;
function default_1() {
    return {
        log(...rest) {
            const next = utils.trailingFunctionArgument(arguments);
            const task = rejectDeprecatedSignatures(...rest) ||
                createLogTask(parseLogOptions(utils.trailingOptionsArgument(arguments), utils.filterType(arguments[0], utils.filterArray)));
            return this._runTask(task, next);
        }
    };
    function createLogTask(options) {
        return logTask(options.splitter, options.fields, options.commands);
    }
    function rejectDeprecatedSignatures(from, to) {
        return (utils.filterString(from) &&
            utils.filterString(to) &&
            task.configurationErrorTask(`git.log(string, string) should be replaced with git.log({ from: string, to: string })`));
    }
}
exports.default = default_1;

});

var MergeSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeSummaryDetail = exports.MergeSummaryConflict = void 0;
class MergeSummaryConflict {
    constructor(reason, file = null, meta) {
        this.reason = reason;
        this.file = file;
        this.meta = meta;
    }
    toString() {
        return `${this.file}:${this.reason}`;
    }
}
exports.MergeSummaryConflict = MergeSummaryConflict;
class MergeSummaryDetail {
    constructor() {
        this.conflicts = [];
        this.merges = [];
        this.result = 'success';
    }
    get failed() {
        return this.conflicts.length > 0;
    }
    get reason() {
        return this.result;
    }
    toString() {
        if (this.conflicts.length) {
            return `CONFLICTS: ${this.conflicts.join(', ')}`;
        }
        return 'OK';
    }
}
exports.MergeSummaryDetail = MergeSummaryDetail;

});

var PullSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullSummary = void 0;
class PullSummary {
    constructor() {
        this.remoteMessages = {
            all: [],
        };
        this.created = [];
        this.deleted = [];
        this.files = [];
        this.deletions = {};
        this.insertions = {};
        this.summary = {
            changes: 0,
            deletions: 0,
            insertions: 0,
        };
    }
}
exports.PullSummary = PullSummary;

});

var parseRemoteObjects = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteMessagesObjectParsers = void 0;

function objectEnumerationResult(remoteMessages) {
    return (remoteMessages.objects = remoteMessages.objects || {
        compressing: 0,
        counting: 0,
        enumerating: 0,
        packReused: 0,
        reused: { count: 0, delta: 0 },
        total: { count: 0, delta: 0 }
    });
}
function asObjectCount(source) {
    const count = /^\s*(\d+)/.exec(source);
    const delta = /delta (\d+)/i.exec(source);
    return {
        count: utils.asNumber(count && count[1] || '0'),
        delta: utils.asNumber(delta && delta[1] || '0'),
    };
}
exports.remoteMessagesObjectParsers = [
    new utils.RemoteLineParser(/^remote:\s*(enumerating|counting|compressing) objects: (\d+),/i, (result, [action, count]) => {
        const key = action.toLowerCase();
        const enumeration = objectEnumerationResult(result.remoteMessages);
        Object.assign(enumeration, { [key]: utils.asNumber(count) });
    }),
    new utils.RemoteLineParser(/^remote:\s*(enumerating|counting|compressing) objects: \d+% \(\d+\/(\d+)\),/i, (result, [action, count]) => {
        const key = action.toLowerCase();
        const enumeration = objectEnumerationResult(result.remoteMessages);
        Object.assign(enumeration, { [key]: utils.asNumber(count) });
    }),
    new utils.RemoteLineParser(/total ([^,]+), reused ([^,]+), pack-reused (\d+)/i, (result, [total, reused, packReused]) => {
        const objects = objectEnumerationResult(result.remoteMessages);
        objects.total = asObjectCount(total);
        objects.reused = asObjectCount(reused);
        objects.packReused = utils.asNumber(packReused);
    }),
];

});

var parseRemoteMessages_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteMessageSummary = exports.parseRemoteMessages = void 0;


const parsers = [
    new utils.RemoteLineParser(/^remote:\s*(.+)$/, (result, [text]) => {
        result.remoteMessages.all.push(text.trim());
        return false;
    }),
    ...parseRemoteObjects.remoteMessagesObjectParsers,
    new utils.RemoteLineParser([/create a (?:pull|merge) request/i, /\s(https?:\/\/\S+)$/], (result, [pullRequestUrl]) => {
        result.remoteMessages.pullRequestUrl = pullRequestUrl;
    }),
    new utils.RemoteLineParser([/found (\d+) vulnerabilities.+\(([^)]+)\)/i, /\s(https?:\/\/\S+)$/], (result, [count, summary, url]) => {
        result.remoteMessages.vulnerabilities = {
            count: utils.asNumber(count),
            summary,
            url,
        };
    }),
];
function parseRemoteMessages(_stdOut, stdErr) {
    return utils.parseStringResponse({ remoteMessages: new RemoteMessageSummary() }, parsers, stdErr);
}
exports.parseRemoteMessages = parseRemoteMessages;
class RemoteMessageSummary {
    constructor() {
        this.all = [];
    }
}
exports.RemoteMessageSummary = RemoteMessageSummary;

});

var parsePull = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePullResult = exports.parsePullDetail = void 0;



const FILE_UPDATE_REGEX = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/;
const SUMMARY_REGEX = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/;
const ACTION_REGEX = /^(create|delete) mode \d+ (.+)/;
const parsers = [
    new utils.LineParser(FILE_UPDATE_REGEX, (result, [file, insertions, deletions]) => {
        result.files.push(file);
        if (insertions) {
            result.insertions[file] = insertions.length;
        }
        if (deletions) {
            result.deletions[file] = deletions.length;
        }
    }),
    new utils.LineParser(SUMMARY_REGEX, (result, [changes, , insertions, , deletions]) => {
        if (insertions !== undefined || deletions !== undefined) {
            result.summary.changes = +changes || 0;
            result.summary.insertions = +insertions || 0;
            result.summary.deletions = +deletions || 0;
            return true;
        }
        return false;
    }),
    new utils.LineParser(ACTION_REGEX, (result, [action, file]) => {
        utils.append(result.files, file);
        utils.append((action === 'create') ? result.created : result.deleted, file);
    }),
];
const parsePullDetail = (stdOut, stdErr) => {
    return utils.parseStringResponse(new PullSummary_1.PullSummary(), parsers, stdOut, stdErr);
};
exports.parsePullDetail = parsePullDetail;
const parsePullResult = (stdOut, stdErr) => {
    return Object.assign(new PullSummary_1.PullSummary(), exports.parsePullDetail(stdOut, stdErr), parseRemoteMessages_1.parseRemoteMessages(stdOut, stdErr));
};
exports.parsePullResult = parsePullResult;

});

var parseMerge = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMergeDetail = exports.parseMergeResult = void 0;



const parsers = [
    new utils.LineParser(/^Auto-merging\s+(.+)$/, (summary, [autoMerge]) => {
        summary.merges.push(autoMerge);
    }),
    new utils.LineParser(/^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/, (summary, [reason, file]) => {
        summary.conflicts.push(new MergeSummary.MergeSummaryConflict(reason, file));
    }),
    new utils.LineParser(/^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/, (summary, [reason, file, deleteRef]) => {
        summary.conflicts.push(new MergeSummary.MergeSummaryConflict(reason, file, { deleteRef }));
    }),
    new utils.LineParser(/^CONFLICT\s+\((.+)\):/, (summary, [reason]) => {
        summary.conflicts.push(new MergeSummary.MergeSummaryConflict(reason, null));
    }),
    new utils.LineParser(/^Automatic merge failed;\s+(.+)$/, (summary, [result]) => {
        summary.result = result;
    }),
];
/**
 * Parse the complete response from `git.merge`
 */
const parseMergeResult = (stdOut, stdErr) => {
    return Object.assign(exports.parseMergeDetail(stdOut, stdErr), parsePull.parsePullResult(stdOut, stdErr));
};
exports.parseMergeResult = parseMergeResult;
/**
 * Parse the merge specific detail (ie: not the content also available in the pull detail) from `git.mnerge`
 * @param stdOut
 */
const parseMergeDetail = (stdOut) => {
    return utils.parseStringResponse(new MergeSummary.MergeSummaryDetail(), parsers, stdOut);
};
exports.parseMergeDetail = parseMergeDetail;

});

var merge = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTask = void 0;



function mergeTask(customArgs) {
    if (!customArgs.length) {
        return task.configurationErrorTask('Git.merge requires at least one option');
    }
    return {
        commands: ['merge', ...customArgs],
        format: 'utf-8',
        parser(stdOut, stdErr) {
            const merge = parseMerge.parseMergeResult(stdOut, stdErr);
            if (merge.failed) {
                throw new gitResponseError.GitResponseError(merge);
            }
            return merge;
        }
    };
}
exports.mergeTask = mergeTask;

});

var parsePush = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePushDetail = exports.parsePushResult = void 0;


function pushResultPushedItem(local, remote, status) {
    const deleted = status.includes('deleted');
    const tag = status.includes('tag') || /^refs\/tags/.test(local);
    const alreadyUpdated = !status.includes('new');
    return {
        deleted,
        tag,
        branch: !tag,
        new: !alreadyUpdated,
        alreadyUpdated,
        local,
        remote,
    };
}
const parsers = [
    new utils.LineParser(/^Pushing to (.+)$/, (result, [repo]) => {
        result.repo = repo;
    }),
    new utils.LineParser(/^updating local tracking ref '(.+)'/, (result, [local]) => {
        result.ref = Object.assign(Object.assign({}, (result.ref || {})), { local });
    }),
    new utils.LineParser(/^[*-=]\s+([^:]+):(\S+)\s+\[(.+)]$/, (result, [local, remote, type]) => {
        result.pushed.push(pushResultPushedItem(local, remote, type));
    }),
    new utils.LineParser(/^Branch '([^']+)' set up to track remote branch '([^']+)' from '([^']+)'/, (result, [local, remote, remoteName]) => {
        result.branch = Object.assign(Object.assign({}, (result.branch || {})), { local,
            remote,
            remoteName });
    }),
    new utils.LineParser(/^([^:]+):(\S+)\s+([a-z0-9]+)\.\.([a-z0-9]+)$/, (result, [local, remote, from, to]) => {
        result.update = {
            head: {
                local,
                remote,
            },
            hash: {
                from,
                to,
            },
        };
    }),
];
const parsePushResult = (stdOut, stdErr) => {
    const pushDetail = exports.parsePushDetail(stdOut, stdErr);
    const responseDetail = parseRemoteMessages_1.parseRemoteMessages(stdOut, stdErr);
    return Object.assign(Object.assign({}, pushDetail), responseDetail);
};
exports.parsePushResult = parsePushResult;
const parsePushDetail = (stdOut, stdErr) => {
    return utils.parseStringResponse({ pushed: [] }, parsers, stdOut, stdErr);
};
exports.parsePushDetail = parsePushDetail;

});

var push = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushTask = exports.pushTagsTask = void 0;


function pushTagsTask(ref = {}, customArgs) {
    utils.append(customArgs, '--tags');
    return pushTask(ref, customArgs);
}
exports.pushTagsTask = pushTagsTask;
function pushTask(ref = {}, customArgs) {
    const commands = ['push', ...customArgs];
    if (ref.branch) {
        commands.splice(1, 0, ref.branch);
    }
    if (ref.remote) {
        commands.splice(1, 0, ref.remote);
    }
    utils.remove(commands, '-v');
    utils.append(commands, '--verbose');
    utils.append(commands, '--porcelain');
    return {
        commands,
        format: 'utf-8',
        parser: parsePush.parsePushResult,
    };
}
exports.pushTask = pushTask;

});

var FileStatusSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStatusSummary = exports.fromPathRegex = void 0;
exports.fromPathRegex = /^(.+) -> (.+)$/;
class FileStatusSummary {
    constructor(path, index, working_dir) {
        this.path = path;
        this.index = index;
        this.working_dir = working_dir;
        if ('R' === (index + working_dir)) {
            const detail = exports.fromPathRegex.exec(path) || [null, path, path];
            this.from = detail[1] || '';
            this.path = detail[2] || '';
        }
    }
}
exports.FileStatusSummary = FileStatusSummary;

});

var StatusSummary_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStatusSummary = exports.StatusSummary = void 0;


/**
 * The StatusSummary is returned as a response to getting `git().status()`
 */
class StatusSummary {
    constructor() {
        this.not_added = [];
        this.conflicted = [];
        this.created = [];
        this.deleted = [];
        this.modified = [];
        this.renamed = [];
        /**
         * All files represented as an array of objects containing the `path` and status in `index` and
         * in the `working_dir`.
         */
        this.files = [];
        this.staged = [];
        /**
         * Number of commits ahead of the tracked branch
         */
        this.ahead = 0;
        /**
         *Number of commits behind the tracked branch
         */
        this.behind = 0;
        /**
         * Name of the current branch
         */
        this.current = null;
        /**
         * Name of the branch being tracked
         */
        this.tracking = null;
    }
    /**
     * Gets whether this StatusSummary represents a clean working branch.
     */
    isClean() {
        return !this.files.length;
    }
}
exports.StatusSummary = StatusSummary;
var PorcelainFileStatus;
(function (PorcelainFileStatus) {
    PorcelainFileStatus["ADDED"] = "A";
    PorcelainFileStatus["DELETED"] = "D";
    PorcelainFileStatus["MODIFIED"] = "M";
    PorcelainFileStatus["RENAMED"] = "R";
    PorcelainFileStatus["COPIED"] = "C";
    PorcelainFileStatus["UNMERGED"] = "U";
    PorcelainFileStatus["UNTRACKED"] = "?";
    PorcelainFileStatus["IGNORED"] = "!";
    PorcelainFileStatus["NONE"] = " ";
})(PorcelainFileStatus || (PorcelainFileStatus = {}));
function renamedFile(line) {
    const detail = /^(.+) -> (.+)$/.exec(line);
    if (!detail) {
        return {
            from: line, to: line
        };
    }
    return {
        from: String(detail[1]),
        to: String(detail[2]),
    };
}
function parser(indexX, indexY, handler) {
    return [`${indexX}${indexY}`, handler];
}
function conflicts(indexX, ...indexY) {
    return indexY.map(y => parser(indexX, y, (result, file) => utils.append(result.conflicted, file)));
}
const parsers = new Map([
    parser(PorcelainFileStatus.NONE, PorcelainFileStatus.ADDED, (result, file) => utils.append(result.created, file)),
    parser(PorcelainFileStatus.NONE, PorcelainFileStatus.DELETED, (result, file) => utils.append(result.deleted, file)),
    parser(PorcelainFileStatus.NONE, PorcelainFileStatus.MODIFIED, (result, file) => utils.append(result.modified, file)),
    parser(PorcelainFileStatus.ADDED, PorcelainFileStatus.NONE, (result, file) => utils.append(result.created, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.ADDED, PorcelainFileStatus.MODIFIED, (result, file) => utils.append(result.created, file) && utils.append(result.staged, file) && utils.append(result.modified, file)),
    parser(PorcelainFileStatus.DELETED, PorcelainFileStatus.NONE, (result, file) => utils.append(result.deleted, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.MODIFIED, PorcelainFileStatus.NONE, (result, file) => utils.append(result.modified, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.MODIFIED, PorcelainFileStatus.MODIFIED, (result, file) => utils.append(result.modified, file) && utils.append(result.staged, file)),
    parser(PorcelainFileStatus.RENAMED, PorcelainFileStatus.NONE, (result, file) => {
        utils.append(result.renamed, renamedFile(file));
    }),
    parser(PorcelainFileStatus.RENAMED, PorcelainFileStatus.MODIFIED, (result, file) => {
        const renamed = renamedFile(file);
        utils.append(result.renamed, renamed);
        utils.append(result.modified, renamed.to);
    }),
    parser(PorcelainFileStatus.UNTRACKED, PorcelainFileStatus.UNTRACKED, (result, file) => utils.append(result.not_added, file)),
    ...conflicts(PorcelainFileStatus.ADDED, PorcelainFileStatus.ADDED, PorcelainFileStatus.UNMERGED),
    ...conflicts(PorcelainFileStatus.DELETED, PorcelainFileStatus.DELETED, PorcelainFileStatus.UNMERGED),
    ...conflicts(PorcelainFileStatus.UNMERGED, PorcelainFileStatus.ADDED, PorcelainFileStatus.DELETED, PorcelainFileStatus.UNMERGED),
    ['##', (result, line) => {
            const aheadReg = /ahead (\d+)/;
            const behindReg = /behind (\d+)/;
            const currentReg = /^(.+?(?=(?:\.{3}|\s|$)))/;
            const trackingReg = /\.{3}(\S*)/;
            const onEmptyBranchReg = /\son\s([\S]+)$/;
            let regexResult;
            regexResult = aheadReg.exec(line);
            result.ahead = regexResult && +regexResult[1] || 0;
            regexResult = behindReg.exec(line);
            result.behind = regexResult && +regexResult[1] || 0;
            regexResult = currentReg.exec(line);
            result.current = regexResult && regexResult[1];
            regexResult = trackingReg.exec(line);
            result.tracking = regexResult && regexResult[1];
            regexResult = onEmptyBranchReg.exec(line);
            result.current = regexResult && regexResult[1] || result.current;
        }]
]);
const parseStatusSummary = function (text) {
    const lines = text.trim().split('\n');
    const status = new StatusSummary();
    for (let i = 0, l = lines.length; i < l; i++) {
        splitLine(status, lines[i]);
    }
    return status;
};
exports.parseStatusSummary = parseStatusSummary;
function splitLine(result, lineStr) {
    const trimmed = lineStr.trim();
    switch (' ') {
        case trimmed.charAt(2):
            return data(trimmed.charAt(0), trimmed.charAt(1), trimmed.substr(3));
        case trimmed.charAt(1):
            return data(PorcelainFileStatus.NONE, trimmed.charAt(0), trimmed.substr(2));
        default:
            return;
    }
    function data(index, workingDir, path) {
        const raw = `${index}${workingDir}`;
        const handler = parsers.get(raw);
        if (handler) {
            handler(result, path);
        }
        if (raw !== '##') {
            result.files.push(new FileStatusSummary_1.FileStatusSummary(path, index, workingDir));
        }
    }
}

});

var status = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusTask = void 0;

function statusTask(customArgs) {
    return {
        format: 'utf-8',
        commands: ['status', '--porcelain', '-b', '-u', ...customArgs],
        parser(text) {
            return StatusSummary_1.parseStatusSummary(text);
        }
    };
}
exports.statusTask = statusTask;

});

var simpleGitApi = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGitApi = void 0;











class SimpleGitApi {
    constructor(_executor) {
        this._executor = _executor;
    }
    _runTask(task, then) {
        const chain = this._executor.chain();
        const promise = chain.push(task);
        if (then) {
            taskCallback_1.taskCallback(task, promise, then);
        }
        return Object.create(this, {
            then: { value: promise.then.bind(promise) },
            catch: { value: promise.catch.bind(promise) },
            _executor: { value: chain },
        });
    }
    add(files) {
        return this._runTask(task.straightThroughStringTask(['add', ...utils.asArray(files)]), utils.trailingFunctionArgument(arguments));
    }
    cwd(directory) {
        const next = utils.trailingFunctionArgument(arguments);
        if (typeof directory === 'string') {
            return this._runTask(changeWorkingDirectory.changeWorkingDirectoryTask(directory, this._executor), next);
        }
        if (typeof (directory === null || directory === void 0 ? void 0 : directory.path) === 'string') {
            return this._runTask(changeWorkingDirectory.changeWorkingDirectoryTask(directory.path, directory.root && this._executor || undefined), next);
        }
        return this._runTask(task.configurationErrorTask('Git.cwd: workingDirectory must be supplied as a string'), next);
    }
    hashObject(path, write) {
        return this._runTask(hashObject.hashObjectTask(path, write === true), utils.trailingFunctionArgument(arguments));
    }
    init(bare) {
        return this._runTask(init.initTask(bare === true, this._executor.cwd, utils.getTrailingOptions(arguments)), utils.trailingFunctionArgument(arguments));
    }
    merge() {
        return this._runTask(merge.mergeTask(utils.getTrailingOptions(arguments)), utils.trailingFunctionArgument(arguments));
    }
    mergeFromTo(remote, branch) {
        if (!(utils.filterString(remote) && utils.filterString(branch))) {
            return this._runTask(task.configurationErrorTask(`Git.mergeFromTo requires that the 'remote' and 'branch' arguments are supplied as strings`));
        }
        return this._runTask(merge.mergeTask([remote, branch, ...utils.getTrailingOptions(arguments)]), utils.trailingFunctionArgument(arguments, false));
    }
    outputHandler(handler) {
        this._executor.outputHandler = handler;
        return this;
    }
    push() {
        const task = push.pushTask({
            remote: utils.filterType(arguments[0], utils.filterString),
            branch: utils.filterType(arguments[1], utils.filterString),
        }, utils.getTrailingOptions(arguments));
        return this._runTask(task, utils.trailingFunctionArgument(arguments));
    }
    stash() {
        return this._runTask(task.straightThroughStringTask(['stash', ...utils.getTrailingOptions(arguments)]), utils.trailingFunctionArgument(arguments));
    }
    status() {
        return this._runTask(status.statusTask(utils.getTrailingOptions(arguments)), utils.trailingFunctionArgument(arguments));
    }
}
exports.SimpleGitApi = SimpleGitApi;
Object.assign(SimpleGitApi.prototype, config.default(), log.default());

});

var dist = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferred = exports.deferred = void 0;
/**
 * Creates a new `DeferredPromise`
 *
 * ```typescript
 import {deferred} from '@kwsites/promise-deferred`;
 ```
 */
function deferred() {
    let done;
    let fail;
    let status = 'pending';
    const promise = new Promise((_done, _fail) => {
        done = _done;
        fail = _fail;
    });
    return {
        promise,
        done(result) {
            if (status === 'pending') {
                status = 'resolved';
                done(result);
            }
        },
        fail(error) {
            if (status === 'pending') {
                status = 'rejected';
                fail(error);
            }
        },
        get fulfilled() {
            return status !== 'pending';
        },
        get status() {
            return status;
        },
    };
}
exports.deferred = deferred;
/**
 * Alias of the exported `deferred` function, to help consumers wanting to use `deferred` as the
 * local variable name rather than the factory import name, without needing to rename on import.
 *
 * ```typescript
 import {createDeferred} from '@kwsites/promise-deferred`;
 ```
 */
exports.createDeferred = deferred;
/**
 * Default export allows use as:
 *
 * ```typescript
 import deferred from '@kwsites/promise-deferred`;
 ```
 */
exports.default = deferred;

});

var scheduler = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;



const createScheduledTask = (() => {
    let id = 0;
    return () => {
        id++;
        const { promise, done } = dist.createDeferred();
        return {
            promise,
            done,
            id,
        };
    };
})();
class Scheduler {
    constructor(concurrency = 2) {
        this.concurrency = concurrency;
        this.logger = gitLogger.createLogger('', 'scheduler');
        this.pending = [];
        this.running = [];
        this.logger(`Constructed, concurrency=%s`, concurrency);
    }
    schedule() {
        if (!this.pending.length || this.running.length >= this.concurrency) {
            this.logger(`Schedule attempt ignored, pending=%s running=%s concurrency=%s`, this.pending.length, this.running.length, this.concurrency);
            return;
        }
        const task = utils.append(this.running, this.pending.shift());
        this.logger(`Attempting id=%s`, task.id);
        task.done(() => {
            this.logger(`Completing id=`, task.id);
            utils.remove(this.running, task);
            this.schedule();
        });
    }
    next() {
        const { promise, id } = utils.append(this.pending, createScheduledTask());
        this.logger(`Scheduling id=%s`, id);
        this.schedule();
        return promise;
    }
}
exports.Scheduler = Scheduler;

});

var applyPatch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPatchTask = void 0;

function applyPatchTask(patches, customArgs) {
    return task.straightThroughStringTask(['apply', ...customArgs, ...patches]);
}
exports.applyPatchTask = applyPatchTask;

});

var BranchDeleteSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSingleBranchDeleteFailure = exports.branchDeletionFailure = exports.branchDeletionSuccess = exports.BranchDeletionBatch = void 0;
class BranchDeletionBatch {
    constructor() {
        this.all = [];
        this.branches = {};
        this.errors = [];
    }
    get success() {
        return !this.errors.length;
    }
}
exports.BranchDeletionBatch = BranchDeletionBatch;
function branchDeletionSuccess(branch, hash) {
    return {
        branch, hash, success: true,
    };
}
exports.branchDeletionSuccess = branchDeletionSuccess;
function branchDeletionFailure(branch) {
    return {
        branch, hash: null, success: false,
    };
}
exports.branchDeletionFailure = branchDeletionFailure;
function isSingleBranchDeleteFailure(test) {
    return test.success;
}
exports.isSingleBranchDeleteFailure = isSingleBranchDeleteFailure;

});

var parseBranchDelete = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBranchDeletionError = exports.parseBranchDeletions = void 0;


const deleteSuccessRegex = /(\S+)\s+\(\S+\s([^)]+)\)/;
const deleteErrorRegex = /^error[^']+'([^']+)'/m;
const parsers = [
    new utils.LineParser(deleteSuccessRegex, (result, [branch, hash]) => {
        const deletion = BranchDeleteSummary.branchDeletionSuccess(branch, hash);
        result.all.push(deletion);
        result.branches[branch] = deletion;
    }),
    new utils.LineParser(deleteErrorRegex, (result, [branch]) => {
        const deletion = BranchDeleteSummary.branchDeletionFailure(branch);
        result.errors.push(deletion);
        result.all.push(deletion);
        result.branches[branch] = deletion;
    }),
];
const parseBranchDeletions = (stdOut, stdErr) => {
    return utils.parseStringResponse(new BranchDeleteSummary.BranchDeletionBatch(), parsers, stdOut, stdErr);
};
exports.parseBranchDeletions = parseBranchDeletions;
function hasBranchDeletionError(data, processExitCode) {
    return processExitCode === utils.ExitCodes.ERROR && deleteErrorRegex.test(data);
}
exports.hasBranchDeletionError = hasBranchDeletionError;

});

var BranchSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchSummaryResult = void 0;
class BranchSummaryResult {
    constructor() {
        this.all = [];
        this.branches = {};
        this.current = '';
        this.detached = false;
    }
    push(current, detached, name, commit, label) {
        if (current) {
            this.detached = detached;
            this.current = name;
        }
        this.all.push(name);
        this.branches[name] = {
            current: current,
            name: name,
            commit: commit,
            label: label
        };
    }
}
exports.BranchSummaryResult = BranchSummaryResult;

});

var parseBranch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBranchSummary = void 0;


const parsers = [
    new utils.LineParser(/^(\*\s)?\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/, (result, [current, name, commit, label]) => {
        result.push(!!current, true, name, commit, label);
    }),
    new utils.LineParser(/^(\*\s)?(\S+)\s+([a-z0-9]+)\s(.*)$/s, (result, [current, name, commit, label]) => {
        result.push(!!current, false, name, commit, label);
    })
];
function parseBranchSummary(stdOut) {
    return utils.parseStringResponse(new BranchSummary.BranchSummaryResult(), parsers, stdOut);
}
exports.parseBranchSummary = parseBranchSummary;

});

var branch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranchTask = exports.deleteBranchesTask = exports.branchLocalTask = exports.branchTask = exports.containsDeleteBranchCommand = void 0;




function containsDeleteBranchCommand(commands) {
    const deleteCommands = ['-d', '-D', '--delete'];
    return commands.some(command => deleteCommands.includes(command));
}
exports.containsDeleteBranchCommand = containsDeleteBranchCommand;
function branchTask(customArgs) {
    const isDelete = containsDeleteBranchCommand(customArgs);
    const commands = ['branch', ...customArgs];
    if (commands.length === 1) {
        commands.push('-a');
    }
    if (!commands.includes('-v')) {
        commands.splice(1, 0, '-v');
    }
    return {
        format: 'utf-8',
        commands,
        parser(stdOut, stdErr) {
            if (isDelete) {
                return parseBranchDelete.parseBranchDeletions(stdOut, stdErr).all[0];
            }
            return parseBranch.parseBranchSummary(stdOut);
        },
    };
}
exports.branchTask = branchTask;
function branchLocalTask() {
    const parser = parseBranch.parseBranchSummary;
    return {
        format: 'utf-8',
        commands: ['branch', '-v'],
        parser,
    };
}
exports.branchLocalTask = branchLocalTask;
function deleteBranchesTask(branches, forceDelete = false) {
    return {
        format: 'utf-8',
        commands: ['branch', '-v', forceDelete ? '-D' : '-d', ...branches],
        parser(stdOut, stdErr) {
            return parseBranchDelete.parseBranchDeletions(stdOut, stdErr);
        },
        onError({ exitCode, stdOut }, error, done, fail) {
            if (!parseBranchDelete.hasBranchDeletionError(String(error), exitCode)) {
                return fail(error);
            }
            done(stdOut);
        },
    };
}
exports.deleteBranchesTask = deleteBranchesTask;
function deleteBranchTask(branch, forceDelete = false) {
    const task = {
        format: 'utf-8',
        commands: ['branch', '-v', forceDelete ? '-D' : '-d', branch],
        parser(stdOut, stdErr) {
            return parseBranchDelete.parseBranchDeletions(stdOut, stdErr).branches[branch];
        },
        onError({ exitCode, stdErr, stdOut }, error, _, fail) {
            if (!parseBranchDelete.hasBranchDeletionError(String(error), exitCode)) {
                return fail(error);
            }
            throw new gitResponseError.GitResponseError(task.parser(utils.bufferToString(stdOut), utils.bufferToString(stdErr)), String(error));
        },
    };
    return task;
}
exports.deleteBranchTask = deleteBranchTask;

});

var CheckIgnore = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCheckIgnore = void 0;
/**
 * Parser for the `check-ignore` command - returns each file as a string array
 */
const parseCheckIgnore = (text) => {
    return text.split(/\n/g)
        .map(line => line.trim())
        .filter(file => !!file);
};
exports.parseCheckIgnore = parseCheckIgnore;

});

var checkIgnore = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIgnoreTask = void 0;

function checkIgnoreTask(paths) {
    return {
        commands: ['check-ignore', ...paths],
        format: 'utf-8',
        parser: CheckIgnore.parseCheckIgnore,
    };
}
exports.checkIgnoreTask = checkIgnoreTask;

});

var clone = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneMirrorTask = exports.cloneTask = void 0;


function cloneTask(repo, directory, customArgs) {
    const commands = ['clone', ...customArgs];
    if (typeof repo === 'string') {
        commands.push(repo);
    }
    if (typeof directory === 'string') {
        commands.push(directory);
    }
    return task.straightThroughStringTask(commands);
}
exports.cloneTask = cloneTask;
function cloneMirrorTask(repo, directory, customArgs) {
    utils.append(customArgs, '--mirror');
    return cloneTask(repo, directory, customArgs);
}
exports.cloneMirrorTask = cloneMirrorTask;

});

var parseCommit = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommitResult = void 0;

const parsers = [
    new utils.LineParser(/^\[([^\s]+)( \([^)]+\))? ([^\]]+)/, (result, [branch, root, commit]) => {
        result.branch = branch;
        result.commit = commit;
        result.root = !!root;
    }),
    new utils.LineParser(/\s*Author:\s(.+)/i, (result, [author]) => {
        const parts = author.split('<');
        const email = parts.pop();
        if (!email || !email.includes('@')) {
            return;
        }
        result.author = {
            email: email.substr(0, email.length - 1),
            name: parts.join('<').trim()
        };
    }),
    new utils.LineParser(/(\d+)[^,]*(?:,\s*(\d+)[^,]*)(?:,\s*(\d+))/g, (result, [changes, insertions, deletions]) => {
        result.summary.changes = parseInt(changes, 10) || 0;
        result.summary.insertions = parseInt(insertions, 10) || 0;
        result.summary.deletions = parseInt(deletions, 10) || 0;
    }),
    new utils.LineParser(/^(\d+)[^,]*(?:,\s*(\d+)[^(]+\(([+-]))?/, (result, [changes, lines, direction]) => {
        result.summary.changes = parseInt(changes, 10) || 0;
        const count = parseInt(lines, 10) || 0;
        if (direction === '-') {
            result.summary.deletions = count;
        }
        else if (direction === '+') {
            result.summary.insertions = count;
        }
    }),
];
function parseCommitResult(stdOut) {
    const result = {
        author: null,
        branch: '',
        commit: '',
        root: false,
        summary: {
            changes: 0,
            insertions: 0,
            deletions: 0,
        },
    };
    return utils.parseStringResponse(result, parsers, stdOut);
}
exports.parseCommitResult = parseCommitResult;

});

var commit = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitTask = void 0;

function commitTask(message, files, customArgs) {
    const commands = ['commit'];
    message.forEach((m) => commands.push('-m', m));
    commands.push(...files, ...customArgs);
    return {
        commands,
        format: 'utf-8',
        parser: parseCommit.parseCommitResult,
    };
}
exports.commitTask = commitTask;

});

var diff = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffSummaryTask = void 0;

function diffSummaryTask(customArgs) {
    return {
        commands: ['diff', '--stat=4096', ...customArgs],
        format: 'utf-8',
        parser(stdOut) {
            return parseDiffSummary.parseDiffResult(stdOut);
        }
    };
}
exports.diffSummaryTask = diffSummaryTask;

});

var parseFetch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFetchResult = void 0;

const parsers = [
    new utils.LineParser(/From (.+)$/, (result, [remote]) => {
        result.remote = remote;
    }),
    new utils.LineParser(/\* \[new branch]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.branches.push({
            name,
            tracking,
        });
    }),
    new utils.LineParser(/\* \[new tag]\s+(\S+)\s*-> (.+)$/, (result, [name, tracking]) => {
        result.tags.push({
            name,
            tracking,
        });
    })
];
function parseFetchResult(stdOut, stdErr) {
    const result = {
        raw: stdOut,
        remote: null,
        branches: [],
        tags: [],
    };
    return utils.parseStringResponse(result, parsers, stdOut, stdErr);
}
exports.parseFetchResult = parseFetchResult;

});

var fetch = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTask = void 0;

function fetchTask(remote, branch, customArgs) {
    const commands = ['fetch', ...customArgs];
    if (remote && branch) {
        commands.push(remote, branch);
    }
    return {
        commands,
        format: 'utf-8',
        parser: parseFetch.parseFetchResult,
    };
}
exports.fetchTask = fetchTask;

});

var parseMove = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMoveResult = void 0;

const parsers = [
    new utils.LineParser(/^Renaming (.+) to (.+)$/, (result, [from, to]) => {
        result.moves.push({ from, to });
    }),
];
function parseMoveResult(stdOut) {
    return utils.parseStringResponse({ moves: [] }, parsers, stdOut);
}
exports.parseMoveResult = parseMoveResult;

});

var move = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTask = void 0;


function moveTask(from, to) {
    return {
        commands: ['mv', '-v', ...utils.asArray(from), to],
        format: 'utf-8',
        parser: parseMove.parseMoveResult,
    };
}
exports.moveTask = moveTask;

});

var pull = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullTask = void 0;

function pullTask(remote, branch, customArgs) {
    const commands = ['pull', ...customArgs];
    if (remote && branch) {
        commands.splice(1, 0, remote, branch);
    }
    return {
        commands,
        format: 'utf-8',
        parser(stdOut, stdErr) {
            return parsePull.parsePullResult(stdOut, stdErr);
        }
    };
}
exports.pullTask = pullTask;

});

var GetRemoteSummary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGetRemotesVerbose = exports.parseGetRemotes = void 0;

function parseGetRemotes(text) {
    const remotes = {};
    forEach(text, ([name]) => remotes[name] = { name });
    return Object.values(remotes);
}
exports.parseGetRemotes = parseGetRemotes;
function parseGetRemotesVerbose(text) {
    const remotes = {};
    forEach(text, ([name, url, purpose]) => {
        if (!remotes.hasOwnProperty(name)) {
            remotes[name] = {
                name: name,
                refs: { fetch: '', push: '' },
            };
        }
        if (purpose && url) {
            remotes[name].refs[purpose.replace(/[^a-z]/g, '')] = url;
        }
    });
    return Object.values(remotes);
}
exports.parseGetRemotesVerbose = parseGetRemotesVerbose;
function forEach(text, handler) {
    utils.forEachLineWithContent(text, (line) => handler(line.split(/\s+/)));
}

});

var remote = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRemoteTask = exports.remoteTask = exports.listRemotesTask = exports.getRemotesTask = exports.addRemoteTask = void 0;


function addRemoteTask(remoteName, remoteRepo, customArgs = []) {
    return task.straightThroughStringTask(['remote', 'add', ...customArgs, remoteName, remoteRepo]);
}
exports.addRemoteTask = addRemoteTask;
function getRemotesTask(verbose) {
    const commands = ['remote'];
    if (verbose) {
        commands.push('-v');
    }
    return {
        commands,
        format: 'utf-8',
        parser: verbose ? GetRemoteSummary.parseGetRemotesVerbose : GetRemoteSummary.parseGetRemotes,
    };
}
exports.getRemotesTask = getRemotesTask;
function listRemotesTask(customArgs = []) {
    const commands = [...customArgs];
    if (commands[0] !== 'ls-remote') {
        commands.unshift('ls-remote');
    }
    return task.straightThroughStringTask(commands);
}
exports.listRemotesTask = listRemotesTask;
function remoteTask(customArgs = []) {
    const commands = [...customArgs];
    if (commands[0] !== 'remote') {
        commands.unshift('remote');
    }
    return task.straightThroughStringTask(commands);
}
exports.remoteTask = remoteTask;
function removeRemoteTask(remoteName) {
    return task.straightThroughStringTask(['remote', 'remove', remoteName]);
}
exports.removeRemoteTask = removeRemoteTask;

});

var stashList = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.stashListTask = void 0;


function stashListTask(opt = {}, customArgs) {
    const options = log.parseLogOptions(opt);
    const parser = parseListLogSummary.createListLogSummaryParser(options.splitter, options.fields);
    return {
        commands: ['stash', 'list', ...options.commands, ...customArgs],
        format: 'utf-8',
        parser,
    };
}
exports.stashListTask = stashListTask;

});

var subModule = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubModuleTask = exports.subModuleTask = exports.initSubModuleTask = exports.addSubModuleTask = void 0;

function addSubModuleTask(repo, path) {
    return subModuleTask(['add', repo, path]);
}
exports.addSubModuleTask = addSubModuleTask;
function initSubModuleTask(customArgs) {
    return subModuleTask(['init', ...customArgs]);
}
exports.initSubModuleTask = initSubModuleTask;
function subModuleTask(customArgs) {
    const commands = [...customArgs];
    if (commands[0] !== 'submodule') {
        commands.unshift('submodule');
    }
    return task.straightThroughStringTask(commands);
}
exports.subModuleTask = subModuleTask;
function updateSubModuleTask(customArgs) {
    return subModuleTask(['update', ...customArgs]);
}
exports.updateSubModuleTask = updateSubModuleTask;

});

var TagList_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTagList = exports.TagList = void 0;
class TagList {
    constructor(all, latest) {
        this.all = all;
        this.latest = latest;
    }
}
exports.TagList = TagList;
const parseTagList = function (data, customSort = false) {
    const tags = data
        .split('\n')
        .map(trimmed)
        .filter(Boolean);
    if (!customSort) {
        tags.sort(function (tagA, tagB) {
            const partsA = tagA.split('.');
            const partsB = tagB.split('.');
            if (partsA.length === 1 || partsB.length === 1) {
                return singleSorted(toNumber(partsA[0]), toNumber(partsB[0]));
            }
            for (let i = 0, l = Math.max(partsA.length, partsB.length); i < l; i++) {
                const diff = sorted(toNumber(partsA[i]), toNumber(partsB[i]));
                if (diff) {
                    return diff;
                }
            }
            return 0;
        });
    }
    const latest = customSort ? tags[0] : [...tags].reverse().find((tag) => tag.indexOf('.') >= 0);
    return new TagList(tags, latest);
};
exports.parseTagList = parseTagList;
function singleSorted(a, b) {
    const aIsNum = isNaN(a);
    const bIsNum = isNaN(b);
    if (aIsNum !== bIsNum) {
        return aIsNum ? 1 : -1;
    }
    return aIsNum ? sorted(a, b) : 0;
}
function sorted(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
}
function trimmed(input) {
    return input.trim();
}
function toNumber(input) {
    if (typeof input === 'string') {
        return parseInt(input.replace(/^\D+/g, ''), 10) || 0;
    }
    return 0;
}

});

var tag = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAnnotatedTagTask = exports.addTagTask = exports.tagListTask = void 0;

/**
 * Task used by `git.tags`
 */
function tagListTask(customArgs = []) {
    const hasCustomSort = customArgs.some((option) => /^--sort=/.test(option));
    return {
        format: 'utf-8',
        commands: ['tag', '-l', ...customArgs],
        parser(text) {
            return TagList_1.parseTagList(text, hasCustomSort);
        },
    };
}
exports.tagListTask = tagListTask;
/**
 * Task used by `git.addTag`
 */
function addTagTask(name) {
    return {
        format: 'utf-8',
        commands: ['tag', name],
        parser() {
            return { name };
        }
    };
}
exports.addTagTask = addTagTask;
/**
 * Task used by `git.addTag`
 */
function addAnnotatedTagTask(name, tagMessage) {
    return {
        format: 'utf-8',
        commands: ['tag', '-a', '-m', tagMessage, name],
        parser() {
            return { name };
        }
    };
}
exports.addAnnotatedTagTask = addAnnotatedTagTask;

});

const {GitExecutor} = gitExecutor;
const {SimpleGitApi} = simpleGitApi;

const {Scheduler} = scheduler;
const {GitLogger} = gitLogger;
const {configurationErrorTask} = task;
const {
   asArray,
   filterArray,
   filterPrimitives,
   filterString,
   filterStringOrStringArray,
   filterType,
   getTrailingOptions,
   trailingFunctionArgument,
   trailingOptionsArgument
} = utils;
const {applyPatchTask} = applyPatch;
const {branchTask, branchLocalTask, deleteBranchesTask, deleteBranchTask} = branch;
const {checkIgnoreTask} = checkIgnore;
const {checkIsRepoTask} = checkIsRepo;
const {cloneTask, cloneMirrorTask} = clone;
const {cleanWithOptionsTask, isCleanOptionsArray} = clean;
const {commitTask} = commit;
const {diffSummaryTask} = diff;
const {fetchTask} = fetch;
const {moveTask} = move;
const {pullTask} = pull;
const {pushTagsTask} = push;
const {addRemoteTask, getRemotesTask, listRemotesTask, remoteTask, removeRemoteTask} = remote;
const {getResetMode, resetTask} = reset;
const {stashListTask} = stashList;
const {addSubModuleTask, initSubModuleTask, subModuleTask, updateSubModuleTask} = subModule;
const {addAnnotatedTagTask, addTagTask, tagListTask} = tag;
const {straightThroughBufferTask, straightThroughStringTask} = task;

function Git (options, plugins) {
   this._executor = new GitExecutor(
      options.binary, options.baseDir,
      new Scheduler(options.maxConcurrentProcesses), plugins,
   );
   this._logger = new GitLogger();
}

(Git.prototype = Object.create(SimpleGitApi.prototype)).constructor = Git;

/**
 * Logging utility for printing out info or error messages to the user
 * @type {GitLogger}
 * @private
 */
Git.prototype._logger = null;

/**
 * Sets the path to a custom git binary, should either be `git` when there is an installation of git available on
 * the system path, or a fully qualified path to the executable.
 *
 * @param {string} command
 * @returns {Git}
 */
Git.prototype.customBinary = function (command) {
   this._executor.binary = command;
   return this;
};

/**
 * Sets an environment variable for the spawned child process, either supply both a name and value as strings or
 * a single object to entirely replace the current environment variables.
 *
 * @param {string|Object} name
 * @param {string} [value]
 * @returns {Git}
 */
Git.prototype.env = function (name, value) {
   if (arguments.length === 1 && typeof name === 'object') {
      this._executor.env = name;
   } else {
      (this._executor.env = this._executor.env || {})[name] = value;
   }

   return this;
};

/**
 * List the stash(s) of the local repo
 */
Git.prototype.stashList = function (options) {
   return this._runTask(
      stashListTask(
         trailingOptionsArgument(arguments) || {},
         filterArray(options) && options || []
      ),
      trailingFunctionArgument(arguments),
   );
};

function createCloneTask (api, task, repoPath, localPath) {
   if (typeof repoPath !== 'string') {
      return configurationErrorTask(`git.${ api }() requires a string 'repoPath'`);
   }

   return task(repoPath, filterType(localPath, filterString), getTrailingOptions(arguments));
}


/**
 * Clone a git repo
 */
Git.prototype.clone = function () {
   return this._runTask(
      createCloneTask('clone', cloneTask, ...arguments),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Mirror a git repo
 */
Git.prototype.mirror = function () {
   return this._runTask(
      createCloneTask('mirror', cloneMirrorTask, ...arguments),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Moves one or more files to a new destination.
 *
 * @see https://git-scm.com/docs/git-mv
 *
 * @param {string|string[]} from
 * @param {string} to
 */
Git.prototype.mv = function (from, to) {
   return this._runTask(moveTask(from, to), trailingFunctionArgument(arguments));
};

/**
 * Internally uses pull and tags to get the list of tags then checks out the latest tag.
 *
 * @param {Function} [then]
 */
Git.prototype.checkoutLatestTag = function (then) {
   var git = this;
   return this.pull(function () {
      git.tags(function (err, tags) {
         git.checkout(tags.latest, then);
      });
   });
};

/**
 * Commits changes in the current working directory - when specific file paths are supplied, only changes on those
 * files will be committed.
 *
 * @param {string|string[]} message
 * @param {string|string[]} [files]
 * @param {Object} [options]
 * @param {Function} [then]
 */
Git.prototype.commit = function (message, files, options, then) {
   const next = trailingFunctionArgument(arguments);
   const messages = [];

   if (filterStringOrStringArray(message)) {
      messages.push(...asArray(message));
   } else {
      console.warn('simple-git deprecation notice: git.commit: requires the commit message to be supplied as a string/string[], this will be an error in version 3');
   }

   return this._runTask(
      commitTask(
         messages,
         asArray(filterType(files, filterStringOrStringArray, [])),
         [...filterType(options, filterArray, []), ...getTrailingOptions(arguments, 0, true)]
      ),
      next
   );
};

/**
 * Pull the updated contents of the current repo
 */
Git.prototype.pull = function (remote, branch, options, then) {
   return this._runTask(
      pullTask(filterType(remote, filterString), filterType(branch, filterString), getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Fetch the updated contents of the current repo.
 *
 * @example
 *   .fetch('upstream', 'master') // fetches from master on remote named upstream
 *   .fetch(function () {}) // runs fetch against default remote and branch and calls function
 *
 * @param {string} [remote]
 * @param {string} [branch]
 */
Git.prototype.fetch = function (remote, branch) {
   return this._runTask(
      fetchTask(filterType(remote, filterString), filterType(branch, filterString), getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Disables/enables the use of the console for printing warnings and errors, by default messages are not shown in
 * a production environment.
 *
 * @param {boolean} silence
 * @returns {Git}
 */
Git.prototype.silent = function (silence) {
   console.warn('simple-git deprecation notice: git.silent: logging should be configured using the `debug` library / `DEBUG` environment variable, this will be an error in version 3');
   this._logger.silent(!!silence);
   return this;
};

/**
 * List all tags. When using git 2.7.0 or above, include an options object with `"--sort": "property-name"` to
 * sort the tags by that property instead of using the default semantic versioning sort.
 *
 * Note, supplying this option when it is not supported by your Git version will cause the operation to fail.
 *
 * @param {Object} [options]
 * @param {Function} [then]
 */
Git.prototype.tags = function (options, then) {
   return this._runTask(
      tagListTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Rebases the current working copy. Options can be supplied either as an array of string parameters
 * to be sent to the `git rebase` command, or a standard options object.
 */
Git.prototype.rebase = function () {
   return this._runTask(
      straightThroughStringTask(['rebase', ...getTrailingOptions(arguments)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Reset a repo
 */
Git.prototype.reset = function (mode) {
   return this._runTask(
      resetTask(getResetMode(mode), getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Revert one or more commits in the local working copy
 */
Git.prototype.revert = function (commit) {
   const next = trailingFunctionArgument(arguments);

   if (typeof commit !== 'string') {
      return this._runTask(
         configurationErrorTask('Commit must be a string'),
         next,
      );
   }

   return this._runTask(
      straightThroughStringTask(['revert', ...getTrailingOptions(arguments, 0, true), commit]),
      next
   );
};

/**
 * Add a lightweight tag to the head of the current branch
 */
Git.prototype.addTag = function (name) {
   const task = (typeof name === 'string')
      ? addTagTask(name)
      : configurationErrorTask('Git.addTag requires a tag name');

   return this._runTask(task, trailingFunctionArgument(arguments));
};

/**
 * Add an annotated tag to the head of the current branch
 */
Git.prototype.addAnnotatedTag = function (tagName, tagMessage) {
   return this._runTask(
      addAnnotatedTagTask(tagName, tagMessage),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Check out a tag or revision, any number of additional arguments can be passed to the `git checkout` command
 * by supplying either a string or array of strings as the first argument.
 */
Git.prototype.checkout = function () {
   const commands = ['checkout', ...getTrailingOptions(arguments, true)];
   return this._runTask(
      straightThroughStringTask(commands),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Check out a remote branch
 *
 * @param {string} branchName name of branch
 * @param {string} startPoint (e.g origin/development)
 * @param {Function} [then]
 */
Git.prototype.checkoutBranch = function (branchName, startPoint, then) {
   return this.checkout(['-b', branchName, startPoint], trailingFunctionArgument(arguments));
};

/**
 * Check out a local branch
 */
Git.prototype.checkoutLocalBranch = function (branchName, then) {
   return this.checkout(['-b', branchName], trailingFunctionArgument(arguments));
};

/**
 * Delete a local branch
 */
Git.prototype.deleteLocalBranch = function (branchName, forceDelete, then) {
   return this._runTask(
      deleteBranchTask(branchName, typeof forceDelete === "boolean" ? forceDelete : false),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Delete one or more local branches
 */
Git.prototype.deleteLocalBranches = function (branchNames, forceDelete, then) {
   return this._runTask(
      deleteBranchesTask(branchNames, typeof forceDelete === "boolean" ? forceDelete : false),
      trailingFunctionArgument(arguments),
   );
};

/**
 * List all branches
 *
 * @param {Object | string[]} [options]
 * @param {Function} [then]
 */
Git.prototype.branch = function (options, then) {
   return this._runTask(
      branchTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Return list of local branches
 *
 * @param {Function} [then]
 */
Git.prototype.branchLocal = function (then) {
   return this._runTask(
      branchLocalTask(),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Executes any command against the git binary.
 */
Git.prototype.raw = function (commands) {
   const createRestCommands = !Array.isArray(commands);
   const command = [].slice.call(createRestCommands ? arguments : commands, 0);

   for (let i = 0; i < command.length && createRestCommands; i++) {
      if (!filterPrimitives(command[i])) {
         command.splice(i, command.length - i);
         break;
      }
   }

   command.push(
      ...getTrailingOptions(arguments, 0, true),
   );

   var next = trailingFunctionArgument(arguments);

   if (!command.length) {
      return this._runTask(
         configurationErrorTask('Raw: must supply one or more command to execute'),
         next,
      );
   }

   return this._runTask(straightThroughStringTask(command), next);
};

Git.prototype.submoduleAdd = function (repo, path, then) {
   return this._runTask(
      addSubModuleTask(repo, path),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.submoduleUpdate = function (args, then) {
   return this._runTask(
      updateSubModuleTask(getTrailingOptions(arguments, true)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.submoduleInit = function (args, then) {
   return this._runTask(
      initSubModuleTask(getTrailingOptions(arguments, true)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.subModule = function (options, then) {
   return this._runTask(
      subModuleTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.listRemote = function () {
   return this._runTask(
      listRemotesTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Adds a remote to the list of remotes.
 */
Git.prototype.addRemote = function (remoteName, remoteRepo, then) {
   return this._runTask(
      addRemoteTask(remoteName, remoteRepo, getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Removes an entry by name from the list of remotes.
 */
Git.prototype.removeRemote = function (remoteName, then) {
   return this._runTask(
      removeRemoteTask(remoteName),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Gets the currently available remotes, setting the optional verbose argument to true includes additional
 * detail on the remotes themselves.
 */
Git.prototype.getRemotes = function (verbose, then) {
   return this._runTask(
      getRemotesTask(verbose === true),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Call any `git remote` function with arguments passed as an array of strings.
 *
 * @param {string[]} options
 * @param {Function} [then]
 */
Git.prototype.remote = function (options, then) {
   return this._runTask(
      remoteTask(getTrailingOptions(arguments)),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Call any `git tag` function with arguments passed as an array of strings.
 *
 * @param {string[]} options
 * @param {Function} [then]
 */
Git.prototype.tag = function (options, then) {
   const command = getTrailingOptions(arguments);

   if (command[0] !== 'tag') {
      command.unshift('tag');
   }

   return this._runTask(
      straightThroughStringTask(command),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Updates repository server info
 *
 * @param {Function} [then]
 */
Git.prototype.updateServerInfo = function (then) {
   return this._runTask(
      straightThroughStringTask(['update-server-info']),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Pushes the current tag changes to a remote which can be either a URL or named remote. When not specified uses the
 * default configured remote spec.
 *
 * @param {string} [remote]
 * @param {Function} [then]
 */
Git.prototype.pushTags = function (remote, then) {
   const task = pushTagsTask({remote: filterType(remote, filterString)}, getTrailingOptions(arguments));

   return this._runTask(task, trailingFunctionArgument(arguments));
};

/**
 * Removes the named files from source control.
 */
Git.prototype.rm = function (files) {
   return this._runTask(
      straightThroughStringTask(['rm', '-f', ...asArray(files)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Removes the named files from source control but keeps them on disk rather than deleting them entirely. To
 * completely remove the files, use `rm`.
 *
 * @param {string|string[]} files
 */
Git.prototype.rmKeepLocal = function (files) {
   return this._runTask(
      straightThroughStringTask(['rm', '--cached', ...asArray(files)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 * Returns a list of objects in a tree based on commit hash. Passing in an object hash returns the object's content,
 * size, and type.
 *
 * Passing "-p" will instruct cat-file to determine the object type, and display its formatted contents.
 *
 * @param {string[]} [options]
 * @param {Function} [then]
 */
Git.prototype.catFile = function (options, then) {
   return this._catFile('utf-8', arguments);
};

Git.prototype.binaryCatFile = function () {
   return this._catFile('buffer', arguments);
};

Git.prototype._catFile = function (format, args) {
   var handler = trailingFunctionArgument(args);
   var command = ['cat-file'];
   var options = args[0];

   if (typeof options === 'string') {
      return this._runTask(
         configurationErrorTask('Git.catFile: options must be supplied as an array of strings'),
         handler,
      );
   }

   if (Array.isArray(options)) {
      command.push.apply(command, options);
   }

   const task = format === 'buffer'
      ? straightThroughBufferTask(command)
      : straightThroughStringTask(command);

   return this._runTask(task, handler);
};

Git.prototype.diff = function (options, then) {
   const command = ['diff', ...getTrailingOptions(arguments)];

   if (typeof options === 'string') {
      command.splice(1, 0, options);
      this._logger.warn('Git#diff: supplying options as a single string is now deprecated, switch to an array of strings');
   }

   return this._runTask(
      straightThroughStringTask(command),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.diffSummary = function () {
   return this._runTask(
      diffSummaryTask(getTrailingOptions(arguments, 1)),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.applyPatch = function (patches) {
   const task = !filterStringOrStringArray(patches)
      ? configurationErrorTask(`git.applyPatch requires one or more string patches as the first argument`)
      : applyPatchTask(asArray(patches), getTrailingOptions([].slice.call(arguments, 1)));

   return this._runTask(
      task,
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.revparse = function () {
   const commands = ['rev-parse', ...getTrailingOptions(arguments, true)];
   return this._runTask(
      straightThroughStringTask(commands, true),
      trailingFunctionArgument(arguments),
   );
};

/**
 * Show various types of objects, for example the file at a certain commit
 *
 * @param {string[]} [options]
 * @param {Function} [then]
 */
Git.prototype.show = function (options, then) {
   return this._runTask(
      straightThroughStringTask(['show', ...getTrailingOptions(arguments, 1)]),
      trailingFunctionArgument(arguments)
   );
};

/**
 */
Git.prototype.clean = function (mode, options, then) {
   const usingCleanOptionsArray = isCleanOptionsArray(mode);
   const cleanMode = usingCleanOptionsArray && mode.join('') || filterType(mode, filterString) || '';
   const customArgs = getTrailingOptions([].slice.call(arguments, usingCleanOptionsArray ? 1 : 0));

   return this._runTask(
      cleanWithOptionsTask(cleanMode, customArgs),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.exec = function (then) {
   const task = {
      commands: [],
      format: 'utf-8',
      parser () {
         if (typeof then === 'function') {
            then();
         }
      }
   };

   return this._runTask(task);
};

/**
 * Clears the queue of pending commands and returns the wrapper instance for chaining.
 *
 * @returns {Git}
 */
Git.prototype.clearQueue = function () {
   // TODO:
   // this._executor.clear();
   return this;
};

/**
 * Check if a pathname or pathnames are excluded by .gitignore
 *
 * @param {string|string[]} pathnames
 * @param {Function} [then]
 */
Git.prototype.checkIgnore = function (pathnames, then) {
   return this._runTask(
      checkIgnoreTask(asArray((filterType(pathnames, filterStringOrStringArray, [])))),
      trailingFunctionArgument(arguments),
   );
};

Git.prototype.checkIsRepo = function (checkType, then) {
   return this._runTask(
      checkIsRepoTask(filterType(checkType, filterString)),
      trailingFunctionArgument(arguments),
   );
};

var git = Git;

var gitFactory = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitInstanceFactory = exports.gitExportFactory = exports.esModuleFactory = void 0;




/**
 * Adds the necessary properties to the supplied object to enable it for use as
 * the default export of a module.
 *
 * Eg: `module.exports = esModuleFactory({ something () {} })`
 */
function esModuleFactory(defaultExport) {
    return Object.defineProperties(defaultExport, {
        __esModule: { value: true },
        default: { value: defaultExport },
    });
}
exports.esModuleFactory = esModuleFactory;
function gitExportFactory(factory, extra) {
    return Object.assign(function (...args) {
        return factory.apply(null, args);
    }, api_1.default, extra || {});
}
exports.gitExportFactory = gitExportFactory;
function gitInstanceFactory(baseDir, options) {
    const plugins$1 = new plugins.PluginStore();
    const config = utils.createInstanceConfig(baseDir && (typeof baseDir === 'string' ? { baseDir } : baseDir) || {}, options);
    if (!utils.folderExists(config.baseDir)) {
        throw new api_1.default.GitConstructError(config, `Cannot use simple-git on a directory that does not exist`);
    }
    if (Array.isArray(config.config)) {
        plugins$1.add(plugins.commandConfigPrefixingPlugin(config.config));
    }
    config.progress && plugins$1.add(plugins.progressMonitorPlugin(config.progress));
    config.timeout && plugins$1.add(plugins.timeoutPlugin(config.timeout));
    config.spawnOptions && plugins$1.add(plugins.spawnOptionsPlugin(config.spawnOptions));
    plugins$1.add(plugins.errorDetectionPlugin(plugins.errorDetectionHandler(true)));
    config.errors && plugins$1.add(plugins.errorDetectionPlugin(config.errors));
    return new git(config, plugins$1);
}
exports.gitInstanceFactory = gitInstanceFactory;

});

var promiseWrapped = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitP = void 0;


const functionNamesBuilderApi = [
    'customBinary', 'env', 'outputHandler', 'silent',
];
const functionNamesPromiseApi = [
    'add',
    'addAnnotatedTag',
    'addConfig',
    'addRemote',
    'addTag',
    'applyPatch',
    'binaryCatFile',
    'branch',
    'branchLocal',
    'catFile',
    'checkIgnore',
    'checkIsRepo',
    'checkout',
    'checkoutBranch',
    'checkoutLatestTag',
    'checkoutLocalBranch',
    'clean',
    'clone',
    'commit',
    'cwd',
    'deleteLocalBranch',
    'deleteLocalBranches',
    'diff',
    'diffSummary',
    'exec',
    'fetch',
    'getRemotes',
    'init',
    'listConfig',
    'listRemote',
    'log',
    'merge',
    'mergeFromTo',
    'mirror',
    'mv',
    'pull',
    'push',
    'pushTags',
    'raw',
    'rebase',
    'remote',
    'removeRemote',
    'reset',
    'revert',
    'revparse',
    'rm',
    'rmKeepLocal',
    'show',
    'stash',
    'stashList',
    'status',
    'subModule',
    'submoduleAdd',
    'submoduleInit',
    'submoduleUpdate',
    'tag',
    'tags',
    'updateServerInfo'
];
function gitP(...args) {
    let git;
    let chain = Promise.resolve();
    try {
        git = gitFactory.gitInstanceFactory(...args);
    }
    catch (e) {
        chain = Promise.reject(e);
    }
    function builderReturn() {
        return promiseApi;
    }
    function chainReturn() {
        return chain;
    }
    const promiseApi = [...functionNamesBuilderApi, ...functionNamesPromiseApi].reduce((api, name) => {
        const isAsync = functionNamesPromiseApi.includes(name);
        const valid = isAsync ? asyncWrapper(name, git) : syncWrapper(name, git, api);
        const alternative = isAsync ? chainReturn : builderReturn;
        Object.defineProperty(api, name, {
            enumerable: false,
            configurable: false,
            value: git ? valid : alternative,
        });
        return api;
    }, {});
    return promiseApi;
    function asyncWrapper(fn, git) {
        return function (...args) {
            if (typeof args[args.length] === 'function') {
                throw new TypeError('Promise interface requires that handlers are not supplied inline, ' +
                    'trailing function not allowed in call to ' + fn);
            }
            return chain.then(function () {
                return new Promise(function (resolve, reject) {
                    const callback = (err, result) => {
                        if (err) {
                            return reject(toError(err));
                        }
                        resolve(result);
                    };
                    args.push(callback);
                    git[fn].apply(git, args);
                });
            });
        };
    }
    function syncWrapper(fn, git, api) {
        return (...args) => {
            git[fn](...args);
            return api;
        };
    }
}
exports.gitP = gitP;
function toError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'string') {
        return new Error(error);
    }
    return new gitResponseError.GitResponseError(error);
}

});

const {gitP} = promiseWrapped;
const {esModuleFactory, gitInstanceFactory, gitExportFactory} = gitFactory;

var src = esModuleFactory(
   gitExportFactory(gitInstanceFactory, {gitP})
);

var GitManager = /** @class */ (function () {
    function GitManager(plugin) {
        this.plugin = plugin;
        this.app = plugin.app;
    }
    GitManager.prototype.formatCommitMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var template, status_1, numFiles, status_2, changeset_1, chunks, _i, _a, _b, action, files_1, files, moment, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        template = this.plugin.settings.commitMessage;
                        if (!template.includes("{{numFiles}}")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.status()];
                    case 1:
                        status_1 = _d.sent();
                        numFiles = status_1.changed.length;
                        template = template.replace("{{numFiles}}", String(numFiles));
                        _d.label = 2;
                    case 2:
                        if (!template.includes("{{files}}")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.status()];
                    case 3:
                        status_2 = _d.sent();
                        changeset_1 = {};
                        status_2.changed.forEach(function (value) {
                            if (value.index in changeset_1) {
                                changeset_1[value.index].push(value.path);
                            }
                            else {
                                changeset_1[value.index] = [value.path];
                            }
                        });
                        chunks = [];
                        for (_i = 0, _a = Object.entries(changeset_1); _i < _a.length; _i++) {
                            _b = _a[_i], action = _b[0], files_1 = _b[1];
                            chunks.push(action + " " + files_1.join(" "));
                        }
                        files = chunks.join(", ");
                        template = template.replace("{{files}}", files);
                        _d.label = 4;
                    case 4:
                        moment = window.moment;
                        template = template.replace("{{date}}", moment().format(this.plugin.settings.commitDateFormat));
                        if (!this.plugin.settings.listChangedFilesInMessageBody) return [3 /*break*/, 6];
                        _c = template + "\n\n" + "Affected files:" + "\n";
                        return [4 /*yield*/, this.status()];
                    case 5:
                        template = _c + (_d.sent()).staged.join("\n");
                        _d.label = 6;
                    case 6: return [2 /*return*/, template];
                }
            });
        });
    };
    return GitManager;
}());

var SimpleGit = /** @class */ (function (_super) {
    __extends(SimpleGit, _super);
    function SimpleGit(plugin) {
        var _this = _super.call(this, plugin) || this;
        var adapter = _this.app.vault.adapter;
        var path = adapter.getBasePath();
        if (_this.isGitInstalled()) {
            _this.git = src(path);
        }
        return _this;
    }
    SimpleGit.prototype.status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.setState(PluginState.status);
                        return [4 /*yield*/, this.git.status()];
                    case 1:
                        status = _a.sent();
                        return [2 /*return*/, {
                                changed: status.files,
                                staged: status.staged,
                                conflicted: status.conflicted,
                            }];
                }
            });
        });
    };
    SimpleGit.prototype.commitAll = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!this.plugin.settings.updateSubmodules) return [3 /*break*/, 5];
                        this.plugin.setState(PluginState.commit);
                        _b = (_a = this.git).subModule;
                        _c = ["foreach", "--recursive"];
                        _d = "git add -A && if [ ! -z \"$(git status --porcelain)\" ]; then git commit -m \"";
                        if (!(message !== null && message !== void 0)) return [3 /*break*/, 1];
                        _e = message;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.formatCommitMessage()];
                    case 2:
                        _e = _j.sent();
                        _j.label = 3;
                    case 3: return [4 /*yield*/, _b.apply(_a, [_c.concat([_d + (_e) + "\"; fi"]), function (err) { return _this.onError(err); }])];
                    case 4:
                        _j.sent();
                        _j.label = 5;
                    case 5:
                        this.plugin.setState(PluginState.add);
                        return [4 /*yield*/, this.git.add("./*", function (err) { return _this.onError(err); })];
                    case 6:
                        _j.sent();
                        this.plugin.setState(PluginState.commit);
                        _g = (_f = this.git).commit;
                        if (!(message !== null && message !== void 0)) return [3 /*break*/, 7];
                        _h = message;
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.formatCommitMessage()];
                    case 8:
                        _h = _j.sent();
                        _j.label = 9;
                    case 9: return [4 /*yield*/, _g.apply(_f, [_h])];
                    case 10: return [2 /*return*/, (_j.sent()).summary.changes];
                }
            });
        });
    };
    SimpleGit.prototype.pull = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pullResult;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.setState(PluginState.pull);
                        if (!this.plugin.settings.updateSubmodules) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.git.subModule(["update", "--remote", "--merge", "--recursive"], function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.git.pull(["--no-rebase"], function (err) { return __awaiter(_this, void 0, void 0, function () {
                            var status_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!err) return [3 /*break*/, 2];
                                        this.plugin.displayError("Pull failed " + err.message);
                                        return [4 /*yield*/, this.git.status()];
                                    case 1:
                                        status_1 = _a.sent();
                                        if (status_1.conflicted.length > 0) {
                                            this.plugin.handleConflict(status_1.conflicted);
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 3:
                        pullResult = _a.sent();
                        return [2 /*return*/, pullResult.files.length];
                }
            });
        });
    };
    SimpleGit.prototype.push = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, trackingBranch, currentBranch, remoteChangedFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.plugin.setState(PluginState.status);
                        return [4 /*yield*/, this.git.status()];
                    case 1:
                        status = _a.sent();
                        trackingBranch = status.tracking;
                        currentBranch = status.current;
                        return [4 /*yield*/, this.git.diffSummary([currentBranch, trackingBranch])];
                    case 2:
                        remoteChangedFiles = (_a.sent()).changed;
                        this.plugin.setState(PluginState.push);
                        if (!this.plugin.settings.updateSubmodules) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.git.env(__assign(__assign({}, process.env), { "OBSIDIAN_GIT": 1 })).subModule(["foreach", "--recursive", "tracking=$(git for-each-ref --format='%(upstream:short)' \"$(git symbolic-ref -q HEAD)\"); echo $tracking; if [ ! -z \"$(git diff --shortstat $tracking)\" ]; then git push; fi"], function (err) { return _this.onError(err); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.git.env(__assign(__assign({}, process.env), { "OBSIDIAN_GIT": 1 })).push(function (err) { return _this.onError(err); })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, remoteChangedFiles];
                }
            });
        });
    };
    SimpleGit.prototype.canPush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, trackingBranch, currentBranch, remoteChangedFiles;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // allow pushing in submodules even if the root has no changes.
                        if (this.plugin.settings.updateSubmodules === true) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this.git.status(function (err) { return _this.onError(err); })];
                    case 1:
                        status = _a.sent();
                        trackingBranch = status.tracking;
                        currentBranch = status.current;
                        return [4 /*yield*/, this.git.diffSummary([currentBranch, trackingBranch])];
                    case 2:
                        remoteChangedFiles = (_a.sent()).changed;
                        return [2 /*return*/, remoteChangedFiles !== 0];
                }
            });
        });
    };
    SimpleGit.prototype.checkRequirements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, user, email, remoteURL;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isGitInstalled()) {
                            return [2 /*return*/, "missing-git"];
                        }
                        return [4 /*yield*/, this.git.checkIsRepo()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/, "missing-repo"];
                        }
                        return [4 /*yield*/, this.git.listConfig(function (err) { return _this.onError(err); })];
                    case 2:
                        config = (_a.sent()).all;
                        user = config["user.name"];
                        email = config["user.email"];
                        remoteURL = config["remote.origin.url"];
                        if (!user || !email || !remoteURL) {
                            return [2 /*return*/, "wrong-settings"];
                        }
                        return [2 /*return*/, "valid"];
                }
            });
        });
    };
    SimpleGit.prototype.branchInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, branches;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.status(function (err) { return _this.onError(err); })];
                    case 1:
                        status = _a.sent();
                        return [4 /*yield*/, this.git.branch(["--no-color"], function (err) { return _this.onError(err); })];
                    case 2:
                        branches = _a.sent();
                        return [2 /*return*/, {
                                current: status.current,
                                tracking: status.tracking,
                                branches: branches.all,
                            }];
                }
            });
        });
    };
    SimpleGit.prototype.checkout = function (branch) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.checkout(branch, function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.init(false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.setConfig = function (path, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.addConfig(path, value, function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.getConfig = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.listConfig(function (err) { return _this.onError(err); })];
                    case 1:
                        config = _a.sent();
                        return [2 /*return*/, config.all[path]];
                }
            });
        });
    };
    SimpleGit.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.git.fetch(function (err) { return _this.onError(err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimpleGit.prototype.isGitInstalled = function () {
        // https://github.com/steveukx/git-js/issues/402
        var command = child_process_1.spawnSync('git', ['--version'], {
            stdio: 'ignore'
        });
        if (command.error) {
            console.error(command.error);
            return false;
        }
        return true;
    };
    SimpleGit.prototype.onError = function (error) {
        if (error) {
            this.plugin.displayError(error.message);
        }
    };
    return SimpleGit;
}(GitManager));

var DEFAULT_SETTINGS = {
    commitMessage: "vault backup: {{date}}",
    commitDateFormat: "YYYY-MM-DD HH:mm:ss",
    autoSaveInterval: 0,
    autoPullInterval: 0,
    autoPullOnBoot: false,
    disablePush: false,
    pullBeforePush: true,
    disablePopups: false,
    listChangedFilesInMessageBody: false,
    showStatusBar: true,
    updateSubmodules: false,
};
var ObsidianGit = /** @class */ (function (_super) {
    __extends(ObsidianGit, _super);
    function ObsidianGit() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gitReady = false;
        _this.promiseQueue = new PromiseQueue();
        _this.conflictOutputFile = "conflict-files-obsidian-git.md";
        return _this;
    }
    ObsidianGit.prototype.setState = function (state) {
        var _a;
        this.state = state;
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.display();
    };
    ObsidianGit.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statusBarEl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('loading ' + this.manifest.name + " plugin");
                        return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new ObsidianGitSettingsTab(this.app, this));
                        this.addCommand({
                            id: "pull",
                            name: "Pull from remote repository",
                            callback: function () { return _this.promiseQueue.addTask(function () { return _this.pullChangesFromRemote(); }); },
                        });
                        this.addCommand({
                            id: "push",
                            name: "Commit *all* changes and push to remote repository",
                            callback: function () { return _this.promiseQueue.addTask(function () { return _this.createBackup(false); }); }
                        });
                        this.addCommand({
                            id: "commit-push-specified-message",
                            name: "Commit and push all changes with specified message",
                            callback: function () { return new CustomMessageModal(_this).open(); }
                        });
                        this.addCommand({
                            id: "list-changed-files",
                            name: "List changed files",
                            callback: function () { return __awaiter(_this, void 0, void 0, function () {
                                var status;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.gitManager.status()];
                                        case 1:
                                            status = _a.sent();
                                            new ChangedFilesModal(this, status.changed).open();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                        if (this.settings.showStatusBar) {
                            statusBarEl = this.addStatusBarItem();
                            this.statusBar = new StatusBar(statusBarEl, this);
                            this.registerInterval(window.setInterval(function () { return _this.statusBar.display(); }, 1000));
                        }
                        this.app.workspace.onLayoutReady(function () { return _this.init(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.onunload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                window.clearTimeout(this.timeoutIDBackup);
                window.clearTimeout(this.timeoutIDPull);
                console.log('unloading ' + this.manifest.name + " plugin");
                return [2 /*return*/];
            });
        });
    };
    ObsidianGit.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [{}, DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.saveLastAuto = function (date, mode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (mode === "backup") {
                    window.localStorage.setItem(this.manifest.id + ":lastAutoBackup", date.toString());
                }
                else if (mode === "pull") {
                    window.localStorage.setItem(this.manifest.id + ":lastAutoPull", date.toString());
                }
                return [2 /*return*/];
            });
        });
    };
    ObsidianGit.prototype.loadLastAuto = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, {
                        "backup": new Date((_a = window.localStorage.getItem(this.manifest.id + ":lastAutoBackup")) !== null && _a !== void 0 ? _a : ""),
                        "pull": new Date((_b = window.localStorage.getItem(this.manifest.id + ":lastAutoPull")) !== null && _b !== void 0 ? _b : "")
                    }];
            });
        });
    };
    ObsidianGit.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, lastAutos, now, diff, now, diff, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        this.gitManager = new SimpleGit(this);
                        return [4 /*yield*/, this.gitManager.checkRequirements()];
                    case 1:
                        result = _b.sent();
                        _a = result;
                        switch (_a) {
                            case "missing-git": return [3 /*break*/, 2];
                            case "missing-repo": return [3 /*break*/, 3];
                            case "wrong-settings": return [3 /*break*/, 4];
                            case "valid": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 2:
                        this.displayError("Cannot run git command");
                        return [3 /*break*/, 8];
                    case 3:
                        new obsidian.Notice("Can't find a valid git repository. Please create one");
                        return [3 /*break*/, 8];
                    case 4:
                        this.displayError("Not all of the required configs are set. See README");
                        _b.label = 5;
                    case 5:
                        this.gitReady = true;
                        this.setState(PluginState.idle);
                        if (this.settings.autoPullOnBoot) {
                            this.promiseQueue.addTask(function () { return _this.pullChangesFromRemote(); });
                        }
                        return [4 /*yield*/, this.loadLastAuto()];
                    case 6:
                        lastAutos = _b.sent();
                        if (this.settings.autoSaveInterval > 0) {
                            now = new Date();
                            diff = this.settings.autoSaveInterval - (Math.round(((now.getTime() - lastAutos.backup.getTime()) / 1000) / 60));
                            this.startAutoBackup(diff <= 0 ? 0 : diff);
                        }
                        if (this.settings.autoPullInterval > 0) {
                            now = new Date();
                            diff = this.settings.autoPullInterval - (Math.round(((now.getTime() - lastAutos.pull.getTime()) / 1000) / 60));
                            this.startAutoPull(diff <= 0 ? 0 : diff);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        console.log("Something weird happened. The 'checkRequirements' result is " + result);
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _b.sent();
                        this.displayError(error_1);
                        console.error(error_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.pullChangesFromRemote = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filesUpdated, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.gitReady) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.gitReady)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.gitManager.pull()];
                    case 3:
                        filesUpdated = _a.sent();
                        if (filesUpdated > 0) {
                            this.displayMessage("Pulled new changes. " + filesUpdated + " files updated");
                        }
                        else {
                            this.displayMessage("Everything is up-to-date");
                        }
                        if (!(this.gitManager instanceof SimpleGit)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.gitManager.status()];
                    case 4:
                        status_1 = _a.sent();
                        if (status_1.conflicted.length > 0) {
                            this.displayError("You have " + status_1.conflicted.length + " conflict files");
                        }
                        _a.label = 5;
                    case 5:
                        this.setState(PluginState.idle);
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.createBackup = function (fromAutoBackup, commitMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var file, status_2, changedFiles, commitedFiles, pulledFilesLength, status_3, _a, pushedFiles;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.gitReady) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!this.gitReady)
                            return [2 /*return*/];
                        if (!!fromAutoBackup) return [3 /*break*/, 4];
                        file = this.app.vault.getAbstractFileByPath(this.conflictOutputFile);
                        return [4 /*yield*/, this.app.vault.delete(file)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!(this.gitManager instanceof SimpleGit)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.gitManager.status()];
                    case 5:
                        status_2 = _b.sent();
                        // check for conflict files on auto backup
                        if (fromAutoBackup && status_2.conflicted.length > 0) {
                            this.setState(PluginState.idle);
                            this.displayError("Did not commit, because you have " + status_2.conflicted.length + " conflict files. Please resolve them and commit per command.");
                            this.handleConflict(status_2.conflicted);
                            return [2 /*return*/];
                        }
                        _b.label = 6;
                    case 6: return [4 /*yield*/, this.gitManager.status()];
                    case 7:
                        changedFiles = (_b.sent()).changed;
                        if (!(changedFiles.length !== 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.gitManager.commitAll(commitMessage)];
                    case 8:
                        commitedFiles = _b.sent();
                        this.displayMessage("Committed " + commitedFiles + " files");
                        return [3 /*break*/, 10];
                    case 9:
                        this.displayMessage("No changes to commit");
                        _b.label = 10;
                    case 10:
                        if (!!this.settings.disablePush) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.gitManager.branchInfo()];
                    case 11:
                        if (!(_b.sent()).tracking) {
                            this.displayError("Did not push. No tracking branch is set! Please set one in the settings", 10000);
                            this.setState(PluginState.idle);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.gitManager.canPush()];
                    case 12:
                        if (!_b.sent()) return [3 /*break*/, 20];
                        if (!this.settings.pullBeforePush) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.gitManager.pull()];
                    case 13:
                        pulledFilesLength = _b.sent();
                        if (pulledFilesLength > 0) {
                            this.displayMessage("Pulled " + pulledFilesLength + " files from remote");
                        }
                        _b.label = 14;
                    case 14:
                        _a = this.gitManager instanceof SimpleGit;
                        if (!_a) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.gitManager.status()];
                    case 15:
                        _a = (status_3 = _b.sent()).conflicted.length > 0;
                        _b.label = 16;
                    case 16:
                        if (!_a) return [3 /*break*/, 17];
                        this.displayError("Cannot push. You have " + status_3.conflicted.length + " conflict files");
                        this.handleConflict(status_3.conflicted);
                        return [2 /*return*/];
                    case 17: return [4 /*yield*/, this.gitManager.push()];
                    case 18:
                        pushedFiles = _b.sent();
                        this.displayMessage("Pushed " + pushedFiles + " files to remote");
                        _b.label = 19;
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        this.displayMessage("No changes to push");
                        _b.label = 21;
                    case 21:
                        this.setState(PluginState.idle);
                        return [2 /*return*/];
                }
            });
        });
    };
    ObsidianGit.prototype.startAutoBackup = function (minutes) {
        var _this = this;
        this.timeoutIDBackup = window.setTimeout(function () {
            _this.promiseQueue.addTask(function () { return _this.createBackup(true); });
            _this.saveLastAuto(new Date(), "backup");
            _this.saveSettings();
            _this.startAutoBackup();
        }, (minutes !== null && minutes !== void 0 ? minutes : this.settings.autoSaveInterval) * 60000);
    };
    ObsidianGit.prototype.startAutoPull = function (minutes) {
        var _this = this;
        this.timeoutIDPull = window.setTimeout(function () {
            _this.promiseQueue.addTask(function () { return _this.pullChangesFromRemote(); });
            _this.saveLastAuto(new Date(), "pull");
            _this.saveSettings();
            _this.startAutoPull();
        }, (minutes !== null && minutes !== void 0 ? minutes : this.settings.autoPullInterval) * 60000);
    };
    ObsidianGit.prototype.clearAutoBackup = function () {
        if (this.timeoutIDBackup) {
            window.clearTimeout(this.timeoutIDBackup);
            return true;
        }
        return false;
    };
    ObsidianGit.prototype.clearAutoPull = function () {
        if (this.timeoutIDPull) {
            window.clearTimeout(this.timeoutIDPull);
            return true;
        }
        return false;
    };
    ObsidianGit.prototype.handleConflict = function (conflicted) {
        return __awaiter(this, void 0, void 0, function () {
            var lines;
            var _this = this;
            return __generator(this, function (_a) {
                this.setState(PluginState.conflicted);
                lines = __spreadArray([
                    "# Conflict files",
                    "Please resolve them and commit per command (This file will be deleted before the commit)."
                ], conflicted.map(function (e) {
                    var file = _this.app.vault.getAbstractFileByPath(e);
                    if (file instanceof obsidian.TFile) {
                        var link = _this.app.metadataCache.fileToLinktext(file, "/");
                        return "- [[" + link + "]]";
                    }
                    else {
                        return "- Not a file: " + e;
                    }
                }));
                this.writeAndOpenFile(lines.join("\n"));
                return [2 /*return*/];
            });
        });
    };
    ObsidianGit.prototype.writeAndOpenFile = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var fileIsAlreadyOpened;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.app.vault.adapter.write(this.conflictOutputFile, text)];
                    case 1:
                        _a.sent();
                        fileIsAlreadyOpened = false;
                        this.app.workspace.iterateAllLeaves(function (leaf) {
                            if (leaf.getDisplayText() != "" && _this.conflictOutputFile.startsWith(leaf.getDisplayText())) {
                                fileIsAlreadyOpened = true;
                            }
                        });
                        if (!fileIsAlreadyOpened) {
                            this.app.workspace.openLinkText(this.conflictOutputFile, "/", true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // region: displaying / formatting messages
    ObsidianGit.prototype.displayMessage = function (message, timeout) {
        var _a;
        if (timeout === void 0) { timeout = 4 * 1000; }
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.displayMessage(message.toLowerCase(), timeout);
        if (!this.settings.disablePopups) {
            new obsidian.Notice(message);
        }
        console.log("git obsidian message: " + message);
    };
    ObsidianGit.prototype.displayError = function (message, timeout) {
        var _a;
        if (timeout === void 0) { timeout = 0; }
        new obsidian.Notice(message);
        console.log("git obsidian error: " + message);
        (_a = this.statusBar) === null || _a === void 0 ? void 0 : _a.displayMessage(message.toLowerCase(), timeout);
    };
    return ObsidianGit;
}(obsidian.Plugin));

module.exports = ObsidianGit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9tb2RhbHMvY2hhbmdlZEZpbGVzTW9kYWwudHMiLCJzcmMvbW9kYWxzL2N1c3RvbU1lc3NhZ2VNb2RhbC50cyIsInNyYy9wcm9taXNlUXVldWUudHMiLCJzcmMvc2V0dGluZ3MudHMiLCJzcmMvdHlwZXMudHMiLCJzcmMvc3RhdHVzQmFyLnRzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9lcnJvcnMvZ2l0LWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9lcnJvcnMvZ2l0LXJlc3BvbnNlLWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9lcnJvcnMvZ2l0LWNvbnN0cnVjdC1lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvZXJyb3JzL2dpdC1wbHVnaW4tZXJyb3IuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL2Vycm9ycy90YXNrLWNvbmZpZ3VyYXRpb24tZXJyb3IuanMiLCJub2RlX21vZHVsZXMvbXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGVidWcvc3JjL2NvbW1vbi5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBwb3J0cy1jb2xvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvbm9kZS5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGt3c2l0ZXMvZmlsZS1leGlzdHMvZGlzdC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvQGt3c2l0ZXMvZmlsZS1leGlzdHMvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvYXJndW1lbnQtZmlsdGVycy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvZXhpdC1jb2Rlcy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvZ2l0LW91dHB1dC1zdHJlYW1zLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi91dGlscy9saW5lLXBhcnNlci5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdXRpbHMvc2ltcGxlLWdpdC1vcHRpb25zLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi91dGlscy90YXNrLW9wdGlvbnMuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3V0aWxzL3Rhc2stcGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi91dGlscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY2hlY2staXMtcmVwby5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL0NsZWFuU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY2xlYW4uanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Jlc3BvbnNlcy9Db25maWdMaXN0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9jb25maWcuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL3Jlc2V0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9hcGkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3BsdWdpbnMvY29tbWFuZC1jb25maWctcHJlZml4aW5nLXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9lcnJvci1kZXRlY3Rpb24ucGx1Z2luLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wbHVnaW5zL3BsdWdpbi1zdG9yZS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9wcm9ncmVzcy1tb25pdG9yLXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9zaW1wbGUtZ2l0LXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy9zcGF3bi1vcHRpb25zLXBsdWdpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGx1Z2lucy90aW1vdXQtcGx1Z2luLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wbHVnaW5zL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9naXQtbG9nZ2VyLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9ydW5uZXJzL3Rhc2tzLXBlbmRpbmctcXVldWUuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3J1bm5lcnMvZ2l0LWV4ZWN1dG9yLWNoYWluLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9ydW5uZXJzL2dpdC1leGVjdXRvci5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFzay1jYWxsYmFjay5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY2hhbmdlLXdvcmtpbmctZGlyZWN0b3J5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9oYXNoLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL0luaXRTdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9pbml0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvRGlmZlN1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3BhcnNlcnMvcGFyc2UtZGlmZi1zdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLWxpc3QtbG9nLXN1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2xvZy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL01lcmdlU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL1B1bGxTdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLXJlbW90ZS1vYmplY3RzLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLXJlbW90ZS1tZXNzYWdlcy5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1wdWxsLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLW1lcmdlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9tZXJnZS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1wdXNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9wdXNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvRmlsZVN0YXR1c1N1bW1hcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Jlc3BvbnNlcy9TdGF0dXNTdW1tYXJ5LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9zdGF0dXMuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3NpbXBsZS1naXQtYXBpLmpzIiwibm9kZV9tb2R1bGVzL0Brd3NpdGVzL3Byb21pc2UtZGVmZXJyZWQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcnVubmVycy9zY2hlZHVsZXIuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2FwcGx5LXBhdGNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvQnJhbmNoRGVsZXRlU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1icmFuY2gtZGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvQnJhbmNoU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1icmFuY2guanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2JyYW5jaC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcmVzcG9uc2VzL0NoZWNrSWdub3JlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9jaGVjay1pZ25vcmUuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3Rhc2tzL2Nsb25lLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLWNvbW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvY29tbWl0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9kaWZmLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9wYXJzZXJzL3BhcnNlLWZldGNoLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9mZXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvcGFyc2Vycy9wYXJzZS1tb3ZlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9tb3ZlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9wdWxsLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvR2V0UmVtb3RlU3VtbWFyeS5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvcmVtb3RlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9zdGFzaC1saXN0LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi90YXNrcy9zdWItbW9kdWxlLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2xpYi9yZXNwb25zZXMvVGFnTGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvdGFza3MvdGFnLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2dpdC5qcyIsIm5vZGVfbW9kdWxlcy9zaW1wbGUtZ2l0L3NyYy9saWIvZ2l0LWZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvc2ltcGxlLWdpdC9zcmMvbGliL3J1bm5lcnMvcHJvbWlzZS13cmFwcGVkLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZS1naXQvc3JjL2luZGV4LmpzIiwic3JjL2dpdE1hbmFnZXIudHMiLCJzcmMvc2ltcGxlR2l0LnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBmcm9tKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7IEZ1enp5U3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgT2JzaWRpYW5HaXQgZnJvbSBcInNyYy9tYWluXCI7XG5pbXBvcnQgeyBGaWxlU3RhdHVzUmVzdWx0IH0gZnJvbSBcInNyYy90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgQ2hhbmdlZEZpbGVzTW9kYWwgZXh0ZW5kcyBGdXp6eVN1Z2dlc3RNb2RhbDxGaWxlU3RhdHVzUmVzdWx0PiB7XG4gICAgcGx1Z2luOiBPYnNpZGlhbkdpdDtcbiAgICBjaGFuZ2VkRmlsZXM6IEZpbGVTdGF0dXNSZXN1bHRbXTtcblxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogT2JzaWRpYW5HaXQsIGNoYW5nZWRGaWxlczogRmlsZVN0YXR1c1Jlc3VsdFtdKSB7XG4gICAgICAgIHN1cGVyKHBsdWdpbi5hcHApO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5jaGFuZ2VkRmlsZXMgPSBjaGFuZ2VkRmlsZXM7XG4gICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoXCJOb3Qgc3VwcG9ydGVkIGZpbGVzIHdpbGwgYmUgb3BlbmVkIGJ5IGRlZmF1bHQgYXBwIVwiKTtcbiAgICB9XG5cbiAgICBnZXRJdGVtcygpOiBGaWxlU3RhdHVzUmVzdWx0W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2VkRmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogRmlsZVN0YXR1c1Jlc3VsdCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpdGVtLmluZGV4ID09IFwiP1wiICYmIGl0ZW0ud29ya2luZ19kaXIgPT0gXCI/XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgVW50cmFja2VkIHwgJHtpdGVtLnBhdGh9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3b3JraW5nX2RpciA9IFwiXCI7XG4gICAgICAgIGxldCBpbmRleCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKGl0ZW0ud29ya2luZ19kaXIgIT0gXCIgXCIpIHdvcmtpbmdfZGlyID0gYFdvcmtpbmcgZGlyOiAke2l0ZW0ud29ya2luZ19kaXJ9IGA7XG4gICAgICAgIGlmIChpdGVtLmluZGV4ICE9IFwiIFwiKSBpbmRleCA9IGBJbmRleDogJHtpdGVtLmluZGV4fWA7XG5cbiAgICAgICAgcmV0dXJuIGAke3dvcmtpbmdfZGlyfSR7aW5kZXh9IHwgJHtpdGVtLnBhdGh9YDtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogRmlsZVN0YXR1c1Jlc3VsdCwgXzogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGl0ZW0ucGF0aCwgXCJcIikgPT0gbnVsbCkge1xuICAgICAgICAgICAgKHRoaXMuYXBwIGFzIGFueSkub3BlbldpdGhEZWZhdWx0QXBwKGl0ZW0ucGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dChpdGVtLnBhdGgsIFwiL1wiKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBTdWdnZXN0TW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBPYnNpZGlhbkdpdCBmcm9tIFwic3JjL21haW5cIjtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbU1lc3NhZ2VNb2RhbCBleHRlbmRzIFN1Z2dlc3RNb2RhbDxzdHJpbmc+IHtcbiAgICBwbHVnaW46IE9ic2lkaWFuR2l0O1xuXG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBPYnNpZGlhbkdpdCkge1xuICAgICAgICBzdXBlcihwbHVnaW4uYXBwKTtcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoXCJUeXBlIHlvdXIgbWVzc2FnZSBhbmQgc2VsZWN0IG9wdGlvbmFsIHRoZSB2ZXJzaW9uIHdpdGggdGhlIGFkZGVkIGRhdGUuXCIpO1xuICAgIH1cblxuXG4gICAgZ2V0U3VnZ2VzdGlvbnMocXVlcnk6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9ICh3aW5kb3cgYXMgYW55KS5tb21lbnQoKS5mb3JtYXQodGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWl0RGF0ZUZvcm1hdCk7XG4gICAgICAgIGlmIChxdWVyeSA9PSBcIlwiKSBxdWVyeSA9IFwiLi4uXCI7XG4gICAgICAgIHJldHVybiBbcXVlcnksIGAke2RhdGV9OiAke3F1ZXJ5fWAsIGAke3F1ZXJ5fTogJHtkYXRlfWBdO1xuICAgIH1cblxuICAgIHJlbmRlclN1Z2dlc3Rpb24odmFsdWU6IHN0cmluZywgZWw6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIG9uQ2hvb3NlU3VnZ2VzdGlvbihpdGVtOiBzdHJpbmcsIF86IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMucGx1Z2luLnByb21pc2VRdWV1ZS5hZGRUYXNrKCgpID0+IHRoaXMucGx1Z2luLmNyZWF0ZUJhY2t1cChmYWxzZSwgaXRlbSkpO1xuICAgIH1cblxufSIsIlxuZXhwb3J0IGNsYXNzIFByb21pc2VRdWV1ZSB7XG4gICAgdGFza3M6ICgoKSA9PiBQcm9taXNlPGFueT4pW10gPSBbXTtcblxuICAgIGFkZFRhc2sodGFzazogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gICAgICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgaWYgKHRoaXMudGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVRhc2soKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBoYW5kbGVUYXNrKCkge1xuICAgICAgICBpZiAodGhpcy50YXNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnRhc2tzWzBdKCkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVGFzaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgTm90aWNlLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgT2JzaWRpYW5HaXQgZnJvbSBcIi4vbWFpblwiO1xuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5HaXRTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGxldCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBwbHVnaW46IE9ic2lkaWFuR2l0ID0gKHRoaXMgYXMgYW55KS5wbHVnaW47XG5cbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiR2l0IEJhY2t1cCBzZXR0aW5nc1wiIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJWYXVsdCBiYWNrdXAgaW50ZXJ2YWwgKG1pbnV0ZXMpXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIkNvbW1pdCBhbmQgcHVzaCBjaGFuZ2VzIGV2ZXJ5IFggbWludXRlcy4gVG8gZGlzYWJsZSBhdXRvbWF0aWMgYmFja3VwLCBzcGVjaWZ5IG5lZ2F0aXZlIHZhbHVlIG9yIHplcm8gKGRlZmF1bHQpXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKFN0cmluZyhwbHVnaW4uc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbCkpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4oTnVtYmVyKHZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbCA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5zZXR0aW5ncy5hdXRvU2F2ZUludGVydmFsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uY2xlYXJBdXRvQmFja3VwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zdGFydEF1dG9CYWNrdXAocGx1Z2luLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYEF1dG9tYXRpYyBiYWNrdXAgZW5hYmxlZCEgRXZlcnkgJHtwbHVnaW4uc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbH0gbWludXRlcy5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmF1dG9TYXZlSW50ZXJ2YWwgPD0gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4udGltZW91dElEQmFja3VwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5jbGVhckF1dG9CYWNrdXAoKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIkF1dG9tYXRpYyBiYWNrdXAgZGlzYWJsZWQhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlBsZWFzZSBzcGVjaWZ5IGEgdmFsaWQgbnVtYmVyLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJBdXRvIHB1bGwgaW50ZXJ2YWwgKG1pbnV0ZXMpXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICBcIlB1bGwgY2hhbmdlcyBldmVyeSBYIG1pbnV0ZXMuIFRvIGRpc2FibGUgYXV0b21hdGljIHB1bGwsIHNwZWNpZnkgbmVnYXRpdmUgdmFsdWUgb3IgemVybyAoZGVmYXVsdClcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoU3RyaW5nKHBsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbEludGVydmFsKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihOdW1iZXIodmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbEludGVydmFsID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGx1Z2luLnNldHRpbmdzLmF1dG9QdWxsSW50ZXJ2YWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5jbGVhckF1dG9QdWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zdGFydEF1dG9QdWxsKHBsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbEludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBBdXRvbWF0aWMgcHVsbCBlbmFibGVkISBFdmVyeSAke3BsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbEludGVydmFsfSBtaW51dGVzLmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCA8PSAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi50aW1lb3V0SURQdWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5jbGVhckF1dG9QdWxsKCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJBdXRvbWF0aWMgcHVsbCBkaXNhYmxlZCFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiUGxlYXNlIHNwZWNpZnkgYSB2YWxpZCBudW1iZXIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQ29tbWl0IG1lc3NhZ2VcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIFwiU3BlY2lmeSBjdXN0b20gY29tbWl0IG1lc3NhZ2UuIEF2YWlsYWJsZSBwbGFjZWhvbGRlcnM6IHt7ZGF0ZX19XCIgK1xuICAgICAgICAgICAgICAgIFwiIChzZWUgYmVsb3cpIGFuZCB7e251bUZpbGVzfX0gKG51bWJlciBvZiBjaGFuZ2VkIGZpbGVzIGluIHRoZSBjb21taXQpXCJcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKFwidmF1bHQgYmFja3VwXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jb21taXRNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBwbHVnaW4uc2V0dGluZ3MuY29tbWl0TWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5jb21taXRNZXNzYWdlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJ7e2RhdGV9fSBwbGFjZWhvbGRlciBmb3JtYXRcIilcbiAgICAgICAgICAgIC5zZXREZXNjKCdTcGVjaWZ5IGN1c3RvbSBkYXRlIGZvcm1hdC4gRS5nLiBcIllZWVktTU0tREQgSEg6bW06c3NcIicpXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihwbHVnaW4uc2V0dGluZ3MuY29tbWl0RGF0ZUZvcm1hdClcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5jb21taXREYXRlRm9ybWF0KVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2V0dGluZ3MuY29tbWl0RGF0ZUZvcm1hdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiUHJldmlldyBjb21taXQgbWVzc2FnZVwiKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uKSA9PlxuICAgICAgICAgICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KFwiUHJldmlld1wiKS5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbW1pdE1lc3NhZ2VQcmV2aWV3ID0gYXdhaXQgcGx1Z2luLmdpdE1hbmFnZXIuZm9ybWF0Q29tbWl0TWVzc2FnZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGAke2NvbW1pdE1lc3NhZ2VQcmV2aWV3fWApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJMaXN0IGZpbGVuYW1lcyBhZmZlY3RlZCBieSBjb21taXQgaW4gdGhlIGNvbW1pdCBib2R5XCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MubGlzdENoYW5nZWRGaWxlc0luTWVzc2FnZUJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5saXN0Q2hhbmdlZEZpbGVzSW5NZXNzYWdlQm9keSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiQ3VycmVudCBicmFuY2hcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFwiU3dpdGNoIHRvIGEgZGlmZmVyZW50IGJyYW5jaFwiKVxuICAgICAgICAgICAgLmFkZERyb3Bkb3duKGFzeW5jIChkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJyYW5jaEluZm8gPSBhd2FpdCBwbHVnaW4uZ2l0TWFuYWdlci5icmFuY2hJbmZvKCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBicmFuY2ggb2YgYnJhbmNoSW5mby5icmFuY2hlcykge1xuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oYnJhbmNoLCBicmFuY2gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZShicmFuY2hJbmZvLmN1cnJlbnQpO1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLm9uQ2hhbmdlKGFzeW5jIChvcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgcGx1Z2luLmdpdE1hbmFnZXIuY2hlY2tvdXQob3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShgQ2hlY2tlZCBvdXQgdG8gJHtvcHRpb259YCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiUHVsbCB1cGRhdGVzIG9uIHN0YXJ0dXBcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFwiQXV0b21hdGljYWxseSBwdWxsIHVwZGF0ZXMgd2hlbiBPYnNpZGlhbiBzdGFydHNcIilcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5hdXRvUHVsbE9uQm9vdClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmF1dG9QdWxsT25Cb290ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJEaXNhYmxlIHB1c2hcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFwiRG8gbm90IHB1c2ggY2hhbmdlcyB0byB0aGUgcmVtb3RlIHJlcG9zaXRvcnlcIilcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlUHVzaClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLmRpc2FibGVQdXNoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJQdWxsIGNoYW5nZXMgYmVmb3JlIHB1c2hcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFwiQ29tbWl0IC0+IHB1bGwgLT4gcHVzaCAoT25seSBpZiBwdXNoaW5nIGlzIGVuYWJsZWQpXCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MucHVsbEJlZm9yZVB1c2gpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5wdWxsQmVmb3JlUHVzaCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiVXBkYXRlIHN1Ym1vZHVsZXNcIilcbiAgICAgICAgICAgIC5zZXREZXNjKCdcIkNyZWF0ZSBiYWNrdXBcIiBhbmQgXCJwdWxsXCIgdGFrZXMgY2FyZSBvZiBzdWJtb2R1bGVzLiBNaXNzaW5nIGZlYXR1cmVzOiBDb25mbGljdGVkIGZpbGVzLCBjb3VudCBvZiBwdWxsZWQvcHVzaGVkL2NvbW1pdHRlZCBmaWxlcy4gVHJhY2tpbmcgYnJhbmNoIG5lZWRzIHRvIGJlIHNldCBmb3IgZWFjaCBzdWJtb2R1bGUnKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLnVwZGF0ZVN1Ym1vZHVsZXMpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy51cGRhdGVTdWJtb2R1bGVzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJEaXNhYmxlIG5vdGlmaWNhdGlvbnNcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIFwiRGlzYWJsZSBub3RpZmljYXRpb25zIGZvciBnaXQgb3BlcmF0aW9ucyB0byBtaW5pbWl6ZSBkaXN0cmFjdGlvbiAocmVmZXIgdG8gc3RhdHVzIGJhciBmb3IgdXBkYXRlcylcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmRpc2FibGVQb3B1cHMpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlUG9wdXBzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJTaG93IHN0YXR1cyBiYXJcIilcbiAgICAgICAgICAgIC5zZXREZXNjKFwiT2JzaWRpYW4gbXVzdCBiZSByZXN0YXJ0ZWQgZm9yIHRoZSBjaGFuZ2VzIHRvIHRha2UgYWZmZWN0XCIpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3Muc2hvd1N0YXR1c0JhcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnNob3dTdGF0dXNCYXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgfVxufSIsImV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5HaXRTZXR0aW5ncyB7XG4gICAgY29tbWl0TWVzc2FnZTogc3RyaW5nO1xuICAgIGNvbW1pdERhdGVGb3JtYXQ6IHN0cmluZztcbiAgICBhdXRvU2F2ZUludGVydmFsOiBudW1iZXI7XG4gICAgYXV0b1B1bGxJbnRlcnZhbDogbnVtYmVyO1xuICAgIGF1dG9QdWxsT25Cb290OiBib29sZWFuO1xuICAgIGRpc2FibGVQdXNoOiBib29sZWFuO1xuICAgIHB1bGxCZWZvcmVQdXNoOiBib29sZWFuO1xuICAgIGRpc2FibGVQb3B1cHM6IGJvb2xlYW47XG4gICAgbGlzdENoYW5nZWRGaWxlc0luTWVzc2FnZUJvZHk6IGJvb2xlYW47XG4gICAgc3RhbmRhbG9uZU1vZGU6IGJvb2xlYW47XG4gICAgcHJveHlVUkw6IHN0cmluZztcbiAgICBzaG93U3RhdHVzQmFyOiBib29sZWFuO1xuICAgIGxhc3RBdXRvQmFja1VwOiBzdHJpbmc7XG4gICAgbGFzdEF1dG9QdWxsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aG9yIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZW1haWw6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdHVzIHtcbiAgICBjaGFuZ2VkOiBGaWxlU3RhdHVzUmVzdWx0W107XG4gICAgc3RhZ2VkOiBzdHJpbmdbXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZVN0YXR1c1Jlc3VsdCB7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIGluZGV4OiBzdHJpbmc7XG4gICAgd29ya2luZ19kaXI6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRGlmZlJlc3VsdCB7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIHR5cGU6IFwiZXF1YWxcIiB8IFwibW9kaWZ5XCIgfCBcImFkZFwiIHwgXCJyZW1vdmVcIjtcbn1cblxuZXhwb3J0IGVudW0gUGx1Z2luU3RhdGUge1xuICAgIGlkbGUsXG4gICAgc3RhdHVzLFxuICAgIHB1bGwsXG4gICAgYWRkLFxuICAgIGNvbW1pdCxcbiAgICBwdXNoLFxuICAgIGNvbmZsaWN0ZWQsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnJhbmNoSW5mbyB7XG4gICAgY3VycmVudDogc3RyaW5nO1xuICAgIHRyYWNraW5nOiBzdHJpbmc7XG4gICAgYnJhbmNoZXM6IHN0cmluZ1tdO1xufSIsImltcG9ydCBPYnNpZGlhbkdpdCBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBQbHVnaW5TdGF0ZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmludGVyZmFjZSBTdGF0dXNCYXJNZXNzYWdlIHtcbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgdGltZW91dDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdHVzQmFyIHtcbiAgICBwdWJsaWMgbWVzc2FnZXM6IFN0YXR1c0Jhck1lc3NhZ2VbXSA9IFtdO1xuICAgIHB1YmxpYyBjdXJyZW50TWVzc2FnZTogU3RhdHVzQmFyTWVzc2FnZTtcbiAgICBwdWJsaWMgbGFzdE1lc3NhZ2VUaW1lc3RhbXA6IG51bWJlcjtcblxuICAgIHByaXZhdGUgc3RhdHVzQmFyRWw6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgcGx1Z2luOiBPYnNpZGlhbkdpdDtcblxuICAgIGNvbnN0cnVjdG9yKHN0YXR1c0JhckVsOiBIVE1MRWxlbWVudCwgcGx1Z2luOiBPYnNpZGlhbkdpdCkge1xuICAgICAgICB0aGlzLnN0YXR1c0JhckVsID0gc3RhdHVzQmFyRWw7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIHB1YmxpYyBkaXNwbGF5TWVzc2FnZShtZXNzYWdlOiBzdHJpbmcsIHRpbWVvdXQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgbWVzc2FnZTogYGdpdDogJHttZXNzYWdlLnNsaWNlKDAsIDEwMCl9YCxcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGlzcGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZXMubGVuZ3RoID4gMCAmJiAhdGhpcy5jdXJyZW50TWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSA9IHRoaXMubWVzc2FnZXMuc2hpZnQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyRWwuc2V0VGV4dCh0aGlzLmN1cnJlbnRNZXNzYWdlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5sYXN0TWVzc2FnZVRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZUFnZSA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RNZXNzYWdlVGltZXN0YW1wO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VBZ2UgPj0gdGhpcy5jdXJyZW50TWVzc2FnZS50aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0TWVzc2FnZVRpbWVzdGFtcCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaXNwbGF5U3RhdGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5wbHVnaW4uc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGx1Z2luU3RhdGUuaWRsZTpcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGcm9tTm93KHRoaXMucGx1Z2luLmxhc3RVcGRhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQbHVnaW5TdGF0ZS5zdGF0dXM6XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KFwiZ2l0OiBjaGVja2luZyByZXBvIHN0YXR1cy4uLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUGx1Z2luU3RhdGUuYWRkOlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyRWwuc2V0VGV4dChcImdpdDogYWRkaW5nIGZpbGVzIHRvIHJlcG8uLi5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsdWdpblN0YXRlLmNvbW1pdDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoXCJnaXQ6IGNvbW1pdHRpbmcgY2hhbmdlcy4uLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUGx1Z2luU3RhdGUucHVzaDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoXCJnaXQ6IHB1c2hpbmcgY2hhbmdlcy4uLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUGx1Z2luU3RhdGUucHVsbDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoXCJnaXQ6IHB1bGxpbmcgY2hhbmdlcy4uLlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUGx1Z2luU3RhdGUuY29uZmxpY3RlZDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoXCJnaXQ6IHlvdSBoYXZlIGNvbmZsaWN0IGZpbGVzLi4uXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoXCJnaXQ6IGZhaWxlZCBvbiBpbml0aWFsaXphdGlvbiFcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRpc3BsYXlGcm9tTm93KHRpbWVzdGFtcDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aW1lc3RhbXApIHtcbiAgICAgICAgICAgIGxldCBtb21lbnQgPSAod2luZG93IGFzIGFueSkubW9tZW50O1xuICAgICAgICAgICAgbGV0IGZyb21Ob3cgPSBtb21lbnQodGltZXN0YW1wKS5mcm9tTm93KCk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0JhckVsLnNldFRleHQoYGdpdDogbGFzdCB1cGRhdGUgJHtmcm9tTm93fWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXNCYXJFbC5zZXRUZXh0KGBnaXQ6IHJlYWR5YCk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdEVycm9yID0gdm9pZCAwO1xuLyoqXG4gKiBUaGUgYEdpdEVycm9yYCBpcyB0aHJvd24gd2hlbiB0aGUgdW5kZXJseWluZyBgZ2l0YCBwcm9jZXNzIHRocm93cyBhXG4gKiBmYXRhbCBleGNlcHRpb24gKGVnIGFuIGBFTk9FTlRgIGV4Y2VwdGlvbiB3aGVuIGF0dGVtcHRpbmcgdG8gdXNlIGFcbiAqIG5vbi13cml0YWJsZSBkaXJlY3RvcnkgYXMgdGhlIHJvb3QgZm9yIHlvdXIgcmVwbyksIGFuZCBhY3RzIGFzIHRoZVxuICogYmFzZSBjbGFzcyBmb3IgbW9yZSBzcGVjaWZpYyBlcnJvcnMgdGhyb3duIGJ5IHRoZSBwYXJzaW5nIG9mIHRoZVxuICogZ2l0IHJlc3BvbnNlIG9yIGVycm9ycyBpbiB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgdGFzayBhYm91dCB0b1xuICogYmUgcnVuLlxuICpcbiAqIFdoZW4gYW4gZXhjZXB0aW9uIGlzIHRocm93biwgcGVuZGluZyB0YXNrcyBpbiB0aGUgc2FtZSBpbnN0YW5jZSB3aWxsXG4gKiBub3QgYmUgZXhlY3V0ZWQuIFRoZSByZWNvbW1lbmRlZCB3YXkgdG8gcnVuIGEgc2VyaWVzIG9mIHRhc2tzIHRoYXRcbiAqIGNhbiBpbmRlcGVuZGVudGx5IGZhaWwgd2l0aG91dCBuZWVkaW5nIHRvIHByZXZlbnQgZnV0dXJlIHRhc2tzIGZyb21cbiAqIHJ1bm5pbmcgaXMgdG8gY2F0Y2ggdGhlbSBpbmRpdmlkdWFsbHk6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuIGltcG9ydCB7IGdpdFAsIFNpbXBsZUdpdCwgR2l0RXJyb3IsIFB1bGxSZXN1bHQgfSBmcm9tICdzaW1wbGUtZ2l0JztcblxuIGZ1bmN0aW9uIGNhdGNoVGFzayAoZTogR2l0RXJyb3IpIHtcbiAgIHJldHVybiBlLlxuIH1cblxuIGNvbnN0IGdpdCA9IGdpdFAocmVwb1dvcmtpbmdEaXIpO1xuIGNvbnN0IHB1bGxlZDogUHVsbFJlc3VsdCB8IEdpdEVycm9yID0gYXdhaXQgZ2l0LnB1bGwoKS5jYXRjaChjYXRjaFRhc2spO1xuIGNvbnN0IHB1c2hlZDogc3RyaW5nIHwgR2l0RXJyb3IgPSBhd2FpdCBnaXQucHVzaFRhZ3MoKS5jYXRjaChjYXRjaFRhc2spO1xuIGBgYFxuICovXG5jbGFzcyBHaXRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXNrLCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnRhc2sgPSB0YXNrO1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3LnRhcmdldC5wcm90b3R5cGUpO1xuICAgIH1cbn1cbmV4cG9ydHMuR2l0RXJyb3IgPSBHaXRFcnJvcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1lcnJvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0UmVzcG9uc2VFcnJvciA9IHZvaWQgMDtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4vZ2l0LWVycm9yXCIpO1xuLyoqXG4gKiBUaGUgYEdpdFJlc3BvbnNlRXJyb3JgIGlzIHRoZSB3cmFwcGVyIGZvciBhIHBhcnNlZCByZXNwb25zZSB0aGF0IGlzIHRyZWF0ZWQgYXNcbiAqIGEgZmF0YWwgZXJyb3IsIGZvciBleGFtcGxlIGF0dGVtcHRpbmcgYSBgbWVyZ2VgIGNhbiBsZWF2ZSB0aGUgcmVwbyBpbiBhIGNvcnJ1cHRlZFxuICogc3RhdGUgd2hlbiB0aGVyZSBhcmUgY29uZmxpY3RzIHNvIHRoZSB0YXNrIHdpbGwgcmVqZWN0IHJhdGhlciB0aGFuIHJlc29sdmUuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNhdGNoaW5nIHRoZSBtZXJnZSBjb25mbGljdCBleGNlcHRpb246XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuIGltcG9ydCB7IGdpdFAsIFNpbXBsZUdpdCwgR2l0UmVzcG9uc2VFcnJvciwgTWVyZ2VTdW1tYXJ5IH0gZnJvbSAnc2ltcGxlLWdpdCc7XG5cbiBjb25zdCBnaXQgPSBnaXRQKHJlcG9Sb290KTtcbiBjb25zdCBtZXJnZU9wdGlvbnM6IHN0cmluZ1tdID0gWyctLW5vLWZmJywgJ290aGVyLWJyYW5jaCddO1xuIGNvbnN0IG1lcmdlU3VtbWFyeTogTWVyZ2VTdW1tYXJ5ID0gYXdhaXQgZ2l0Lm1lcmdlKG1lcmdlT3B0aW9ucylcbiAgICAgIC5jYXRjaCgoZTogR2l0UmVzcG9uc2VFcnJvcjxNZXJnZVN1bW1hcnk+KSA9PiBlLmdpdCk7XG5cbiBpZiAobWVyZ2VTdW1tYXJ5LmZhaWxlZCkge1xuICAgLy8gZGVhbCB3aXRoIHRoZSBlcnJvclxuIH1cbiBgYGBcbiAqL1xuY2xhc3MgR2l0UmVzcG9uc2VFcnJvciBleHRlbmRzIGdpdF9lcnJvcl8xLkdpdEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvKipcbiAgICAgKiBgLmdpdGAgYWNjZXNzIHRoZSBwYXJzZWQgcmVzcG9uc2UgdGhhdCBpcyB0cmVhdGVkIGFzIGJlaW5nIGFuIGVycm9yXG4gICAgICovXG4gICAgZ2l0LCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKHVuZGVmaW5lZCwgbWVzc2FnZSB8fCBTdHJpbmcoZ2l0KSk7XG4gICAgICAgIHRoaXMuZ2l0ID0gZ2l0O1xuICAgIH1cbn1cbmV4cG9ydHMuR2l0UmVzcG9uc2VFcnJvciA9IEdpdFJlc3BvbnNlRXJyb3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtcmVzcG9uc2UtZXJyb3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdENvbnN0cnVjdEVycm9yID0gdm9pZCAwO1xuY29uc3QgZ2l0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi9naXQtZXJyb3JcIik7XG4vKipcbiAqIFRoZSBgR2l0Q29uc3RydWN0RXJyb3JgIGlzIHRocm93biB3aGVuIGFuIGVycm9yIG9jY3VycyBpbiB0aGUgY29uc3RydWN0b3JcbiAqIG9mIHRoZSBgc2ltcGxlLWdpdGAgaW5zdGFuY2UgaXRzZWxmLiBNb3N0IGNvbW1vbmx5IGFzIGEgcmVzdWx0IG9mIHVzaW5nXG4gKiBhIGBiYXNlRGlyYCBvcHRpb24gdGhhdCBwb2ludHMgdG8gYSBmb2xkZXIgdGhhdCBlaXRoZXIgZG9lcyBub3QgZXhpc3QsXG4gKiBvciBjYW5ub3QgYmUgcmVhZCBieSB0aGUgdXNlciB0aGUgbm9kZSBzY3JpcHQgaXMgcnVubmluZyBhcy5cbiAqXG4gKiBDaGVjayB0aGUgYC5tZXNzYWdlYCBwcm9wZXJ0eSBmb3IgbW9yZSBkZXRhaWwgaW5jbHVkaW5nIHRoZSBwcm9wZXJ0aWVzXG4gKiBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICovXG5jbGFzcyBHaXRDb25zdHJ1Y3RFcnJvciBleHRlbmRzIGdpdF9lcnJvcl8xLkdpdEVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcsIG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIodW5kZWZpbmVkLCBtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxufVxuZXhwb3J0cy5HaXRDb25zdHJ1Y3RFcnJvciA9IEdpdENvbnN0cnVjdEVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2l0LWNvbnN0cnVjdC1lcnJvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0UGx1Z2luRXJyb3IgPSB2b2lkIDA7XG5jb25zdCBnaXRfZXJyb3JfMSA9IHJlcXVpcmUoXCIuL2dpdC1lcnJvclwiKTtcbmNsYXNzIEdpdFBsdWdpbkVycm9yIGV4dGVuZHMgZ2l0X2Vycm9yXzEuR2l0RXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHRhc2ssIHBsdWdpbiwgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcih0YXNrLCBtZXNzYWdlKTtcbiAgICAgICAgdGhpcy50YXNrID0gdGFzaztcbiAgICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcudGFyZ2V0LnByb3RvdHlwZSk7XG4gICAgfVxufVxuZXhwb3J0cy5HaXRQbHVnaW5FcnJvciA9IEdpdFBsdWdpbkVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2l0LXBsdWdpbi1lcnJvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVGFza0NvbmZpZ3VyYXRpb25FcnJvciA9IHZvaWQgMDtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4vZ2l0LWVycm9yXCIpO1xuLyoqXG4gKiBUaGUgYFRhc2tDb25maWd1cmF0aW9uRXJyb3JgIGlzIHRocm93biB3aGVuIGEgY29tbWFuZCB3YXMgaW5jb3JyZWN0bHlcbiAqIGNvbmZpZ3VyZWQuIEFuIGVycm9yIG9mIHRoaXMga2luZCBtZWFucyB0aGF0IG5vIGF0dGVtcHQgd2FzIG1hZGUgdG9cbiAqIHJ1biB5b3VyIGNvbW1hbmQgdGhyb3VnaCB0aGUgdW5kZXJseWluZyBgZ2l0YCBiaW5hcnkuXG4gKlxuICogQ2hlY2sgdGhlIGAubWVzc2FnZWAgcHJvcGVydHkgZm9yIG1vcmUgZGV0YWlsIG9uIHdoeSB5b3VyIGNvbmZpZ3VyYXRpb25cbiAqIHJlc3VsdGVkIGluIGFuIGVycm9yLlxuICovXG5jbGFzcyBUYXNrQ29uZmlndXJhdGlvbkVycm9yIGV4dGVuZHMgZ2l0X2Vycm9yXzEuR2l0RXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIodW5kZWZpbmVkLCBtZXNzYWdlKTtcbiAgICB9XG59XG5leHBvcnRzLlRhc2tDb25maWd1cmF0aW9uRXJyb3IgPSBUYXNrQ29uZmlndXJhdGlvbkVycm9yO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFzay1jb25maWd1cmF0aW9uLWVycm9yLmpzLm1hcCIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHRocm93cyB7RXJyb3J9IHRocm93IGFuIGVycm9yIGlmIHZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsO1xuICBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgdmFsLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcGFyc2UodmFsKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigtPyg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8d2Vla3M/fHd8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ3dlZWtzJzpcbiAgICBjYXNlICd3ZWVrJzpcbiAgICBjYXNlICd3JzpcbiAgICAgIHJldHVybiBuICogdztcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXNBYnMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zQWJzID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgaWYgKG1zQWJzID49IGQpIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBoKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIGgsICdob3VyJyk7XG4gIH1cbiAgaWYgKG1zQWJzID49IG0pIHtcbiAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgbSwgJ21pbnV0ZScpO1xuICB9XG4gIGlmIChtc0FicyA+PSBzKSB7XG4gICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgfVxuICByZXR1cm4gbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG1zQWJzLCBuLCBuYW1lKSB7XG4gIHZhciBpc1BsdXJhbCA9IG1zQWJzID49IG4gKiAxLjU7XG4gIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKi9cblxuZnVuY3Rpb24gc2V0dXAoZW52KSB7XG5cdGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWc7XG5cdGNyZWF0ZURlYnVnLmRlZmF1bHQgPSBjcmVhdGVEZWJ1Zztcblx0Y3JlYXRlRGVidWcuY29lcmNlID0gY29lcmNlO1xuXHRjcmVhdGVEZWJ1Zy5kaXNhYmxlID0gZGlzYWJsZTtcblx0Y3JlYXRlRGVidWcuZW5hYmxlID0gZW5hYmxlO1xuXHRjcmVhdGVEZWJ1Zy5lbmFibGVkID0gZW5hYmxlZDtcblx0Y3JlYXRlRGVidWcuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXHRjcmVhdGVEZWJ1Zy5kZXN0cm95ID0gZGVzdHJveTtcblxuXHRPYmplY3Qua2V5cyhlbnYpLmZvckVhY2goa2V5ID0+IHtcblx0XHRjcmVhdGVEZWJ1Z1trZXldID0gZW52W2tleV07XG5cdH0pO1xuXG5cdC8qKlxuXHQqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuXHQqL1xuXG5cdGNyZWF0ZURlYnVnLm5hbWVzID0gW107XG5cdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0LyoqXG5cdCogTWFwIG9mIHNwZWNpYWwgXCIlblwiIGhhbmRsaW5nIGZ1bmN0aW9ucywgZm9yIHRoZSBkZWJ1ZyBcImZvcm1hdFwiIGFyZ3VtZW50LlxuXHQqXG5cdCogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuXHQqL1xuXHRjcmVhdGVEZWJ1Zy5mb3JtYXR0ZXJzID0ge307XG5cblx0LyoqXG5cdCogU2VsZWN0cyBhIGNvbG9yIGZvciBhIGRlYnVnIG5hbWVzcGFjZVxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2UgVGhlIG5hbWVzcGFjZSBzdHJpbmcgZm9yIHRoZSBmb3IgdGhlIGRlYnVnIGluc3RhbmNlIHRvIGJlIGNvbG9yZWRcblx0KiBAcmV0dXJuIHtOdW1iZXJ8U3RyaW5nfSBBbiBBTlNJIGNvbG9yIGNvZGUgZm9yIHRoZSBnaXZlbiBuYW1lc3BhY2Vcblx0KiBAYXBpIHByaXZhdGVcblx0Ki9cblx0ZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG5cdFx0bGV0IGhhc2ggPSAwO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lc3BhY2UubGVuZ3RoOyBpKyspIHtcblx0XHRcdGhhc2ggPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIG5hbWVzcGFjZS5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0aGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcblx0XHR9XG5cblx0XHRyZXR1cm4gY3JlYXRlRGVidWcuY29sb3JzW01hdGguYWJzKGhhc2gpICUgY3JlYXRlRGVidWcuY29sb3JzLmxlbmd0aF07XG5cdH1cblx0Y3JlYXRlRGVidWcuc2VsZWN0Q29sb3IgPSBzZWxlY3RDb2xvcjtcblxuXHQvKipcblx0KiBDcmVhdGUgYSBkZWJ1Z2dlciB3aXRoIHRoZSBnaXZlbiBgbmFtZXNwYWNlYC5cblx0KlxuXHQqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2Vcblx0KiBAcmV0dXJuIHtGdW5jdGlvbn1cblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcblx0XHRsZXQgcHJldlRpbWU7XG5cdFx0bGV0IGVuYWJsZU92ZXJyaWRlID0gbnVsbDtcblx0XHRsZXQgbmFtZXNwYWNlc0NhY2hlO1xuXHRcdGxldCBlbmFibGVkQ2FjaGU7XG5cblx0XHRmdW5jdGlvbiBkZWJ1ZyguLi5hcmdzKSB7XG5cdFx0XHQvLyBEaXNhYmxlZD9cblx0XHRcdGlmICghZGVidWcuZW5hYmxlZCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNlbGYgPSBkZWJ1ZztcblxuXHRcdFx0Ly8gU2V0IGBkaWZmYCB0aW1lc3RhbXBcblx0XHRcdGNvbnN0IGN1cnIgPSBOdW1iZXIobmV3IERhdGUoKSk7XG5cdFx0XHRjb25zdCBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG5cdFx0XHRzZWxmLmRpZmYgPSBtcztcblx0XHRcdHNlbGYucHJldiA9IHByZXZUaW1lO1xuXHRcdFx0c2VsZi5jdXJyID0gY3Vycjtcblx0XHRcdHByZXZUaW1lID0gY3VycjtcblxuXHRcdFx0YXJnc1swXSA9IGNyZWF0ZURlYnVnLmNvZXJjZShhcmdzWzBdKTtcblxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzWzBdICE9PSAnc3RyaW5nJykge1xuXHRcdFx0XHQvLyBBbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlT1xuXHRcdFx0XHRhcmdzLnVuc2hpZnQoJyVPJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG5cdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0YXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16QS1aJV0pL2csIChtYXRjaCwgZm9ybWF0KSA9PiB7XG5cdFx0XHRcdC8vIElmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcblx0XHRcdFx0aWYgKG1hdGNoID09PSAnJSUnKSB7XG5cdFx0XHRcdFx0cmV0dXJuICclJztcblx0XHRcdFx0fVxuXHRcdFx0XHRpbmRleCsrO1xuXHRcdFx0XHRjb25zdCBmb3JtYXR0ZXIgPSBjcmVhdGVEZWJ1Zy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG5cdFx0XHRcdGlmICh0eXBlb2YgZm9ybWF0dGVyID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsID0gYXJnc1tpbmRleF07XG5cdFx0XHRcdFx0bWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG5cdFx0XHRcdFx0Ly8gTm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuXHRcdFx0XHRcdGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0XHRpbmRleC0tO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBtYXRjaDtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBBcHBseSBlbnYtc3BlY2lmaWMgZm9ybWF0dGluZyAoY29sb3JzLCBldGMuKVxuXHRcdFx0Y3JlYXRlRGVidWcuZm9ybWF0QXJncy5jYWxsKHNlbGYsIGFyZ3MpO1xuXG5cdFx0XHRjb25zdCBsb2dGbiA9IHNlbGYubG9nIHx8IGNyZWF0ZURlYnVnLmxvZztcblx0XHRcdGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXHRcdH1cblxuXHRcdGRlYnVnLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcblx0XHRkZWJ1Zy51c2VDb2xvcnMgPSBjcmVhdGVEZWJ1Zy51c2VDb2xvcnMoKTtcblx0XHRkZWJ1Zy5jb2xvciA9IGNyZWF0ZURlYnVnLnNlbGVjdENvbG9yKG5hbWVzcGFjZSk7XG5cdFx0ZGVidWcuZXh0ZW5kID0gZXh0ZW5kO1xuXHRcdGRlYnVnLmRlc3Ryb3kgPSBjcmVhdGVEZWJ1Zy5kZXN0cm95OyAvLyBYWFggVGVtcG9yYXJ5LiBXaWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZWJ1ZywgJ2VuYWJsZWQnLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcblx0XHRcdGdldDogKCkgPT4ge1xuXHRcdFx0XHRpZiAoZW5hYmxlT3ZlcnJpZGUgIT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gZW5hYmxlT3ZlcnJpZGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5hbWVzcGFjZXNDYWNoZSAhPT0gY3JlYXRlRGVidWcubmFtZXNwYWNlcykge1xuXHRcdFx0XHRcdG5hbWVzcGFjZXNDYWNoZSA9IGNyZWF0ZURlYnVnLm5hbWVzcGFjZXM7XG5cdFx0XHRcdFx0ZW5hYmxlZENhY2hlID0gY3JlYXRlRGVidWcuZW5hYmxlZChuYW1lc3BhY2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGVuYWJsZWRDYWNoZTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IHYgPT4ge1xuXHRcdFx0XHRlbmFibGVPdmVycmlkZSA9IHY7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBFbnYtc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGRlYnVnIGluc3RhbmNlc1xuXHRcdGlmICh0eXBlb2YgY3JlYXRlRGVidWcuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y3JlYXRlRGVidWcuaW5pdChkZWJ1Zyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlYnVnO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXh0ZW5kKG5hbWVzcGFjZSwgZGVsaW1pdGVyKSB7XG5cdFx0Y29uc3QgbmV3RGVidWcgPSBjcmVhdGVEZWJ1Zyh0aGlzLm5hbWVzcGFjZSArICh0eXBlb2YgZGVsaW1pdGVyID09PSAndW5kZWZpbmVkJyA/ICc6JyA6IGRlbGltaXRlcikgKyBuYW1lc3BhY2UpO1xuXHRcdG5ld0RlYnVnLmxvZyA9IHRoaXMubG9nO1xuXHRcdHJldHVybiBuZXdEZWJ1Zztcblx0fVxuXG5cdC8qKlxuXHQqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcblx0KiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuXHRcdGNyZWF0ZURlYnVnLnNhdmUobmFtZXNwYWNlcyk7XG5cdFx0Y3JlYXRlRGVidWcubmFtZXNwYWNlcyA9IG5hbWVzcGFjZXM7XG5cblx0XHRjcmVhdGVEZWJ1Zy5uYW1lcyA9IFtdO1xuXHRcdGNyZWF0ZURlYnVnLnNraXBzID0gW107XG5cblx0XHRsZXQgaTtcblx0XHRjb25zdCBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpLnNwbGl0KC9bXFxzLF0rLyk7XG5cdFx0Y29uc3QgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoIXNwbGl0W2ldKSB7XG5cdFx0XHRcdC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcblxuXHRcdFx0aWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuXHRcdFx0XHRjcmVhdGVEZWJ1Zy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyZWF0ZURlYnVnLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG5cdCpcblx0KiBAcmV0dXJuIHtTdHJpbmd9IG5hbWVzcGFjZXNcblx0KiBAYXBpIHB1YmxpY1xuXHQqL1xuXHRmdW5jdGlvbiBkaXNhYmxlKCkge1xuXHRcdGNvbnN0IG5hbWVzcGFjZXMgPSBbXG5cdFx0XHQuLi5jcmVhdGVEZWJ1Zy5uYW1lcy5tYXAodG9OYW1lc3BhY2UpLFxuXHRcdFx0Li4uY3JlYXRlRGVidWcuc2tpcHMubWFwKHRvTmFtZXNwYWNlKS5tYXAobmFtZXNwYWNlID0+ICctJyArIG5hbWVzcGFjZSlcblx0XHRdLmpvaW4oJywnKTtcblx0XHRjcmVhdGVEZWJ1Zy5lbmFibGUoJycpO1xuXHRcdHJldHVybiBuYW1lc3BhY2VzO1xuXHR9XG5cblx0LyoqXG5cdCogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuXHQqXG5cdCogQHBhcmFtIHtTdHJpbmd9IG5hbWVcblx0KiBAcmV0dXJuIHtCb29sZWFufVxuXHQqIEBhcGkgcHVibGljXG5cdCovXG5cdGZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuXHRcdGlmIChuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0bGV0IGk7XG5cdFx0bGV0IGxlbjtcblxuXHRcdGZvciAoaSA9IDAsIGxlbiA9IGNyZWF0ZURlYnVnLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoY3JlYXRlRGVidWcuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgbGVuID0gY3JlYXRlRGVidWcubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChjcmVhdGVEZWJ1Zy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQqIENvbnZlcnQgcmVnZXhwIHRvIG5hbWVzcGFjZVxuXHQqXG5cdCogQHBhcmFtIHtSZWdFeHB9IHJlZ3hlcFxuXHQqIEByZXR1cm4ge1N0cmluZ30gbmFtZXNwYWNlXG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIHRvTmFtZXNwYWNlKHJlZ2V4cCkge1xuXHRcdHJldHVybiByZWdleHAudG9TdHJpbmcoKVxuXHRcdFx0LnN1YnN0cmluZygyLCByZWdleHAudG9TdHJpbmcoKS5sZW5ndGggLSAyKVxuXHRcdFx0LnJlcGxhY2UoL1xcLlxcKlxcPyQvLCAnKicpO1xuXHR9XG5cblx0LyoqXG5cdCogQ29lcmNlIGB2YWxgLlxuXHQqXG5cdCogQHBhcmFtIHtNaXhlZH0gdmFsXG5cdCogQHJldHVybiB7TWl4ZWR9XG5cdCogQGFwaSBwcml2YXRlXG5cdCovXG5cdGZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcblx0XHRpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHtcblx0XHRcdHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG5cdFx0fVxuXHRcdHJldHVybiB2YWw7XG5cdH1cblxuXHQvKipcblx0KiBYWFggRE8gTk9UIFVTRS4gVGhpcyBpcyBhIHRlbXBvcmFyeSBzdHViIGZ1bmN0aW9uLlxuXHQqIFhYWCBJdCBXSUxMIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgcmVsZWFzZS5cblx0Ki9cblx0ZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRjb25zb2xlLndhcm4oJ0luc3RhbmNlIG1ldGhvZCBgZGVidWcuZGVzdHJveSgpYCBpcyBkZXByZWNhdGVkIGFuZCBubyBsb25nZXIgZG9lcyBhbnl0aGluZy4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gb2YgYGRlYnVnYC4nKTtcblx0fVxuXG5cdGNyZWF0ZURlYnVnLmVuYWJsZShjcmVhdGVEZWJ1Zy5sb2FkKCkpO1xuXG5cdHJldHVybiBjcmVhdGVEZWJ1Zztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cDtcbiIsIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9IGxvY2Fsc3RvcmFnZSgpO1xuZXhwb3J0cy5kZXN0cm95ID0gKCgpID0+IHtcblx0bGV0IHdhcm5lZCA9IGZhbHNlO1xuXG5cdHJldHVybiAoKSA9PiB7XG5cdFx0aWYgKCF3YXJuZWQpIHtcblx0XHRcdHdhcm5lZCA9IHRydWU7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0luc3RhbmNlIG1ldGhvZCBgZGVidWcuZGVzdHJveSgpYCBpcyBkZXByZWNhdGVkIGFuZCBubyBsb25nZXIgZG9lcyBhbnl0aGluZy4gSXQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24gb2YgYGRlYnVnYC4nKTtcblx0XHR9XG5cdH07XG59KSgpO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFtcblx0JyMwMDAwQ0MnLFxuXHQnIzAwMDBGRicsXG5cdCcjMDAzM0NDJyxcblx0JyMwMDMzRkYnLFxuXHQnIzAwNjZDQycsXG5cdCcjMDA2NkZGJyxcblx0JyMwMDk5Q0MnLFxuXHQnIzAwOTlGRicsXG5cdCcjMDBDQzAwJyxcblx0JyMwMENDMzMnLFxuXHQnIzAwQ0M2NicsXG5cdCcjMDBDQzk5Jyxcblx0JyMwMENDQ0MnLFxuXHQnIzAwQ0NGRicsXG5cdCcjMzMwMENDJyxcblx0JyMzMzAwRkYnLFxuXHQnIzMzMzNDQycsXG5cdCcjMzMzM0ZGJyxcblx0JyMzMzY2Q0MnLFxuXHQnIzMzNjZGRicsXG5cdCcjMzM5OUNDJyxcblx0JyMzMzk5RkYnLFxuXHQnIzMzQ0MwMCcsXG5cdCcjMzNDQzMzJyxcblx0JyMzM0NDNjYnLFxuXHQnIzMzQ0M5OScsXG5cdCcjMzNDQ0NDJyxcblx0JyMzM0NDRkYnLFxuXHQnIzY2MDBDQycsXG5cdCcjNjYwMEZGJyxcblx0JyM2NjMzQ0MnLFxuXHQnIzY2MzNGRicsXG5cdCcjNjZDQzAwJyxcblx0JyM2NkNDMzMnLFxuXHQnIzk5MDBDQycsXG5cdCcjOTkwMEZGJyxcblx0JyM5OTMzQ0MnLFxuXHQnIzk5MzNGRicsXG5cdCcjOTlDQzAwJyxcblx0JyM5OUNDMzMnLFxuXHQnI0NDMDAwMCcsXG5cdCcjQ0MwMDMzJyxcblx0JyNDQzAwNjYnLFxuXHQnI0NDMDA5OScsXG5cdCcjQ0MwMENDJyxcblx0JyNDQzAwRkYnLFxuXHQnI0NDMzMwMCcsXG5cdCcjQ0MzMzMzJyxcblx0JyNDQzMzNjYnLFxuXHQnI0NDMzM5OScsXG5cdCcjQ0MzM0NDJyxcblx0JyNDQzMzRkYnLFxuXHQnI0NDNjYwMCcsXG5cdCcjQ0M2NjMzJyxcblx0JyNDQzk5MDAnLFxuXHQnI0NDOTkzMycsXG5cdCcjQ0NDQzAwJyxcblx0JyNDQ0NDMzMnLFxuXHQnI0ZGMDAwMCcsXG5cdCcjRkYwMDMzJyxcblx0JyNGRjAwNjYnLFxuXHQnI0ZGMDA5OScsXG5cdCcjRkYwMENDJyxcblx0JyNGRjAwRkYnLFxuXHQnI0ZGMzMwMCcsXG5cdCcjRkYzMzMzJyxcblx0JyNGRjMzNjYnLFxuXHQnI0ZGMzM5OScsXG5cdCcjRkYzM0NDJyxcblx0JyNGRjMzRkYnLFxuXHQnI0ZGNjYwMCcsXG5cdCcjRkY2NjMzJyxcblx0JyNGRjk5MDAnLFxuXHQnI0ZGOTkzMycsXG5cdCcjRkZDQzAwJyxcblx0JyNGRkNDMzMnXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG5cdC8vIE5COiBJbiBhbiBFbGVjdHJvbiBwcmVsb2FkIHNjcmlwdCwgZG9jdW1lbnQgd2lsbCBiZSBkZWZpbmVkIGJ1dCBub3QgZnVsbHlcblx0Ly8gaW5pdGlhbGl6ZWQuIFNpbmNlIHdlIGtub3cgd2UncmUgaW4gQ2hyb21lLCB3ZSdsbCBqdXN0IGRldGVjdCB0aGlzIGNhc2Vcblx0Ly8gZXhwbGljaXRseVxuXHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnByb2Nlc3MgJiYgKHdpbmRvdy5wcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicgfHwgd2luZG93LnByb2Nlc3MuX19ud2pzKSkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0Ly8gSW50ZXJuZXQgRXhwbG9yZXIgYW5kIEVkZ2UgZG8gbm90IHN1cHBvcnQgY29sb3JzLlxuXHRpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goLyhlZGdlfHRyaWRlbnQpXFwvKFxcZCspLykpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBJcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuXHQvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuXHRyZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcblx0XHQvLyBJcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG5cdFx0KHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcblx0XHQvLyBJcyBmaXJlZm94ID49IHYzMT9cblx0XHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcblx0XHQodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcblx0XHQvLyBEb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG5cdFx0KHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcblx0YXJnc1swXSA9ICh0aGlzLnVzZUNvbG9ycyA/ICclYycgOiAnJykgK1xuXHRcdHRoaXMubmFtZXNwYWNlICtcblx0XHQodGhpcy51c2VDb2xvcnMgPyAnICVjJyA6ICcgJykgK1xuXHRcdGFyZ3NbMF0gK1xuXHRcdCh0aGlzLnVzZUNvbG9ycyA/ICclYyAnIDogJyAnKSArXG5cdFx0JysnICsgbW9kdWxlLmV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuXHRpZiAoIXRoaXMudXNlQ29sb3JzKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgYyA9ICdjb2xvcjogJyArIHRoaXMuY29sb3I7XG5cdGFyZ3Muc3BsaWNlKDEsIDAsIGMsICdjb2xvcjogaW5oZXJpdCcpO1xuXG5cdC8vIFRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG5cdC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cblx0Ly8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG5cdGxldCBpbmRleCA9IDA7XG5cdGxldCBsYXN0QyA9IDA7XG5cdGFyZ3NbMF0ucmVwbGFjZSgvJVthLXpBLVolXS9nLCBtYXRjaCA9PiB7XG5cdFx0aWYgKG1hdGNoID09PSAnJSUnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGluZGV4Kys7XG5cdFx0aWYgKG1hdGNoID09PSAnJWMnKSB7XG5cdFx0XHQvLyBXZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcblx0XHRcdC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG5cdFx0XHRsYXN0QyA9IGluZGV4O1xuXHRcdH1cblx0fSk7XG5cblx0YXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUuZGVidWcoKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmRlYnVnYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKiBJZiBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGF2YWlsYWJsZSwgZmFsbHMgYmFja1xuICogdG8gYGNvbnNvbGUubG9nYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnRzLmxvZyA9IGNvbnNvbGUuZGVidWcgfHwgY29uc29sZS5sb2cgfHwgKCgpID0+IHt9KTtcblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuXHR0cnkge1xuXHRcdGlmIChuYW1lc3BhY2VzKSB7XG5cdFx0XHRleHBvcnRzLnN0b3JhZ2Uuc2V0SXRlbSgnZGVidWcnLCBuYW1lc3BhY2VzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXhwb3J0cy5zdG9yYWdlLnJlbW92ZUl0ZW0oJ2RlYnVnJyk7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIFN3YWxsb3dcblx0XHQvLyBYWFggKEBRaXgtKSBzaG91bGQgd2UgYmUgbG9nZ2luZyB0aGVzZT9cblx0fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBsb2FkKCkge1xuXHRsZXQgcjtcblx0dHJ5IHtcblx0XHRyID0gZXhwb3J0cy5zdG9yYWdlLmdldEl0ZW0oJ2RlYnVnJyk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Ly8gU3dhbGxvd1xuXHRcdC8vIFhYWCAoQFFpeC0pIHNob3VsZCB3ZSBiZSBsb2dnaW5nIHRoZXNlP1xuXHR9XG5cblx0Ly8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuXHRpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcblx0XHRyID0gcHJvY2Vzcy5lbnYuREVCVUc7XG5cdH1cblxuXHRyZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKSB7XG5cdHRyeSB7XG5cdFx0Ly8gVFZNTEtpdCAoQXBwbGUgVFYgSlMgUnVudGltZSkgZG9lcyBub3QgaGF2ZSBhIHdpbmRvdyBvYmplY3QsIGp1c3QgbG9jYWxTdG9yYWdlIGluIHRoZSBnbG9iYWwgY29udGV4dFxuXHRcdC8vIFRoZSBCcm93c2VyIGFsc28gaGFzIGxvY2FsU3RvcmFnZSBpbiB0aGUgZ2xvYmFsIGNvbnRleHQuXG5cdFx0cmV0dXJuIGxvY2FsU3RvcmFnZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHQvLyBTd2FsbG93XG5cdFx0Ly8gWFhYIChAUWl4LSkgc2hvdWxkIHdlIGJlIGxvZ2dpbmcgdGhlc2U/XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbW1vbicpKGV4cG9ydHMpO1xuXG5jb25zdCB7Zm9ybWF0dGVyc30gPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZm9ybWF0dGVycy5qID0gZnVuY3Rpb24gKHYpIHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuICdbVW5leHBlY3RlZEpTT05QYXJzZUVycm9yXTogJyArIGVycm9yLm1lc3NhZ2U7XG5cdH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZsYWcsIGFyZ3YgPSBwcm9jZXNzLmFyZ3YpID0+IHtcblx0Y29uc3QgcHJlZml4ID0gZmxhZy5zdGFydHNXaXRoKCctJykgPyAnJyA6IChmbGFnLmxlbmd0aCA9PT0gMSA/ICctJyA6ICctLScpO1xuXHRjb25zdCBwb3NpdGlvbiA9IGFyZ3YuaW5kZXhPZihwcmVmaXggKyBmbGFnKTtcblx0Y29uc3QgdGVybWluYXRvclBvc2l0aW9uID0gYXJndi5pbmRleE9mKCctLScpO1xuXHRyZXR1cm4gcG9zaXRpb24gIT09IC0xICYmICh0ZXJtaW5hdG9yUG9zaXRpb24gPT09IC0xIHx8IHBvc2l0aW9uIDwgdGVybWluYXRvclBvc2l0aW9uKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5jb25zdCB0dHkgPSByZXF1aXJlKCd0dHknKTtcbmNvbnN0IGhhc0ZsYWcgPSByZXF1aXJlKCdoYXMtZmxhZycpO1xuXG5jb25zdCB7ZW52fSA9IHByb2Nlc3M7XG5cbmxldCBmb3JjZUNvbG9yO1xuaWYgKGhhc0ZsYWcoJ25vLWNvbG9yJykgfHxcblx0aGFzRmxhZygnbm8tY29sb3JzJykgfHxcblx0aGFzRmxhZygnY29sb3I9ZmFsc2UnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1uZXZlcicpKSB7XG5cdGZvcmNlQ29sb3IgPSAwO1xufSBlbHNlIGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPXRydWUnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRmb3JjZUNvbG9yID0gMTtcbn1cblxuaWYgKCdGT1JDRV9DT0xPUicgaW4gZW52KSB7XG5cdGlmIChlbnYuRk9SQ0VfQ09MT1IgPT09ICd0cnVlJykge1xuXHRcdGZvcmNlQ29sb3IgPSAxO1xuXHR9IGVsc2UgaWYgKGVudi5GT1JDRV9DT0xPUiA9PT0gJ2ZhbHNlJykge1xuXHRcdGZvcmNlQ29sb3IgPSAwO1xuXHR9IGVsc2Uge1xuXHRcdGZvcmNlQ29sb3IgPSBlbnYuRk9SQ0VfQ09MT1IubGVuZ3RoID09PSAwID8gMSA6IE1hdGgubWluKHBhcnNlSW50KGVudi5GT1JDRV9DT0xPUiwgMTApLCAzKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFuc2xhdGVMZXZlbChsZXZlbCkge1xuXHRpZiAobGV2ZWwgPT09IDApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGxldmVsLFxuXHRcdGhhc0Jhc2ljOiB0cnVlLFxuXHRcdGhhczI1NjogbGV2ZWwgPj0gMixcblx0XHRoYXMxNm06IGxldmVsID49IDNcblx0fTtcbn1cblxuZnVuY3Rpb24gc3VwcG9ydHNDb2xvcihoYXZlU3RyZWFtLCBzdHJlYW1Jc1RUWSkge1xuXHRpZiAoZm9yY2VDb2xvciA9PT0gMCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZnVsbCcpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZWNvbG9yJykpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0yNTYnKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKGhhdmVTdHJlYW0gJiYgIXN0cmVhbUlzVFRZICYmIGZvcmNlQ29sb3IgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0Y29uc3QgbWluID0gZm9yY2VDb2xvciB8fCAwO1xuXG5cdGlmIChlbnYuVEVSTSA9PT0gJ2R1bWInKSB7XG5cdFx0cmV0dXJuIG1pbjtcblx0fVxuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0Ly8gV2luZG93cyAxMCBidWlsZCAxMDU4NiBpcyB0aGUgZmlyc3QgV2luZG93cyByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMjU2IGNvbG9ycy5cblx0XHQvLyBXaW5kb3dzIDEwIGJ1aWxkIDE0OTMxIGlzIHRoZSBmaXJzdCByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMTZtL1RydWVDb2xvci5cblx0XHRjb25zdCBvc1JlbGVhc2UgPSBvcy5yZWxlYXNlKCkuc3BsaXQoJy4nKTtcblx0XHRpZiAoXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzBdKSA+PSAxMCAmJlxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODZcblx0XHQpIHtcblx0XHRcdHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDSScgaW4gZW52KSB7XG5cdFx0aWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSScsICdHSVRIVUJfQUNUSU9OUycsICdCVUlMREtJVEUnXS5zb21lKHNpZ24gPT4gc2lnbiBpbiBlbnYpIHx8IGVudi5DSV9OQU1FID09PSAnY29kZXNoaXAnKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbWluO1xuXHR9XG5cblx0aWYgKCdURUFNQ0lUWV9WRVJTSU9OJyBpbiBlbnYpIHtcblx0XHRyZXR1cm4gL14oOVxcLigwKlsxLTldXFxkKilcXC58XFxkezIsfVxcLikvLnRlc3QoZW52LlRFQU1DSVRZX1ZFUlNJT04pID8gMSA6IDA7XG5cdH1cblxuXHRpZiAoZW52LkNPTE9SVEVSTSA9PT0gJ3RydWVjb2xvcicpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmICgnVEVSTV9QUk9HUkFNJyBpbiBlbnYpIHtcblx0XHRjb25zdCB2ZXJzaW9uID0gcGFyc2VJbnQoKGVudi5URVJNX1BST0dSQU1fVkVSU0lPTiB8fCAnJykuc3BsaXQoJy4nKVswXSwgMTApO1xuXG5cdFx0c3dpdGNoIChlbnYuVEVSTV9QUk9HUkFNKSB7XG5cdFx0XHRjYXNlICdpVGVybS5hcHAnOlxuXHRcdFx0XHRyZXR1cm4gdmVyc2lvbiA+PSAzID8gMyA6IDI7XG5cdFx0XHRjYXNlICdBcHBsZV9UZXJtaW5hbCc6XG5cdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0Ly8gTm8gZGVmYXVsdFxuXHRcdH1cblx0fVxuXG5cdGlmICgvLTI1Nihjb2xvcik/JC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDI7XG5cdH1cblxuXHRpZiAoL15zY3JlZW58Xnh0ZXJtfF52dDEwMHxednQyMjB8XnJ4dnR8Y29sb3J8YW5zaXxjeWd3aW58bGludXgvaS50ZXN0KGVudi5URVJNKSkge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDT0xPUlRFUk0nIGluIGVudikge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0cmV0dXJuIG1pbjtcbn1cblxuZnVuY3Rpb24gZ2V0U3VwcG9ydExldmVsKHN0cmVhbSkge1xuXHRjb25zdCBsZXZlbCA9IHN1cHBvcnRzQ29sb3Ioc3RyZWFtLCBzdHJlYW0gJiYgc3RyZWFtLmlzVFRZKTtcblx0cmV0dXJuIHRyYW5zbGF0ZUxldmVsKGxldmVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN1cHBvcnRzQ29sb3I6IGdldFN1cHBvcnRMZXZlbCxcblx0c3Rkb3V0OiB0cmFuc2xhdGVMZXZlbChzdXBwb3J0c0NvbG9yKHRydWUsIHR0eS5pc2F0dHkoMSkpKSxcblx0c3RkZXJyOiB0cmFuc2xhdGVMZXZlbChzdXBwb3J0c0NvbG9yKHRydWUsIHR0eS5pc2F0dHkoMikpKVxufTtcbiIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG5jb25zdCB0dHkgPSByZXF1aXJlKCd0dHknKTtcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgTm9kZS5qcyBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKi9cblxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLmRlc3Ryb3kgPSB1dGlsLmRlcHJlY2F0ZShcblx0KCkgPT4ge30sXG5cdCdJbnN0YW5jZSBtZXRob2QgYGRlYnVnLmRlc3Ryb3koKWAgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGRvZXMgYW55dGhpbmcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uIG9mIGBkZWJ1Z2AuJ1xuKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbNiwgMiwgMywgNCwgNSwgMV07XG5cbnRyeSB7XG5cdC8vIE9wdGlvbmFsIGRlcGVuZGVuY3kgKGFzIGluLCBkb2Vzbid0IG5lZWQgdG8gYmUgaW5zdGFsbGVkLCBOT1QgbGlrZSBvcHRpb25hbERlcGVuZGVuY2llcyBpbiBwYWNrYWdlLmpzb24pXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblx0Y29uc3Qgc3VwcG9ydHNDb2xvciA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG5cblx0aWYgKHN1cHBvcnRzQ29sb3IgJiYgKHN1cHBvcnRzQ29sb3Iuc3RkZXJyIHx8IHN1cHBvcnRzQ29sb3IpLmxldmVsID49IDIpIHtcblx0XHRleHBvcnRzLmNvbG9ycyA9IFtcblx0XHRcdDIwLFxuXHRcdFx0MjEsXG5cdFx0XHQyNixcblx0XHRcdDI3LFxuXHRcdFx0MzIsXG5cdFx0XHQzMyxcblx0XHRcdDM4LFxuXHRcdFx0MzksXG5cdFx0XHQ0MCxcblx0XHRcdDQxLFxuXHRcdFx0NDIsXG5cdFx0XHQ0Myxcblx0XHRcdDQ0LFxuXHRcdFx0NDUsXG5cdFx0XHQ1Nixcblx0XHRcdDU3LFxuXHRcdFx0NjIsXG5cdFx0XHQ2Myxcblx0XHRcdDY4LFxuXHRcdFx0NjksXG5cdFx0XHQ3NCxcblx0XHRcdDc1LFxuXHRcdFx0NzYsXG5cdFx0XHQ3Nyxcblx0XHRcdDc4LFxuXHRcdFx0NzksXG5cdFx0XHQ4MCxcblx0XHRcdDgxLFxuXHRcdFx0OTIsXG5cdFx0XHQ5Myxcblx0XHRcdDk4LFxuXHRcdFx0OTksXG5cdFx0XHQxMTIsXG5cdFx0XHQxMTMsXG5cdFx0XHQxMjgsXG5cdFx0XHQxMjksXG5cdFx0XHQxMzQsXG5cdFx0XHQxMzUsXG5cdFx0XHQxNDgsXG5cdFx0XHQxNDksXG5cdFx0XHQxNjAsXG5cdFx0XHQxNjEsXG5cdFx0XHQxNjIsXG5cdFx0XHQxNjMsXG5cdFx0XHQxNjQsXG5cdFx0XHQxNjUsXG5cdFx0XHQxNjYsXG5cdFx0XHQxNjcsXG5cdFx0XHQxNjgsXG5cdFx0XHQxNjksXG5cdFx0XHQxNzAsXG5cdFx0XHQxNzEsXG5cdFx0XHQxNzIsXG5cdFx0XHQxNzMsXG5cdFx0XHQxNzgsXG5cdFx0XHQxNzksXG5cdFx0XHQxODQsXG5cdFx0XHQxODUsXG5cdFx0XHQxOTYsXG5cdFx0XHQxOTcsXG5cdFx0XHQxOTgsXG5cdFx0XHQxOTksXG5cdFx0XHQyMDAsXG5cdFx0XHQyMDEsXG5cdFx0XHQyMDIsXG5cdFx0XHQyMDMsXG5cdFx0XHQyMDQsXG5cdFx0XHQyMDUsXG5cdFx0XHQyMDYsXG5cdFx0XHQyMDcsXG5cdFx0XHQyMDgsXG5cdFx0XHQyMDksXG5cdFx0XHQyMTQsXG5cdFx0XHQyMTUsXG5cdFx0XHQyMjAsXG5cdFx0XHQyMjFcblx0XHRdO1xuXHR9XG59IGNhdGNoIChlcnJvcikge1xuXHQvLyBTd2FsbG93IC0gd2Ugb25seSBjYXJlIGlmIGBzdXBwb3J0cy1jb2xvcmAgaXMgYXZhaWxhYmxlOyBpdCBkb2Vzbid0IGhhdmUgdG8gYmUuXG59XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIGRlZmF1bHQgYGluc3BlY3RPcHRzYCBvYmplY3QgZnJvbSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICpcbiAqICAgJCBERUJVR19DT0xPUlM9bm8gREVCVUdfREVQVEg9MTAgREVCVUdfU0hPV19ISURERU49ZW5hYmxlZCBub2RlIHNjcmlwdC5qc1xuICovXG5cbmV4cG9ydHMuaW5zcGVjdE9wdHMgPSBPYmplY3Qua2V5cyhwcm9jZXNzLmVudikuZmlsdGVyKGtleSA9PiB7XG5cdHJldHVybiAvXmRlYnVnXy9pLnRlc3Qoa2V5KTtcbn0pLnJlZHVjZSgob2JqLCBrZXkpID0+IHtcblx0Ly8gQ2FtZWwtY2FzZVxuXHRjb25zdCBwcm9wID0ga2V5XG5cdFx0LnN1YnN0cmluZyg2KVxuXHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0LnJlcGxhY2UoL18oW2Etel0pL2csIChfLCBrKSA9PiB7XG5cdFx0XHRyZXR1cm4gay50b1VwcGVyQ2FzZSgpO1xuXHRcdH0pO1xuXG5cdC8vIENvZXJjZSBzdHJpbmcgdmFsdWUgaW50byBKUyB2YWx1ZVxuXHRsZXQgdmFsID0gcHJvY2Vzcy5lbnZba2V5XTtcblx0aWYgKC9eKHllc3xvbnx0cnVlfGVuYWJsZWQpJC9pLnRlc3QodmFsKSkge1xuXHRcdHZhbCA9IHRydWU7XG5cdH0gZWxzZSBpZiAoL14obm98b2ZmfGZhbHNlfGRpc2FibGVkKSQvaS50ZXN0KHZhbCkpIHtcblx0XHR2YWwgPSBmYWxzZTtcblx0fSBlbHNlIGlmICh2YWwgPT09ICdudWxsJykge1xuXHRcdHZhbCA9IG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0dmFsID0gTnVtYmVyKHZhbCk7XG5cdH1cblxuXHRvYmpbcHJvcF0gPSB2YWw7XG5cdHJldHVybiBvYmo7XG59LCB7fSk7XG5cbi8qKlxuICogSXMgc3Rkb3V0IGEgVFRZPyBDb2xvcmVkIG91dHB1dCBpcyBlbmFibGVkIHdoZW4gYHRydWVgLlxuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcblx0cmV0dXJuICdjb2xvcnMnIGluIGV4cG9ydHMuaW5zcGVjdE9wdHMgP1xuXHRcdEJvb2xlYW4oZXhwb3J0cy5pbnNwZWN0T3B0cy5jb2xvcnMpIDpcblx0XHR0dHkuaXNhdHR5KHByb2Nlc3Muc3RkZXJyLmZkKTtcbn1cblxuLyoqXG4gKiBBZGRzIEFOU0kgY29sb3IgZXNjYXBlIGNvZGVzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcblx0Y29uc3Qge25hbWVzcGFjZTogbmFtZSwgdXNlQ29sb3JzfSA9IHRoaXM7XG5cblx0aWYgKHVzZUNvbG9ycykge1xuXHRcdGNvbnN0IGMgPSB0aGlzLmNvbG9yO1xuXHRcdGNvbnN0IGNvbG9yQ29kZSA9ICdcXHUwMDFCWzMnICsgKGMgPCA4ID8gYyA6ICc4OzU7JyArIGMpO1xuXHRcdGNvbnN0IHByZWZpeCA9IGAgICR7Y29sb3JDb2RlfTsxbSR7bmFtZX0gXFx1MDAxQlswbWA7XG5cblx0XHRhcmdzWzBdID0gcHJlZml4ICsgYXJnc1swXS5zcGxpdCgnXFxuJykuam9pbignXFxuJyArIHByZWZpeCk7XG5cdFx0YXJncy5wdXNoKGNvbG9yQ29kZSArICdtKycgKyBtb2R1bGUuZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpICsgJ1xcdTAwMUJbMG0nKTtcblx0fSBlbHNlIHtcblx0XHRhcmdzWzBdID0gZ2V0RGF0ZSgpICsgbmFtZSArICcgJyArIGFyZ3NbMF07XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0RGF0ZSgpIHtcblx0aWYgKGV4cG9ydHMuaW5zcGVjdE9wdHMuaGlkZURhdGUpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblx0cmV0dXJuIG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSArICcgJztcbn1cblxuLyoqXG4gKiBJbnZva2VzIGB1dGlsLmZvcm1hdCgpYCB3aXRoIHRoZSBzcGVjaWZpZWQgYXJndW1lbnRzIGFuZCB3cml0ZXMgdG8gc3RkZXJyLlxuICovXG5cbmZ1bmN0aW9uIGxvZyguLi5hcmdzKSB7XG5cdHJldHVybiBwcm9jZXNzLnN0ZGVyci53cml0ZSh1dGlsLmZvcm1hdCguLi5hcmdzKSArICdcXG4nKTtcbn1cblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuXHRpZiAobmFtZXNwYWNlcykge1xuXHRcdHByb2Nlc3MuZW52LkRFQlVHID0gbmFtZXNwYWNlcztcblx0fSBlbHNlIHtcblx0XHQvLyBJZiB5b3Ugc2V0IGEgcHJvY2Vzcy5lbnYgZmllbGQgdG8gbnVsbCBvciB1bmRlZmluZWQsIGl0IGdldHMgY2FzdCB0byB0aGVcblx0XHQvLyBzdHJpbmcgJ251bGwnIG9yICd1bmRlZmluZWQnLiBKdXN0IGRlbGV0ZSBpbnN0ZWFkLlxuXHRcdGRlbGV0ZSBwcm9jZXNzLmVudi5ERUJVRztcblx0fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG5cdHJldHVybiBwcm9jZXNzLmVudi5ERUJVRztcbn1cblxuLyoqXG4gKiBJbml0IGxvZ2ljIGZvciBgZGVidWdgIGluc3RhbmNlcy5cbiAqXG4gKiBDcmVhdGUgYSBuZXcgYGluc3BlY3RPcHRzYCBvYmplY3QgaW4gY2FzZSBgdXNlQ29sb3JzYCBpcyBzZXRcbiAqIGRpZmZlcmVudGx5IGZvciBhIHBhcnRpY3VsYXIgYGRlYnVnYCBpbnN0YW5jZS5cbiAqL1xuXG5mdW5jdGlvbiBpbml0KGRlYnVnKSB7XG5cdGRlYnVnLmluc3BlY3RPcHRzID0ge307XG5cblx0Y29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGV4cG9ydHMuaW5zcGVjdE9wdHMpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRkZWJ1Zy5pbnNwZWN0T3B0c1trZXlzW2ldXSA9IGV4cG9ydHMuaW5zcGVjdE9wdHNba2V5c1tpXV07XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvbW1vbicpKGV4cG9ydHMpO1xuXG5jb25zdCB7Zm9ybWF0dGVyc30gPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBNYXAgJW8gdG8gYHV0aWwuaW5zcGVjdCgpYCwgYWxsIG9uIGEgc2luZ2xlIGxpbmUuXG4gKi9cblxuZm9ybWF0dGVycy5vID0gZnVuY3Rpb24gKHYpIHtcblx0dGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblx0cmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKVxuXHRcdC5zcGxpdCgnXFxuJylcblx0XHQubWFwKHN0ciA9PiBzdHIudHJpbSgpKVxuXHRcdC5qb2luKCcgJyk7XG59O1xuXG4vKipcbiAqIE1hcCAlTyB0byBgdXRpbC5pbnNwZWN0KClgLCBhbGxvd2luZyBtdWx0aXBsZSBsaW5lcyBpZiBuZWVkZWQuXG4gKi9cblxuZm9ybWF0dGVycy5PID0gZnVuY3Rpb24gKHYpIHtcblx0dGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblx0cmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKTtcbn07XG4iLCIvKipcbiAqIERldGVjdCBFbGVjdHJvbiByZW5kZXJlciAvIG53anMgcHJvY2Vzcywgd2hpY2ggaXMgbm9kZSwgYnV0IHdlIHNob3VsZFxuICogdHJlYXQgYXMgYSBicm93c2VyLlxuICovXG5cbmlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHByb2Nlc3MuYnJvd3NlciA9PT0gdHJ1ZSB8fCBwcm9jZXNzLl9fbndqcykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpO1xufSBlbHNlIHtcblx0bW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL25vZGUuanMnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnNfMSA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IGRlYnVnXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRlYnVnXCIpKTtcbmNvbnN0IGxvZyA9IGRlYnVnXzEuZGVmYXVsdCgnQGt3c2l0ZXMvZmlsZS1leGlzdHMnKTtcbmZ1bmN0aW9uIGNoZWNrKHBhdGgsIGlzRmlsZSwgaXNEaXJlY3RvcnkpIHtcbiAgICBsb2coYGNoZWNraW5nICVzYCwgcGF0aCk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgc3RhdCA9IGZzXzEuc3RhdFN5bmMocGF0aCk7XG4gICAgICAgIGlmIChzdGF0LmlzRmlsZSgpICYmIGlzRmlsZSkge1xuICAgICAgICAgICAgbG9nKGBbT0tdIHBhdGggcmVwcmVzZW50cyBhIGZpbGVgKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkgJiYgaXNEaXJlY3RvcnkpIHtcbiAgICAgICAgICAgIGxvZyhgW09LXSBwYXRoIHJlcHJlc2VudHMgYSBkaXJlY3RvcnlgKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxvZyhgW0ZBSUxdIHBhdGggcmVwcmVzZW50cyBzb21ldGhpbmcgb3RoZXIgdGhhbiBhIGZpbGUgb3IgZGlyZWN0b3J5YCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICAgIGxvZyhgW0ZBSUxdIHBhdGggaXMgbm90IGFjY2Vzc2libGU6ICVvYCwgZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbG9nKGBbRkFUQUxdICVvYCwgZSk7XG4gICAgICAgIHRocm93IGU7XG4gICAgfVxufVxuLyoqXG4gKiBTeW5jaHJvbm91cyB2YWxpZGF0aW9uIG9mIGEgcGF0aCBleGlzdGluZyBlaXRoZXIgYXMgYSBmaWxlIG9yIGFzIGEgZGlyZWN0b3J5LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrXG4gKiBAcGFyYW0ge251bWJlcn0gdHlwZSBPbmUgb3IgYm90aCBvZiB0aGUgZXhwb3J0ZWQgbnVtZXJpYyBjb25zdGFudHNcbiAqL1xuZnVuY3Rpb24gZXhpc3RzKHBhdGgsIHR5cGUgPSBleHBvcnRzLlJFQURBQkxFKSB7XG4gICAgcmV0dXJuIGNoZWNrKHBhdGgsICh0eXBlICYgZXhwb3J0cy5GSUxFKSA+IDAsICh0eXBlICYgZXhwb3J0cy5GT0xERVIpID4gMCk7XG59XG5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcbi8qKlxuICogQ29uc3RhbnQgcmVwcmVzZW50aW5nIGEgZmlsZVxuICovXG5leHBvcnRzLkZJTEUgPSAxO1xuLyoqXG4gKiBDb25zdGFudCByZXByZXNlbnRpbmcgYSBmb2xkZXJcbiAqL1xuZXhwb3J0cy5GT0xERVIgPSAyO1xuLyoqXG4gKiBDb25zdGFudCByZXByZXNlbnRpbmcgZWl0aGVyIGEgZmlsZSBvciBhIGZvbGRlclxuICovXG5leHBvcnRzLlJFQURBQkxFID0gZXhwb3J0cy5GSUxFICsgZXhwb3J0cy5GT0xERVI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zcmNcIikpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBpY2sgPSBleHBvcnRzLmJ1ZmZlclRvU3RyaW5nID0gZXhwb3J0cy5wcmVmaXhlZEFycmF5ID0gZXhwb3J0cy5hc051bWJlciA9IGV4cG9ydHMuYXNTdHJpbmdBcnJheSA9IGV4cG9ydHMuYXNBcnJheSA9IGV4cG9ydHMub2JqZWN0VG9TdHJpbmcgPSBleHBvcnRzLnJlbW92ZSA9IGV4cG9ydHMuaW5jbHVkaW5nID0gZXhwb3J0cy5hcHBlbmQgPSBleHBvcnRzLmZvbGRlckV4aXN0cyA9IGV4cG9ydHMuZm9yRWFjaExpbmVXaXRoQ29udGVudCA9IGV4cG9ydHMudG9MaW5lc1dpdGhDb250ZW50ID0gZXhwb3J0cy5sYXN0ID0gZXhwb3J0cy5maXJzdCA9IGV4cG9ydHMuc3BsaXRPbiA9IGV4cG9ydHMuaXNVc2VyRnVuY3Rpb24gPSBleHBvcnRzLmFzRnVuY3Rpb24gPSBleHBvcnRzLk5PT1AgPSB2b2lkIDA7XG5jb25zdCBmaWxlX2V4aXN0c18xID0gcmVxdWlyZShcIkBrd3NpdGVzL2ZpbGUtZXhpc3RzXCIpO1xuY29uc3QgTk9PUCA9ICgpID0+IHtcbn07XG5leHBvcnRzLk5PT1AgPSBOT09QO1xuLyoqXG4gKiBSZXR1cm5zIGVpdGhlciB0aGUgc291cmNlIGFyZ3VtZW50IHdoZW4gaXQgaXMgYSBgRnVuY3Rpb25gLCBvciB0aGUgZGVmYXVsdFxuICogYE5PT1BgIGZ1bmN0aW9uIGNvbnN0YW50XG4gKi9cbmZ1bmN0aW9uIGFzRnVuY3Rpb24oc291cmNlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzb3VyY2UgPT09ICdmdW5jdGlvbicgPyBzb3VyY2UgOiBleHBvcnRzLk5PT1A7XG59XG5leHBvcnRzLmFzRnVuY3Rpb24gPSBhc0Z1bmN0aW9uO1xuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHN1cHBsaWVkIGFyZ3VtZW50IGlzIGJvdGggYSBmdW5jdGlvbiwgYW5kIGlzIG5vdFxuICogdGhlIGBOT09QYCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gaXNVc2VyRnVuY3Rpb24oc291cmNlKSB7XG4gICAgcmV0dXJuICh0eXBlb2Ygc291cmNlID09PSAnZnVuY3Rpb24nICYmIHNvdXJjZSAhPT0gZXhwb3J0cy5OT09QKTtcbn1cbmV4cG9ydHMuaXNVc2VyRnVuY3Rpb24gPSBpc1VzZXJGdW5jdGlvbjtcbmZ1bmN0aW9uIHNwbGl0T24oaW5wdXQsIGNoYXIpIHtcbiAgICBjb25zdCBpbmRleCA9IGlucHV0LmluZGV4T2YoY2hhcik7XG4gICAgaWYgKGluZGV4IDw9IDApIHtcbiAgICAgICAgcmV0dXJuIFtpbnB1dCwgJyddO1xuICAgIH1cbiAgICByZXR1cm4gW1xuICAgICAgICBpbnB1dC5zdWJzdHIoMCwgaW5kZXgpLFxuICAgICAgICBpbnB1dC5zdWJzdHIoaW5kZXggKyAxKSxcbiAgICBdO1xufVxuZXhwb3J0cy5zcGxpdE9uID0gc3BsaXRPbjtcbmZ1bmN0aW9uIGZpcnN0KGlucHV0LCBvZmZzZXQgPSAwKSB7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKGlucHV0KSAmJiBpbnB1dC5sZW5ndGggPiBvZmZzZXQgPyBpbnB1dFtvZmZzZXRdIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5maXJzdCA9IGZpcnN0O1xuZnVuY3Rpb24gbGFzdChpbnB1dCwgb2Zmc2V0ID0gMCkge1xuICAgIGlmIChpc0FycmF5TGlrZShpbnB1dCkgJiYgaW5wdXQubGVuZ3RoID4gb2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dFtpbnB1dC5sZW5ndGggLSAxIC0gb2Zmc2V0XTtcbiAgICB9XG59XG5leHBvcnRzLmxhc3QgPSBsYXN0O1xuZnVuY3Rpb24gaXNBcnJheUxpa2UoaW5wdXQpIHtcbiAgICByZXR1cm4gISEoaW5wdXQgJiYgdHlwZW9mIGlucHV0Lmxlbmd0aCA9PT0gJ251bWJlcicpO1xufVxuZnVuY3Rpb24gdG9MaW5lc1dpdGhDb250ZW50KGlucHV0LCB0cmltbWVkID0gdHJ1ZSwgc2VwYXJhdG9yID0gJ1xcbicpIHtcbiAgICByZXR1cm4gaW5wdXQuc3BsaXQoc2VwYXJhdG9yKVxuICAgICAgICAucmVkdWNlKChvdXRwdXQsIGxpbmUpID0+IHtcbiAgICAgICAgY29uc3QgbGluZUNvbnRlbnQgPSB0cmltbWVkID8gbGluZS50cmltKCkgOiBsaW5lO1xuICAgICAgICBpZiAobGluZUNvbnRlbnQpIHtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKGxpbmVDb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sIFtdKTtcbn1cbmV4cG9ydHMudG9MaW5lc1dpdGhDb250ZW50ID0gdG9MaW5lc1dpdGhDb250ZW50O1xuZnVuY3Rpb24gZm9yRWFjaExpbmVXaXRoQ29udGVudChpbnB1dCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdG9MaW5lc1dpdGhDb250ZW50KGlucHV0LCB0cnVlKS5tYXAobGluZSA9PiBjYWxsYmFjayhsaW5lKSk7XG59XG5leHBvcnRzLmZvckVhY2hMaW5lV2l0aENvbnRlbnQgPSBmb3JFYWNoTGluZVdpdGhDb250ZW50O1xuZnVuY3Rpb24gZm9sZGVyRXhpc3RzKHBhdGgpIHtcbiAgICByZXR1cm4gZmlsZV9leGlzdHNfMS5leGlzdHMocGF0aCwgZmlsZV9leGlzdHNfMS5GT0xERVIpO1xufVxuZXhwb3J0cy5mb2xkZXJFeGlzdHMgPSBmb2xkZXJFeGlzdHM7XG4vKipcbiAqIEFkZHMgYGl0ZW1gIGludG8gdGhlIGB0YXJnZXRgIGBBcnJheWAgb3IgYFNldGAgd2hlbiBpdCBpcyBub3QgYWxyZWFkeSBwcmVzZW50IGFuZCByZXR1cm5zIHRoZSBgaXRlbWAuXG4gKi9cbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIGl0ZW0pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgIGlmICghdGFyZ2V0LmluY2x1ZGVzKGl0ZW0pKSB7XG4gICAgICAgICAgICB0YXJnZXQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LmFkZChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW07XG59XG5leHBvcnRzLmFwcGVuZCA9IGFwcGVuZDtcbi8qKlxuICogQWRkcyBgaXRlbWAgaW50byB0aGUgYHRhcmdldGAgYEFycmF5YCB3aGVuIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQgYW5kIHJldHVybnMgdGhlIGB0YXJnZXRgLlxuICovXG5mdW5jdGlvbiBpbmNsdWRpbmcodGFyZ2V0LCBpdGVtKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSAmJiAhdGFyZ2V0LmluY2x1ZGVzKGl0ZW0pKSB7XG4gICAgICAgIHRhcmdldC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZXhwb3J0cy5pbmNsdWRpbmcgPSBpbmNsdWRpbmc7XG5mdW5jdGlvbiByZW1vdmUodGFyZ2V0LCBpdGVtKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRhcmdldC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgdGFyZ2V0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRhcmdldC5kZWxldGUoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtO1xufVxuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG5leHBvcnRzLm9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyk7XG5mdW5jdGlvbiBhc0FycmF5KHNvdXJjZSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHNvdXJjZSkgPyBzb3VyY2UgOiBbc291cmNlXTtcbn1cbmV4cG9ydHMuYXNBcnJheSA9IGFzQXJyYXk7XG5mdW5jdGlvbiBhc1N0cmluZ0FycmF5KHNvdXJjZSkge1xuICAgIHJldHVybiBhc0FycmF5KHNvdXJjZSkubWFwKFN0cmluZyk7XG59XG5leHBvcnRzLmFzU3RyaW5nQXJyYXkgPSBhc1N0cmluZ0FycmF5O1xuZnVuY3Rpb24gYXNOdW1iZXIoc291cmNlLCBvbk5hTiA9IDApIHtcbiAgICBpZiAoc291cmNlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG9uTmFOO1xuICAgIH1cbiAgICBjb25zdCBudW0gPSBwYXJzZUludChzb3VyY2UsIDEwKTtcbiAgICByZXR1cm4gaXNOYU4obnVtKSA/IG9uTmFOIDogbnVtO1xufVxuZXhwb3J0cy5hc051bWJlciA9IGFzTnVtYmVyO1xuZnVuY3Rpb24gcHJlZml4ZWRBcnJheShpbnB1dCwgcHJlZml4KSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIG1heCA9IGlucHV0Lmxlbmd0aDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHByZWZpeCwgaW5wdXRbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuZXhwb3J0cy5wcmVmaXhlZEFycmF5ID0gcHJlZml4ZWRBcnJheTtcbmZ1bmN0aW9uIGJ1ZmZlclRvU3RyaW5nKGlucHV0KSB7XG4gICAgcmV0dXJuIChBcnJheS5pc0FycmF5KGlucHV0KSA/IEJ1ZmZlci5jb25jYXQoaW5wdXQpIDogaW5wdXQpLnRvU3RyaW5nKCd1dGYtOCcpO1xufVxuZXhwb3J0cy5idWZmZXJUb1N0cmluZyA9IGJ1ZmZlclRvU3RyaW5nO1xuLyoqXG4gKiBHZXQgYSBuZXcgb2JqZWN0IGZyb20gYSBzb3VyY2Ugb2JqZWN0IHdpdGggb25seSB0aGUgbGlzdGVkIHByb3BlcnRpZXMuXG4gKi9cbmZ1bmN0aW9uIHBpY2soc291cmNlLCBwcm9wZXJ0aWVzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIC4uLnByb3BlcnRpZXMubWFwKChwcm9wZXJ0eSkgPT4gcHJvcGVydHkgaW4gc291cmNlID8geyBbcHJvcGVydHldOiBzb3VyY2VbcHJvcGVydHldIH0gOiB7fSkpO1xufVxuZXhwb3J0cy5waWNrID0gcGljaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpbHRlckhhc0xlbmd0aCA9IGV4cG9ydHMuZmlsdGVyRnVuY3Rpb24gPSBleHBvcnRzLmZpbHRlclBsYWluT2JqZWN0ID0gZXhwb3J0cy5maWx0ZXJTdHJpbmdPclN0cmluZ0FycmF5ID0gZXhwb3J0cy5maWx0ZXJTdHJpbmdBcnJheSA9IGV4cG9ydHMuZmlsdGVyU3RyaW5nID0gZXhwb3J0cy5maWx0ZXJQcmltaXRpdmVzID0gZXhwb3J0cy5maWx0ZXJBcnJheSA9IGV4cG9ydHMuZmlsdGVyVHlwZSA9IHZvaWQgMDtcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBmaWx0ZXJUeXBlKGlucHV0LCBmaWx0ZXIsIGRlZikge1xuICAgIGlmIChmaWx0ZXIoaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIChhcmd1bWVudHMubGVuZ3RoID4gMikgPyBkZWYgOiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmZpbHRlclR5cGUgPSBmaWx0ZXJUeXBlO1xuY29uc3QgZmlsdGVyQXJyYXkgPSAoaW5wdXQpID0+IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpbnB1dCk7XG59O1xuZXhwb3J0cy5maWx0ZXJBcnJheSA9IGZpbHRlckFycmF5O1xuZnVuY3Rpb24gZmlsdGVyUHJpbWl0aXZlcyhpbnB1dCwgb21pdCkge1xuICAgIHJldHVybiAvbnVtYmVyfHN0cmluZ3xib29sZWFuLy50ZXN0KHR5cGVvZiBpbnB1dCkgJiYgKCFvbWl0IHx8ICFvbWl0LmluY2x1ZGVzKCh0eXBlb2YgaW5wdXQpKSk7XG59XG5leHBvcnRzLmZpbHRlclByaW1pdGl2ZXMgPSBmaWx0ZXJQcmltaXRpdmVzO1xuY29uc3QgZmlsdGVyU3RyaW5nID0gKGlucHV0KSA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZyc7XG59O1xuZXhwb3J0cy5maWx0ZXJTdHJpbmcgPSBmaWx0ZXJTdHJpbmc7XG5jb25zdCBmaWx0ZXJTdHJpbmdBcnJheSA9IChpbnB1dCkgPT4ge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGlucHV0KSAmJiBpbnB1dC5ldmVyeShleHBvcnRzLmZpbHRlclN0cmluZyk7XG59O1xuZXhwb3J0cy5maWx0ZXJTdHJpbmdBcnJheSA9IGZpbHRlclN0cmluZ0FycmF5O1xuY29uc3QgZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheSA9IChpbnB1dCkgPT4ge1xuICAgIHJldHVybiBleHBvcnRzLmZpbHRlclN0cmluZyhpbnB1dCkgfHwgKEFycmF5LmlzQXJyYXkoaW5wdXQpICYmIGlucHV0LmV2ZXJ5KGV4cG9ydHMuZmlsdGVyU3RyaW5nKSk7XG59O1xuZXhwb3J0cy5maWx0ZXJTdHJpbmdPclN0cmluZ0FycmF5ID0gZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheTtcbmZ1bmN0aW9uIGZpbHRlclBsYWluT2JqZWN0KGlucHV0KSB7XG4gICAgcmV0dXJuICEhaW5wdXQgJiYgdXRpbF8xLm9iamVjdFRvU3RyaW5nKGlucHV0KSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5leHBvcnRzLmZpbHRlclBsYWluT2JqZWN0ID0gZmlsdGVyUGxhaW5PYmplY3Q7XG5mdW5jdGlvbiBmaWx0ZXJGdW5jdGlvbihpbnB1dCkge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmZpbHRlckZ1bmN0aW9uID0gZmlsdGVyRnVuY3Rpb247XG5jb25zdCBmaWx0ZXJIYXNMZW5ndGggPSAoaW5wdXQpID0+IHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCB8fCAnbnVtYmVyfGJvb2xlYW58ZnVuY3Rpb24nLmluY2x1ZGVzKHR5cGVvZiBpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpbnB1dCkgfHwgdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgaW5wdXQubGVuZ3RoID09PSAnbnVtYmVyJztcbn07XG5leHBvcnRzLmZpbHRlckhhc0xlbmd0aCA9IGZpbHRlckhhc0xlbmd0aDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFyZ3VtZW50LWZpbHRlcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkV4aXRDb2RlcyA9IHZvaWQgMDtcbi8qKlxuICogS25vd24gcHJvY2VzcyBleGl0IGNvZGVzIHVzZWQgYnkgdGhlIHRhc2sgcGFyc2VycyB0byBkZXRlcm1pbmUgd2hldGhlciBhbiBlcnJvclxuICogd2FzIG9uZSB0aGV5IGNhbiBhdXRvbWF0aWNhbGx5IGhhbmRsZVxuICovXG52YXIgRXhpdENvZGVzO1xuKGZ1bmN0aW9uIChFeGl0Q29kZXMpIHtcbiAgICBFeGl0Q29kZXNbRXhpdENvZGVzW1wiU1VDQ0VTU1wiXSA9IDBdID0gXCJTVUNDRVNTXCI7XG4gICAgRXhpdENvZGVzW0V4aXRDb2Rlc1tcIkVSUk9SXCJdID0gMV0gPSBcIkVSUk9SXCI7XG4gICAgRXhpdENvZGVzW0V4aXRDb2Rlc1tcIlVOQ0xFQU5cIl0gPSAxMjhdID0gXCJVTkNMRUFOXCI7XG59KShFeGl0Q29kZXMgPSBleHBvcnRzLkV4aXRDb2RlcyB8fCAoZXhwb3J0cy5FeGl0Q29kZXMgPSB7fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhpdC1jb2Rlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0T3V0cHV0U3RyZWFtcyA9IHZvaWQgMDtcbmNsYXNzIEdpdE91dHB1dFN0cmVhbXMge1xuICAgIGNvbnN0cnVjdG9yKHN0ZE91dCwgc3RkRXJyKSB7XG4gICAgICAgIHRoaXMuc3RkT3V0ID0gc3RkT3V0O1xuICAgICAgICB0aGlzLnN0ZEVyciA9IHN0ZEVycjtcbiAgICB9XG4gICAgYXNTdHJpbmdzKCkge1xuICAgICAgICByZXR1cm4gbmV3IEdpdE91dHB1dFN0cmVhbXModGhpcy5zdGRPdXQudG9TdHJpbmcoJ3V0ZjgnKSwgdGhpcy5zdGRFcnIudG9TdHJpbmcoJ3V0ZjgnKSk7XG4gICAgfVxufVxuZXhwb3J0cy5HaXRPdXRwdXRTdHJlYW1zID0gR2l0T3V0cHV0U3RyZWFtcztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1vdXRwdXQtc3RyZWFtcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVtb3RlTGluZVBhcnNlciA9IGV4cG9ydHMuTGluZVBhcnNlciA9IHZvaWQgMDtcbmNsYXNzIExpbmVQYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHJlZ0V4cCwgdXNlTWF0Y2hlcykge1xuICAgICAgICB0aGlzLm1hdGNoZXMgPSBbXTtcbiAgICAgICAgdGhpcy5wYXJzZSA9IChsaW5lLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRNYXRjaGVzKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlZ0V4cC5ldmVyeSgocmVnLCBpbmRleCkgPT4gdGhpcy5hZGRNYXRjaChyZWcsIGluZGV4LCBsaW5lKGluZGV4KSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWF0Y2hlcyh0YXJnZXQsIHRoaXMucHJlcGFyZU1hdGNoZXMoKSkgIT09IGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9yZWdFeHAgPSBBcnJheS5pc0FycmF5KHJlZ0V4cCkgPyByZWdFeHAgOiBbcmVnRXhwXTtcbiAgICAgICAgaWYgKHVzZU1hdGNoZXMpIHtcbiAgICAgICAgICAgIHRoaXMudXNlTWF0Y2hlcyA9IHVzZU1hdGNoZXM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHVzZU1hdGNoZXModGFyZ2V0LCBtYXRjaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYExpbmVQYXJzZXI6dXNlTWF0Y2hlcyBub3QgaW1wbGVtZW50ZWRgKTtcbiAgICB9XG4gICAgcmVzZXRNYXRjaGVzKCkge1xuICAgICAgICB0aGlzLm1hdGNoZXMubGVuZ3RoID0gMDtcbiAgICB9XG4gICAgcHJlcGFyZU1hdGNoZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoZXM7XG4gICAgfVxuICAgIGFkZE1hdGNoKHJlZywgaW5kZXgsIGxpbmUpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlZCA9IGxpbmUgJiYgcmVnLmV4ZWMobGluZSk7XG4gICAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hNYXRjaChpbmRleCwgbWF0Y2hlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICEhbWF0Y2hlZDtcbiAgICB9XG4gICAgcHVzaE1hdGNoKF9pbmRleCwgbWF0Y2hlZCkge1xuICAgICAgICB0aGlzLm1hdGNoZXMucHVzaCguLi5tYXRjaGVkLnNsaWNlKDEpKTtcbiAgICB9XG59XG5leHBvcnRzLkxpbmVQYXJzZXIgPSBMaW5lUGFyc2VyO1xuY2xhc3MgUmVtb3RlTGluZVBhcnNlciBleHRlbmRzIExpbmVQYXJzZXIge1xuICAgIGFkZE1hdGNoKHJlZywgaW5kZXgsIGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIC9ecmVtb3RlOlxccy8udGVzdChTdHJpbmcobGluZSkpICYmIHN1cGVyLmFkZE1hdGNoKHJlZywgaW5kZXgsIGxpbmUpO1xuICAgIH1cbiAgICBwdXNoTWF0Y2goaW5kZXgsIG1hdGNoZWQpIHtcbiAgICAgICAgaWYgKGluZGV4ID4gMCB8fCBtYXRjaGVkLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHN1cGVyLnB1c2hNYXRjaChpbmRleCwgbWF0Y2hlZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLlJlbW90ZUxpbmVQYXJzZXIgPSBSZW1vdGVMaW5lUGFyc2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluZS1wYXJzZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUluc3RhbmNlQ29uZmlnID0gdm9pZCAwO1xuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgYmluYXJ5OiAnZ2l0JyxcbiAgICBtYXhDb25jdXJyZW50UHJvY2Vzc2VzOiA1LFxuICAgIGNvbmZpZzogW10sXG59O1xuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VDb25maWcoLi4ub3B0aW9ucykge1xuICAgIGNvbnN0IGJhc2VEaXIgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IGJhc2VEaXIgfSwgZGVmYXVsdE9wdGlvbnMpLCAuLi4ob3B0aW9ucy5maWx0ZXIobyA9PiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgbykpKTtcbiAgICBjb25maWcuYmFzZURpciA9IGNvbmZpZy5iYXNlRGlyIHx8IGJhc2VEaXI7XG4gICAgcmV0dXJuIGNvbmZpZztcbn1cbmV4cG9ydHMuY3JlYXRlSW5zdGFuY2VDb25maWcgPSBjcmVhdGVJbnN0YW5jZUNvbmZpZztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpbXBsZS1naXQtb3B0aW9ucy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50ID0gZXhwb3J0cy50cmFpbGluZ09wdGlvbnNBcmd1bWVudCA9IGV4cG9ydHMuZ2V0VHJhaWxpbmdPcHRpb25zID0gZXhwb3J0cy5hcHBlbmRUYXNrT3B0aW9ucyA9IHZvaWQgMDtcbmNvbnN0IGFyZ3VtZW50X2ZpbHRlcnNfMSA9IHJlcXVpcmUoXCIuL2FyZ3VtZW50LWZpbHRlcnNcIik7XG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuZnVuY3Rpb24gYXBwZW5kVGFza09wdGlvbnMob3B0aW9ucywgY29tbWFuZHMgPSBbXSkge1xuICAgIGlmICghYXJndW1lbnRfZmlsdGVyc18xLmZpbHRlclBsYWluT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgIHJldHVybiBjb21tYW5kcztcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9wdGlvbnMpLnJlZHVjZSgoY29tbWFuZHMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgaWYgKGFyZ3VtZW50X2ZpbHRlcnNfMS5maWx0ZXJQcmltaXRpdmVzKHZhbHVlLCBbJ2Jvb2xlYW4nXSkpIHtcbiAgICAgICAgICAgIGNvbW1hbmRzLnB1c2goa2V5ICsgJz0nICsgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29tbWFuZHMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21tYW5kcztcbiAgICB9LCBjb21tYW5kcyk7XG59XG5leHBvcnRzLmFwcGVuZFRhc2tPcHRpb25zID0gYXBwZW5kVGFza09wdGlvbnM7XG5mdW5jdGlvbiBnZXRUcmFpbGluZ09wdGlvbnMoYXJncywgaW5pdGlhbFByaW1pdGl2ZSA9IDAsIG9iamVjdE9ubHkgPSBmYWxzZSkge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gaW5pdGlhbFByaW1pdGl2ZSA8IDAgPyBhcmdzLmxlbmd0aCA6IGluaXRpYWxQcmltaXRpdmU7IGkgPCBtYXg7IGkrKykge1xuICAgICAgICBpZiAoJ3N0cmluZ3xudW1iZXInLmluY2x1ZGVzKHR5cGVvZiBhcmdzW2ldKSkge1xuICAgICAgICAgICAgY29tbWFuZC5wdXNoKFN0cmluZyhhcmdzW2ldKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXBwZW5kVGFza09wdGlvbnModHJhaWxpbmdPcHRpb25zQXJndW1lbnQoYXJncyksIGNvbW1hbmQpO1xuICAgIGlmICghb2JqZWN0T25seSkge1xuICAgICAgICBjb21tYW5kLnB1c2goLi4udHJhaWxpbmdBcnJheUFyZ3VtZW50KGFyZ3MpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1hbmQ7XG59XG5leHBvcnRzLmdldFRyYWlsaW5nT3B0aW9ucyA9IGdldFRyYWlsaW5nT3B0aW9ucztcbmZ1bmN0aW9uIHRyYWlsaW5nQXJyYXlBcmd1bWVudChhcmdzKSB7XG4gICAgY29uc3QgaGFzVHJhaWxpbmdDYWxsYmFjayA9IHR5cGVvZiB1dGlsXzEubGFzdChhcmdzKSA9PT0gJ2Z1bmN0aW9uJztcbiAgICByZXR1cm4gYXJndW1lbnRfZmlsdGVyc18xLmZpbHRlclR5cGUodXRpbF8xLmxhc3QoYXJncywgaGFzVHJhaWxpbmdDYWxsYmFjayA/IDEgOiAwKSwgYXJndW1lbnRfZmlsdGVyc18xLmZpbHRlckFycmF5LCBbXSk7XG59XG4vKipcbiAqIEdpdmVuIGFueSBudW1iZXIgb2YgYXJndW1lbnRzLCByZXR1cm5zIHRoZSB0cmFpbGluZyBvcHRpb25zIGFyZ3VtZW50LCBpZ25vcmluZyBhIHRyYWlsaW5nIGZ1bmN0aW9uIGFyZ3VtZW50XG4gKiBpZiB0aGVyZSBpcyBvbmUuIFdoZW4gbm90IGZvdW5kLCB0aGUgcmV0dXJuIHZhbHVlIGlzIG51bGwuXG4gKi9cbmZ1bmN0aW9uIHRyYWlsaW5nT3B0aW9uc0FyZ3VtZW50KGFyZ3MpIHtcbiAgICBjb25zdCBoYXNUcmFpbGluZ0NhbGxiYWNrID0gYXJndW1lbnRfZmlsdGVyc18xLmZpbHRlckZ1bmN0aW9uKHV0aWxfMS5sYXN0KGFyZ3MpKTtcbiAgICByZXR1cm4gYXJndW1lbnRfZmlsdGVyc18xLmZpbHRlclR5cGUodXRpbF8xLmxhc3QoYXJncywgaGFzVHJhaWxpbmdDYWxsYmFjayA/IDEgOiAwKSwgYXJndW1lbnRfZmlsdGVyc18xLmZpbHRlclBsYWluT2JqZWN0KTtcbn1cbmV4cG9ydHMudHJhaWxpbmdPcHRpb25zQXJndW1lbnQgPSB0cmFpbGluZ09wdGlvbnNBcmd1bWVudDtcbi8qKlxuICogUmV0dXJucyBlaXRoZXIgdGhlIHNvdXJjZSBhcmd1bWVudCB3aGVuIGl0IGlzIGEgYEZ1bmN0aW9uYCwgb3IgdGhlIGRlZmF1bHRcbiAqIGBOT09QYCBmdW5jdGlvbiBjb25zdGFudFxuICovXG5mdW5jdGlvbiB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJncywgaW5jbHVkZU5vb3AgPSB0cnVlKSB7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB1dGlsXzEuYXNGdW5jdGlvbih1dGlsXzEubGFzdChhcmdzKSk7XG4gICAgcmV0dXJuIGluY2x1ZGVOb29wIHx8IHV0aWxfMS5pc1VzZXJGdW5jdGlvbihjYWxsYmFjaykgPyBjYWxsYmFjayA6IHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50ID0gdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFzay1vcHRpb25zLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVN0cmluZ1Jlc3BvbnNlID0gZXhwb3J0cy5jYWxsVGFza1BhcnNlciA9IHZvaWQgMDtcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5mdW5jdGlvbiBjYWxsVGFza1BhcnNlcihwYXJzZXIsIHN0cmVhbXMpIHtcbiAgICByZXR1cm4gcGFyc2VyKHN0cmVhbXMuc3RkT3V0LCBzdHJlYW1zLnN0ZEVycik7XG59XG5leHBvcnRzLmNhbGxUYXNrUGFyc2VyID0gY2FsbFRhc2tQYXJzZXI7XG5mdW5jdGlvbiBwYXJzZVN0cmluZ1Jlc3BvbnNlKHJlc3VsdCwgcGFyc2VycywgLi4udGV4dHMpIHtcbiAgICB0ZXh0cy5mb3JFYWNoKHRleHQgPT4ge1xuICAgICAgICBmb3IgKGxldCBsaW5lcyA9IHV0aWxfMS50b0xpbmVzV2l0aENvbnRlbnQodGV4dCksIGkgPSAwLCBtYXggPSBsaW5lcy5sZW5ndGg7IGkgPCBtYXg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IChvZmZzZXQgPSAwKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKChpICsgb2Zmc2V0KSA+PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZXNbaSArIG9mZnNldF07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcGFyc2Vycy5zb21lKCh7IHBhcnNlIH0pID0+IHBhcnNlKGxpbmUsIHJlc3VsdCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMucGFyc2VTdHJpbmdSZXNwb25zZSA9IHBhcnNlU3RyaW5nUmVzcG9uc2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10YXNrLXBhcnNlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FyZ3VtZW50LWZpbHRlcnNcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2V4aXQtY29kZXNcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2dpdC1vdXRwdXQtc3RyZWFtc1wiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vbGluZS1wYXJzZXJcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3NpbXBsZS1naXQtb3B0aW9uc1wiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdGFzay1vcHRpb25zXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90YXNrLXBhcnNlclwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdXRpbFwiKSwgZXhwb3J0cyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2hlY2tJc0JhcmVSZXBvVGFzayA9IGV4cG9ydHMuY2hlY2tJc1JlcG9Sb290VGFzayA9IGV4cG9ydHMuY2hlY2tJc1JlcG9UYXNrID0gZXhwb3J0cy5DaGVja1JlcG9BY3Rpb25zID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbnZhciBDaGVja1JlcG9BY3Rpb25zO1xuKGZ1bmN0aW9uIChDaGVja1JlcG9BY3Rpb25zKSB7XG4gICAgQ2hlY2tSZXBvQWN0aW9uc1tcIkJBUkVcIl0gPSBcImJhcmVcIjtcbiAgICBDaGVja1JlcG9BY3Rpb25zW1wiSU5fVFJFRVwiXSA9IFwidHJlZVwiO1xuICAgIENoZWNrUmVwb0FjdGlvbnNbXCJJU19SRVBPX1JPT1RcIl0gPSBcInJvb3RcIjtcbn0pKENoZWNrUmVwb0FjdGlvbnMgPSBleHBvcnRzLkNoZWNrUmVwb0FjdGlvbnMgfHwgKGV4cG9ydHMuQ2hlY2tSZXBvQWN0aW9ucyA9IHt9KSk7XG5jb25zdCBvbkVycm9yID0gKHsgZXhpdENvZGUgfSwgZXJyb3IsIGRvbmUsIGZhaWwpID0+IHtcbiAgICBpZiAoZXhpdENvZGUgPT09IHV0aWxzXzEuRXhpdENvZGVzLlVOQ0xFQU4gJiYgaXNOb3RSZXBvTWVzc2FnZShlcnJvcikpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUoQnVmZmVyLmZyb20oJ2ZhbHNlJykpO1xuICAgIH1cbiAgICBmYWlsKGVycm9yKTtcbn07XG5jb25zdCBwYXJzZXIgPSAodGV4dCkgPT4ge1xuICAgIHJldHVybiB0ZXh0LnRyaW0oKSA9PT0gJ3RydWUnO1xufTtcbmZ1bmN0aW9uIGNoZWNrSXNSZXBvVGFzayhhY3Rpb24pIHtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICBjYXNlIENoZWNrUmVwb0FjdGlvbnMuQkFSRTpcbiAgICAgICAgICAgIHJldHVybiBjaGVja0lzQmFyZVJlcG9UYXNrKCk7XG4gICAgICAgIGNhc2UgQ2hlY2tSZXBvQWN0aW9ucy5JU19SRVBPX1JPT1Q6XG4gICAgICAgICAgICByZXR1cm4gY2hlY2tJc1JlcG9Sb290VGFzaygpO1xuICAgIH1cbiAgICBjb25zdCBjb21tYW5kcyA9IFsncmV2LXBhcnNlJywgJy0taXMtaW5zaWRlLXdvcmstdHJlZSddO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIG9uRXJyb3IsXG4gICAgICAgIHBhcnNlcixcbiAgICB9O1xufVxuZXhwb3J0cy5jaGVja0lzUmVwb1Rhc2sgPSBjaGVja0lzUmVwb1Rhc2s7XG5mdW5jdGlvbiBjaGVja0lzUmVwb1Jvb3RUYXNrKCkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydyZXYtcGFyc2UnLCAnLS1naXQtZGlyJ107XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgb25FcnJvcixcbiAgICAgICAgcGFyc2VyKHBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiAvXlxcLihnaXQpPyQvLnRlc3QocGF0aC50cmltKCkpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLmNoZWNrSXNSZXBvUm9vdFRhc2sgPSBjaGVja0lzUmVwb1Jvb3RUYXNrO1xuZnVuY3Rpb24gY2hlY2tJc0JhcmVSZXBvVGFzaygpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsncmV2LXBhcnNlJywgJy0taXMtYmFyZS1yZXBvc2l0b3J5J107XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgb25FcnJvcixcbiAgICAgICAgcGFyc2VyLFxuICAgIH07XG59XG5leHBvcnRzLmNoZWNrSXNCYXJlUmVwb1Rhc2sgPSBjaGVja0lzQmFyZVJlcG9UYXNrO1xuZnVuY3Rpb24gaXNOb3RSZXBvTWVzc2FnZShlcnJvcikge1xuICAgIHJldHVybiAvKE5vdCBhIGdpdCByZXBvc2l0b3J5fEtlaW4gR2l0LVJlcG9zaXRvcnkpL2kudGVzdChTdHJpbmcoZXJyb3IpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWlzLXJlcG8uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNsZWFuU3VtbWFyeVBhcnNlciA9IGV4cG9ydHMuQ2xlYW5SZXNwb25zZSA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jbGFzcyBDbGVhblJlc3BvbnNlIHtcbiAgICBjb25zdHJ1Y3RvcihkcnlSdW4pIHtcbiAgICAgICAgdGhpcy5kcnlSdW4gPSBkcnlSdW47XG4gICAgICAgIHRoaXMucGF0aHMgPSBbXTtcbiAgICAgICAgdGhpcy5maWxlcyA9IFtdO1xuICAgICAgICB0aGlzLmZvbGRlcnMgPSBbXTtcbiAgICB9XG59XG5leHBvcnRzLkNsZWFuUmVzcG9uc2UgPSBDbGVhblJlc3BvbnNlO1xuY29uc3QgcmVtb3ZhbFJlZ2V4cCA9IC9eW2Etel0rXFxzKi9pO1xuY29uc3QgZHJ5UnVuUmVtb3ZhbFJlZ2V4cCA9IC9eW2Etel0rXFxzK1thLXpdK1xccyovaTtcbmNvbnN0IGlzRm9sZGVyUmVnZXhwID0gL1xcLyQvO1xuZnVuY3Rpb24gY2xlYW5TdW1tYXJ5UGFyc2VyKGRyeVJ1biwgdGV4dCkge1xuICAgIGNvbnN0IHN1bW1hcnkgPSBuZXcgQ2xlYW5SZXNwb25zZShkcnlSdW4pO1xuICAgIGNvbnN0IHJlZ2V4cCA9IGRyeVJ1biA/IGRyeVJ1blJlbW92YWxSZWdleHAgOiByZW1vdmFsUmVnZXhwO1xuICAgIHV0aWxzXzEudG9MaW5lc1dpdGhDb250ZW50KHRleHQpLmZvckVhY2gobGluZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW92ZWQgPSBsaW5lLnJlcGxhY2UocmVnZXhwLCAnJyk7XG4gICAgICAgIHN1bW1hcnkucGF0aHMucHVzaChyZW1vdmVkKTtcbiAgICAgICAgKGlzRm9sZGVyUmVnZXhwLnRlc3QocmVtb3ZlZCkgPyBzdW1tYXJ5LmZvbGRlcnMgOiBzdW1tYXJ5LmZpbGVzKS5wdXNoKHJlbW92ZWQpO1xuICAgIH0pO1xuICAgIHJldHVybiBzdW1tYXJ5O1xufVxuZXhwb3J0cy5jbGVhblN1bW1hcnlQYXJzZXIgPSBjbGVhblN1bW1hcnlQYXJzZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1DbGVhblN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzRW1wdHlUYXNrID0gZXhwb3J0cy5pc0J1ZmZlclRhc2sgPSBleHBvcnRzLnN0cmFpZ2h0VGhyb3VnaEJ1ZmZlclRhc2sgPSBleHBvcnRzLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2sgPSBleHBvcnRzLmNvbmZpZ3VyYXRpb25FcnJvclRhc2sgPSBleHBvcnRzLmFkaG9jRXhlY1Rhc2sgPSBleHBvcnRzLkVNUFRZX0NPTU1BTkRTID0gdm9pZCAwO1xuY29uc3QgdGFza19jb25maWd1cmF0aW9uX2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL3Rhc2stY29uZmlndXJhdGlvbi1lcnJvclwiKTtcbmV4cG9ydHMuRU1QVFlfQ09NTUFORFMgPSBbXTtcbmZ1bmN0aW9uIGFkaG9jRXhlY1Rhc2socGFyc2VyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IGV4cG9ydHMuRU1QVFlfQ09NTUFORFMsXG4gICAgICAgIGZvcm1hdDogJ2VtcHR5JyxcbiAgICAgICAgcGFyc2VyLFxuICAgIH07XG59XG5leHBvcnRzLmFkaG9jRXhlY1Rhc2sgPSBhZGhvY0V4ZWNUYXNrO1xuZnVuY3Rpb24gY29uZmlndXJhdGlvbkVycm9yVGFzayhlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzOiBleHBvcnRzLkVNUFRZX0NPTU1BTkRTLFxuICAgICAgICBmb3JtYXQ6ICdlbXB0eScsXG4gICAgICAgIHBhcnNlcigpIHtcbiAgICAgICAgICAgIHRocm93IHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBuZXcgdGFza19jb25maWd1cmF0aW9uX2Vycm9yXzEuVGFza0NvbmZpZ3VyYXRpb25FcnJvcihlcnJvcikgOiBlcnJvcjtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmNvbmZpZ3VyYXRpb25FcnJvclRhc2sgPSBjb25maWd1cmF0aW9uRXJyb3JUYXNrO1xuZnVuY3Rpb24gc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcywgdHJpbW1lZCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmltbWVkID8gU3RyaW5nKHRleHQpLnRyaW0oKSA6IHRleHQ7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayA9IHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2s7XG5mdW5jdGlvbiBzdHJhaWdodFRocm91Z2hCdWZmZXJUYXNrKGNvbW1hbmRzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ2J1ZmZlcicsXG4gICAgICAgIHBhcnNlcihidWZmZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuc3RyYWlnaHRUaHJvdWdoQnVmZmVyVGFzayA9IHN0cmFpZ2h0VGhyb3VnaEJ1ZmZlclRhc2s7XG5mdW5jdGlvbiBpc0J1ZmZlclRhc2sodGFzaykge1xuICAgIHJldHVybiB0YXNrLmZvcm1hdCA9PT0gJ2J1ZmZlcic7XG59XG5leHBvcnRzLmlzQnVmZmVyVGFzayA9IGlzQnVmZmVyVGFzaztcbmZ1bmN0aW9uIGlzRW1wdHlUYXNrKHRhc2spIHtcbiAgICByZXR1cm4gdGFzay5mb3JtYXQgPT09ICdlbXB0eScgfHwgIXRhc2suY29tbWFuZHMubGVuZ3RoO1xufVxuZXhwb3J0cy5pc0VtcHR5VGFzayA9IGlzRW1wdHlUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFzay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNDbGVhbk9wdGlvbnNBcnJheSA9IGV4cG9ydHMuY2xlYW5UYXNrID0gZXhwb3J0cy5jbGVhbldpdGhPcHRpb25zVGFzayA9IGV4cG9ydHMuQ2xlYW5PcHRpb25zID0gZXhwb3J0cy5DT05GSUdfRVJST1JfVU5LTk9XTl9PUFRJT04gPSBleHBvcnRzLkNPTkZJR19FUlJPUl9NT0RFX1JFUVVJUkVEID0gZXhwb3J0cy5DT05GSUdfRVJST1JfSU5URVJBQ1RJVkVfTU9ERSA9IHZvaWQgMDtcbmNvbnN0IENsZWFuU3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9DbGVhblN1bW1hcnlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbmV4cG9ydHMuQ09ORklHX0VSUk9SX0lOVEVSQUNUSVZFX01PREUgPSAnR2l0IGNsZWFuIGludGVyYWN0aXZlIG1vZGUgaXMgbm90IHN1cHBvcnRlZCc7XG5leHBvcnRzLkNPTkZJR19FUlJPUl9NT0RFX1JFUVVJUkVEID0gJ0dpdCBjbGVhbiBtb2RlIHBhcmFtZXRlciAoXCJuXCIgb3IgXCJmXCIpIGlzIHJlcXVpcmVkJztcbmV4cG9ydHMuQ09ORklHX0VSUk9SX1VOS05PV05fT1BUSU9OID0gJ0dpdCBjbGVhbiB1bmtub3duIG9wdGlvbiBmb3VuZCBpbjogJztcbi8qKlxuICogQWxsIHN1cHBvcnRlZCBvcHRpb24gc3dpdGNoZXMgYXZhaWxhYmxlIGZvciB1c2UgaW4gYSBgZ2l0LmNsZWFuYCBvcGVyYXRpb25cbiAqL1xudmFyIENsZWFuT3B0aW9ucztcbihmdW5jdGlvbiAoQ2xlYW5PcHRpb25zKSB7XG4gICAgQ2xlYW5PcHRpb25zW1wiRFJZX1JVTlwiXSA9IFwiblwiO1xuICAgIENsZWFuT3B0aW9uc1tcIkZPUkNFXCJdID0gXCJmXCI7XG4gICAgQ2xlYW5PcHRpb25zW1wiSUdOT1JFRF9JTkNMVURFRFwiXSA9IFwieFwiO1xuICAgIENsZWFuT3B0aW9uc1tcIklHTk9SRURfT05MWVwiXSA9IFwiWFwiO1xuICAgIENsZWFuT3B0aW9uc1tcIkVYQ0xVRElOR1wiXSA9IFwiZVwiO1xuICAgIENsZWFuT3B0aW9uc1tcIlFVSUVUXCJdID0gXCJxXCI7XG4gICAgQ2xlYW5PcHRpb25zW1wiUkVDVVJTSVZFXCJdID0gXCJkXCI7XG59KShDbGVhbk9wdGlvbnMgPSBleHBvcnRzLkNsZWFuT3B0aW9ucyB8fCAoZXhwb3J0cy5DbGVhbk9wdGlvbnMgPSB7fSkpO1xuY29uc3QgQ2xlYW5PcHRpb25WYWx1ZXMgPSBuZXcgU2V0KFsnaScsIC4uLnV0aWxzXzEuYXNTdHJpbmdBcnJheShPYmplY3QudmFsdWVzKENsZWFuT3B0aW9ucykpXSk7XG5mdW5jdGlvbiBjbGVhbldpdGhPcHRpb25zVGFzayhtb2RlLCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgeyBjbGVhbk1vZGUsIG9wdGlvbnMsIHZhbGlkIH0gPSBnZXRDbGVhbk9wdGlvbnMobW9kZSk7XG4gICAgaWYgKCFjbGVhbk1vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tfMS5jb25maWd1cmF0aW9uRXJyb3JUYXNrKGV4cG9ydHMuQ09ORklHX0VSUk9SX01PREVfUkVRVUlSRUQpO1xuICAgIH1cbiAgICBpZiAoIXZhbGlkLm9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tfMS5jb25maWd1cmF0aW9uRXJyb3JUYXNrKGV4cG9ydHMuQ09ORklHX0VSUk9SX1VOS05PV05fT1BUSU9OICsgSlNPTi5zdHJpbmdpZnkobW9kZSkpO1xuICAgIH1cbiAgICBvcHRpb25zLnB1c2goLi4uY3VzdG9tQXJncyk7XG4gICAgaWYgKG9wdGlvbnMuc29tZShpc0ludGVyYWN0aXZlTW9kZSkpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tfMS5jb25maWd1cmF0aW9uRXJyb3JUYXNrKGV4cG9ydHMuQ09ORklHX0VSUk9SX0lOVEVSQUNUSVZFX01PREUpO1xuICAgIH1cbiAgICByZXR1cm4gY2xlYW5UYXNrKGNsZWFuTW9kZSwgb3B0aW9ucyk7XG59XG5leHBvcnRzLmNsZWFuV2l0aE9wdGlvbnNUYXNrID0gY2xlYW5XaXRoT3B0aW9uc1Rhc2s7XG5mdW5jdGlvbiBjbGVhblRhc2sobW9kZSwgY3VzdG9tQXJncykge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydjbGVhbicsIGAtJHttb2RlfWAsIC4uLmN1c3RvbUFyZ3NdO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcih0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gQ2xlYW5TdW1tYXJ5XzEuY2xlYW5TdW1tYXJ5UGFyc2VyKG1vZGUgPT09IENsZWFuT3B0aW9ucy5EUllfUlVOLCB0ZXh0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmNsZWFuVGFzayA9IGNsZWFuVGFzaztcbmZ1bmN0aW9uIGlzQ2xlYW5PcHRpb25zQXJyYXkoaW5wdXQpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShpbnB1dCkgJiYgaW5wdXQuZXZlcnkodGVzdCA9PiBDbGVhbk9wdGlvblZhbHVlcy5oYXModGVzdCkpO1xufVxuZXhwb3J0cy5pc0NsZWFuT3B0aW9uc0FycmF5ID0gaXNDbGVhbk9wdGlvbnNBcnJheTtcbmZ1bmN0aW9uIGdldENsZWFuT3B0aW9ucyhpbnB1dCkge1xuICAgIGxldCBjbGVhbk1vZGU7XG4gICAgbGV0IG9wdGlvbnMgPSBbXTtcbiAgICBsZXQgdmFsaWQgPSB7IGNsZWFuTW9kZTogZmFsc2UsIG9wdGlvbnM6IHRydWUgfTtcbiAgICBpbnB1dC5yZXBsYWNlKC9bXmEtel1pL2csICcnKS5zcGxpdCgnJykuZm9yRWFjaChjaGFyID0+IHtcbiAgICAgICAgaWYgKGlzQ2xlYW5Nb2RlKGNoYXIpKSB7XG4gICAgICAgICAgICBjbGVhbk1vZGUgPSBjaGFyO1xuICAgICAgICAgICAgdmFsaWQuY2xlYW5Nb2RlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbGlkLm9wdGlvbnMgPSB2YWxpZC5vcHRpb25zICYmIGlzS25vd25PcHRpb24ob3B0aW9uc1tvcHRpb25zLmxlbmd0aF0gPSAoYC0ke2NoYXJ9YCkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2xlYW5Nb2RlLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICB2YWxpZCxcbiAgICB9O1xufVxuZnVuY3Rpb24gaXNDbGVhbk1vZGUoY2xlYW5Nb2RlKSB7XG4gICAgcmV0dXJuIGNsZWFuTW9kZSA9PT0gQ2xlYW5PcHRpb25zLkZPUkNFIHx8IGNsZWFuTW9kZSA9PT0gQ2xlYW5PcHRpb25zLkRSWV9SVU47XG59XG5mdW5jdGlvbiBpc0tub3duT3B0aW9uKG9wdGlvbikge1xuICAgIHJldHVybiAvXi1bYS16XSQvaS50ZXN0KG9wdGlvbikgJiYgQ2xlYW5PcHRpb25WYWx1ZXMuaGFzKG9wdGlvbi5jaGFyQXQoMSkpO1xufVxuZnVuY3Rpb24gaXNJbnRlcmFjdGl2ZU1vZGUob3B0aW9uKSB7XG4gICAgaWYgKC9eLVteXFwtXS8udGVzdChvcHRpb24pKSB7XG4gICAgICAgIHJldHVybiBvcHRpb24uaW5kZXhPZignaScpID4gMDtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbiA9PT0gJy0taW50ZXJhY3RpdmUnO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xlYW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbmZpZ0xpc3RQYXJzZXIgPSBleHBvcnRzLkNvbmZpZ0xpc3QgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY2xhc3MgQ29uZmlnTGlzdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbiAgICBnZXQgYWxsKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2FsbCkge1xuICAgICAgICAgICAgdGhpcy5fYWxsID0gdGhpcy5maWxlcy5yZWR1Y2UoKGFsbCwgZmlsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFsbCwgdGhpcy52YWx1ZXNbZmlsZV0pO1xuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hbGw7XG4gICAgfVxuICAgIGFkZEZpbGUoZmlsZSkge1xuICAgICAgICBpZiAoIShmaWxlIGluIHRoaXMudmFsdWVzKSkge1xuICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gdXRpbHNfMS5sYXN0KHRoaXMuZmlsZXMpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZXNbZmlsZV0gPSBsYXRlc3QgPyBPYmplY3QuY3JlYXRlKHRoaXMudmFsdWVzW2xhdGVzdF0pIDoge307XG4gICAgICAgICAgICB0aGlzLmZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ZpbGVdO1xuICAgIH1cbiAgICBhZGRWYWx1ZShmaWxlLCBrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuYWRkRmlsZShmaWxlKTtcbiAgICAgICAgaWYgKCF2YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlc1trZXldKSkge1xuICAgICAgICAgICAgdmFsdWVzW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZXNba2V5XSA9IFt2YWx1ZXNba2V5XSwgdmFsdWVdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FsbCA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG5leHBvcnRzLkNvbmZpZ0xpc3QgPSBDb25maWdMaXN0O1xuZnVuY3Rpb24gY29uZmlnTGlzdFBhcnNlcih0ZXh0KSB7XG4gICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZ0xpc3QoKTtcbiAgICBjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoJ1xcMCcpO1xuICAgIGZvciAobGV0IGkgPSAwLCBtYXggPSBsaW5lcy5sZW5ndGggLSAxOyBpIDwgbWF4Oykge1xuICAgICAgICBjb25zdCBmaWxlID0gY29uZmlnRmlsZVBhdGgobGluZXNbaSsrXSk7XG4gICAgICAgIGNvbnN0IFtrZXksIHZhbHVlXSA9IHV0aWxzXzEuc3BsaXRPbihsaW5lc1tpKytdLCAnXFxuJyk7XG4gICAgICAgIGNvbmZpZy5hZGRWYWx1ZShmaWxlLCBrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbn1cbmV4cG9ydHMuY29uZmlnTGlzdFBhcnNlciA9IGNvbmZpZ0xpc3RQYXJzZXI7XG5mdW5jdGlvbiBjb25maWdGaWxlUGF0aChmaWxlUGF0aCkge1xuICAgIHJldHVybiBmaWxlUGF0aC5yZXBsYWNlKC9eKGZpbGUpOi8sICcnKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbmZpZ0xpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdENvbmZpZ1Njb3BlID0gdm9pZCAwO1xuY29uc3QgQ29uZmlnTGlzdF8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9Db25maWdMaXN0XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbnZhciBHaXRDb25maWdTY29wZTtcbihmdW5jdGlvbiAoR2l0Q29uZmlnU2NvcGUpIHtcbiAgICBHaXRDb25maWdTY29wZVtcInN5c3RlbVwiXSA9IFwic3lzdGVtXCI7XG4gICAgR2l0Q29uZmlnU2NvcGVbXCJnbG9iYWxcIl0gPSBcImdsb2JhbFwiO1xuICAgIEdpdENvbmZpZ1Njb3BlW1wibG9jYWxcIl0gPSBcImxvY2FsXCI7XG4gICAgR2l0Q29uZmlnU2NvcGVbXCJ3b3JrdHJlZVwiXSA9IFwid29ya3RyZWVcIjtcbn0pKEdpdENvbmZpZ1Njb3BlID0gZXhwb3J0cy5HaXRDb25maWdTY29wZSB8fCAoZXhwb3J0cy5HaXRDb25maWdTY29wZSA9IHt9KSk7XG5mdW5jdGlvbiBhc0NvbmZpZ1Njb3BlKHNjb3BlLCBmYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2Ygc2NvcGUgPT09ICdzdHJpbmcnICYmIEdpdENvbmZpZ1Njb3BlLmhhc093blByb3BlcnR5KHNjb3BlKSkge1xuICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxsYmFjaztcbn1cbmZ1bmN0aW9uIGFkZENvbmZpZ1Rhc2soa2V5LCB2YWx1ZSwgYXBwZW5kLCBzY29wZSkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydjb25maWcnLCBgLS0ke3Njb3BlfWBdO1xuICAgIGlmIChhcHBlbmQpIHtcbiAgICAgICAgY29tbWFuZHMucHVzaCgnLS1hZGQnKTtcbiAgICB9XG4gICAgY29tbWFuZHMucHVzaChrZXksIHZhbHVlKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXIodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gbGlzdENvbmZpZ1Rhc2soc2NvcGUpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnY29uZmlnJywgJy0tbGlzdCcsICctLXNob3ctb3JpZ2luJywgJy0tbnVsbCddO1xuICAgIGlmIChzY29wZSkge1xuICAgICAgICBjb21tYW5kcy5wdXNoKGAtLSR7c2NvcGV9YCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcih0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnTGlzdF8xLmNvbmZpZ0xpc3RQYXJzZXIodGV4dCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRfMSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhZGRDb25maWcoa2V5LCB2YWx1ZSwgLi4ucmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2soYWRkQ29uZmlnVGFzayhrZXksIHZhbHVlLCByZXN0WzBdID09PSB0cnVlLCBhc0NvbmZpZ1Njb3BlKHJlc3RbMV0sIEdpdENvbmZpZ1Njb3BlLmxvY2FsKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgICAgICB9LFxuICAgICAgICBsaXN0Q29uZmlnKC4uLnJlc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKGxpc3RDb25maWdUYXNrKGFzQ29uZmlnU2NvcGUocmVzdFswXSwgdW5kZWZpbmVkKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25maWcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFJlc2V0TW9kZSA9IGV4cG9ydHMucmVzZXRUYXNrID0gZXhwb3J0cy5SZXNldE1vZGUgPSB2b2lkIDA7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xudmFyIFJlc2V0TW9kZTtcbihmdW5jdGlvbiAoUmVzZXRNb2RlKSB7XG4gICAgUmVzZXRNb2RlW1wiTUlYRURcIl0gPSBcIm1peGVkXCI7XG4gICAgUmVzZXRNb2RlW1wiU09GVFwiXSA9IFwic29mdFwiO1xuICAgIFJlc2V0TW9kZVtcIkhBUkRcIl0gPSBcImhhcmRcIjtcbiAgICBSZXNldE1vZGVbXCJNRVJHRVwiXSA9IFwibWVyZ2VcIjtcbiAgICBSZXNldE1vZGVbXCJLRUVQXCJdID0gXCJrZWVwXCI7XG59KShSZXNldE1vZGUgPSBleHBvcnRzLlJlc2V0TW9kZSB8fCAoZXhwb3J0cy5SZXNldE1vZGUgPSB7fSkpO1xuY29uc3QgUmVzZXRNb2RlcyA9IEFycmF5LmZyb20oT2JqZWN0LnZhbHVlcyhSZXNldE1vZGUpKTtcbmZ1bmN0aW9uIHJlc2V0VGFzayhtb2RlLCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3Jlc2V0J107XG4gICAgaWYgKGlzVmFsaWRSZXNldE1vZGUobW9kZSkpIHtcbiAgICAgICAgY29tbWFuZHMucHVzaChgLS0ke21vZGV9YCk7XG4gICAgfVxuICAgIGNvbW1hbmRzLnB1c2goLi4uY3VzdG9tQXJncyk7XG4gICAgcmV0dXJuIHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmRzKTtcbn1cbmV4cG9ydHMucmVzZXRUYXNrID0gcmVzZXRUYXNrO1xuZnVuY3Rpb24gZ2V0UmVzZXRNb2RlKG1vZGUpIHtcbiAgICBpZiAoaXNWYWxpZFJlc2V0TW9kZShtb2RlKSkge1xuICAgICAgICByZXR1cm4gbW9kZTtcbiAgICB9XG4gICAgc3dpdGNoICh0eXBlb2YgbW9kZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIFJlc2V0TW9kZS5TT0ZUO1xuICAgIH1cbiAgICByZXR1cm47XG59XG5leHBvcnRzLmdldFJlc2V0TW9kZSA9IGdldFJlc2V0TW9kZTtcbmZ1bmN0aW9uIGlzVmFsaWRSZXNldE1vZGUobW9kZSkge1xuICAgIHJldHVybiBSZXNldE1vZGVzLmluY2x1ZGVzKG1vZGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVzZXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBnaXRfY29uc3RydWN0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvcnMvZ2l0LWNvbnN0cnVjdC1lcnJvclwiKTtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4vZXJyb3JzL2dpdC1lcnJvclwiKTtcbmNvbnN0IGdpdF9wbHVnaW5fZXJyb3JfMSA9IHJlcXVpcmUoXCIuL2Vycm9ycy9naXQtcGx1Z2luLWVycm9yXCIpO1xuY29uc3QgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvcnMvZ2l0LXJlc3BvbnNlLWVycm9yXCIpO1xuY29uc3QgdGFza19jb25maWd1cmF0aW9uX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvcnMvdGFzay1jb25maWd1cmF0aW9uLWVycm9yXCIpO1xuY29uc3QgY2hlY2tfaXNfcmVwb18xID0gcmVxdWlyZShcIi4vdGFza3MvY2hlY2staXMtcmVwb1wiKTtcbmNvbnN0IGNsZWFuXzEgPSByZXF1aXJlKFwiLi90YXNrcy9jbGVhblwiKTtcbmNvbnN0IGNvbmZpZ18xID0gcmVxdWlyZShcIi4vdGFza3MvY29uZmlnXCIpO1xuY29uc3QgcmVzZXRfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL3Jlc2V0XCIpO1xuY29uc3QgYXBpID0ge1xuICAgIENoZWNrUmVwb0FjdGlvbnM6IGNoZWNrX2lzX3JlcG9fMS5DaGVja1JlcG9BY3Rpb25zLFxuICAgIENsZWFuT3B0aW9uczogY2xlYW5fMS5DbGVhbk9wdGlvbnMsXG4gICAgR2l0Q29uZmlnU2NvcGU6IGNvbmZpZ18xLkdpdENvbmZpZ1Njb3BlLFxuICAgIEdpdENvbnN0cnVjdEVycm9yOiBnaXRfY29uc3RydWN0X2Vycm9yXzEuR2l0Q29uc3RydWN0RXJyb3IsXG4gICAgR2l0RXJyb3I6IGdpdF9lcnJvcl8xLkdpdEVycm9yLFxuICAgIEdpdFBsdWdpbkVycm9yOiBnaXRfcGx1Z2luX2Vycm9yXzEuR2l0UGx1Z2luRXJyb3IsXG4gICAgR2l0UmVzcG9uc2VFcnJvcjogZ2l0X3Jlc3BvbnNlX2Vycm9yXzEuR2l0UmVzcG9uc2VFcnJvcixcbiAgICBSZXNldE1vZGU6IHJlc2V0XzEuUmVzZXRNb2RlLFxuICAgIFRhc2tDb25maWd1cmF0aW9uRXJyb3I6IHRhc2tfY29uZmlndXJhdGlvbl9lcnJvcl8xLlRhc2tDb25maWd1cmF0aW9uRXJyb3IsXG59O1xuZXhwb3J0cy5kZWZhdWx0ID0gYXBpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBpLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jb21tYW5kQ29uZmlnUHJlZml4aW5nUGx1Z2luID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIGNvbW1hbmRDb25maWdQcmVmaXhpbmdQbHVnaW4oY29uZmlndXJhdGlvbikge1xuICAgIGNvbnN0IHByZWZpeCA9IHV0aWxzXzEucHJlZml4ZWRBcnJheShjb25maWd1cmF0aW9uLCAnLWMnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnc3Bhd24uYXJncycsXG4gICAgICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnByZWZpeCwgLi4uZGF0YV07XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuY29tbWFuZENvbmZpZ1ByZWZpeGluZ1BsdWdpbiA9IGNvbW1hbmRDb25maWdQcmVmaXhpbmdQbHVnaW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21tYW5kLWNvbmZpZy1wcmVmaXhpbmctcGx1Z2luLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lcnJvckRldGVjdGlvblBsdWdpbiA9IGV4cG9ydHMuZXJyb3JEZXRlY3Rpb25IYW5kbGVyID0gdm9pZCAwO1xuY29uc3QgZ2l0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1lcnJvclwiKTtcbmZ1bmN0aW9uIGlzVGFza0Vycm9yKHJlc3VsdCkge1xuICAgIHJldHVybiAhIShyZXN1bHQuZXhpdENvZGUgJiYgcmVzdWx0LnN0ZEVyci5sZW5ndGgpO1xufVxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKHJlc3VsdCkge1xuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KFsuLi5yZXN1bHQuc3RkT3V0LCAuLi5yZXN1bHQuc3RkRXJyXSk7XG59XG5mdW5jdGlvbiBlcnJvckRldGVjdGlvbkhhbmRsZXIob3ZlcndyaXRlID0gZmFsc2UsIGlzRXJyb3IgPSBpc1Rhc2tFcnJvciwgZXJyb3JNZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKSB7XG4gICAgcmV0dXJuIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmICgoIW92ZXJ3cml0ZSAmJiBlcnJvcikgfHwgIWlzRXJyb3IocmVzdWx0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvck1lc3NhZ2UocmVzdWx0KTtcbiAgICB9O1xufVxuZXhwb3J0cy5lcnJvckRldGVjdGlvbkhhbmRsZXIgPSBlcnJvckRldGVjdGlvbkhhbmRsZXI7XG5mdW5jdGlvbiBlcnJvckRldGVjdGlvblBsdWdpbihjb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAndGFzay5lcnJvcicsXG4gICAgICAgIGFjdGlvbihkYXRhLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IGNvbmZpZyhkYXRhLmVycm9yLCB7XG4gICAgICAgICAgICAgICAgc3RkRXJyOiBjb250ZXh0LnN0ZEVycixcbiAgICAgICAgICAgICAgICBzdGRPdXQ6IGNvbnRleHQuc3RkT3V0LFxuICAgICAgICAgICAgICAgIGV4aXRDb2RlOiBjb250ZXh0LmV4aXRDb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyb3I6IG5ldyBnaXRfZXJyb3JfMS5HaXRFcnJvcih1bmRlZmluZWQsIGVycm9yLnRvU3RyaW5nKCd1dGYtOCcpKSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnJvclxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy5lcnJvckRldGVjdGlvblBsdWdpbiA9IGVycm9yRGV0ZWN0aW9uUGx1Z2luO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3ItZGV0ZWN0aW9uLnBsdWdpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGx1Z2luU3RvcmUgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY2xhc3MgUGx1Z2luU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBsdWdpbnMgPSBuZXcgU2V0KCk7XG4gICAgfVxuICAgIGFkZChwbHVnaW4pIHtcbiAgICAgICAgY29uc3QgcGx1Z2lucyA9IFtdO1xuICAgICAgICB1dGlsc18xLmFzQXJyYXkocGx1Z2luKS5mb3JFYWNoKHBsdWdpbiA9PiBwbHVnaW4gJiYgdGhpcy5wbHVnaW5zLmFkZCh1dGlsc18xLmFwcGVuZChwbHVnaW5zLCBwbHVnaW4pKSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHRoaXMucGx1Z2lucy5kZWxldGUocGx1Z2luKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGV4ZWModHlwZSwgZGF0YSwgY29udGV4dCkge1xuICAgICAgICBsZXQgb3V0cHV0ID0gZGF0YTtcbiAgICAgICAgY29uc3QgY29udGV4dHVhbCA9IE9iamVjdC5mcmVlemUoT2JqZWN0LmNyZWF0ZShjb250ZXh0KSk7XG4gICAgICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMucGx1Z2lucykge1xuICAgICAgICAgICAgaWYgKHBsdWdpbi50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gcGx1Z2luLmFjdGlvbihvdXRwdXQsIGNvbnRleHR1YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxufVxuZXhwb3J0cy5QbHVnaW5TdG9yZSA9IFBsdWdpblN0b3JlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGx1Z2luLXN0b3JlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wcm9ncmVzc01vbml0b3JQbHVnaW4gPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuZnVuY3Rpb24gcHJvZ3Jlc3NNb25pdG9yUGx1Z2luKHByb2dyZXNzKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3NDb21tYW5kID0gJy0tcHJvZ3Jlc3MnO1xuICAgIGNvbnN0IHByb2dyZXNzTWV0aG9kcyA9IFsnY2hlY2tvdXQnLCAnY2xvbmUnLCAnZmV0Y2gnLCAncHVsbCcsICdwdXNoJ107XG4gICAgY29uc3Qgb25Qcm9ncmVzcyA9IHtcbiAgICAgICAgdHlwZTogJ3NwYXduLmFmdGVyJyxcbiAgICAgICAgYWN0aW9uKF9kYXRhLCBjb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQuY29tbWFuZHMuaW5jbHVkZXMocHJvZ3Jlc3NDb21tYW5kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGNvbnRleHQuc3Bhd25lZC5zdGRlcnIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAvXihbYS16QS1aIF0rKTpcXHMqKFxcZCspJSBcXCgoXFxkKylcXC8oXFxkKylcXCkvLmV4ZWMoY2h1bmsudG9TdHJpbmcoJ3V0ZjgnKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3Moe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IGNvbnRleHQubWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICBzdGFnZTogcHJvZ3Jlc3NFdmVudFN0YWdlKG1lc3NhZ2VbMV0pLFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogdXRpbHNfMS5hc051bWJlcihtZXNzYWdlWzJdKSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkOiB1dGlsc18xLmFzTnVtYmVyKG1lc3NhZ2VbM10pLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdXRpbHNfMS5hc051bWJlcihtZXNzYWdlWzRdKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBvbkFyZ3MgPSB7XG4gICAgICAgIHR5cGU6ICdzcGF3bi5hcmdzJyxcbiAgICAgICAgYWN0aW9uKGFyZ3MsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghcHJvZ3Jlc3NNZXRob2RzLmluY2x1ZGVzKGNvbnRleHQubWV0aG9kKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHV0aWxzXzEuaW5jbHVkaW5nKGFyZ3MsIHByb2dyZXNzQ29tbWFuZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBbb25BcmdzLCBvblByb2dyZXNzXTtcbn1cbmV4cG9ydHMucHJvZ3Jlc3NNb25pdG9yUGx1Z2luID0gcHJvZ3Jlc3NNb25pdG9yUGx1Z2luO1xuZnVuY3Rpb24gcHJvZ3Jlc3NFdmVudFN0YWdlKGlucHV0KSB7XG4gICAgcmV0dXJuIFN0cmluZyhpbnB1dC50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJywgMSkpIHx8ICd1bmtub3duJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb2dyZXNzLW1vbml0b3ItcGx1Z2luLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2ltcGxlLWdpdC1wbHVnaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNwYXduT3B0aW9uc1BsdWdpbiA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5mdW5jdGlvbiBzcGF3bk9wdGlvbnNQbHVnaW4oc3Bhd25PcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHV0aWxzXzEucGljayhzcGF3bk9wdGlvbnMsIFsndWlkJywgJ2dpZCddKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnc3Bhd24ub3B0aW9ucycsXG4gICAgICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgZGF0YSk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuc3Bhd25PcHRpb25zUGx1Z2luID0gc3Bhd25PcHRpb25zUGx1Z2luO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Bhd24tb3B0aW9ucy1wbHVnaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRpbWVvdXRQbHVnaW4gPSB2b2lkIDA7XG5jb25zdCBnaXRfcGx1Z2luX2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1wbHVnaW4tZXJyb3JcIik7XG5mdW5jdGlvbiB0aW1lb3V0UGx1Z2luKHsgYmxvY2sgfSkge1xuICAgIGlmIChibG9jayA+IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdzcGF3bi5hZnRlcicsXG4gICAgICAgICAgICBhY3Rpb24oX2RhdGEsIGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIGxldCB0aW1lb3V0O1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHdhaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgJiYgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChraWxsLCBibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgICAgIChfYSA9IGNvbnRleHQuc3Bhd25lZC5zdGRvdXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vZmYoJ2RhdGEnLCB3YWl0KTtcbiAgICAgICAgICAgICAgICAgICAgKF9iID0gY29udGV4dC5zcGF3bmVkLnN0ZGVycikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm9mZignZGF0YScsIHdhaXQpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNwYXduZWQub2ZmKCdleGl0Jywgc3RvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Bhd25lZC5vZmYoJ2Nsb3NlJywgc3RvcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGtpbGwoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5raWxsKG5ldyBnaXRfcGx1Z2luX2Vycm9yXzEuR2l0UGx1Z2luRXJyb3IodW5kZWZpbmVkLCAndGltZW91dCcsIGBibG9jayB0aW1lb3V0IHJlYWNoZWRgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIChfYSA9IGNvbnRleHQuc3Bhd25lZC5zdGRvdXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5vbignZGF0YScsIHdhaXQpO1xuICAgICAgICAgICAgICAgIChfYiA9IGNvbnRleHQuc3Bhd25lZC5zdGRlcnIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5vbignZGF0YScsIHdhaXQpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Bhd25lZC5vbignZXhpdCcsIHN0b3ApO1xuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Bhd25lZC5vbignY2xvc2UnLCBzdG9wKTtcbiAgICAgICAgICAgICAgICB3YWl0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy50aW1lb3V0UGx1Z2luID0gdGltZW91dFBsdWdpbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbW91dC1wbHVnaW4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9jb21tYW5kLWNvbmZpZy1wcmVmaXhpbmctcGx1Z2luXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9lcnJvci1kZXRlY3Rpb24ucGx1Z2luXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9wbHVnaW4tc3RvcmVcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3Byb2dyZXNzLW1vbml0b3ItcGx1Z2luXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9zaW1wbGUtZ2l0LXBsdWdpblwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3Bhd24tb3B0aW9ucy1wbHVnaW5cIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3RpbW91dC1wbHVnaW5cIiksIGV4cG9ydHMpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdpdExvZ2dlciA9IGV4cG9ydHMuY3JlYXRlTG9nZ2VyID0gdm9pZCAwO1xuY29uc3QgZGVidWdfMSA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmRlYnVnXzEuZGVmYXVsdC5mb3JtYXR0ZXJzLkwgPSAodmFsdWUpID0+IFN0cmluZyh1dGlsc18xLmZpbHRlckhhc0xlbmd0aCh2YWx1ZSkgPyB2YWx1ZS5sZW5ndGggOiAnLScpO1xuZGVidWdfMS5kZWZhdWx0LmZvcm1hdHRlcnMuQiA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygndXRmOCcpO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbHNfMS5vYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59O1xuZnVuY3Rpb24gY3JlYXRlTG9nKCkge1xuICAgIHJldHVybiBkZWJ1Z18xLmRlZmF1bHQoJ3NpbXBsZS1naXQnKTtcbn1cbmZ1bmN0aW9uIHByZWZpeGVkTG9nZ2VyKHRvLCBwcmVmaXgsIGZvcndhcmQpIHtcbiAgICBpZiAoIXByZWZpeCB8fCAhU3RyaW5nKHByZWZpeCkucmVwbGFjZSgvXFxzKi8sICcnKSkge1xuICAgICAgICByZXR1cm4gIWZvcndhcmQgPyB0byA6IChtZXNzYWdlLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICB0byhtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIGZvcndhcmQobWVzc2FnZSwgLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiAobWVzc2FnZSwgLi4uYXJncykgPT4ge1xuICAgICAgICB0byhgJXMgJHttZXNzYWdlfWAsIHByZWZpeCwgLi4uYXJncyk7XG4gICAgICAgIGlmIChmb3J3YXJkKSB7XG4gICAgICAgICAgICBmb3J3YXJkKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoaWxkTG9nZ2VyTmFtZShuYW1lLCBjaGlsZERlYnVnZ2VyLCB7IG5hbWVzcGFjZTogcGFyZW50TmFtZXNwYWNlIH0pIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZE5hbWVzcGFjZSA9IGNoaWxkRGVidWdnZXIgJiYgY2hpbGREZWJ1Z2dlci5uYW1lc3BhY2UgfHwgJyc7XG4gICAgaWYgKGNoaWxkTmFtZXNwYWNlLnN0YXJ0c1dpdGgocGFyZW50TmFtZXNwYWNlKSkge1xuICAgICAgICByZXR1cm4gY2hpbGROYW1lc3BhY2Uuc3Vic3RyKHBhcmVudE5hbWVzcGFjZS5sZW5ndGggKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkTmFtZXNwYWNlIHx8IHBhcmVudE5hbWVzcGFjZTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcihsYWJlbCwgdmVyYm9zZSwgaW5pdGlhbFN0ZXAsIGluZm9EZWJ1Z2dlciA9IGNyZWF0ZUxvZygpKSB7XG4gICAgY29uc3QgbGFiZWxQcmVmaXggPSBsYWJlbCAmJiBgWyR7bGFiZWx9XWAgfHwgJyc7XG4gICAgY29uc3Qgc3Bhd25lZCA9IFtdO1xuICAgIGNvbnN0IGRlYnVnRGVidWdnZXIgPSAodHlwZW9mIHZlcmJvc2UgPT09ICdzdHJpbmcnKSA/IGluZm9EZWJ1Z2dlci5leHRlbmQodmVyYm9zZSkgOiB2ZXJib3NlO1xuICAgIGNvbnN0IGtleSA9IGNoaWxkTG9nZ2VyTmFtZSh1dGlsc18xLmZpbHRlclR5cGUodmVyYm9zZSwgdXRpbHNfMS5maWx0ZXJTdHJpbmcpLCBkZWJ1Z0RlYnVnZ2VyLCBpbmZvRGVidWdnZXIpO1xuICAgIHJldHVybiBzdGVwKGluaXRpYWxTdGVwKTtcbiAgICBmdW5jdGlvbiBzaWJsaW5nKG5hbWUsIGluaXRpYWwpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuYXBwZW5kKHNwYXduZWQsIGNyZWF0ZUxvZ2dlcihsYWJlbCwga2V5LnJlcGxhY2UoL15bXjpdKy8sIG5hbWUpLCBpbml0aWFsLCBpbmZvRGVidWdnZXIpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3RlcChwaGFzZSkge1xuICAgICAgICBjb25zdCBzdGVwUHJlZml4ID0gcGhhc2UgJiYgYFske3BoYXNlfV1gIHx8ICcnO1xuICAgICAgICBjb25zdCBkZWJ1ZyA9IGRlYnVnRGVidWdnZXIgJiYgcHJlZml4ZWRMb2dnZXIoZGVidWdEZWJ1Z2dlciwgc3RlcFByZWZpeCkgfHwgdXRpbHNfMS5OT09QO1xuICAgICAgICBjb25zdCBpbmZvID0gcHJlZml4ZWRMb2dnZXIoaW5mb0RlYnVnZ2VyLCBgJHtsYWJlbFByZWZpeH0gJHtzdGVwUHJlZml4fWAsIGRlYnVnKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZGVidWdEZWJ1Z2dlciA/IGRlYnVnIDogaW5mbywge1xuICAgICAgICAgICAgbGFiZWwsXG4gICAgICAgICAgICBzaWJsaW5nLFxuICAgICAgICAgICAgaW5mbyxcbiAgICAgICAgICAgIHN0ZXAsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuY3JlYXRlTG9nZ2VyID0gY3JlYXRlTG9nZ2VyO1xuLyoqXG4gKiBUaGUgYEdpdExvZ2dlcmAgaXMgdXNlZCBieSB0aGUgbWFpbiBgU2ltcGxlR2l0YCBydW5uZXIgdG8gaGFuZGxlIGxvZ2dpbmdcbiAqIGFueSB3YXJuaW5ncyBvciBlcnJvcnMuXG4gKi9cbmNsYXNzIEdpdExvZ2dlciB7XG4gICAgY29uc3RydWN0b3IoX291dCA9IGNyZWF0ZUxvZygpKSB7XG4gICAgICAgIHRoaXMuX291dCA9IF9vdXQ7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBwcmVmaXhlZExvZ2dlcihfb3V0LCAnW0VSUk9SXScpO1xuICAgICAgICB0aGlzLndhcm4gPSBwcmVmaXhlZExvZ2dlcihfb3V0LCAnW1dBUk5dJyk7XG4gICAgfVxuICAgIHNpbGVudChzaWxlbmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHNpbGVuY2UgIT09IHRoaXMuX291dC5lbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBuYW1lc3BhY2UgfSA9IHRoaXMuX291dDtcbiAgICAgICAgY29uc3QgZW52ID0gKHByb2Nlc3MuZW52LkRFQlVHIHx8ICcnKS5zcGxpdCgnLCcpLmZpbHRlcihzID0+ICEhcyk7XG4gICAgICAgIGNvbnN0IGhhc09uID0gZW52LmluY2x1ZGVzKG5hbWVzcGFjZSk7XG4gICAgICAgIGNvbnN0IGhhc09mZiA9IGVudi5pbmNsdWRlcyhgLSR7bmFtZXNwYWNlfWApO1xuICAgICAgICAvLyBlbmFibGluZyB0aGUgbG9nXG4gICAgICAgIGlmICghc2lsZW5jZSkge1xuICAgICAgICAgICAgaWYgKGhhc09mZikge1xuICAgICAgICAgICAgICAgIHV0aWxzXzEucmVtb3ZlKGVudiwgYC0ke25hbWVzcGFjZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVudi5wdXNoKG5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaGFzT24pIHtcbiAgICAgICAgICAgICAgICB1dGlsc18xLnJlbW92ZShlbnYsIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnYucHVzaChgLSR7bmFtZXNwYWNlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRlYnVnXzEuZGVmYXVsdC5lbmFibGUoZW52LmpvaW4oJywnKSk7XG4gICAgfVxufVxuZXhwb3J0cy5HaXRMb2dnZXIgPSBHaXRMb2dnZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtbG9nZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UYXNrc1BlbmRpbmdRdWV1ZSA9IHZvaWQgMDtcbmNvbnN0IGdpdF9lcnJvcl8xID0gcmVxdWlyZShcIi4uL2Vycm9ycy9naXQtZXJyb3JcIik7XG5jb25zdCBnaXRfbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi4vZ2l0LWxvZ2dlclwiKTtcbmNsYXNzIFRhc2tzUGVuZGluZ1F1ZXVlIHtcbiAgICBjb25zdHJ1Y3Rvcihsb2dMYWJlbCA9ICdHaXRFeGVjdXRvcicpIHtcbiAgICAgICAgdGhpcy5sb2dMYWJlbCA9IGxvZ0xhYmVsO1xuICAgICAgICB0aGlzLl9xdWV1ZSA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgd2l0aFByb2dyZXNzKHRhc2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXVlLmdldCh0YXNrKTtcbiAgICB9XG4gICAgY3JlYXRlUHJvZ3Jlc3ModGFzaykge1xuICAgICAgICBjb25zdCBuYW1lID0gVGFza3NQZW5kaW5nUXVldWUuZ2V0TmFtZSh0YXNrLmNvbW1hbmRzWzBdKTtcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gZ2l0X2xvZ2dlcl8xLmNyZWF0ZUxvZ2dlcih0aGlzLmxvZ0xhYmVsLCBuYW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgICBsb2dnZXIsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBwdXNoKHRhc2spIHtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLmNyZWF0ZVByb2dyZXNzKHRhc2spO1xuICAgICAgICBwcm9ncmVzcy5sb2dnZXIoJ0FkZGluZyB0YXNrIHRvIHRoZSBxdWV1ZSwgY29tbWFuZHMgPSAlbycsIHRhc2suY29tbWFuZHMpO1xuICAgICAgICB0aGlzLl9xdWV1ZS5zZXQodGFzaywgcHJvZ3Jlc3MpO1xuICAgICAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gICAgfVxuICAgIGZhdGFsKGVycikge1xuICAgICAgICBmb3IgKGNvbnN0IFt0YXNrLCB7IGxvZ2dlciB9XSBvZiBBcnJheS5mcm9tKHRoaXMuX3F1ZXVlLmVudHJpZXMoKSkpIHtcbiAgICAgICAgICAgIGlmICh0YXNrID09PSBlcnIudGFzaykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBGYWlsZWQgJW9gLCBlcnIpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcihgRmF0YWwgZXhjZXB0aW9uLCBhbnkgYXMteWV0IHVuLXN0YXJ0ZWQgdGFza3MgcnVuIHRocm91Z2ggdGhpcyBleGVjdXRvciB3aWxsIG5vdCBiZSBhdHRlbXB0ZWRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBBIGZhdGFsIGV4Y2VwdGlvbiBvY2N1cnJlZCBpbiBhIHByZXZpb3VzIHRhc2ssIHRoZSBxdWV1ZSBoYXMgYmVlbiBwdXJnZWQ6ICVvYCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fcXVldWUuc2l6ZSAhPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBRdWV1ZSBzaXplIHNob3VsZCBiZSB6ZXJvIGFmdGVyIGZhdGFsOiAke3RoaXMuX3F1ZXVlLnNpemV9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGxldGUodGFzaykge1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRoaXMud2l0aFByb2dyZXNzKHRhc2spO1xuICAgICAgICBpZiAocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlLmRlbGV0ZSh0YXNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhdHRlbXB0KHRhc2spIHtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLndpdGhQcm9ncmVzcyh0YXNrKTtcbiAgICAgICAgaWYgKCFwcm9ncmVzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IGdpdF9lcnJvcl8xLkdpdEVycm9yKHVuZGVmaW5lZCwgJ1Rhc2tzUGVuZGluZ1F1ZXVlOiBhdHRlbXB0IGNhbGxlZCBmb3IgYW4gdW5rbm93biB0YXNrJyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvZ3Jlc3MubG9nZ2VyKCdTdGFydGluZyB0YXNrJyk7XG4gICAgICAgIHJldHVybiBwcm9ncmVzcztcbiAgICB9XG4gICAgc3RhdGljIGdldE5hbWUobmFtZSA9ICdlbXB0eScpIHtcbiAgICAgICAgcmV0dXJuIGB0YXNrOiR7bmFtZX06JHsrK1Rhc2tzUGVuZGluZ1F1ZXVlLmNvdW50ZXJ9YDtcbiAgICB9XG59XG5leHBvcnRzLlRhc2tzUGVuZGluZ1F1ZXVlID0gVGFza3NQZW5kaW5nUXVldWU7XG5UYXNrc1BlbmRpbmdRdWV1ZS5jb3VudGVyID0gMDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhc2tzLXBlbmRpbmctcXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0RXhlY3V0b3JDaGFpbiA9IHZvaWQgMDtcbmNvbnN0IGNoaWxkX3Byb2Nlc3NfMSA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xuY29uc3QgZ2l0X2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1lcnJvclwiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuLi90YXNrcy90YXNrXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHRhc2tzX3BlbmRpbmdfcXVldWVfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzLXBlbmRpbmctcXVldWVcIik7XG5jbGFzcyBHaXRFeGVjdXRvckNoYWluIHtcbiAgICBjb25zdHJ1Y3RvcihfZXhlY3V0b3IsIF9zY2hlZHVsZXIsIF9wbHVnaW5zKSB7XG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yID0gX2V4ZWN1dG9yO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSBfc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLl9wbHVnaW5zID0gX3BsdWdpbnM7XG4gICAgICAgIHRoaXMuX2NoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlID0gbmV3IHRhc2tzX3BlbmRpbmdfcXVldWVfMS5UYXNrc1BlbmRpbmdRdWV1ZSgpO1xuICAgIH1cbiAgICBnZXQgYmluYXJ5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhlY3V0b3IuYmluYXJ5O1xuICAgIH1cbiAgICBnZXQgY3dkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3dkIHx8IHRoaXMuX2V4ZWN1dG9yLmN3ZDtcbiAgICB9XG4gICAgc2V0IGN3ZChjd2QpIHtcbiAgICAgICAgdGhpcy5fY3dkID0gY3dkO1xuICAgIH1cbiAgICBnZXQgZW52KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZXhlY3V0b3IuZW52O1xuICAgIH1cbiAgICBnZXQgb3V0cHV0SGFuZGxlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V4ZWN1dG9yLm91dHB1dEhhbmRsZXI7XG4gICAgfVxuICAgIGNoYWluKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcHVzaCh0YXNrKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnB1c2godGFzayk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFpbiA9IHRoaXMuX2NoYWluLnRoZW4oKCkgPT4gdGhpcy5hdHRlbXB0VGFzayh0YXNrKSk7XG4gICAgfVxuICAgIGF0dGVtcHRUYXNrKHRhc2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9uU2NoZWR1bGVDb21wbGV0ZSA9IHlpZWxkIHRoaXMuX3NjaGVkdWxlci5uZXh0KCk7XG4gICAgICAgICAgICBjb25zdCBvblF1ZXVlQ29tcGxldGUgPSAoKSA9PiB0aGlzLl9xdWV1ZS5jb21wbGV0ZSh0YXNrKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBsb2dnZXIgfSA9IHRoaXMuX3F1ZXVlLmF0dGVtcHQodGFzayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkICh0YXNrXzEuaXNFbXB0eVRhc2sodGFzaylcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmF0dGVtcHRFbXB0eVRhc2sodGFzaywgbG9nZ2VyKVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuYXR0ZW1wdFJlbW90ZVRhc2sodGFzaywgbG9nZ2VyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRocm93IHRoaXMub25GYXRhbEV4Y2VwdGlvbih0YXNrLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIG9uUXVldWVDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIG9uU2NoZWR1bGVDb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25GYXRhbEV4Y2VwdGlvbih0YXNrLCBlKSB7XG4gICAgICAgIGNvbnN0IGdpdEVycm9yID0gKGUgaW5zdGFuY2VvZiBnaXRfZXJyb3JfMS5HaXRFcnJvcikgPyBPYmplY3QuYXNzaWduKGUsIHsgdGFzayB9KSA6IG5ldyBnaXRfZXJyb3JfMS5HaXRFcnJvcih0YXNrLCBlICYmIFN0cmluZyhlKSk7XG4gICAgICAgIHRoaXMuX2NoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIHRoaXMuX3F1ZXVlLmZhdGFsKGdpdEVycm9yKTtcbiAgICAgICAgcmV0dXJuIGdpdEVycm9yO1xuICAgIH1cbiAgICBhdHRlbXB0UmVtb3RlVGFzayh0YXNrLCBsb2dnZXIpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLl9wbHVnaW5zLmV4ZWMoJ3NwYXduLmFyZ3MnLCBbLi4udGFzay5jb21tYW5kc10sIHBsdWdpbkNvbnRleHQodGFzaywgdGFzay5jb21tYW5kcykpO1xuICAgICAgICAgICAgY29uc3QgcmF3ID0geWllbGQgdGhpcy5naXRSZXNwb25zZSh0YXNrLCB0aGlzLmJpbmFyeSwgYXJncywgdGhpcy5vdXRwdXRIYW5kbGVyLCBsb2dnZXIuc3RlcCgnU1BBV04nKSk7XG4gICAgICAgICAgICBjb25zdCBvdXRwdXRTdHJlYW1zID0geWllbGQgdGhpcy5oYW5kbGVUYXNrRGF0YSh0YXNrLCBhcmdzLCByYXcsIGxvZ2dlci5zdGVwKCdIQU5ETEUnKSk7XG4gICAgICAgICAgICBsb2dnZXIoYHBhc3NpbmcgcmVzcG9uc2UgdG8gdGFzaydzIHBhcnNlciBhcyBhICVzYCwgdGFzay5mb3JtYXQpO1xuICAgICAgICAgICAgaWYgKHRhc2tfMS5pc0J1ZmZlclRhc2sodGFzaykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbHNfMS5jYWxsVGFza1BhcnNlcih0YXNrLnBhcnNlciwgb3V0cHV0U3RyZWFtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdXRpbHNfMS5jYWxsVGFza1BhcnNlcih0YXNrLnBhcnNlciwgb3V0cHV0U3RyZWFtcy5hc1N0cmluZ3MoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhdHRlbXB0RW1wdHlUYXNrKHRhc2ssIGxvZ2dlcikge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbG9nZ2VyKGBlbXB0eSB0YXNrIGJ5cGFzc2luZyBjaGlsZCBwcm9jZXNzIHRvIGNhbGwgdG8gdGFzaydzIHBhcnNlcmApO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2sucGFyc2VyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlVGFza0RhdGEodGFzaywgYXJncywgcmVzdWx0LCBsb2dnZXIpIHtcbiAgICAgICAgY29uc3QgeyBleGl0Q29kZSwgcmVqZWN0aW9uLCBzdGRPdXQsIHN0ZEVyciB9ID0gcmVzdWx0O1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGRvbmUsIGZhaWwpID0+IHtcbiAgICAgICAgICAgIGxvZ2dlcihgUHJlcGFyaW5nIHRvIGhhbmRsZSBwcm9jZXNzIHJlc3BvbnNlIGV4aXRDb2RlPSVkIHN0ZE91dD1gLCBleGl0Q29kZSk7XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSB0aGlzLl9wbHVnaW5zLmV4ZWMoJ3Rhc2suZXJyb3InLCB7IGVycm9yOiByZWplY3Rpb24gfSwgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwbHVnaW5Db250ZXh0KHRhc2ssIGFyZ3MpKSwgcmVzdWx0KSk7XG4gICAgICAgICAgICBpZiAoZXJyb3IgJiYgdGFzay5vbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYGV4aXRDb2RlPSVzIGhhbmRsaW5nIHdpdGggY3VzdG9tIGVycm9yIGhhbmRsZXJgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFzay5vbkVycm9yKHJlc3VsdCwgZXJyb3IsIChuZXdTdGRPdXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYGN1c3RvbSBlcnJvciBoYW5kbGVyIHRyZWF0ZWQgYXMgc3VjY2Vzc2ApO1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIoYGN1c3RvbSBlcnJvciByZXR1cm5lZCBhICVzYCwgdXRpbHNfMS5vYmplY3RUb1N0cmluZyhuZXdTdGRPdXQpKTtcbiAgICAgICAgICAgICAgICAgICAgZG9uZShuZXcgdXRpbHNfMS5HaXRPdXRwdXRTdHJlYW1zKEFycmF5LmlzQXJyYXkobmV3U3RkT3V0KSA/IEJ1ZmZlci5jb25jYXQobmV3U3RkT3V0KSA6IG5ld1N0ZE91dCwgQnVmZmVyLmNvbmNhdChzdGRFcnIpKSk7XG4gICAgICAgICAgICAgICAgfSwgZmFpbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhgaGFuZGxpbmcgYXMgZXJyb3I6IGV4aXRDb2RlPSVzIHN0ZEVycj0lcyByZWplY3Rpb249JW9gLCBleGl0Q29kZSwgc3RkRXJyLmxlbmd0aCwgcmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFpbChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgcmV0cmlldmluZyB0YXNrIG91dHB1dCBjb21wbGV0ZWApO1xuICAgICAgICAgICAgZG9uZShuZXcgdXRpbHNfMS5HaXRPdXRwdXRTdHJlYW1zKEJ1ZmZlci5jb25jYXQoc3RkT3V0KSwgQnVmZmVyLmNvbmNhdChzdGRFcnIpKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnaXRSZXNwb25zZSh0YXNrLCBjb21tYW5kLCBhcmdzLCBvdXRwdXRIYW5kbGVyLCBsb2dnZXIpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG91dHB1dExvZ2dlciA9IGxvZ2dlci5zaWJsaW5nKCdvdXRwdXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHNwYXduT3B0aW9ucyA9IHRoaXMuX3BsdWdpbnMuZXhlYygnc3Bhd24ub3B0aW9ucycsIHtcbiAgICAgICAgICAgICAgICBjd2Q6IHRoaXMuY3dkLFxuICAgICAgICAgICAgICAgIGVudjogdGhpcy5lbnYsXG4gICAgICAgICAgICAgICAgd2luZG93c0hpZGU6IHRydWUsXG4gICAgICAgICAgICB9LCBwbHVnaW5Db250ZXh0KHRhc2ssIHRhc2suY29tbWFuZHMpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoZG9uZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZE91dCA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZEVyciA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBhdHRlbXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgcmVqZWN0aW9uO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGF0dGVtcHRDbG9zZShleGl0Q29kZSwgZXZlbnQgPSAncmV0cnknKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNsb3Npbmcgd2hlbiB0aGVyZSBpcyBjb250ZW50LCB0ZXJtaW5hdGUgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGVtcHRlZCB8fCBzdGRFcnIubGVuZ3RoIHx8IHN0ZE91dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBleGl0Q29kZT0lcyBldmVudD0lcyByZWplY3Rpb249JW9gLCBleGl0Q29kZSwgZXZlbnQsIHJlamVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGRPdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RkRXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXRDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBhdHRlbXB0IGF0IGNsb3NpbmcgYnV0IG5vIGNvbnRlbnQgeWV0LCB3YWl0IGJyaWVmbHkgZm9yIHRoZSBjbG9zZS9leGl0IHRoYXQgbWF5IGZvbGxvd1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dGVtcHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYXR0ZW1wdENsb3NlKGV4aXRDb2RlLCAnZGVmZXJyZWQnKSwgNTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyKCdyZWNlaXZlZCAlcyBldmVudCBiZWZvcmUgY29udGVudCBvbiBzdGRPdXQvc3RkRXJyJywgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGAlcyAlb2AsIGNvbW1hbmQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGxvZ2dlcignJU8nLCBzcGF3bk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNwYXduZWQgPSBjaGlsZF9wcm9jZXNzXzEuc3Bhd24oY29tbWFuZCwgYXJncywgc3Bhd25PcHRpb25zKTtcbiAgICAgICAgICAgICAgICBzcGF3bmVkLnN0ZG91dC5vbignZGF0YScsIG9uRGF0YVJlY2VpdmVkKHN0ZE91dCwgJ3N0ZE91dCcsIGxvZ2dlciwgb3V0cHV0TG9nZ2VyLnN0ZXAoJ3N0ZE91dCcpKSk7XG4gICAgICAgICAgICAgICAgc3Bhd25lZC5zdGRlcnIub24oJ2RhdGEnLCBvbkRhdGFSZWNlaXZlZChzdGRFcnIsICdzdGRFcnInLCBsb2dnZXIsIG91dHB1dExvZ2dlci5zdGVwKCdzdGRFcnInKSkpO1xuICAgICAgICAgICAgICAgIHNwYXduZWQub24oJ2Vycm9yJywgb25FcnJvclJlY2VpdmVkKHN0ZEVyciwgbG9nZ2VyKSk7XG4gICAgICAgICAgICAgICAgc3Bhd25lZC5vbignY2xvc2UnLCAoY29kZSkgPT4gYXR0ZW1wdENsb3NlKGNvZGUsICdjbG9zZScpKTtcbiAgICAgICAgICAgICAgICBzcGF3bmVkLm9uKCdleGl0JywgKGNvZGUpID0+IGF0dGVtcHRDbG9zZShjb2RlLCAnZXhpdCcpKTtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0SGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIoYFBhc3NpbmcgY2hpbGQgcHJvY2VzcyBzdGRPdXQvc3RkRXJyIHRvIGN1c3RvbSBvdXRwdXRIYW5kbGVyYCk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dEhhbmRsZXIoY29tbWFuZCwgc3Bhd25lZC5zdGRvdXQsIHNwYXduZWQuc3RkZXJyLCBbLi4uYXJnc10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9wbHVnaW5zLmV4ZWMoJ3NwYXduLmFmdGVyJywgdW5kZWZpbmVkLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHBsdWdpbkNvbnRleHQodGFzaywgYXJncykpLCB7IHNwYXduZWQsIGtpbGwocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3Bhd25lZC5raWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Rpb24gPSByZWFzb247XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGF3bmVkLmtpbGwoJ1NJR0lOVCcpO1xuICAgICAgICAgICAgICAgICAgICB9IH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkdpdEV4ZWN1dG9yQ2hhaW4gPSBHaXRFeGVjdXRvckNoYWluO1xuZnVuY3Rpb24gcGx1Z2luQ29udGV4dCh0YXNrLCBjb21tYW5kcykge1xuICAgIHJldHVybiB7XG4gICAgICAgIG1ldGhvZDogdXRpbHNfMS5maXJzdCh0YXNrLmNvbW1hbmRzKSB8fCAnJyxcbiAgICAgICAgY29tbWFuZHMsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIG9uRXJyb3JSZWNlaXZlZCh0YXJnZXQsIGxvZ2dlcikge1xuICAgIHJldHVybiAoZXJyKSA9PiB7XG4gICAgICAgIGxvZ2dlcihgW0VSUk9SXSBjaGlsZCBwcm9jZXNzIGV4Y2VwdGlvbiAlb2AsIGVycik7XG4gICAgICAgIHRhcmdldC5wdXNoKEJ1ZmZlci5mcm9tKFN0cmluZyhlcnIuc3RhY2spLCAnYXNjaWknKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG9uRGF0YVJlY2VpdmVkKHRhcmdldCwgbmFtZSwgbG9nZ2VyLCBvdXRwdXQpIHtcbiAgICByZXR1cm4gKGJ1ZmZlcikgPT4ge1xuICAgICAgICBsb2dnZXIoYCVzIHJlY2VpdmVkICVMIGJ5dGVzYCwgbmFtZSwgYnVmZmVyKTtcbiAgICAgICAgb3V0cHV0KGAlQmAsIGJ1ZmZlcik7XG4gICAgICAgIHRhcmdldC5wdXNoKGJ1ZmZlcik7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1leGVjdXRvci1jaGFpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2l0RXhlY3V0b3IgPSB2b2lkIDA7XG5jb25zdCBnaXRfZXhlY3V0b3JfY2hhaW5fMSA9IHJlcXVpcmUoXCIuL2dpdC1leGVjdXRvci1jaGFpblwiKTtcbmNsYXNzIEdpdEV4ZWN1dG9yIHtcbiAgICBjb25zdHJ1Y3RvcihiaW5hcnkgPSAnZ2l0JywgY3dkLCBfc2NoZWR1bGVyLCBfcGx1Z2lucykge1xuICAgICAgICB0aGlzLmJpbmFyeSA9IGJpbmFyeTtcbiAgICAgICAgdGhpcy5jd2QgPSBjd2Q7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlciA9IF9zY2hlZHVsZXI7XG4gICAgICAgIHRoaXMuX3BsdWdpbnMgPSBfcGx1Z2lucztcbiAgICAgICAgdGhpcy5fY2hhaW4gPSBuZXcgZ2l0X2V4ZWN1dG9yX2NoYWluXzEuR2l0RXhlY3V0b3JDaGFpbih0aGlzLCB0aGlzLl9zY2hlZHVsZXIsIHRoaXMuX3BsdWdpbnMpO1xuICAgIH1cbiAgICBjaGFpbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBnaXRfZXhlY3V0b3JfY2hhaW5fMS5HaXRFeGVjdXRvckNoYWluKHRoaXMsIHRoaXMuX3NjaGVkdWxlciwgdGhpcy5fcGx1Z2lucyk7XG4gICAgfVxuICAgIHB1c2godGFzaykge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hhaW4ucHVzaCh0YXNrKTtcbiAgICB9XG59XG5leHBvcnRzLkdpdEV4ZWN1dG9yID0gR2l0RXhlY3V0b3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1naXQtZXhlY3V0b3IuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRhc2tDYWxsYmFjayA9IHZvaWQgMDtcbmNvbnN0IGdpdF9yZXNwb25zZV9lcnJvcl8xID0gcmVxdWlyZShcIi4vZXJyb3JzL2dpdC1yZXNwb25zZS1lcnJvclwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmZ1bmN0aW9uIHRhc2tDYWxsYmFjayh0YXNrLCByZXNwb25zZSwgY2FsbGJhY2sgPSB1dGlsc18xLk5PT1ApIHtcbiAgICBjb25zdCBvblN1Y2Nlc3MgPSAoZGF0YSkgPT4ge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgIGlmICgoZXJyID09PSBudWxsIHx8IGVyciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyLnRhc2spID09PSB0YXNrKSB7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEuR2l0UmVzcG9uc2VFcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhhZGREZXByZWNhdGlvbk5vdGljZVRvRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXNwb25zZS50aGVuKG9uU3VjY2Vzcywgb25FcnJvcik7XG59XG5leHBvcnRzLnRhc2tDYWxsYmFjayA9IHRhc2tDYWxsYmFjaztcbmZ1bmN0aW9uIGFkZERlcHJlY2F0aW9uTm90aWNlVG9FcnJvcihlcnIpIHtcbiAgICBsZXQgbG9nID0gKG5hbWUpID0+IHtcbiAgICAgICAgY29uc29sZS53YXJuKGBzaW1wbGUtZ2l0IGRlcHJlY2F0aW9uIG5vdGljZTogYWNjZXNzaW5nIEdpdFJlc3BvbnNlRXJyb3IuJHtuYW1lfSBzaG91bGQgYmUgR2l0UmVzcG9uc2VFcnJvci5naXQuJHtuYW1lfSwgdGhpcyB3aWxsIG5vIGxvbmdlciBiZSBhdmFpbGFibGUgaW4gdmVyc2lvbiAzYCk7XG4gICAgICAgIGxvZyA9IHV0aWxzXzEuTk9PUDtcbiAgICB9O1xuICAgIHJldHVybiBPYmplY3QuY3JlYXRlKGVyciwgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZXJyLmdpdCkucmVkdWNlKGRlc2NyaXB0b3JSZWR1Y2VyLCB7fSkpO1xuICAgIGZ1bmN0aW9uIGRlc2NyaXB0b3JSZWR1Y2VyKGFsbCwgbmFtZSkge1xuICAgICAgICBpZiAobmFtZSBpbiBlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBhbGw7XG4gICAgICAgIH1cbiAgICAgICAgYWxsW25hbWVdID0ge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIGxvZyhuYW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyLmdpdFtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBhbGw7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFzay1jYWxsYmFjay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeVRhc2sgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbmZ1bmN0aW9uIGNoYW5nZVdvcmtpbmdEaXJlY3RvcnlUYXNrKGRpcmVjdG9yeSwgcm9vdCkge1xuICAgIHJldHVybiB0YXNrXzEuYWRob2NFeGVjVGFzaygoaW5zdGFuY2UpID0+IHtcbiAgICAgICAgaWYgKCF1dGlsc18xLmZvbGRlckV4aXN0cyhkaXJlY3RvcnkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEdpdC5jd2Q6IGNhbm5vdCBjaGFuZ2UgdG8gbm9uLWRpcmVjdG9yeSBcIiR7ZGlyZWN0b3J5fVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgocm9vdCB8fCBpbnN0YW5jZSkuY3dkID0gZGlyZWN0b3J5KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuY2hhbmdlV29ya2luZ0RpcmVjdG9yeVRhc2sgPSBjaGFuZ2VXb3JraW5nRGlyZWN0b3J5VGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoYW5nZS13b3JraW5nLWRpcmVjdG9yeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaGFzaE9iamVjdFRhc2sgPSB2b2lkIDA7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xuLyoqXG4gKiBUYXNrIHVzZWQgYnkgYGdpdC5oYXNoT2JqZWN0YFxuICovXG5mdW5jdGlvbiBoYXNoT2JqZWN0VGFzayhmaWxlUGF0aCwgd3JpdGUpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnaGFzaC1vYmplY3QnLCBmaWxlUGF0aF07XG4gICAgaWYgKHdyaXRlKSB7XG4gICAgICAgIGNvbW1hbmRzLnB1c2goJy13Jyk7XG4gICAgfVxuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcywgdHJ1ZSk7XG59XG5leHBvcnRzLmhhc2hPYmplY3RUYXNrID0gaGFzaE9iamVjdFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYXNoLW9iamVjdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VJbml0ID0gZXhwb3J0cy5Jbml0U3VtbWFyeSA9IHZvaWQgMDtcbmNsYXNzIEluaXRTdW1tYXJ5IHtcbiAgICBjb25zdHJ1Y3RvcihiYXJlLCBwYXRoLCBleGlzdGluZywgZ2l0RGlyKSB7XG4gICAgICAgIHRoaXMuYmFyZSA9IGJhcmU7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuZXhpc3RpbmcgPSBleGlzdGluZztcbiAgICAgICAgdGhpcy5naXREaXIgPSBnaXREaXI7XG4gICAgfVxufVxuZXhwb3J0cy5Jbml0U3VtbWFyeSA9IEluaXRTdW1tYXJ5O1xuY29uc3QgaW5pdFJlc3BvbnNlUmVnZXggPSAvXkluaXQuKyByZXBvc2l0b3J5IGluICguKykkLztcbmNvbnN0IHJlSW5pdFJlc3BvbnNlUmVnZXggPSAvXlJlaW4uKyBpbiAoLispJC87XG5mdW5jdGlvbiBwYXJzZUluaXQoYmFyZSwgcGF0aCwgdGV4dCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gU3RyaW5nKHRleHQpLnRyaW0oKTtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICgocmVzdWx0ID0gaW5pdFJlc3BvbnNlUmVnZXguZXhlYyhyZXNwb25zZSkpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5pdFN1bW1hcnkoYmFyZSwgcGF0aCwgZmFsc2UsIHJlc3VsdFsxXSk7XG4gICAgfVxuICAgIGlmICgocmVzdWx0ID0gcmVJbml0UmVzcG9uc2VSZWdleC5leGVjKHJlc3BvbnNlKSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbml0U3VtbWFyeShiYXJlLCBwYXRoLCB0cnVlLCByZXN1bHRbMV0pO1xuICAgIH1cbiAgICBsZXQgZ2l0RGlyID0gJyc7XG4gICAgY29uc3QgdG9rZW5zID0gcmVzcG9uc2Uuc3BsaXQoJyAnKTtcbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHRva2Vucy5zaGlmdCgpO1xuICAgICAgICBpZiAodG9rZW4gPT09ICdpbicpIHtcbiAgICAgICAgICAgIGdpdERpciA9IHRva2Vucy5qb2luKCcgJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEluaXRTdW1tYXJ5KGJhcmUsIHBhdGgsIC9ecmUvaS50ZXN0KHJlc3BvbnNlKSwgZ2l0RGlyKTtcbn1cbmV4cG9ydHMucGFyc2VJbml0ID0gcGFyc2VJbml0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SW5pdFN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluaXRUYXNrID0gdm9pZCAwO1xuY29uc3QgSW5pdFN1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvSW5pdFN1bW1hcnlcIik7XG5jb25zdCBiYXJlQ29tbWFuZCA9ICctLWJhcmUnO1xuZnVuY3Rpb24gaGFzQmFyZUNvbW1hbmQoY29tbWFuZCkge1xuICAgIHJldHVybiBjb21tYW5kLmluY2x1ZGVzKGJhcmVDb21tYW5kKTtcbn1cbmZ1bmN0aW9uIGluaXRUYXNrKGJhcmUgPSBmYWxzZSwgcGF0aCwgY3VzdG9tQXJncykge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydpbml0JywgLi4uY3VzdG9tQXJnc107XG4gICAgaWYgKGJhcmUgJiYgIWhhc0JhcmVDb21tYW5kKGNvbW1hbmRzKSkge1xuICAgICAgICBjb21tYW5kcy5zcGxpY2UoMSwgMCwgYmFyZUNvbW1hbmQpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXIodGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIEluaXRTdW1tYXJ5XzEucGFyc2VJbml0KGNvbW1hbmRzLmluY2x1ZGVzKCctLWJhcmUnKSwgcGF0aCwgdGV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5pbml0VGFzayA9IGluaXRUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5pdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRGlmZlN1bW1hcnkgPSB2b2lkIDA7XG4vKioqXG4gKiBUaGUgRGlmZlN1bW1hcnkgaXMgcmV0dXJuZWQgYXMgYSByZXNwb25zZSB0byBnZXR0aW5nIGBnaXQoKS5zdGF0dXMoKWBcbiAqL1xuY2xhc3MgRGlmZlN1bW1hcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoYW5nZWQgPSAwO1xuICAgICAgICB0aGlzLmRlbGV0aW9ucyA9IDA7XG4gICAgICAgIHRoaXMuaW5zZXJ0aW9ucyA9IDA7XG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICB9XG59XG5leHBvcnRzLkRpZmZTdW1tYXJ5ID0gRGlmZlN1bW1hcnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1EaWZmU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VEaWZmUmVzdWx0ID0gdm9pZCAwO1xuY29uc3QgRGlmZlN1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvRGlmZlN1bW1hcnlcIik7XG5mdW5jdGlvbiBwYXJzZURpZmZSZXN1bHQoc3RkT3V0KSB7XG4gICAgY29uc3QgbGluZXMgPSBzdGRPdXQudHJpbSgpLnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBzdGF0dXMgPSBuZXcgRGlmZlN1bW1hcnlfMS5EaWZmU3VtbWFyeSgpO1xuICAgIHJlYWRTdW1tYXJ5TGluZShzdGF0dXMsIGxpbmVzLnBvcCgpKTtcbiAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gbGluZXMubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgICB0ZXh0RmlsZUNoYW5nZShsaW5lLCBzdGF0dXMpIHx8IGJpbmFyeUZpbGVDaGFuZ2UobGluZSwgc3RhdHVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXR1cztcbn1cbmV4cG9ydHMucGFyc2VEaWZmUmVzdWx0ID0gcGFyc2VEaWZmUmVzdWx0O1xuZnVuY3Rpb24gcmVhZFN1bW1hcnlMaW5lKHN0YXR1cywgc3VtbWFyeSkge1xuICAgIChzdW1tYXJ5IHx8ICcnKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5zcGxpdCgnLCAnKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gLyhcXGQrKVxccyhbYS16XSspLy5leGVjKHRleHQpO1xuICAgICAgICBpZiAoIXN1bW1hcnkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdW1tYXJ5VHlwZShzdGF0dXMsIHN1bW1hcnlbMl0sIHBhcnNlSW50KHN1bW1hcnlbMV0sIDEwKSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBzdW1tYXJ5VHlwZShzdGF0dXMsIGtleSwgdmFsdWUpIHtcbiAgICBjb25zdCBtYXRjaCA9ICgvKFthLXpdKz8pcz9cXGIvLmV4ZWMoa2V5KSk7XG4gICAgaWYgKCFtYXRjaCB8fCAhc3RhdHVzVXBkYXRlW21hdGNoWzFdXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YXR1c1VwZGF0ZVttYXRjaFsxXV0oc3RhdHVzLCB2YWx1ZSk7XG59XG5jb25zdCBzdGF0dXNVcGRhdGUgPSB7XG4gICAgZmlsZShzdGF0dXMsIHZhbHVlKSB7XG4gICAgICAgIHN0YXR1cy5jaGFuZ2VkID0gdmFsdWU7XG4gICAgfSxcbiAgICBkZWxldGlvbihzdGF0dXMsIHZhbHVlKSB7XG4gICAgICAgIHN0YXR1cy5kZWxldGlvbnMgPSB2YWx1ZTtcbiAgICB9LFxuICAgIGluc2VydGlvbihzdGF0dXMsIHZhbHVlKSB7XG4gICAgICAgIHN0YXR1cy5pbnNlcnRpb25zID0gdmFsdWU7XG4gICAgfVxufTtcbmZ1bmN0aW9uIHRleHRGaWxlQ2hhbmdlKGlucHV0LCB7IGZpbGVzIH0pIHtcbiAgICBjb25zdCBsaW5lID0gaW5wdXQudHJpbSgpLm1hdGNoKC9eKC4rKVxccytcXHxcXHMrKFxcZCspKFxccytbK1xcLV0rKT8kLyk7XG4gICAgaWYgKGxpbmUpIHtcbiAgICAgICAgdmFyIGFsdGVyYXRpb25zID0gKGxpbmVbM10gfHwgJycpLnRyaW0oKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgICBmaWxlOiBsaW5lWzFdLnRyaW0oKSxcbiAgICAgICAgICAgIGNoYW5nZXM6IHBhcnNlSW50KGxpbmVbMl0sIDEwKSxcbiAgICAgICAgICAgIGluc2VydGlvbnM6IGFsdGVyYXRpb25zLnJlcGxhY2UoLy0vZywgJycpLmxlbmd0aCxcbiAgICAgICAgICAgIGRlbGV0aW9uczogYWx0ZXJhdGlvbnMucmVwbGFjZSgvXFwrL2csICcnKS5sZW5ndGgsXG4gICAgICAgICAgICBiaW5hcnk6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gYmluYXJ5RmlsZUNoYW5nZShpbnB1dCwgeyBmaWxlcyB9KSB7XG4gICAgY29uc3QgbGluZSA9IGlucHV0Lm1hdGNoKC9eKC4rKSBcXHxcXHMrQmluIChbMC05Ll0rKSAtPiAoWzAtOS5dKykgKFthLXpdKykkLyk7XG4gICAgaWYgKGxpbmUpIHtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgICBmaWxlOiBsaW5lWzFdLnRyaW0oKSxcbiAgICAgICAgICAgIGJlZm9yZTogK2xpbmVbMl0sXG4gICAgICAgICAgICBhZnRlcjogK2xpbmVbM10sXG4gICAgICAgICAgICBiaW5hcnk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1kaWZmLXN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUxpc3RMb2dTdW1tYXJ5UGFyc2VyID0gZXhwb3J0cy5TUExJVFRFUiA9IGV4cG9ydHMuQ09NTUlUX0JPVU5EQVJZID0gZXhwb3J0cy5TVEFSVF9CT1VOREFSWSA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZV9kaWZmX3N1bW1hcnlfMSA9IHJlcXVpcmUoXCIuL3BhcnNlLWRpZmYtc3VtbWFyeVwiKTtcbmV4cG9ydHMuU1RBUlRfQk9VTkRBUlkgPSAnw7LDssOyw7LDssOyICc7XG5leHBvcnRzLkNPTU1JVF9CT1VOREFSWSA9ICcgw7LDsic7XG5leHBvcnRzLlNQTElUVEVSID0gJyDDsiAnO1xuY29uc3QgZGVmYXVsdEZpZWxkTmFtZXMgPSBbJ2hhc2gnLCAnZGF0ZScsICdtZXNzYWdlJywgJ3JlZnMnLCAnYXV0aG9yX25hbWUnLCAnYXV0aG9yX2VtYWlsJ107XG5mdW5jdGlvbiBsaW5lQnVpbGRlcih0b2tlbnMsIGZpZWxkcykge1xuICAgIHJldHVybiBmaWVsZHMucmVkdWNlKChsaW5lLCBmaWVsZCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGluZVtmaWVsZF0gPSB0b2tlbnNbaW5kZXhdIHx8ICcnO1xuICAgICAgICByZXR1cm4gbGluZTtcbiAgICB9LCBPYmplY3QuY3JlYXRlKHsgZGlmZjogbnVsbCB9KSk7XG59XG5mdW5jdGlvbiBjcmVhdGVMaXN0TG9nU3VtbWFyeVBhcnNlcihzcGxpdHRlciA9IGV4cG9ydHMuU1BMSVRURVIsIGZpZWxkcyA9IGRlZmF1bHRGaWVsZE5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzdGRPdXQpIHtcbiAgICAgICAgY29uc3QgYWxsID0gdXRpbHNfMS50b0xpbmVzV2l0aENvbnRlbnQoc3RkT3V0LCB0cnVlLCBleHBvcnRzLlNUQVJUX0JPVU5EQVJZKVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgY29uc3QgbGluZURldGFpbCA9IGl0ZW0udHJpbSgpLnNwbGl0KGV4cG9ydHMuQ09NTUlUX0JPVU5EQVJZKTtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RMb2dMaW5lID0gbGluZUJ1aWxkZXIobGluZURldGFpbFswXS50cmltKCkuc3BsaXQoc3BsaXR0ZXIpLCBmaWVsZHMpO1xuICAgICAgICAgICAgaWYgKGxpbmVEZXRhaWwubGVuZ3RoID4gMSAmJiAhIWxpbmVEZXRhaWxbMV0udHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgbGlzdExvZ0xpbmUuZGlmZiA9IHBhcnNlX2RpZmZfc3VtbWFyeV8xLnBhcnNlRGlmZlJlc3VsdChsaW5lRGV0YWlsWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaXN0TG9nTGluZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGwsXG4gICAgICAgICAgICBsYXRlc3Q6IGFsbC5sZW5ndGggJiYgYWxsWzBdIHx8IG51bGwsXG4gICAgICAgICAgICB0b3RhbDogYWxsLmxlbmd0aCxcbiAgICAgICAgfTtcbiAgICB9O1xufVxuZXhwb3J0cy5jcmVhdGVMaXN0TG9nU3VtbWFyeVBhcnNlciA9IGNyZWF0ZUxpc3RMb2dTdW1tYXJ5UGFyc2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtbGlzdC1sb2ctc3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubG9nVGFzayA9IGV4cG9ydHMucGFyc2VMb2dPcHRpb25zID0gdm9pZCAwO1xuY29uc3QgcGFyc2VfbGlzdF9sb2dfc3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtbGlzdC1sb2ctc3VtbWFyeVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xudmFyIGV4Y2x1ZGVPcHRpb25zO1xuKGZ1bmN0aW9uIChleGNsdWRlT3B0aW9ucykge1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1wiLS1wcmV0dHlcIl0gPSAwXSA9IFwiLS1wcmV0dHlcIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcIm1heC1jb3VudFwiXSA9IDFdID0gXCJtYXgtY291bnRcIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcIm1heENvdW50XCJdID0gMl0gPSBcIm1heENvdW50XCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJuXCJdID0gM10gPSBcIm5cIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcImZpbGVcIl0gPSA0XSA9IFwiZmlsZVwiO1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1wiZm9ybWF0XCJdID0gNV0gPSBcImZvcm1hdFwiO1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1wiZnJvbVwiXSA9IDZdID0gXCJmcm9tXCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJ0b1wiXSA9IDddID0gXCJ0b1wiO1xuICAgIGV4Y2x1ZGVPcHRpb25zW2V4Y2x1ZGVPcHRpb25zW1wic3BsaXR0ZXJcIl0gPSA4XSA9IFwic3BsaXR0ZXJcIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcInN5bW1ldHJpY1wiXSA9IDldID0gXCJzeW1tZXRyaWNcIjtcbiAgICBleGNsdWRlT3B0aW9uc1tleGNsdWRlT3B0aW9uc1tcIm11bHRpTGluZVwiXSA9IDEwXSA9IFwibXVsdGlMaW5lXCI7XG4gICAgZXhjbHVkZU9wdGlvbnNbZXhjbHVkZU9wdGlvbnNbXCJzdHJpY3REYXRlXCJdID0gMTFdID0gXCJzdHJpY3REYXRlXCI7XG59KShleGNsdWRlT3B0aW9ucyB8fCAoZXhjbHVkZU9wdGlvbnMgPSB7fSkpO1xuZnVuY3Rpb24gcHJldHR5Rm9ybWF0KGZvcm1hdCwgc3BsaXR0ZXIpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBbXTtcbiAgICBjb25zdCBmb3JtYXRTdHIgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhmb3JtYXQpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgZm9ybWF0U3RyLnB1c2goU3RyaW5nKGZvcm1hdFtmaWVsZF0pKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW1xuICAgICAgICBmaWVsZHMsIGZvcm1hdFN0ci5qb2luKHNwbGl0dGVyKVxuICAgIF07XG59XG5mdW5jdGlvbiB1c2VyT3B0aW9ucyhpbnB1dCkge1xuICAgIGNvbnN0IG91dHB1dCA9IE9iamVjdC5hc3NpZ24oe30sIGlucHV0KTtcbiAgICBPYmplY3Qua2V5cyhpbnB1dCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoa2V5IGluIGV4Y2x1ZGVPcHRpb25zKSB7XG4gICAgICAgICAgICBkZWxldGUgb3V0cHV0W2tleV07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3V0cHV0O1xufVxuZnVuY3Rpb24gcGFyc2VMb2dPcHRpb25zKG9wdCA9IHt9LCBjdXN0b21BcmdzID0gW10pIHtcbiAgICBjb25zdCBzcGxpdHRlciA9IG9wdC5zcGxpdHRlciB8fCBwYXJzZV9saXN0X2xvZ19zdW1tYXJ5XzEuU1BMSVRURVI7XG4gICAgY29uc3QgZm9ybWF0ID0gb3B0LmZvcm1hdCB8fCB7XG4gICAgICAgIGhhc2g6ICclSCcsXG4gICAgICAgIGRhdGU6IG9wdC5zdHJpY3REYXRlID09PSBmYWxzZSA/ICclYWknIDogJyVhSScsXG4gICAgICAgIG1lc3NhZ2U6ICclcycsXG4gICAgICAgIHJlZnM6ICclRCcsXG4gICAgICAgIGJvZHk6IG9wdC5tdWx0aUxpbmUgPyAnJUInIDogJyViJyxcbiAgICAgICAgYXV0aG9yX25hbWU6ICclYU4nLFxuICAgICAgICBhdXRob3JfZW1haWw6ICclYWUnXG4gICAgfTtcbiAgICBjb25zdCBbZmllbGRzLCBmb3JtYXRTdHJdID0gcHJldHR5Rm9ybWF0KGZvcm1hdCwgc3BsaXR0ZXIpO1xuICAgIGNvbnN0IHN1ZmZpeCA9IFtdO1xuICAgIGNvbnN0IGNvbW1hbmQgPSBbXG4gICAgICAgIGAtLXByZXR0eT1mb3JtYXQ6JHtwYXJzZV9saXN0X2xvZ19zdW1tYXJ5XzEuU1RBUlRfQk9VTkRBUll9JHtmb3JtYXRTdHJ9JHtwYXJzZV9saXN0X2xvZ19zdW1tYXJ5XzEuQ09NTUlUX0JPVU5EQVJZfWAsXG4gICAgICAgIC4uLmN1c3RvbUFyZ3MsXG4gICAgXTtcbiAgICBjb25zdCBtYXhDb3VudCA9IG9wdC5uIHx8IG9wdFsnbWF4LWNvdW50J10gfHwgb3B0Lm1heENvdW50O1xuICAgIGlmIChtYXhDb3VudCkge1xuICAgICAgICBjb21tYW5kLnB1c2goYC0tbWF4LWNvdW50PSR7bWF4Q291bnR9YCk7XG4gICAgfVxuICAgIGlmIChvcHQuZnJvbSAmJiBvcHQudG8pIHtcbiAgICAgICAgY29uc3QgcmFuZ2VPcGVyYXRvciA9IChvcHQuc3ltbWV0cmljICE9PSBmYWxzZSkgPyAnLi4uJyA6ICcuLic7XG4gICAgICAgIHN1ZmZpeC5wdXNoKGAke29wdC5mcm9tfSR7cmFuZ2VPcGVyYXRvcn0ke29wdC50b31gKTtcbiAgICB9XG4gICAgaWYgKG9wdC5maWxlKSB7XG4gICAgICAgIHN1ZmZpeC5wdXNoKCctLWZvbGxvdycsIG9wdC5maWxlKTtcbiAgICB9XG4gICAgdXRpbHNfMS5hcHBlbmRUYXNrT3B0aW9ucyh1c2VyT3B0aW9ucyhvcHQpLCBjb21tYW5kKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaWVsZHMsXG4gICAgICAgIHNwbGl0dGVyLFxuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgLi4uY29tbWFuZCxcbiAgICAgICAgICAgIC4uLnN1ZmZpeCxcbiAgICAgICAgXSxcbiAgICB9O1xufVxuZXhwb3J0cy5wYXJzZUxvZ09wdGlvbnMgPSBwYXJzZUxvZ09wdGlvbnM7XG5mdW5jdGlvbiBsb2dUYXNrKHNwbGl0dGVyLCBmaWVsZHMsIGN1c3RvbUFyZ3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kczogWydsb2cnLCAuLi5jdXN0b21BcmdzXSxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXI6IHBhcnNlX2xpc3RfbG9nX3N1bW1hcnlfMS5jcmVhdGVMaXN0TG9nU3VtbWFyeVBhcnNlcihzcGxpdHRlciwgZmllbGRzKSxcbiAgICB9O1xufVxuZXhwb3J0cy5sb2dUYXNrID0gbG9nVGFzaztcbmZ1bmN0aW9uIGRlZmF1bHRfMSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsb2coLi4ucmVzdCkge1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBjb25zdCB0YXNrID0gcmVqZWN0RGVwcmVjYXRlZFNpZ25hdHVyZXMoLi4ucmVzdCkgfHxcbiAgICAgICAgICAgICAgICBjcmVhdGVMb2dUYXNrKHBhcnNlTG9nT3B0aW9ucyh1dGlsc18xLnRyYWlsaW5nT3B0aW9uc0FyZ3VtZW50KGFyZ3VtZW50cyksIHV0aWxzXzEuZmlsdGVyVHlwZShhcmd1bWVudHNbMF0sIHV0aWxzXzEuZmlsdGVyQXJyYXkpKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrLCBuZXh0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gY3JlYXRlTG9nVGFzayhvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBsb2dUYXNrKG9wdGlvbnMuc3BsaXR0ZXIsIG9wdGlvbnMuZmllbGRzLCBvcHRpb25zLmNvbW1hbmRzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVqZWN0RGVwcmVjYXRlZFNpZ25hdHVyZXMoZnJvbSwgdG8pIHtcbiAgICAgICAgcmV0dXJuICh1dGlsc18xLmZpbHRlclN0cmluZyhmcm9tKSAmJlxuICAgICAgICAgICAgdXRpbHNfMS5maWx0ZXJTdHJpbmcodG8pICYmXG4gICAgICAgICAgICB0YXNrXzEuY29uZmlndXJhdGlvbkVycm9yVGFzayhgZ2l0LmxvZyhzdHJpbmcsIHN0cmluZykgc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggZ2l0LmxvZyh7IGZyb206IHN0cmluZywgdG86IHN0cmluZyB9KWApKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2cuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk1lcmdlU3VtbWFyeURldGFpbCA9IGV4cG9ydHMuTWVyZ2VTdW1tYXJ5Q29uZmxpY3QgPSB2b2lkIDA7XG5jbGFzcyBNZXJnZVN1bW1hcnlDb25mbGljdCB7XG4gICAgY29uc3RydWN0b3IocmVhc29uLCBmaWxlID0gbnVsbCwgbWV0YSkge1xuICAgICAgICB0aGlzLnJlYXNvbiA9IHJlYXNvbjtcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICAgICAgdGhpcy5tZXRhID0gbWV0YTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmZpbGV9OiR7dGhpcy5yZWFzb259YDtcbiAgICB9XG59XG5leHBvcnRzLk1lcmdlU3VtbWFyeUNvbmZsaWN0ID0gTWVyZ2VTdW1tYXJ5Q29uZmxpY3Q7XG5jbGFzcyBNZXJnZVN1bW1hcnlEZXRhaWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbmZsaWN0cyA9IFtdO1xuICAgICAgICB0aGlzLm1lcmdlcyA9IFtdO1xuICAgICAgICB0aGlzLnJlc3VsdCA9ICdzdWNjZXNzJztcbiAgICB9XG4gICAgZ2V0IGZhaWxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmxpY3RzLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIGdldCByZWFzb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZsaWN0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBgQ09ORkxJQ1RTOiAke3RoaXMuY29uZmxpY3RzLmpvaW4oJywgJyl9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ09LJztcbiAgICB9XG59XG5leHBvcnRzLk1lcmdlU3VtbWFyeURldGFpbCA9IE1lcmdlU3VtbWFyeURldGFpbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU1lcmdlU3VtbWFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUHVsbFN1bW1hcnkgPSB2b2lkIDA7XG5jbGFzcyBQdWxsU3VtbWFyeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVtb3RlTWVzc2FnZXMgPSB7XG4gICAgICAgICAgICBhbGw6IFtdLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNyZWF0ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5kZWxldGVkID0gW107XG4gICAgICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5kZWxldGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5pbnNlcnRpb25zID0ge307XG4gICAgICAgIHRoaXMuc3VtbWFyeSA9IHtcbiAgICAgICAgICAgIGNoYW5nZXM6IDAsXG4gICAgICAgICAgICBkZWxldGlvbnM6IDAsXG4gICAgICAgICAgICBpbnNlcnRpb25zOiAwLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuUHVsbFN1bW1hcnkgPSBQdWxsU3VtbWFyeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVB1bGxTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZW1vdGVNZXNzYWdlc09iamVjdFBhcnNlcnMgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuZnVuY3Rpb24gb2JqZWN0RW51bWVyYXRpb25SZXN1bHQocmVtb3RlTWVzc2FnZXMpIHtcbiAgICByZXR1cm4gKHJlbW90ZU1lc3NhZ2VzLm9iamVjdHMgPSByZW1vdGVNZXNzYWdlcy5vYmplY3RzIHx8IHtcbiAgICAgICAgY29tcHJlc3Npbmc6IDAsXG4gICAgICAgIGNvdW50aW5nOiAwLFxuICAgICAgICBlbnVtZXJhdGluZzogMCxcbiAgICAgICAgcGFja1JldXNlZDogMCxcbiAgICAgICAgcmV1c2VkOiB7IGNvdW50OiAwLCBkZWx0YTogMCB9LFxuICAgICAgICB0b3RhbDogeyBjb3VudDogMCwgZGVsdGE6IDAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gYXNPYmplY3RDb3VudChzb3VyY2UpIHtcbiAgICBjb25zdCBjb3VudCA9IC9eXFxzKihcXGQrKS8uZXhlYyhzb3VyY2UpO1xuICAgIGNvbnN0IGRlbHRhID0gL2RlbHRhIChcXGQrKS9pLmV4ZWMoc291cmNlKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb3VudDogdXRpbHNfMS5hc051bWJlcihjb3VudCAmJiBjb3VudFsxXSB8fCAnMCcpLFxuICAgICAgICBkZWx0YTogdXRpbHNfMS5hc051bWJlcihkZWx0YSAmJiBkZWx0YVsxXSB8fCAnMCcpLFxuICAgIH07XG59XG5leHBvcnRzLnJlbW90ZU1lc3NhZ2VzT2JqZWN0UGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5SZW1vdGVMaW5lUGFyc2VyKC9ecmVtb3RlOlxccyooZW51bWVyYXRpbmd8Y291bnRpbmd8Y29tcHJlc3NpbmcpIG9iamVjdHM6IChcXGQrKSwvaSwgKHJlc3VsdCwgW2FjdGlvbiwgY291bnRdKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGFjdGlvbi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBlbnVtZXJhdGlvbiA9IG9iamVjdEVudW1lcmF0aW9uUmVzdWx0KHJlc3VsdC5yZW1vdGVNZXNzYWdlcyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW51bWVyYXRpb24sIHsgW2tleV06IHV0aWxzXzEuYXNOdW1iZXIoY291bnQpIH0pO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLlJlbW90ZUxpbmVQYXJzZXIoL15yZW1vdGU6XFxzKihlbnVtZXJhdGluZ3xjb3VudGluZ3xjb21wcmVzc2luZykgb2JqZWN0czogXFxkKyUgXFwoXFxkK1xcLyhcXGQrKVxcKSwvaSwgKHJlc3VsdCwgW2FjdGlvbiwgY291bnRdKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGFjdGlvbi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBlbnVtZXJhdGlvbiA9IG9iamVjdEVudW1lcmF0aW9uUmVzdWx0KHJlc3VsdC5yZW1vdGVNZXNzYWdlcyk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW51bWVyYXRpb24sIHsgW2tleV06IHV0aWxzXzEuYXNOdW1iZXIoY291bnQpIH0pO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLlJlbW90ZUxpbmVQYXJzZXIoL3RvdGFsIChbXixdKyksIHJldXNlZCAoW14sXSspLCBwYWNrLXJldXNlZCAoXFxkKykvaSwgKHJlc3VsdCwgW3RvdGFsLCByZXVzZWQsIHBhY2tSZXVzZWRdKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iamVjdHMgPSBvYmplY3RFbnVtZXJhdGlvblJlc3VsdChyZXN1bHQucmVtb3RlTWVzc2FnZXMpO1xuICAgICAgICBvYmplY3RzLnRvdGFsID0gYXNPYmplY3RDb3VudCh0b3RhbCk7XG4gICAgICAgIG9iamVjdHMucmV1c2VkID0gYXNPYmplY3RDb3VudChyZXVzZWQpO1xuICAgICAgICBvYmplY3RzLnBhY2tSZXVzZWQgPSB1dGlsc18xLmFzTnVtYmVyKHBhY2tSZXVzZWQpO1xuICAgIH0pLFxuXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLXJlbW90ZS1vYmplY3RzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZW1vdGVNZXNzYWdlU3VtbWFyeSA9IGV4cG9ydHMucGFyc2VSZW1vdGVNZXNzYWdlcyA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZV9yZW1vdGVfb2JqZWN0c18xID0gcmVxdWlyZShcIi4vcGFyc2UtcmVtb3RlLW9iamVjdHNcIik7XG5jb25zdCBwYXJzZXJzID0gW1xuICAgIG5ldyB1dGlsc18xLlJlbW90ZUxpbmVQYXJzZXIoL15yZW1vdGU6XFxzKiguKykkLywgKHJlc3VsdCwgW3RleHRdKSA9PiB7XG4gICAgICAgIHJlc3VsdC5yZW1vdGVNZXNzYWdlcy5hbGwucHVzaCh0ZXh0LnRyaW0oKSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KSxcbiAgICAuLi5wYXJzZV9yZW1vdGVfb2JqZWN0c18xLnJlbW90ZU1lc3NhZ2VzT2JqZWN0UGFyc2VycyxcbiAgICBuZXcgdXRpbHNfMS5SZW1vdGVMaW5lUGFyc2VyKFsvY3JlYXRlIGEgKD86cHVsbHxtZXJnZSkgcmVxdWVzdC9pLCAvXFxzKGh0dHBzPzpcXC9cXC9cXFMrKSQvXSwgKHJlc3VsdCwgW3B1bGxSZXF1ZXN0VXJsXSkgPT4ge1xuICAgICAgICByZXN1bHQucmVtb3RlTWVzc2FnZXMucHVsbFJlcXVlc3RVcmwgPSBwdWxsUmVxdWVzdFVybDtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5SZW1vdGVMaW5lUGFyc2VyKFsvZm91bmQgKFxcZCspIHZ1bG5lcmFiaWxpdGllcy4rXFwoKFteKV0rKVxcKS9pLCAvXFxzKGh0dHBzPzpcXC9cXC9cXFMrKSQvXSwgKHJlc3VsdCwgW2NvdW50LCBzdW1tYXJ5LCB1cmxdKSA9PiB7XG4gICAgICAgIHJlc3VsdC5yZW1vdGVNZXNzYWdlcy52dWxuZXJhYmlsaXRpZXMgPSB7XG4gICAgICAgICAgICBjb3VudDogdXRpbHNfMS5hc051bWJlcihjb3VudCksXG4gICAgICAgICAgICBzdW1tYXJ5LFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICB9O1xuICAgIH0pLFxuXTtcbmZ1bmN0aW9uIHBhcnNlUmVtb3RlTWVzc2FnZXMoX3N0ZE91dCwgc3RkRXJyKSB7XG4gICAgcmV0dXJuIHV0aWxzXzEucGFyc2VTdHJpbmdSZXNwb25zZSh7IHJlbW90ZU1lc3NhZ2VzOiBuZXcgUmVtb3RlTWVzc2FnZVN1bW1hcnkoKSB9LCBwYXJzZXJzLCBzdGRFcnIpO1xufVxuZXhwb3J0cy5wYXJzZVJlbW90ZU1lc3NhZ2VzID0gcGFyc2VSZW1vdGVNZXNzYWdlcztcbmNsYXNzIFJlbW90ZU1lc3NhZ2VTdW1tYXJ5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5hbGwgPSBbXTtcbiAgICB9XG59XG5leHBvcnRzLlJlbW90ZU1lc3NhZ2VTdW1tYXJ5ID0gUmVtb3RlTWVzc2FnZVN1bW1hcnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1yZW1vdGUtbWVzc2FnZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlUHVsbFJlc3VsdCA9IGV4cG9ydHMucGFyc2VQdWxsRGV0YWlsID0gdm9pZCAwO1xuY29uc3QgUHVsbFN1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9yZXNwb25zZXMvUHVsbFN1bW1hcnlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VfcmVtb3RlX21lc3NhZ2VzXzEgPSByZXF1aXJlKFwiLi9wYXJzZS1yZW1vdGUtbWVzc2FnZXNcIik7XG5jb25zdCBGSUxFX1VQREFURV9SRUdFWCA9IC9eXFxzKiguKz8pXFxzK1xcfFxccytcXGQrXFxzKihcXCsqKSgtKikvO1xuY29uc3QgU1VNTUFSWV9SRUdFWCA9IC8oXFxkKylcXEQrKChcXGQrKVxcRCtcXChcXCtcXCkpPyhcXEQrKFxcZCspXFxEK1xcKC1cXCkpPy87XG5jb25zdCBBQ1RJT05fUkVHRVggPSAvXihjcmVhdGV8ZGVsZXRlKSBtb2RlIFxcZCsgKC4rKS87XG5jb25zdCBwYXJzZXJzID0gW1xuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoRklMRV9VUERBVEVfUkVHRVgsIChyZXN1bHQsIFtmaWxlLCBpbnNlcnRpb25zLCBkZWxldGlvbnNdKSA9PiB7XG4gICAgICAgIHJlc3VsdC5maWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICBpZiAoaW5zZXJ0aW9ucykge1xuICAgICAgICAgICAgcmVzdWx0Lmluc2VydGlvbnNbZmlsZV0gPSBpbnNlcnRpb25zLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVsZXRpb25zKSB7XG4gICAgICAgICAgICByZXN1bHQuZGVsZXRpb25zW2ZpbGVdID0gZGVsZXRpb25zLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoU1VNTUFSWV9SRUdFWCwgKHJlc3VsdCwgW2NoYW5nZXMsICwgaW5zZXJ0aW9ucywgLCBkZWxldGlvbnNdKSA9PiB7XG4gICAgICAgIGlmIChpbnNlcnRpb25zICE9PSB1bmRlZmluZWQgfHwgZGVsZXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdC5zdW1tYXJ5LmNoYW5nZXMgPSArY2hhbmdlcyB8fCAwO1xuICAgICAgICAgICAgcmVzdWx0LnN1bW1hcnkuaW5zZXJ0aW9ucyA9ICtpbnNlcnRpb25zIHx8IDA7XG4gICAgICAgICAgICByZXN1bHQuc3VtbWFyeS5kZWxldGlvbnMgPSArZGVsZXRpb25zIHx8IDA7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcihBQ1RJT05fUkVHRVgsIChyZXN1bHQsIFthY3Rpb24sIGZpbGVdKSA9PiB7XG4gICAgICAgIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5maWxlcywgZmlsZSk7XG4gICAgICAgIHV0aWxzXzEuYXBwZW5kKChhY3Rpb24gPT09ICdjcmVhdGUnKSA/IHJlc3VsdC5jcmVhdGVkIDogcmVzdWx0LmRlbGV0ZWQsIGZpbGUpO1xuICAgIH0pLFxuXTtcbmNvbnN0IHBhcnNlUHVsbERldGFpbCA9IChzdGRPdXQsIHN0ZEVycikgPT4ge1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UobmV3IFB1bGxTdW1tYXJ5XzEuUHVsbFN1bW1hcnkoKSwgcGFyc2Vycywgc3RkT3V0LCBzdGRFcnIpO1xufTtcbmV4cG9ydHMucGFyc2VQdWxsRGV0YWlsID0gcGFyc2VQdWxsRGV0YWlsO1xuY29uc3QgcGFyc2VQdWxsUmVzdWx0ID0gKHN0ZE91dCwgc3RkRXJyKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IFB1bGxTdW1tYXJ5XzEuUHVsbFN1bW1hcnkoKSwgZXhwb3J0cy5wYXJzZVB1bGxEZXRhaWwoc3RkT3V0LCBzdGRFcnIpLCBwYXJzZV9yZW1vdGVfbWVzc2FnZXNfMS5wYXJzZVJlbW90ZU1lc3NhZ2VzKHN0ZE91dCwgc3RkRXJyKSk7XG59O1xuZXhwb3J0cy5wYXJzZVB1bGxSZXN1bHQgPSBwYXJzZVB1bGxSZXN1bHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1wdWxsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZU1lcmdlRGV0YWlsID0gZXhwb3J0cy5wYXJzZU1lcmdlUmVzdWx0ID0gdm9pZCAwO1xuY29uc3QgTWVyZ2VTdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL01lcmdlU3VtbWFyeVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZV9wdWxsXzEgPSByZXF1aXJlKFwiLi9wYXJzZS1wdWxsXCIpO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eQXV0by1tZXJnaW5nXFxzKyguKykkLywgKHN1bW1hcnksIFthdXRvTWVyZ2VdKSA9PiB7XG4gICAgICAgIHN1bW1hcnkubWVyZ2VzLnB1c2goYXV0b01lcmdlKTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eQ09ORkxJQ1RcXHMrXFwoKC4rKVxcKTogTWVyZ2UgY29uZmxpY3QgaW4gKC4rKSQvLCAoc3VtbWFyeSwgW3JlYXNvbiwgZmlsZV0pID0+IHtcbiAgICAgICAgc3VtbWFyeS5jb25mbGljdHMucHVzaChuZXcgTWVyZ2VTdW1tYXJ5XzEuTWVyZ2VTdW1tYXJ5Q29uZmxpY3QocmVhc29uLCBmaWxlKSk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXkNPTkZMSUNUXFxzK1xcKCguK1xcL2RlbGV0ZSlcXCk6ICguKykgZGVsZXRlZCBpbiAoLispIGFuZC8sIChzdW1tYXJ5LCBbcmVhc29uLCBmaWxlLCBkZWxldGVSZWZdKSA9PiB7XG4gICAgICAgIHN1bW1hcnkuY29uZmxpY3RzLnB1c2gobmV3IE1lcmdlU3VtbWFyeV8xLk1lcmdlU3VtbWFyeUNvbmZsaWN0KHJlYXNvbiwgZmlsZSwgeyBkZWxldGVSZWYgfSkpO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL15DT05GTElDVFxccytcXCgoLispXFwpOi8sIChzdW1tYXJ5LCBbcmVhc29uXSkgPT4ge1xuICAgICAgICBzdW1tYXJ5LmNvbmZsaWN0cy5wdXNoKG5ldyBNZXJnZVN1bW1hcnlfMS5NZXJnZVN1bW1hcnlDb25mbGljdChyZWFzb24sIG51bGwpKTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eQXV0b21hdGljIG1lcmdlIGZhaWxlZDtcXHMrKC4rKSQvLCAoc3VtbWFyeSwgW3Jlc3VsdF0pID0+IHtcbiAgICAgICAgc3VtbWFyeS5yZXN1bHQgPSByZXN1bHQ7XG4gICAgfSksXG5dO1xuLyoqXG4gKiBQYXJzZSB0aGUgY29tcGxldGUgcmVzcG9uc2UgZnJvbSBgZ2l0Lm1lcmdlYFxuICovXG5jb25zdCBwYXJzZU1lcmdlUmVzdWx0ID0gKHN0ZE91dCwgc3RkRXJyKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZXhwb3J0cy5wYXJzZU1lcmdlRGV0YWlsKHN0ZE91dCwgc3RkRXJyKSwgcGFyc2VfcHVsbF8xLnBhcnNlUHVsbFJlc3VsdChzdGRPdXQsIHN0ZEVycikpO1xufTtcbmV4cG9ydHMucGFyc2VNZXJnZVJlc3VsdCA9IHBhcnNlTWVyZ2VSZXN1bHQ7XG4vKipcbiAqIFBhcnNlIHRoZSBtZXJnZSBzcGVjaWZpYyBkZXRhaWwgKGllOiBub3QgdGhlIGNvbnRlbnQgYWxzbyBhdmFpbGFibGUgaW4gdGhlIHB1bGwgZGV0YWlsKSBmcm9tIGBnaXQubW5lcmdlYFxuICogQHBhcmFtIHN0ZE91dFxuICovXG5jb25zdCBwYXJzZU1lcmdlRGV0YWlsID0gKHN0ZE91dCkgPT4ge1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UobmV3IE1lcmdlU3VtbWFyeV8xLk1lcmdlU3VtbWFyeURldGFpbCgpLCBwYXJzZXJzLCBzdGRPdXQpO1xufTtcbmV4cG9ydHMucGFyc2VNZXJnZURldGFpbCA9IHBhcnNlTWVyZ2VEZXRhaWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1tZXJnZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubWVyZ2VUYXNrID0gdm9pZCAwO1xuY29uc3QgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1yZXNwb25zZS1lcnJvclwiKTtcbmNvbnN0IHBhcnNlX21lcmdlXzEgPSByZXF1aXJlKFwiLi4vcGFyc2Vycy9wYXJzZS1tZXJnZVwiKTtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2tcIik7XG5mdW5jdGlvbiBtZXJnZVRhc2soY3VzdG9tQXJncykge1xuICAgIGlmICghY3VzdG9tQXJncy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRhc2tfMS5jb25maWd1cmF0aW9uRXJyb3JUYXNrKCdHaXQubWVyZ2UgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG9wdGlvbicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kczogWydtZXJnZScsIC4uLmN1c3RvbUFyZ3NdLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcihzdGRPdXQsIHN0ZEVycikge1xuICAgICAgICAgICAgY29uc3QgbWVyZ2UgPSBwYXJzZV9tZXJnZV8xLnBhcnNlTWVyZ2VSZXN1bHQoc3RkT3V0LCBzdGRFcnIpO1xuICAgICAgICAgICAgaWYgKG1lcmdlLmZhaWxlZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBnaXRfcmVzcG9uc2VfZXJyb3JfMS5HaXRSZXNwb25zZUVycm9yKG1lcmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXJnZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLm1lcmdlVGFzayA9IG1lcmdlVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVB1c2hEZXRhaWwgPSBleHBvcnRzLnBhcnNlUHVzaFJlc3VsdCA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZV9yZW1vdGVfbWVzc2FnZXNfMSA9IHJlcXVpcmUoXCIuL3BhcnNlLXJlbW90ZS1tZXNzYWdlc1wiKTtcbmZ1bmN0aW9uIHB1c2hSZXN1bHRQdXNoZWRJdGVtKGxvY2FsLCByZW1vdGUsIHN0YXR1cykge1xuICAgIGNvbnN0IGRlbGV0ZWQgPSBzdGF0dXMuaW5jbHVkZXMoJ2RlbGV0ZWQnKTtcbiAgICBjb25zdCB0YWcgPSBzdGF0dXMuaW5jbHVkZXMoJ3RhZycpIHx8IC9ecmVmc1xcL3RhZ3MvLnRlc3QobG9jYWwpO1xuICAgIGNvbnN0IGFscmVhZHlVcGRhdGVkID0gIXN0YXR1cy5pbmNsdWRlcygnbmV3Jyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVsZXRlZCxcbiAgICAgICAgdGFnLFxuICAgICAgICBicmFuY2g6ICF0YWcsXG4gICAgICAgIG5ldzogIWFscmVhZHlVcGRhdGVkLFxuICAgICAgICBhbHJlYWR5VXBkYXRlZCxcbiAgICAgICAgbG9jYWwsXG4gICAgICAgIHJlbW90ZSxcbiAgICB9O1xufVxuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eUHVzaGluZyB0byAoLispJC8sIChyZXN1bHQsIFtyZXBvXSkgPT4ge1xuICAgICAgICByZXN1bHQucmVwbyA9IHJlcG87XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXnVwZGF0aW5nIGxvY2FsIHRyYWNraW5nIHJlZiAnKC4rKScvLCAocmVzdWx0LCBbbG9jYWxdKSA9PiB7XG4gICAgICAgIHJlc3VsdC5yZWYgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIChyZXN1bHQucmVmIHx8IHt9KSksIHsgbG9jYWwgfSk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXlsqLT1dXFxzKyhbXjpdKyk6KFxcUyspXFxzK1xcWyguKyldJC8sIChyZXN1bHQsIFtsb2NhbCwgcmVtb3RlLCB0eXBlXSkgPT4ge1xuICAgICAgICByZXN1bHQucHVzaGVkLnB1c2gocHVzaFJlc3VsdFB1c2hlZEl0ZW0obG9jYWwsIHJlbW90ZSwgdHlwZSkpO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL15CcmFuY2ggJyhbXiddKyknIHNldCB1cCB0byB0cmFjayByZW1vdGUgYnJhbmNoICcoW14nXSspJyBmcm9tICcoW14nXSspJy8sIChyZXN1bHQsIFtsb2NhbCwgcmVtb3RlLCByZW1vdGVOYW1lXSkgPT4ge1xuICAgICAgICByZXN1bHQuYnJhbmNoID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCAocmVzdWx0LmJyYW5jaCB8fCB7fSkpLCB7IGxvY2FsLFxuICAgICAgICAgICAgcmVtb3RlLFxuICAgICAgICAgICAgcmVtb3RlTmFtZSB9KTtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eKFteOl0rKTooXFxTKylcXHMrKFthLXowLTldKylcXC5cXC4oW2EtejAtOV0rKSQvLCAocmVzdWx0LCBbbG9jYWwsIHJlbW90ZSwgZnJvbSwgdG9dKSA9PiB7XG4gICAgICAgIHJlc3VsdC51cGRhdGUgPSB7XG4gICAgICAgICAgICBoZWFkOiB7XG4gICAgICAgICAgICAgICAgbG9jYWwsXG4gICAgICAgICAgICAgICAgcmVtb3RlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc2g6IHtcbiAgICAgICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgICAgIHRvLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9KSxcbl07XG5jb25zdCBwYXJzZVB1c2hSZXN1bHQgPSAoc3RkT3V0LCBzdGRFcnIpID0+IHtcbiAgICBjb25zdCBwdXNoRGV0YWlsID0gZXhwb3J0cy5wYXJzZVB1c2hEZXRhaWwoc3RkT3V0LCBzdGRFcnIpO1xuICAgIGNvbnN0IHJlc3BvbnNlRGV0YWlsID0gcGFyc2VfcmVtb3RlX21lc3NhZ2VzXzEucGFyc2VSZW1vdGVNZXNzYWdlcyhzdGRPdXQsIHN0ZEVycik7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcHVzaERldGFpbCksIHJlc3BvbnNlRGV0YWlsKTtcbn07XG5leHBvcnRzLnBhcnNlUHVzaFJlc3VsdCA9IHBhcnNlUHVzaFJlc3VsdDtcbmNvbnN0IHBhcnNlUHVzaERldGFpbCA9IChzdGRPdXQsIHN0ZEVycikgPT4ge1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UoeyBwdXNoZWQ6IFtdIH0sIHBhcnNlcnMsIHN0ZE91dCwgc3RkRXJyKTtcbn07XG5leHBvcnRzLnBhcnNlUHVzaERldGFpbCA9IHBhcnNlUHVzaERldGFpbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLXB1c2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnB1c2hUYXNrID0gZXhwb3J0cy5wdXNoVGFnc1Rhc2sgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9wdXNoXzEgPSByZXF1aXJlKFwiLi4vcGFyc2Vycy9wYXJzZS1wdXNoXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIHB1c2hUYWdzVGFzayhyZWYgPSB7fSwgY3VzdG9tQXJncykge1xuICAgIHV0aWxzXzEuYXBwZW5kKGN1c3RvbUFyZ3MsICctLXRhZ3MnKTtcbiAgICByZXR1cm4gcHVzaFRhc2socmVmLCBjdXN0b21BcmdzKTtcbn1cbmV4cG9ydHMucHVzaFRhZ3NUYXNrID0gcHVzaFRhZ3NUYXNrO1xuZnVuY3Rpb24gcHVzaFRhc2socmVmID0ge30sIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsncHVzaCcsIC4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChyZWYuYnJhbmNoKSB7XG4gICAgICAgIGNvbW1hbmRzLnNwbGljZSgxLCAwLCByZWYuYnJhbmNoKTtcbiAgICB9XG4gICAgaWYgKHJlZi5yZW1vdGUpIHtcbiAgICAgICAgY29tbWFuZHMuc3BsaWNlKDEsIDAsIHJlZi5yZW1vdGUpO1xuICAgIH1cbiAgICB1dGlsc18xLnJlbW92ZShjb21tYW5kcywgJy12Jyk7XG4gICAgdXRpbHNfMS5hcHBlbmQoY29tbWFuZHMsICctLXZlcmJvc2UnKTtcbiAgICB1dGlsc18xLmFwcGVuZChjb21tYW5kcywgJy0tcG9yY2VsYWluJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHMsXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyOiBwYXJzZV9wdXNoXzEucGFyc2VQdXNoUmVzdWx0LFxuICAgIH07XG59XG5leHBvcnRzLnB1c2hUYXNrID0gcHVzaFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wdXNoLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5GaWxlU3RhdHVzU3VtbWFyeSA9IGV4cG9ydHMuZnJvbVBhdGhSZWdleCA9IHZvaWQgMDtcbmV4cG9ydHMuZnJvbVBhdGhSZWdleCA9IC9eKC4rKSAtPiAoLispJC87XG5jbGFzcyBGaWxlU3RhdHVzU3VtbWFyeSB7XG4gICAgY29uc3RydWN0b3IocGF0aCwgaW5kZXgsIHdvcmtpbmdfZGlyKSB7XG4gICAgICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy53b3JraW5nX2RpciA9IHdvcmtpbmdfZGlyO1xuICAgICAgICBpZiAoJ1InID09PSAoaW5kZXggKyB3b3JraW5nX2RpcikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGV4cG9ydHMuZnJvbVBhdGhSZWdleC5leGVjKHBhdGgpIHx8IFtudWxsLCBwYXRoLCBwYXRoXTtcbiAgICAgICAgICAgIHRoaXMuZnJvbSA9IGRldGFpbFsxXSB8fCAnJztcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IGRldGFpbFsyXSB8fCAnJztcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuRmlsZVN0YXR1c1N1bW1hcnkgPSBGaWxlU3RhdHVzU3VtbWFyeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUZpbGVTdGF0dXNTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVN0YXR1c1N1bW1hcnkgPSBleHBvcnRzLlN0YXR1c1N1bW1hcnkgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgRmlsZVN0YXR1c1N1bW1hcnlfMSA9IHJlcXVpcmUoXCIuL0ZpbGVTdGF0dXNTdW1tYXJ5XCIpO1xuLyoqXG4gKiBUaGUgU3RhdHVzU3VtbWFyeSBpcyByZXR1cm5lZCBhcyBhIHJlc3BvbnNlIHRvIGdldHRpbmcgYGdpdCgpLnN0YXR1cygpYFxuICovXG5jbGFzcyBTdGF0dXNTdW1tYXJ5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ub3RfYWRkZWQgPSBbXTtcbiAgICAgICAgdGhpcy5jb25mbGljdGVkID0gW107XG4gICAgICAgIHRoaXMuY3JlYXRlZCA9IFtdO1xuICAgICAgICB0aGlzLmRlbGV0ZWQgPSBbXTtcbiAgICAgICAgdGhpcy5tb2RpZmllZCA9IFtdO1xuICAgICAgICB0aGlzLnJlbmFtZWQgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFsbCBmaWxlcyByZXByZXNlbnRlZCBhcyBhbiBhcnJheSBvZiBvYmplY3RzIGNvbnRhaW5pbmcgdGhlIGBwYXRoYCBhbmQgc3RhdHVzIGluIGBpbmRleGAgYW5kXG4gICAgICAgICAqIGluIHRoZSBgd29ya2luZ19kaXJgLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maWxlcyA9IFtdO1xuICAgICAgICB0aGlzLnN0YWdlZCA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogTnVtYmVyIG9mIGNvbW1pdHMgYWhlYWQgb2YgdGhlIHRyYWNrZWQgYnJhbmNoXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFoZWFkID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqTnVtYmVyIG9mIGNvbW1pdHMgYmVoaW5kIHRoZSB0cmFja2VkIGJyYW5jaFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5iZWhpbmQgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogTmFtZSBvZiB0aGUgY3VycmVudCBicmFuY2hcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBOYW1lIG9mIHRoZSBicmFuY2ggYmVpbmcgdHJhY2tlZFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy50cmFja2luZyA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMgd2hldGhlciB0aGlzIFN0YXR1c1N1bW1hcnkgcmVwcmVzZW50cyBhIGNsZWFuIHdvcmtpbmcgYnJhbmNoLlxuICAgICAqL1xuICAgIGlzQ2xlYW4oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5maWxlcy5sZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0cy5TdGF0dXNTdW1tYXJ5ID0gU3RhdHVzU3VtbWFyeTtcbnZhciBQb3JjZWxhaW5GaWxlU3RhdHVzO1xuKGZ1bmN0aW9uIChQb3JjZWxhaW5GaWxlU3RhdHVzKSB7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIkFEREVEXCJdID0gXCJBXCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIkRFTEVURURcIl0gPSBcIkRcIjtcbiAgICBQb3JjZWxhaW5GaWxlU3RhdHVzW1wiTU9ESUZJRURcIl0gPSBcIk1cIjtcbiAgICBQb3JjZWxhaW5GaWxlU3RhdHVzW1wiUkVOQU1FRFwiXSA9IFwiUlwiO1xuICAgIFBvcmNlbGFpbkZpbGVTdGF0dXNbXCJDT1BJRURcIl0gPSBcIkNcIjtcbiAgICBQb3JjZWxhaW5GaWxlU3RhdHVzW1wiVU5NRVJHRURcIl0gPSBcIlVcIjtcbiAgICBQb3JjZWxhaW5GaWxlU3RhdHVzW1wiVU5UUkFDS0VEXCJdID0gXCI/XCI7XG4gICAgUG9yY2VsYWluRmlsZVN0YXR1c1tcIklHTk9SRURcIl0gPSBcIiFcIjtcbiAgICBQb3JjZWxhaW5GaWxlU3RhdHVzW1wiTk9ORVwiXSA9IFwiIFwiO1xufSkoUG9yY2VsYWluRmlsZVN0YXR1cyB8fCAoUG9yY2VsYWluRmlsZVN0YXR1cyA9IHt9KSk7XG5mdW5jdGlvbiByZW5hbWVkRmlsZShsaW5lKSB7XG4gICAgY29uc3QgZGV0YWlsID0gL14oLispIC0+ICguKykkLy5leGVjKGxpbmUpO1xuICAgIGlmICghZGV0YWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmcm9tOiBsaW5lLCB0bzogbGluZVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBmcm9tOiBTdHJpbmcoZGV0YWlsWzFdKSxcbiAgICAgICAgdG86IFN0cmluZyhkZXRhaWxbMl0pLFxuICAgIH07XG59XG5mdW5jdGlvbiBwYXJzZXIoaW5kZXhYLCBpbmRleFksIGhhbmRsZXIpIHtcbiAgICByZXR1cm4gW2Ake2luZGV4WH0ke2luZGV4WX1gLCBoYW5kbGVyXTtcbn1cbmZ1bmN0aW9uIGNvbmZsaWN0cyhpbmRleFgsIC4uLmluZGV4WSkge1xuICAgIHJldHVybiBpbmRleFkubWFwKHkgPT4gcGFyc2VyKGluZGV4WCwgeSwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0LmNvbmZsaWN0ZWQsIGZpbGUpKSk7XG59XG5jb25zdCBwYXJzZXJzID0gbmV3IE1hcChbXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgUG9yY2VsYWluRmlsZVN0YXR1cy5BRERFRCwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0LmNyZWF0ZWQsIGZpbGUpKSxcbiAgICBwYXJzZXIoUG9yY2VsYWluRmlsZVN0YXR1cy5OT05FLCBQb3JjZWxhaW5GaWxlU3RhdHVzLkRFTEVURUQsIChyZXN1bHQsIGZpbGUpID0+IHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5kZWxldGVkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgUG9yY2VsYWluRmlsZVN0YXR1cy5NT0RJRklFRCwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0Lm1vZGlmaWVkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuQURERUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0LmNyZWF0ZWQsIGZpbGUpICYmIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5zdGFnZWQsIGZpbGUpKSxcbiAgICBwYXJzZXIoUG9yY2VsYWluRmlsZVN0YXR1cy5BRERFRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5NT0RJRklFRCwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0LmNyZWF0ZWQsIGZpbGUpICYmIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5zdGFnZWQsIGZpbGUpICYmIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5tb2RpZmllZCwgZmlsZSkpLFxuICAgIHBhcnNlcihQb3JjZWxhaW5GaWxlU3RhdHVzLkRFTEVURUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuTk9ORSwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0LmRlbGV0ZWQsIGZpbGUpICYmIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5zdGFnZWQsIGZpbGUpKSxcbiAgICBwYXJzZXIoUG9yY2VsYWluRmlsZVN0YXR1cy5NT0RJRklFRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5OT05FLCAocmVzdWx0LCBmaWxlKSA9PiB1dGlsc18xLmFwcGVuZChyZXN1bHQubW9kaWZpZWQsIGZpbGUpICYmIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5zdGFnZWQsIGZpbGUpKSxcbiAgICBwYXJzZXIoUG9yY2VsYWluRmlsZVN0YXR1cy5NT0RJRklFRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5NT0RJRklFRCwgKHJlc3VsdCwgZmlsZSkgPT4gdXRpbHNfMS5hcHBlbmQocmVzdWx0Lm1vZGlmaWVkLCBmaWxlKSAmJiB1dGlsc18xLmFwcGVuZChyZXN1bHQuc3RhZ2VkLCBmaWxlKSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuUkVOQU1FRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5OT05FLCAocmVzdWx0LCBmaWxlKSA9PiB7XG4gICAgICAgIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5yZW5hbWVkLCByZW5hbWVkRmlsZShmaWxlKSk7XG4gICAgfSksXG4gICAgcGFyc2VyKFBvcmNlbGFpbkZpbGVTdGF0dXMuUkVOQU1FRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5NT0RJRklFRCwgKHJlc3VsdCwgZmlsZSkgPT4ge1xuICAgICAgICBjb25zdCByZW5hbWVkID0gcmVuYW1lZEZpbGUoZmlsZSk7XG4gICAgICAgIHV0aWxzXzEuYXBwZW5kKHJlc3VsdC5yZW5hbWVkLCByZW5hbWVkKTtcbiAgICAgICAgdXRpbHNfMS5hcHBlbmQocmVzdWx0Lm1vZGlmaWVkLCByZW5hbWVkLnRvKTtcbiAgICB9KSxcbiAgICBwYXJzZXIoUG9yY2VsYWluRmlsZVN0YXR1cy5VTlRSQUNLRUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuVU5UUkFDS0VELCAocmVzdWx0LCBmaWxlKSA9PiB1dGlsc18xLmFwcGVuZChyZXN1bHQubm90X2FkZGVkLCBmaWxlKSksXG4gICAgLi4uY29uZmxpY3RzKFBvcmNlbGFpbkZpbGVTdGF0dXMuQURERUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuQURERUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuVU5NRVJHRUQpLFxuICAgIC4uLmNvbmZsaWN0cyhQb3JjZWxhaW5GaWxlU3RhdHVzLkRFTEVURUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuREVMRVRFRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5VTk1FUkdFRCksXG4gICAgLi4uY29uZmxpY3RzKFBvcmNlbGFpbkZpbGVTdGF0dXMuVU5NRVJHRUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuQURERUQsIFBvcmNlbGFpbkZpbGVTdGF0dXMuREVMRVRFRCwgUG9yY2VsYWluRmlsZVN0YXR1cy5VTk1FUkdFRCksXG4gICAgWycjIycsIChyZXN1bHQsIGxpbmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFoZWFkUmVnID0gL2FoZWFkIChcXGQrKS87XG4gICAgICAgICAgICBjb25zdCBiZWhpbmRSZWcgPSAvYmVoaW5kIChcXGQrKS87XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UmVnID0gL14oLis/KD89KD86XFwuezN9fFxcc3wkKSkpLztcbiAgICAgICAgICAgIGNvbnN0IHRyYWNraW5nUmVnID0gL1xcLnszfShcXFMqKS87XG4gICAgICAgICAgICBjb25zdCBvbkVtcHR5QnJhbmNoUmVnID0gL1xcc29uXFxzKFtcXFNdKykkLztcbiAgICAgICAgICAgIGxldCByZWdleFJlc3VsdDtcbiAgICAgICAgICAgIHJlZ2V4UmVzdWx0ID0gYWhlYWRSZWcuZXhlYyhsaW5lKTtcbiAgICAgICAgICAgIHJlc3VsdC5haGVhZCA9IHJlZ2V4UmVzdWx0ICYmICtyZWdleFJlc3VsdFsxXSB8fCAwO1xuICAgICAgICAgICAgcmVnZXhSZXN1bHQgPSBiZWhpbmRSZWcuZXhlYyhsaW5lKTtcbiAgICAgICAgICAgIHJlc3VsdC5iZWhpbmQgPSByZWdleFJlc3VsdCAmJiArcmVnZXhSZXN1bHRbMV0gfHwgMDtcbiAgICAgICAgICAgIHJlZ2V4UmVzdWx0ID0gY3VycmVudFJlZy5leGVjKGxpbmUpO1xuICAgICAgICAgICAgcmVzdWx0LmN1cnJlbnQgPSByZWdleFJlc3VsdCAmJiByZWdleFJlc3VsdFsxXTtcbiAgICAgICAgICAgIHJlZ2V4UmVzdWx0ID0gdHJhY2tpbmdSZWcuZXhlYyhsaW5lKTtcbiAgICAgICAgICAgIHJlc3VsdC50cmFja2luZyA9IHJlZ2V4UmVzdWx0ICYmIHJlZ2V4UmVzdWx0WzFdO1xuICAgICAgICAgICAgcmVnZXhSZXN1bHQgPSBvbkVtcHR5QnJhbmNoUmVnLmV4ZWMobGluZSk7XG4gICAgICAgICAgICByZXN1bHQuY3VycmVudCA9IHJlZ2V4UmVzdWx0ICYmIHJlZ2V4UmVzdWx0WzFdIHx8IHJlc3VsdC5jdXJyZW50O1xuICAgICAgICB9XVxuXSk7XG5jb25zdCBwYXJzZVN0YXR1c1N1bW1hcnkgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIGNvbnN0IGxpbmVzID0gdGV4dC50cmltKCkuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IHN0YXR1cyA9IG5ldyBTdGF0dXNTdW1tYXJ5KCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBsaW5lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgc3BsaXRMaW5lKHN0YXR1cywgbGluZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdHVzO1xufTtcbmV4cG9ydHMucGFyc2VTdGF0dXNTdW1tYXJ5ID0gcGFyc2VTdGF0dXNTdW1tYXJ5O1xuZnVuY3Rpb24gc3BsaXRMaW5lKHJlc3VsdCwgbGluZVN0cikge1xuICAgIGNvbnN0IHRyaW1tZWQgPSBsaW5lU3RyLnRyaW0oKTtcbiAgICBzd2l0Y2ggKCcgJykge1xuICAgICAgICBjYXNlIHRyaW1tZWQuY2hhckF0KDIpOlxuICAgICAgICAgICAgcmV0dXJuIGRhdGEodHJpbW1lZC5jaGFyQXQoMCksIHRyaW1tZWQuY2hhckF0KDEpLCB0cmltbWVkLnN1YnN0cigzKSk7XG4gICAgICAgIGNhc2UgdHJpbW1lZC5jaGFyQXQoMSk6XG4gICAgICAgICAgICByZXR1cm4gZGF0YShQb3JjZWxhaW5GaWxlU3RhdHVzLk5PTkUsIHRyaW1tZWQuY2hhckF0KDApLCB0cmltbWVkLnN1YnN0cigyKSk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRhdGEoaW5kZXgsIHdvcmtpbmdEaXIsIHBhdGgpIHtcbiAgICAgICAgY29uc3QgcmF3ID0gYCR7aW5kZXh9JHt3b3JraW5nRGlyfWA7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBwYXJzZXJzLmdldChyYXcpO1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlcihyZXN1bHQsIHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyYXcgIT09ICcjIycpIHtcbiAgICAgICAgICAgIHJlc3VsdC5maWxlcy5wdXNoKG5ldyBGaWxlU3RhdHVzU3VtbWFyeV8xLkZpbGVTdGF0dXNTdW1tYXJ5KHBhdGgsIGluZGV4LCB3b3JraW5nRGlyKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdGF0dXNTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zdGF0dXNUYXNrID0gdm9pZCAwO1xuY29uc3QgU3RhdHVzU3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9TdGF0dXNTdW1tYXJ5XCIpO1xuZnVuY3Rpb24gc3RhdHVzVGFzayhjdXN0b21BcmdzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBjb21tYW5kczogWydzdGF0dXMnLCAnLS1wb3JjZWxhaW4nLCAnLWInLCAnLXUnLCAuLi5jdXN0b21BcmdzXSxcbiAgICAgICAgcGFyc2VyKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiBTdGF0dXNTdW1tYXJ5XzEucGFyc2VTdGF0dXNTdW1tYXJ5KHRleHQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuc3RhdHVzVGFzayA9IHN0YXR1c1Rhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGF0dXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNpbXBsZUdpdEFwaSA9IHZvaWQgMDtcbmNvbnN0IHRhc2tfY2FsbGJhY2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2stY2FsbGJhY2tcIik7XG5jb25zdCBjaGFuZ2Vfd29ya2luZ19kaXJlY3RvcnlfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL2NoYW5nZS13b3JraW5nLWRpcmVjdG9yeVwiKTtcbmNvbnN0IGNvbmZpZ18xID0gcmVxdWlyZShcIi4vdGFza3MvY29uZmlnXCIpO1xuY29uc3QgaGFzaF9vYmplY3RfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL2hhc2gtb2JqZWN0XCIpO1xuY29uc3QgaW5pdF8xID0gcmVxdWlyZShcIi4vdGFza3MvaW5pdFwiKTtcbmNvbnN0IGxvZ18xID0gcmVxdWlyZShcIi4vdGFza3MvbG9nXCIpO1xuY29uc3QgbWVyZ2VfMSA9IHJlcXVpcmUoXCIuL3Rhc2tzL21lcmdlXCIpO1xuY29uc3QgcHVzaF8xID0gcmVxdWlyZShcIi4vdGFza3MvcHVzaFwiKTtcbmNvbnN0IHN0YXR1c18xID0gcmVxdWlyZShcIi4vdGFza3Mvc3RhdHVzXCIpO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza3MvdGFza1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmNsYXNzIFNpbXBsZUdpdEFwaSB7XG4gICAgY29uc3RydWN0b3IoX2V4ZWN1dG9yKSB7XG4gICAgICAgIHRoaXMuX2V4ZWN1dG9yID0gX2V4ZWN1dG9yO1xuICAgIH1cbiAgICBfcnVuVGFzayh0YXNrLCB0aGVuKSB7XG4gICAgICAgIGNvbnN0IGNoYWluID0gdGhpcy5fZXhlY3V0b3IuY2hhaW4oKTtcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IGNoYWluLnB1c2godGFzayk7XG4gICAgICAgIGlmICh0aGVuKSB7XG4gICAgICAgICAgICB0YXNrX2NhbGxiYWNrXzEudGFza0NhbGxiYWNrKHRhc2ssIHByb21pc2UsIHRoZW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKHRoaXMsIHtcbiAgICAgICAgICAgIHRoZW46IHsgdmFsdWU6IHByb21pc2UudGhlbi5iaW5kKHByb21pc2UpIH0sXG4gICAgICAgICAgICBjYXRjaDogeyB2YWx1ZTogcHJvbWlzZS5jYXRjaC5iaW5kKHByb21pc2UpIH0sXG4gICAgICAgICAgICBfZXhlY3V0b3I6IHsgdmFsdWU6IGNoYWluIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGQoZmlsZXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2sodGFza18xLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soWydhZGQnLCAuLi51dGlsc18xLmFzQXJyYXkoZmlsZXMpXSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgIH1cbiAgICBjd2QoZGlyZWN0b3J5KSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSB1dGlsc18xLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpO1xuICAgICAgICBpZiAodHlwZW9mIGRpcmVjdG9yeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKGNoYW5nZV93b3JraW5nX2RpcmVjdG9yeV8xLmNoYW5nZVdvcmtpbmdEaXJlY3RvcnlUYXNrKGRpcmVjdG9yeSwgdGhpcy5fZXhlY3V0b3IpLCBuZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChkaXJlY3RvcnkgPT09IG51bGwgfHwgZGlyZWN0b3J5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkaXJlY3RvcnkucGF0aCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhjaGFuZ2Vfd29ya2luZ19kaXJlY3RvcnlfMS5jaGFuZ2VXb3JraW5nRGlyZWN0b3J5VGFzayhkaXJlY3RvcnkucGF0aCwgZGlyZWN0b3J5LnJvb3QgJiYgdGhpcy5fZXhlY3V0b3IgfHwgdW5kZWZpbmVkKSwgbmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhc2sodGFza18xLmNvbmZpZ3VyYXRpb25FcnJvclRhc2soJ0dpdC5jd2Q6IHdvcmtpbmdEaXJlY3RvcnkgbXVzdCBiZSBzdXBwbGllZCBhcyBhIHN0cmluZycpLCBuZXh0KTtcbiAgICB9XG4gICAgaGFzaE9iamVjdChwYXRoLCB3cml0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhoYXNoX29iamVjdF8xLmhhc2hPYmplY3RUYXNrKHBhdGgsIHdyaXRlID09PSB0cnVlKSwgdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG4gICAgfVxuICAgIGluaXQoYmFyZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhpbml0XzEuaW5pdFRhc2soYmFyZSA9PT0gdHJ1ZSwgdGhpcy5fZXhlY3V0b3IuY3dkLCB1dGlsc18xLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSwgdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG4gICAgfVxuICAgIG1lcmdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhtZXJnZV8xLm1lcmdlVGFzayh1dGlsc18xLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSwgdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG4gICAgfVxuICAgIG1lcmdlRnJvbVRvKHJlbW90ZSwgYnJhbmNoKSB7XG4gICAgICAgIGlmICghKHV0aWxzXzEuZmlsdGVyU3RyaW5nKHJlbW90ZSkgJiYgdXRpbHNfMS5maWx0ZXJTdHJpbmcoYnJhbmNoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2tfMS5jb25maWd1cmF0aW9uRXJyb3JUYXNrKGBHaXQubWVyZ2VGcm9tVG8gcmVxdWlyZXMgdGhhdCB0aGUgJ3JlbW90ZScgYW5kICdicmFuY2gnIGFyZ3VtZW50cyBhcmUgc3VwcGxpZWQgYXMgc3RyaW5nc2ApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhtZXJnZV8xLm1lcmdlVGFzayhbcmVtb3RlLCBicmFuY2gsIC4uLnV0aWxzXzEuZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cyldKSwgdXRpbHNfMS50cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzLCBmYWxzZSkpO1xuICAgIH1cbiAgICBvdXRwdXRIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5fZXhlY3V0b3Iub3V0cHV0SGFuZGxlciA9IGhhbmRsZXI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBwdXNoKCkge1xuICAgICAgICBjb25zdCB0YXNrID0gcHVzaF8xLnB1c2hUYXNrKHtcbiAgICAgICAgICAgIHJlbW90ZTogdXRpbHNfMS5maWx0ZXJUeXBlKGFyZ3VtZW50c1swXSwgdXRpbHNfMS5maWx0ZXJTdHJpbmcpLFxuICAgICAgICAgICAgYnJhbmNoOiB1dGlsc18xLmZpbHRlclR5cGUoYXJndW1lbnRzWzFdLCB1dGlsc18xLmZpbHRlclN0cmluZyksXG4gICAgICAgIH0sIHV0aWxzXzEuZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpO1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrLCB1dGlsc18xLnRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbiAgICB9XG4gICAgc3Rhc2goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsnc3Rhc2gnLCAuLi51dGlsc18xLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpXSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgIH1cbiAgICBzdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHN0YXR1c18xLnN0YXR1c1Rhc2sodXRpbHNfMS5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksIHV0aWxzXzEudHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xuICAgIH1cbn1cbmV4cG9ydHMuU2ltcGxlR2l0QXBpID0gU2ltcGxlR2l0QXBpO1xuT2JqZWN0LmFzc2lnbihTaW1wbGVHaXRBcGkucHJvdG90eXBlLCBjb25maWdfMS5kZWZhdWx0KCksIGxvZ18xLmRlZmF1bHQoKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW1wbGUtZ2l0LWFwaS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlRGVmZXJyZWQgPSBleHBvcnRzLmRlZmVycmVkID0gdm9pZCAwO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBEZWZlcnJlZFByb21pc2VgXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuIGltcG9ydCB7ZGVmZXJyZWR9IGZyb20gJ0Brd3NpdGVzL3Byb21pc2UtZGVmZXJyZWRgO1xuIGBgYFxuICovXG5mdW5jdGlvbiBkZWZlcnJlZCgpIHtcbiAgICBsZXQgZG9uZTtcbiAgICBsZXQgZmFpbDtcbiAgICBsZXQgc3RhdHVzID0gJ3BlbmRpbmcnO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgoX2RvbmUsIF9mYWlsKSA9PiB7XG4gICAgICAgIGRvbmUgPSBfZG9uZTtcbiAgICAgICAgZmFpbCA9IF9mYWlsO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2UsXG4gICAgICAgIGRvbmUocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAncGVuZGluZycpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSAncmVzb2x2ZWQnO1xuICAgICAgICAgICAgICAgIGRvbmUocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbChlcnJvcikge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gJ3JlamVjdGVkJztcbiAgICAgICAgICAgICAgICBmYWlsKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGZ1bGZpbGxlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0dXMgIT09ICdwZW5kaW5nJztcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IHN0YXR1cygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuZGVmZXJyZWQgPSBkZWZlcnJlZDtcbi8qKlxuICogQWxpYXMgb2YgdGhlIGV4cG9ydGVkIGBkZWZlcnJlZGAgZnVuY3Rpb24sIHRvIGhlbHAgY29uc3VtZXJzIHdhbnRpbmcgdG8gdXNlIGBkZWZlcnJlZGAgYXMgdGhlXG4gKiBsb2NhbCB2YXJpYWJsZSBuYW1lIHJhdGhlciB0aGFuIHRoZSBmYWN0b3J5IGltcG9ydCBuYW1lLCB3aXRob3V0IG5lZWRpbmcgdG8gcmVuYW1lIG9uIGltcG9ydC5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gaW1wb3J0IHtjcmVhdGVEZWZlcnJlZH0gZnJvbSAnQGt3c2l0ZXMvcHJvbWlzZS1kZWZlcnJlZGA7XG4gYGBgXG4gKi9cbmV4cG9ydHMuY3JlYXRlRGVmZXJyZWQgPSBkZWZlcnJlZDtcbi8qKlxuICogRGVmYXVsdCBleHBvcnQgYWxsb3dzIHVzZSBhczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gaW1wb3J0IGRlZmVycmVkIGZyb20gJ0Brd3NpdGVzL3Byb21pc2UtZGVmZXJyZWRgO1xuIGBgYFxuICovXG5leHBvcnRzLmRlZmF1bHQgPSBkZWZlcnJlZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TY2hlZHVsZXIgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcHJvbWlzZV9kZWZlcnJlZF8xID0gcmVxdWlyZShcIkBrd3NpdGVzL3Byb21pc2UtZGVmZXJyZWRcIik7XG5jb25zdCBnaXRfbG9nZ2VyXzEgPSByZXF1aXJlKFwiLi4vZ2l0LWxvZ2dlclwiKTtcbmNvbnN0IGNyZWF0ZVNjaGVkdWxlZFRhc2sgPSAoKCkgPT4ge1xuICAgIGxldCBpZCA9IDA7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWQrKztcbiAgICAgICAgY29uc3QgeyBwcm9taXNlLCBkb25lIH0gPSBwcm9taXNlX2RlZmVycmVkXzEuY3JlYXRlRGVmZXJyZWQoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByb21pc2UsXG4gICAgICAgICAgICBkb25lLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgIH07XG4gICAgfTtcbn0pKCk7XG5jbGFzcyBTY2hlZHVsZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbmN1cnJlbmN5ID0gMikge1xuICAgICAgICB0aGlzLmNvbmN1cnJlbmN5ID0gY29uY3VycmVuY3k7XG4gICAgICAgIHRoaXMubG9nZ2VyID0gZ2l0X2xvZ2dlcl8xLmNyZWF0ZUxvZ2dlcignJywgJ3NjaGVkdWxlcicpO1xuICAgICAgICB0aGlzLnBlbmRpbmcgPSBbXTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gW107XG4gICAgICAgIHRoaXMubG9nZ2VyKGBDb25zdHJ1Y3RlZCwgY29uY3VycmVuY3k9JXNgLCBjb25jdXJyZW5jeSk7XG4gICAgfVxuICAgIHNjaGVkdWxlKCkge1xuICAgICAgICBpZiAoIXRoaXMucGVuZGluZy5sZW5ndGggfHwgdGhpcy5ydW5uaW5nLmxlbmd0aCA+PSB0aGlzLmNvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihgU2NoZWR1bGUgYXR0ZW1wdCBpZ25vcmVkLCBwZW5kaW5nPSVzIHJ1bm5pbmc9JXMgY29uY3VycmVuY3k9JXNgLCB0aGlzLnBlbmRpbmcubGVuZ3RoLCB0aGlzLnJ1bm5pbmcubGVuZ3RoLCB0aGlzLmNvbmN1cnJlbmN5KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YXNrID0gdXRpbHNfMS5hcHBlbmQodGhpcy5ydW5uaW5nLCB0aGlzLnBlbmRpbmcuc2hpZnQoKSk7XG4gICAgICAgIHRoaXMubG9nZ2VyKGBBdHRlbXB0aW5nIGlkPSVzYCwgdGFzay5pZCk7XG4gICAgICAgIHRhc2suZG9uZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlcihgQ29tcGxldGluZyBpZD1gLCB0YXNrLmlkKTtcbiAgICAgICAgICAgIHV0aWxzXzEucmVtb3ZlKHRoaXMucnVubmluZywgdGFzayk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuZXh0KCkge1xuICAgICAgICBjb25zdCB7IHByb21pc2UsIGlkIH0gPSB1dGlsc18xLmFwcGVuZCh0aGlzLnBlbmRpbmcsIGNyZWF0ZVNjaGVkdWxlZFRhc2soKSk7XG4gICAgICAgIHRoaXMubG9nZ2VyKGBTY2hlZHVsaW5nIGlkPSVzYCwgaWQpO1xuICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbn1cbmV4cG9ydHMuU2NoZWR1bGVyID0gU2NoZWR1bGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hcHBseVBhdGNoVGFzayA9IHZvaWQgMDtcbmNvbnN0IHRhc2tfMSA9IHJlcXVpcmUoXCIuL3Rhc2tcIik7XG5mdW5jdGlvbiBhcHBseVBhdGNoVGFzayhwYXRjaGVzLCBjdXN0b21BcmdzKSB7XG4gICAgcmV0dXJuIHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsnYXBwbHknLCAuLi5jdXN0b21BcmdzLCAuLi5wYXRjaGVzXSk7XG59XG5leHBvcnRzLmFwcGx5UGF0Y2hUYXNrID0gYXBwbHlQYXRjaFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHBseS1wYXRjaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNTaW5nbGVCcmFuY2hEZWxldGVGYWlsdXJlID0gZXhwb3J0cy5icmFuY2hEZWxldGlvbkZhaWx1cmUgPSBleHBvcnRzLmJyYW5jaERlbGV0aW9uU3VjY2VzcyA9IGV4cG9ydHMuQnJhbmNoRGVsZXRpb25CYXRjaCA9IHZvaWQgMDtcbmNsYXNzIEJyYW5jaERlbGV0aW9uQmF0Y2gge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmFsbCA9IFtdO1xuICAgICAgICB0aGlzLmJyYW5jaGVzID0ge307XG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgfVxuICAgIGdldCBzdWNjZXNzKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZXJyb3JzLmxlbmd0aDtcbiAgICB9XG59XG5leHBvcnRzLkJyYW5jaERlbGV0aW9uQmF0Y2ggPSBCcmFuY2hEZWxldGlvbkJhdGNoO1xuZnVuY3Rpb24gYnJhbmNoRGVsZXRpb25TdWNjZXNzKGJyYW5jaCwgaGFzaCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGJyYW5jaCwgaGFzaCwgc3VjY2VzczogdHJ1ZSxcbiAgICB9O1xufVxuZXhwb3J0cy5icmFuY2hEZWxldGlvblN1Y2Nlc3MgPSBicmFuY2hEZWxldGlvblN1Y2Nlc3M7XG5mdW5jdGlvbiBicmFuY2hEZWxldGlvbkZhaWx1cmUoYnJhbmNoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnJhbmNoLCBoYXNoOiBudWxsLCBzdWNjZXNzOiBmYWxzZSxcbiAgICB9O1xufVxuZXhwb3J0cy5icmFuY2hEZWxldGlvbkZhaWx1cmUgPSBicmFuY2hEZWxldGlvbkZhaWx1cmU7XG5mdW5jdGlvbiBpc1NpbmdsZUJyYW5jaERlbGV0ZUZhaWx1cmUodGVzdCkge1xuICAgIHJldHVybiB0ZXN0LnN1Y2Nlc3M7XG59XG5leHBvcnRzLmlzU2luZ2xlQnJhbmNoRGVsZXRlRmFpbHVyZSA9IGlzU2luZ2xlQnJhbmNoRGVsZXRlRmFpbHVyZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJyYW5jaERlbGV0ZVN1bW1hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhc0JyYW5jaERlbGV0aW9uRXJyb3IgPSBleHBvcnRzLnBhcnNlQnJhbmNoRGVsZXRpb25zID0gdm9pZCAwO1xuY29uc3QgQnJhbmNoRGVsZXRlU3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9CcmFuY2hEZWxldGVTdW1tYXJ5XCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IGRlbGV0ZVN1Y2Nlc3NSZWdleCA9IC8oXFxTKylcXHMrXFwoXFxTK1xccyhbXildKylcXCkvO1xuY29uc3QgZGVsZXRlRXJyb3JSZWdleCA9IC9eZXJyb3JbXiddKycoW14nXSspJy9tO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKGRlbGV0ZVN1Y2Nlc3NSZWdleCwgKHJlc3VsdCwgW2JyYW5jaCwgaGFzaF0pID0+IHtcbiAgICAgICAgY29uc3QgZGVsZXRpb24gPSBCcmFuY2hEZWxldGVTdW1tYXJ5XzEuYnJhbmNoRGVsZXRpb25TdWNjZXNzKGJyYW5jaCwgaGFzaCk7XG4gICAgICAgIHJlc3VsdC5hbGwucHVzaChkZWxldGlvbik7XG4gICAgICAgIHJlc3VsdC5icmFuY2hlc1ticmFuY2hdID0gZGVsZXRpb247XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcihkZWxldGVFcnJvclJlZ2V4LCAocmVzdWx0LCBbYnJhbmNoXSkgPT4ge1xuICAgICAgICBjb25zdCBkZWxldGlvbiA9IEJyYW5jaERlbGV0ZVN1bW1hcnlfMS5icmFuY2hEZWxldGlvbkZhaWx1cmUoYnJhbmNoKTtcbiAgICAgICAgcmVzdWx0LmVycm9ycy5wdXNoKGRlbGV0aW9uKTtcbiAgICAgICAgcmVzdWx0LmFsbC5wdXNoKGRlbGV0aW9uKTtcbiAgICAgICAgcmVzdWx0LmJyYW5jaGVzW2JyYW5jaF0gPSBkZWxldGlvbjtcbiAgICB9KSxcbl07XG5jb25zdCBwYXJzZUJyYW5jaERlbGV0aW9ucyA9IChzdGRPdXQsIHN0ZEVycikgPT4ge1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UobmV3IEJyYW5jaERlbGV0ZVN1bW1hcnlfMS5CcmFuY2hEZWxldGlvbkJhdGNoKCksIHBhcnNlcnMsIHN0ZE91dCwgc3RkRXJyKTtcbn07XG5leHBvcnRzLnBhcnNlQnJhbmNoRGVsZXRpb25zID0gcGFyc2VCcmFuY2hEZWxldGlvbnM7XG5mdW5jdGlvbiBoYXNCcmFuY2hEZWxldGlvbkVycm9yKGRhdGEsIHByb2Nlc3NFeGl0Q29kZSkge1xuICAgIHJldHVybiBwcm9jZXNzRXhpdENvZGUgPT09IHV0aWxzXzEuRXhpdENvZGVzLkVSUk9SICYmIGRlbGV0ZUVycm9yUmVnZXgudGVzdChkYXRhKTtcbn1cbmV4cG9ydHMuaGFzQnJhbmNoRGVsZXRpb25FcnJvciA9IGhhc0JyYW5jaERlbGV0aW9uRXJyb3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1icmFuY2gtZGVsZXRlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5CcmFuY2hTdW1tYXJ5UmVzdWx0ID0gdm9pZCAwO1xuY2xhc3MgQnJhbmNoU3VtbWFyeVJlc3VsdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYWxsID0gW107XG4gICAgICAgIHRoaXMuYnJhbmNoZXMgPSB7fTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gJyc7XG4gICAgICAgIHRoaXMuZGV0YWNoZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcHVzaChjdXJyZW50LCBkZXRhY2hlZCwgbmFtZSwgY29tbWl0LCBsYWJlbCkge1xuICAgICAgICBpZiAoY3VycmVudCkge1xuICAgICAgICAgICAgdGhpcy5kZXRhY2hlZCA9IGRldGFjaGVkO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFsbC5wdXNoKG5hbWUpO1xuICAgICAgICB0aGlzLmJyYW5jaGVzW25hbWVdID0ge1xuICAgICAgICAgICAgY3VycmVudDogY3VycmVudCxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBjb21taXQ6IGNvbW1pdCxcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuQnJhbmNoU3VtbWFyeVJlc3VsdCA9IEJyYW5jaFN1bW1hcnlSZXN1bHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1CcmFuY2hTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZUJyYW5jaFN1bW1hcnkgPSB2b2lkIDA7XG5jb25zdCBCcmFuY2hTdW1tYXJ5XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL0JyYW5jaFN1bW1hcnlcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuY29uc3QgcGFyc2VycyA9IFtcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9eKFxcKlxccyk/XFwoKD86SEVBRCApP2RldGFjaGVkICg/OmZyb218YXQpIChcXFMrKVxcKVxccysoW2EtejAtOV0rKVxccyguKikkLywgKHJlc3VsdCwgW2N1cnJlbnQsIG5hbWUsIGNvbW1pdCwgbGFiZWxdKSA9PiB7XG4gICAgICAgIHJlc3VsdC5wdXNoKCEhY3VycmVudCwgdHJ1ZSwgbmFtZSwgY29tbWl0LCBsYWJlbCk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXihcXCpcXHMpPyhcXFMrKVxccysoW2EtejAtOV0rKVxccyguKikkL3MsIChyZXN1bHQsIFtjdXJyZW50LCBuYW1lLCBjb21taXQsIGxhYmVsXSkgPT4ge1xuICAgICAgICByZXN1bHQucHVzaCghIWN1cnJlbnQsIGZhbHNlLCBuYW1lLCBjb21taXQsIGxhYmVsKTtcbiAgICB9KVxuXTtcbmZ1bmN0aW9uIHBhcnNlQnJhbmNoU3VtbWFyeShzdGRPdXQpIHtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKG5ldyBCcmFuY2hTdW1tYXJ5XzEuQnJhbmNoU3VtbWFyeVJlc3VsdCgpLCBwYXJzZXJzLCBzdGRPdXQpO1xufVxuZXhwb3J0cy5wYXJzZUJyYW5jaFN1bW1hcnkgPSBwYXJzZUJyYW5jaFN1bW1hcnk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1icmFuY2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlbGV0ZUJyYW5jaFRhc2sgPSBleHBvcnRzLmRlbGV0ZUJyYW5jaGVzVGFzayA9IGV4cG9ydHMuYnJhbmNoTG9jYWxUYXNrID0gZXhwb3J0cy5icmFuY2hUYXNrID0gZXhwb3J0cy5jb250YWluc0RlbGV0ZUJyYW5jaENvbW1hbmQgPSB2b2lkIDA7XG5jb25zdCBnaXRfcmVzcG9uc2VfZXJyb3JfMSA9IHJlcXVpcmUoXCIuLi9lcnJvcnMvZ2l0LXJlc3BvbnNlLWVycm9yXCIpO1xuY29uc3QgcGFyc2VfYnJhbmNoX2RlbGV0ZV8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtYnJhbmNoLWRlbGV0ZVwiKTtcbmNvbnN0IHBhcnNlX2JyYW5jaF8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtYnJhbmNoXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIGNvbnRhaW5zRGVsZXRlQnJhbmNoQ29tbWFuZChjb21tYW5kcykge1xuICAgIGNvbnN0IGRlbGV0ZUNvbW1hbmRzID0gWyctZCcsICctRCcsICctLWRlbGV0ZSddO1xuICAgIHJldHVybiBjb21tYW5kcy5zb21lKGNvbW1hbmQgPT4gZGVsZXRlQ29tbWFuZHMuaW5jbHVkZXMoY29tbWFuZCkpO1xufVxuZXhwb3J0cy5jb250YWluc0RlbGV0ZUJyYW5jaENvbW1hbmQgPSBjb250YWluc0RlbGV0ZUJyYW5jaENvbW1hbmQ7XG5mdW5jdGlvbiBicmFuY2hUYXNrKGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBpc0RlbGV0ZSA9IGNvbnRhaW5zRGVsZXRlQnJhbmNoQ29tbWFuZChjdXN0b21BcmdzKTtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnYnJhbmNoJywgLi4uY3VzdG9tQXJnc107XG4gICAgaWYgKGNvbW1hbmRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb21tYW5kcy5wdXNoKCctYScpO1xuICAgIH1cbiAgICBpZiAoIWNvbW1hbmRzLmluY2x1ZGVzKCctdicpKSB7XG4gICAgICAgIGNvbW1hbmRzLnNwbGljZSgxLCAwLCAnLXYnKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgcGFyc2VyKHN0ZE91dCwgc3RkRXJyKSB7XG4gICAgICAgICAgICBpZiAoaXNEZWxldGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VfYnJhbmNoX2RlbGV0ZV8xLnBhcnNlQnJhbmNoRGVsZXRpb25zKHN0ZE91dCwgc3RkRXJyKS5hbGxbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VfYnJhbmNoXzEucGFyc2VCcmFuY2hTdW1tYXJ5KHN0ZE91dCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydHMuYnJhbmNoVGFzayA9IGJyYW5jaFRhc2s7XG5mdW5jdGlvbiBicmFuY2hMb2NhbFRhc2soKSB7XG4gICAgY29uc3QgcGFyc2VyID0gcGFyc2VfYnJhbmNoXzEucGFyc2VCcmFuY2hTdW1tYXJ5O1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHM6IFsnYnJhbmNoJywgJy12J10sXG4gICAgICAgIHBhcnNlcixcbiAgICB9O1xufVxuZXhwb3J0cy5icmFuY2hMb2NhbFRhc2sgPSBicmFuY2hMb2NhbFRhc2s7XG5mdW5jdGlvbiBkZWxldGVCcmFuY2hlc1Rhc2soYnJhbmNoZXMsIGZvcmNlRGVsZXRlID0gZmFsc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIGNvbW1hbmRzOiBbJ2JyYW5jaCcsICctdicsIGZvcmNlRGVsZXRlID8gJy1EJyA6ICctZCcsIC4uLmJyYW5jaGVzXSxcbiAgICAgICAgcGFyc2VyKHN0ZE91dCwgc3RkRXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VfYnJhbmNoX2RlbGV0ZV8xLnBhcnNlQnJhbmNoRGVsZXRpb25zKHN0ZE91dCwgc3RkRXJyKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcih7IGV4aXRDb2RlLCBzdGRPdXQgfSwgZXJyb3IsIGRvbmUsIGZhaWwpIHtcbiAgICAgICAgICAgIGlmICghcGFyc2VfYnJhbmNoX2RlbGV0ZV8xLmhhc0JyYW5jaERlbGV0aW9uRXJyb3IoU3RyaW5nKGVycm9yKSwgZXhpdENvZGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhaWwoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9uZShzdGRPdXQpO1xuICAgICAgICB9LFxuICAgIH07XG59XG5leHBvcnRzLmRlbGV0ZUJyYW5jaGVzVGFzayA9IGRlbGV0ZUJyYW5jaGVzVGFzaztcbmZ1bmN0aW9uIGRlbGV0ZUJyYW5jaFRhc2soYnJhbmNoLCBmb3JjZURlbGV0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgdGFzayA9IHtcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBjb21tYW5kczogWydicmFuY2gnLCAnLXYnLCBmb3JjZURlbGV0ZSA/ICctRCcgOiAnLWQnLCBicmFuY2hdLFxuICAgICAgICBwYXJzZXIoc3RkT3V0LCBzdGRFcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZV9icmFuY2hfZGVsZXRlXzEucGFyc2VCcmFuY2hEZWxldGlvbnMoc3RkT3V0LCBzdGRFcnIpLmJyYW5jaGVzW2JyYW5jaF07XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXJyb3IoeyBleGl0Q29kZSwgc3RkRXJyLCBzdGRPdXQgfSwgZXJyb3IsIF8sIGZhaWwpIHtcbiAgICAgICAgICAgIGlmICghcGFyc2VfYnJhbmNoX2RlbGV0ZV8xLmhhc0JyYW5jaERlbGV0aW9uRXJyb3IoU3RyaW5nKGVycm9yKSwgZXhpdENvZGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhaWwoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IGdpdF9yZXNwb25zZV9lcnJvcl8xLkdpdFJlc3BvbnNlRXJyb3IodGFzay5wYXJzZXIodXRpbHNfMS5idWZmZXJUb1N0cmluZyhzdGRPdXQpLCB1dGlsc18xLmJ1ZmZlclRvU3RyaW5nKHN0ZEVycikpLCBTdHJpbmcoZXJyb3IpKTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiB0YXNrO1xufVxuZXhwb3J0cy5kZWxldGVCcmFuY2hUYXNrID0gZGVsZXRlQnJhbmNoVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJyYW5jaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VDaGVja0lnbm9yZSA9IHZvaWQgMDtcbi8qKlxuICogUGFyc2VyIGZvciB0aGUgYGNoZWNrLWlnbm9yZWAgY29tbWFuZCAtIHJldHVybnMgZWFjaCBmaWxlIGFzIGEgc3RyaW5nIGFycmF5XG4gKi9cbmNvbnN0IHBhcnNlQ2hlY2tJZ25vcmUgPSAodGV4dCkgPT4ge1xuICAgIHJldHVybiB0ZXh0LnNwbGl0KC9cXG4vZylcbiAgICAgICAgLm1hcChsaW5lID0+IGxpbmUudHJpbSgpKVxuICAgICAgICAuZmlsdGVyKGZpbGUgPT4gISFmaWxlKTtcbn07XG5leHBvcnRzLnBhcnNlQ2hlY2tJZ25vcmUgPSBwYXJzZUNoZWNrSWdub3JlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2hlY2tJZ25vcmUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNoZWNrSWdub3JlVGFzayA9IHZvaWQgMDtcbmNvbnN0IENoZWNrSWdub3JlXzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL0NoZWNrSWdub3JlXCIpO1xuZnVuY3Rpb24gY2hlY2tJZ25vcmVUYXNrKHBhdGhzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IFsnY2hlY2staWdub3JlJywgLi4ucGF0aHNdLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcjogQ2hlY2tJZ25vcmVfMS5wYXJzZUNoZWNrSWdub3JlLFxuICAgIH07XG59XG5leHBvcnRzLmNoZWNrSWdub3JlVGFzayA9IGNoZWNrSWdub3JlVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNoZWNrLWlnbm9yZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2xvbmVNaXJyb3JUYXNrID0gZXhwb3J0cy5jbG9uZVRhc2sgPSB2b2lkIDA7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIGNsb25lVGFzayhyZXBvLCBkaXJlY3RvcnksIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IFsnY2xvbmUnLCAuLi5jdXN0b21BcmdzXTtcbiAgICBpZiAodHlwZW9mIHJlcG8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbW1hbmRzLnB1c2gocmVwbyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGlyZWN0b3J5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb21tYW5kcy5wdXNoKGRpcmVjdG9yeSk7XG4gICAgfVxuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcyk7XG59XG5leHBvcnRzLmNsb25lVGFzayA9IGNsb25lVGFzaztcbmZ1bmN0aW9uIGNsb25lTWlycm9yVGFzayhyZXBvLCBkaXJlY3RvcnksIGN1c3RvbUFyZ3MpIHtcbiAgICB1dGlsc18xLmFwcGVuZChjdXN0b21BcmdzLCAnLS1taXJyb3InKTtcbiAgICByZXR1cm4gY2xvbmVUYXNrKHJlcG8sIGRpcmVjdG9yeSwgY3VzdG9tQXJncyk7XG59XG5leHBvcnRzLmNsb25lTWlycm9yVGFzayA9IGNsb25lTWlycm9yVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsb25lLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZUNvbW1pdFJlc3VsdCA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZXJzID0gW1xuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL15cXFsoW15cXHNdKykoIFxcKFteKV0rXFwpKT8gKFteXFxdXSspLywgKHJlc3VsdCwgW2JyYW5jaCwgcm9vdCwgY29tbWl0XSkgPT4ge1xuICAgICAgICByZXN1bHQuYnJhbmNoID0gYnJhbmNoO1xuICAgICAgICByZXN1bHQuY29tbWl0ID0gY29tbWl0O1xuICAgICAgICByZXN1bHQucm9vdCA9ICEhcm9vdDtcbiAgICB9KSxcbiAgICBuZXcgdXRpbHNfMS5MaW5lUGFyc2VyKC9cXHMqQXV0aG9yOlxccyguKykvaSwgKHJlc3VsdCwgW2F1dGhvcl0pID0+IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBhdXRob3Iuc3BsaXQoJzwnKTtcbiAgICAgICAgY29uc3QgZW1haWwgPSBwYXJ0cy5wb3AoKTtcbiAgICAgICAgaWYgKCFlbWFpbCB8fCAhZW1haWwuaW5jbHVkZXMoJ0AnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5hdXRob3IgPSB7XG4gICAgICAgICAgICBlbWFpbDogZW1haWwuc3Vic3RyKDAsIGVtYWlsLmxlbmd0aCAtIDEpLFxuICAgICAgICAgICAgbmFtZTogcGFydHMuam9pbignPCcpLnRyaW0oKVxuICAgICAgICB9O1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoLyhcXGQrKVteLF0qKD86LFxccyooXFxkKylbXixdKikoPzosXFxzKihcXGQrKSkvZywgKHJlc3VsdCwgW2NoYW5nZXMsIGluc2VydGlvbnMsIGRlbGV0aW9uc10pID0+IHtcbiAgICAgICAgcmVzdWx0LnN1bW1hcnkuY2hhbmdlcyA9IHBhcnNlSW50KGNoYW5nZXMsIDEwKSB8fCAwO1xuICAgICAgICByZXN1bHQuc3VtbWFyeS5pbnNlcnRpb25zID0gcGFyc2VJbnQoaW5zZXJ0aW9ucywgMTApIHx8IDA7XG4gICAgICAgIHJlc3VsdC5zdW1tYXJ5LmRlbGV0aW9ucyA9IHBhcnNlSW50KGRlbGV0aW9ucywgMTApIHx8IDA7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXihcXGQrKVteLF0qKD86LFxccyooXFxkKylbXihdK1xcKChbKy1dKSk/LywgKHJlc3VsdCwgW2NoYW5nZXMsIGxpbmVzLCBkaXJlY3Rpb25dKSA9PiB7XG4gICAgICAgIHJlc3VsdC5zdW1tYXJ5LmNoYW5nZXMgPSBwYXJzZUludChjaGFuZ2VzLCAxMCkgfHwgMDtcbiAgICAgICAgY29uc3QgY291bnQgPSBwYXJzZUludChsaW5lcywgMTApIHx8IDA7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICctJykge1xuICAgICAgICAgICAgcmVzdWx0LnN1bW1hcnkuZGVsZXRpb25zID0gY291bnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnKycpIHtcbiAgICAgICAgICAgIHJlc3VsdC5zdW1tYXJ5Lmluc2VydGlvbnMgPSBjb3VudDtcbiAgICAgICAgfVxuICAgIH0pLFxuXTtcbmZ1bmN0aW9uIHBhcnNlQ29tbWl0UmVzdWx0KHN0ZE91dCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgYXV0aG9yOiBudWxsLFxuICAgICAgICBicmFuY2g6ICcnLFxuICAgICAgICBjb21taXQ6ICcnLFxuICAgICAgICByb290OiBmYWxzZSxcbiAgICAgICAgc3VtbWFyeToge1xuICAgICAgICAgICAgY2hhbmdlczogMCxcbiAgICAgICAgICAgIGluc2VydGlvbnM6IDAsXG4gICAgICAgICAgICBkZWxldGlvbnM6IDAsXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdXRpbHNfMS5wYXJzZVN0cmluZ1Jlc3BvbnNlKHJlc3VsdCwgcGFyc2Vycywgc3RkT3V0KTtcbn1cbmV4cG9ydHMucGFyc2VDb21taXRSZXN1bHQgPSBwYXJzZUNvbW1pdFJlc3VsdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLWNvbW1pdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY29tbWl0VGFzayA9IHZvaWQgMDtcbmNvbnN0IHBhcnNlX2NvbW1pdF8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtY29tbWl0XCIpO1xuZnVuY3Rpb24gY29tbWl0VGFzayhtZXNzYWdlLCBmaWxlcywgY3VzdG9tQXJncykge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydjb21taXQnXTtcbiAgICBtZXNzYWdlLmZvckVhY2goKG0pID0+IGNvbW1hbmRzLnB1c2goJy1tJywgbSkpO1xuICAgIGNvbW1hbmRzLnB1c2goLi4uZmlsZXMsIC4uLmN1c3RvbUFyZ3MpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcjogcGFyc2VfY29tbWl0XzEucGFyc2VDb21taXRSZXN1bHQsXG4gICAgfTtcbn1cbmV4cG9ydHMuY29tbWl0VGFzayA9IGNvbW1pdFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21taXQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRpZmZTdW1tYXJ5VGFzayA9IHZvaWQgMDtcbmNvbnN0IHBhcnNlX2RpZmZfc3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtZGlmZi1zdW1tYXJ5XCIpO1xuZnVuY3Rpb24gZGlmZlN1bW1hcnlUYXNrKGN1c3RvbUFyZ3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kczogWydkaWZmJywgJy0tc3RhdD00MDk2JywgLi4uY3VzdG9tQXJnc10sXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyKHN0ZE91dCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlX2RpZmZfc3VtbWFyeV8xLnBhcnNlRGlmZlJlc3VsdChzdGRPdXQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZGlmZlN1bW1hcnlUYXNrID0gZGlmZlN1bW1hcnlUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlmZi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VGZXRjaFJlc3VsdCA9IHZvaWQgMDtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5jb25zdCBwYXJzZXJzID0gW1xuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL0Zyb20gKC4rKSQvLCAocmVzdWx0LCBbcmVtb3RlXSkgPT4ge1xuICAgICAgICByZXN1bHQucmVtb3RlID0gcmVtb3RlO1xuICAgIH0pLFxuICAgIG5ldyB1dGlsc18xLkxpbmVQYXJzZXIoL1xcKiBcXFtuZXcgYnJhbmNoXVxccysoXFxTKylcXHMqLT4gKC4rKSQvLCAocmVzdWx0LCBbbmFtZSwgdHJhY2tpbmddKSA9PiB7XG4gICAgICAgIHJlc3VsdC5icmFuY2hlcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICB0cmFja2luZyxcbiAgICAgICAgfSk7XG4gICAgfSksXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXFwqIFxcW25ldyB0YWddXFxzKyhcXFMrKVxccyotPiAoLispJC8sIChyZXN1bHQsIFtuYW1lLCB0cmFja2luZ10pID0+IHtcbiAgICAgICAgcmVzdWx0LnRhZ3MucHVzaCh7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgdHJhY2tpbmcsXG4gICAgICAgIH0pO1xuICAgIH0pXG5dO1xuZnVuY3Rpb24gcGFyc2VGZXRjaFJlc3VsdChzdGRPdXQsIHN0ZEVycikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgcmF3OiBzdGRPdXQsXG4gICAgICAgIHJlbW90ZTogbnVsbCxcbiAgICAgICAgYnJhbmNoZXM6IFtdLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICB9O1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UocmVzdWx0LCBwYXJzZXJzLCBzdGRPdXQsIHN0ZEVycik7XG59XG5leHBvcnRzLnBhcnNlRmV0Y2hSZXN1bHQgPSBwYXJzZUZldGNoUmVzdWx0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtZmV0Y2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZldGNoVGFzayA9IHZvaWQgMDtcbmNvbnN0IHBhcnNlX2ZldGNoXzEgPSByZXF1aXJlKFwiLi4vcGFyc2Vycy9wYXJzZS1mZXRjaFwiKTtcbmZ1bmN0aW9uIGZldGNoVGFzayhyZW1vdGUsIGJyYW5jaCwgY3VzdG9tQXJncykge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWydmZXRjaCcsIC4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChyZW1vdGUgJiYgYnJhbmNoKSB7XG4gICAgICAgIGNvbW1hbmRzLnB1c2gocmVtb3RlLCBicmFuY2gpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXI6IHBhcnNlX2ZldGNoXzEucGFyc2VGZXRjaFJlc3VsdCxcbiAgICB9O1xufVxuZXhwb3J0cy5mZXRjaFRhc2sgPSBmZXRjaFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mZXRjaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VNb3ZlUmVzdWx0ID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IHBhcnNlcnMgPSBbXG4gICAgbmV3IHV0aWxzXzEuTGluZVBhcnNlcigvXlJlbmFtaW5nICguKykgdG8gKC4rKSQvLCAocmVzdWx0LCBbZnJvbSwgdG9dKSA9PiB7XG4gICAgICAgIHJlc3VsdC5tb3Zlcy5wdXNoKHsgZnJvbSwgdG8gfSk7XG4gICAgfSksXG5dO1xuZnVuY3Rpb24gcGFyc2VNb3ZlUmVzdWx0KHN0ZE91dCkge1xuICAgIHJldHVybiB1dGlsc18xLnBhcnNlU3RyaW5nUmVzcG9uc2UoeyBtb3ZlczogW10gfSwgcGFyc2Vycywgc3RkT3V0KTtcbn1cbmV4cG9ydHMucGFyc2VNb3ZlUmVzdWx0ID0gcGFyc2VNb3ZlUmVzdWx0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UtbW92ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubW92ZVRhc2sgPSB2b2lkIDA7XG5jb25zdCBwYXJzZV9tb3ZlXzEgPSByZXF1aXJlKFwiLi4vcGFyc2Vycy9wYXJzZS1tb3ZlXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmZ1bmN0aW9uIG1vdmVUYXNrKGZyb20sIHRvKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWFuZHM6IFsnbXYnLCAnLXYnLCAuLi51dGlsc18xLmFzQXJyYXkoZnJvbSksIHRvXSxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXI6IHBhcnNlX21vdmVfMS5wYXJzZU1vdmVSZXN1bHQsXG4gICAgfTtcbn1cbmV4cG9ydHMubW92ZVRhc2sgPSBtb3ZlVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdmUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnB1bGxUYXNrID0gdm9pZCAwO1xuY29uc3QgcGFyc2VfcHVsbF8xID0gcmVxdWlyZShcIi4uL3BhcnNlcnMvcGFyc2UtcHVsbFwiKTtcbmZ1bmN0aW9uIHB1bGxUYXNrKHJlbW90ZSwgYnJhbmNoLCBjdXN0b21BcmdzKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3B1bGwnLCAuLi5jdXN0b21BcmdzXTtcbiAgICBpZiAocmVtb3RlICYmIGJyYW5jaCkge1xuICAgICAgICBjb21tYW5kcy5zcGxpY2UoMSwgMCwgcmVtb3RlLCBicmFuY2gpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kcyxcbiAgICAgICAgZm9ybWF0OiAndXRmLTgnLFxuICAgICAgICBwYXJzZXIoc3RkT3V0LCBzdGRFcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZV9wdWxsXzEucGFyc2VQdWxsUmVzdWx0KHN0ZE91dCwgc3RkRXJyKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLnB1bGxUYXNrID0gcHVsbFRhc2s7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wdWxsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZUdldFJlbW90ZXNWZXJib3NlID0gZXhwb3J0cy5wYXJzZUdldFJlbW90ZXMgPSB2b2lkIDA7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpO1xuZnVuY3Rpb24gcGFyc2VHZXRSZW1vdGVzKHRleHQpIHtcbiAgICBjb25zdCByZW1vdGVzID0ge307XG4gICAgZm9yRWFjaCh0ZXh0LCAoW25hbWVdKSA9PiByZW1vdGVzW25hbWVdID0geyBuYW1lIH0pO1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJlbW90ZXMpO1xufVxuZXhwb3J0cy5wYXJzZUdldFJlbW90ZXMgPSBwYXJzZUdldFJlbW90ZXM7XG5mdW5jdGlvbiBwYXJzZUdldFJlbW90ZXNWZXJib3NlKHRleHQpIHtcbiAgICBjb25zdCByZW1vdGVzID0ge307XG4gICAgZm9yRWFjaCh0ZXh0LCAoW25hbWUsIHVybCwgcHVycG9zZV0pID0+IHtcbiAgICAgICAgaWYgKCFyZW1vdGVzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgICAgICByZW1vdGVzW25hbWVdID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgcmVmczogeyBmZXRjaDogJycsIHB1c2g6ICcnIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwdXJwb3NlICYmIHVybCkge1xuICAgICAgICAgICAgcmVtb3Rlc1tuYW1lXS5yZWZzW3B1cnBvc2UucmVwbGFjZSgvW15hLXpdL2csICcnKV0gPSB1cmw7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhyZW1vdGVzKTtcbn1cbmV4cG9ydHMucGFyc2VHZXRSZW1vdGVzVmVyYm9zZSA9IHBhcnNlR2V0UmVtb3Rlc1ZlcmJvc2U7XG5mdW5jdGlvbiBmb3JFYWNoKHRleHQsIGhhbmRsZXIpIHtcbiAgICB1dGlsc18xLmZvckVhY2hMaW5lV2l0aENvbnRlbnQodGV4dCwgKGxpbmUpID0+IGhhbmRsZXIobGluZS5zcGxpdCgvXFxzKy8pKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1HZXRSZW1vdGVTdW1tYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZW1vdmVSZW1vdGVUYXNrID0gZXhwb3J0cy5yZW1vdGVUYXNrID0gZXhwb3J0cy5saXN0UmVtb3Rlc1Rhc2sgPSBleHBvcnRzLmdldFJlbW90ZXNUYXNrID0gZXhwb3J0cy5hZGRSZW1vdGVUYXNrID0gdm9pZCAwO1xuY29uc3QgR2V0UmVtb3RlU3VtbWFyeV8xID0gcmVxdWlyZShcIi4uL3Jlc3BvbnNlcy9HZXRSZW1vdGVTdW1tYXJ5XCIpO1xuY29uc3QgdGFza18xID0gcmVxdWlyZShcIi4vdGFza1wiKTtcbmZ1bmN0aW9uIGFkZFJlbW90ZVRhc2socmVtb3RlTmFtZSwgcmVtb3RlUmVwbywgY3VzdG9tQXJncyA9IFtdKSB7XG4gICAgcmV0dXJuIHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsncmVtb3RlJywgJ2FkZCcsIC4uLmN1c3RvbUFyZ3MsIHJlbW90ZU5hbWUsIHJlbW90ZVJlcG9dKTtcbn1cbmV4cG9ydHMuYWRkUmVtb3RlVGFzayA9IGFkZFJlbW90ZVRhc2s7XG5mdW5jdGlvbiBnZXRSZW1vdGVzVGFzayh2ZXJib3NlKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbJ3JlbW90ZSddO1xuICAgIGlmICh2ZXJib3NlKSB7XG4gICAgICAgIGNvbW1hbmRzLnB1c2goJy12Jyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hbmRzLFxuICAgICAgICBmb3JtYXQ6ICd1dGYtOCcsXG4gICAgICAgIHBhcnNlcjogdmVyYm9zZSA/IEdldFJlbW90ZVN1bW1hcnlfMS5wYXJzZUdldFJlbW90ZXNWZXJib3NlIDogR2V0UmVtb3RlU3VtbWFyeV8xLnBhcnNlR2V0UmVtb3RlcyxcbiAgICB9O1xufVxuZXhwb3J0cy5nZXRSZW1vdGVzVGFzayA9IGdldFJlbW90ZXNUYXNrO1xuZnVuY3Rpb24gbGlzdFJlbW90ZXNUYXNrKGN1c3RvbUFyZ3MgPSBbXSkge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWy4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChjb21tYW5kc1swXSAhPT0gJ2xzLXJlbW90ZScpIHtcbiAgICAgICAgY29tbWFuZHMudW5zaGlmdCgnbHMtcmVtb3RlJyk7XG4gICAgfVxuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcyk7XG59XG5leHBvcnRzLmxpc3RSZW1vdGVzVGFzayA9IGxpc3RSZW1vdGVzVGFzaztcbmZ1bmN0aW9uIHJlbW90ZVRhc2soY3VzdG9tQXJncyA9IFtdKSB7XG4gICAgY29uc3QgY29tbWFuZHMgPSBbLi4uY3VzdG9tQXJnc107XG4gICAgaWYgKGNvbW1hbmRzWzBdICE9PSAncmVtb3RlJykge1xuICAgICAgICBjb21tYW5kcy51bnNoaWZ0KCdyZW1vdGUnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhc2tfMS5zdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmRzKTtcbn1cbmV4cG9ydHMucmVtb3RlVGFzayA9IHJlbW90ZVRhc2s7XG5mdW5jdGlvbiByZW1vdmVSZW1vdGVUYXNrKHJlbW90ZU5hbWUpIHtcbiAgICByZXR1cm4gdGFza18xLnN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soWydyZW1vdGUnLCAncmVtb3ZlJywgcmVtb3RlTmFtZV0pO1xufVxuZXhwb3J0cy5yZW1vdmVSZW1vdGVUYXNrID0gcmVtb3ZlUmVtb3RlVGFzaztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbW90ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc3Rhc2hMaXN0VGFzayA9IHZvaWQgMDtcbmNvbnN0IHBhcnNlX2xpc3RfbG9nX3N1bW1hcnlfMSA9IHJlcXVpcmUoXCIuLi9wYXJzZXJzL3BhcnNlLWxpc3QtbG9nLXN1bW1hcnlcIik7XG5jb25zdCBsb2dfMSA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcbmZ1bmN0aW9uIHN0YXNoTGlzdFRhc2sob3B0ID0ge30sIGN1c3RvbUFyZ3MpIHtcbiAgICBjb25zdCBvcHRpb25zID0gbG9nXzEucGFyc2VMb2dPcHRpb25zKG9wdCk7XG4gICAgY29uc3QgcGFyc2VyID0gcGFyc2VfbGlzdF9sb2dfc3VtbWFyeV8xLmNyZWF0ZUxpc3RMb2dTdW1tYXJ5UGFyc2VyKG9wdGlvbnMuc3BsaXR0ZXIsIG9wdGlvbnMuZmllbGRzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYW5kczogWydzdGFzaCcsICdsaXN0JywgLi4ub3B0aW9ucy5jb21tYW5kcywgLi4uY3VzdG9tQXJnc10sXG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgcGFyc2VyLFxuICAgIH07XG59XG5leHBvcnRzLnN0YXNoTGlzdFRhc2sgPSBzdGFzaExpc3RUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Rhc2gtbGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXBkYXRlU3ViTW9kdWxlVGFzayA9IGV4cG9ydHMuc3ViTW9kdWxlVGFzayA9IGV4cG9ydHMuaW5pdFN1Yk1vZHVsZVRhc2sgPSBleHBvcnRzLmFkZFN1Yk1vZHVsZVRhc2sgPSB2b2lkIDA7XG5jb25zdCB0YXNrXzEgPSByZXF1aXJlKFwiLi90YXNrXCIpO1xuZnVuY3Rpb24gYWRkU3ViTW9kdWxlVGFzayhyZXBvLCBwYXRoKSB7XG4gICAgcmV0dXJuIHN1Yk1vZHVsZVRhc2soWydhZGQnLCByZXBvLCBwYXRoXSk7XG59XG5leHBvcnRzLmFkZFN1Yk1vZHVsZVRhc2sgPSBhZGRTdWJNb2R1bGVUYXNrO1xuZnVuY3Rpb24gaW5pdFN1Yk1vZHVsZVRhc2soY3VzdG9tQXJncykge1xuICAgIHJldHVybiBzdWJNb2R1bGVUYXNrKFsnaW5pdCcsIC4uLmN1c3RvbUFyZ3NdKTtcbn1cbmV4cG9ydHMuaW5pdFN1Yk1vZHVsZVRhc2sgPSBpbml0U3ViTW9kdWxlVGFzaztcbmZ1bmN0aW9uIHN1Yk1vZHVsZVRhc2soY3VzdG9tQXJncykge1xuICAgIGNvbnN0IGNvbW1hbmRzID0gWy4uLmN1c3RvbUFyZ3NdO1xuICAgIGlmIChjb21tYW5kc1swXSAhPT0gJ3N1Ym1vZHVsZScpIHtcbiAgICAgICAgY29tbWFuZHMudW5zaGlmdCgnc3VibW9kdWxlJyk7XG4gICAgfVxuICAgIHJldHVybiB0YXNrXzEuc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kcyk7XG59XG5leHBvcnRzLnN1Yk1vZHVsZVRhc2sgPSBzdWJNb2R1bGVUYXNrO1xuZnVuY3Rpb24gdXBkYXRlU3ViTW9kdWxlVGFzayhjdXN0b21BcmdzKSB7XG4gICAgcmV0dXJuIHN1Yk1vZHVsZVRhc2soWyd1cGRhdGUnLCAuLi5jdXN0b21BcmdzXSk7XG59XG5leHBvcnRzLnVwZGF0ZVN1Yk1vZHVsZVRhc2sgPSB1cGRhdGVTdWJNb2R1bGVUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3ViLW1vZHVsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VUYWdMaXN0ID0gZXhwb3J0cy5UYWdMaXN0ID0gdm9pZCAwO1xuY2xhc3MgVGFnTGlzdCB7XG4gICAgY29uc3RydWN0b3IoYWxsLCBsYXRlc3QpIHtcbiAgICAgICAgdGhpcy5hbGwgPSBhbGw7XG4gICAgICAgIHRoaXMubGF0ZXN0ID0gbGF0ZXN0O1xuICAgIH1cbn1cbmV4cG9ydHMuVGFnTGlzdCA9IFRhZ0xpc3Q7XG5jb25zdCBwYXJzZVRhZ0xpc3QgPSBmdW5jdGlvbiAoZGF0YSwgY3VzdG9tU29ydCA9IGZhbHNlKSB7XG4gICAgY29uc3QgdGFncyA9IGRhdGFcbiAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAubWFwKHRyaW1tZWQpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKCFjdXN0b21Tb3J0KSB7XG4gICAgICAgIHRhZ3Muc29ydChmdW5jdGlvbiAodGFnQSwgdGFnQikge1xuICAgICAgICAgICAgY29uc3QgcGFydHNBID0gdGFnQS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgY29uc3QgcGFydHNCID0gdGFnQi5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYgKHBhcnRzQS5sZW5ndGggPT09IDEgfHwgcGFydHNCLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVTb3J0ZWQodG9OdW1iZXIocGFydHNBWzBdKSwgdG9OdW1iZXIocGFydHNCWzBdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IE1hdGgubWF4KHBhcnRzQS5sZW5ndGgsIHBhcnRzQi5sZW5ndGgpOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZiA9IHNvcnRlZCh0b051bWJlcihwYXJ0c0FbaV0pLCB0b051bWJlcihwYXJ0c0JbaV0pKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlmZikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlmZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGxhdGVzdCA9IGN1c3RvbVNvcnQgPyB0YWdzWzBdIDogWy4uLnRhZ3NdLnJldmVyc2UoKS5maW5kKCh0YWcpID0+IHRhZy5pbmRleE9mKCcuJykgPj0gMCk7XG4gICAgcmV0dXJuIG5ldyBUYWdMaXN0KHRhZ3MsIGxhdGVzdCk7XG59O1xuZXhwb3J0cy5wYXJzZVRhZ0xpc3QgPSBwYXJzZVRhZ0xpc3Q7XG5mdW5jdGlvbiBzaW5nbGVTb3J0ZWQoYSwgYikge1xuICAgIGNvbnN0IGFJc051bSA9IGlzTmFOKGEpO1xuICAgIGNvbnN0IGJJc051bSA9IGlzTmFOKGIpO1xuICAgIGlmIChhSXNOdW0gIT09IGJJc051bSkge1xuICAgICAgICByZXR1cm4gYUlzTnVtID8gMSA6IC0xO1xuICAgIH1cbiAgICByZXR1cm4gYUlzTnVtID8gc29ydGVkKGEsIGIpIDogMDtcbn1cbmZ1bmN0aW9uIHNvcnRlZChhLCBiKSB7XG4gICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA+IGIgPyAxIDogLTE7XG59XG5mdW5jdGlvbiB0cmltbWVkKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0LnRyaW0oKTtcbn1cbmZ1bmN0aW9uIHRvTnVtYmVyKGlucHV0KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LnJlcGxhY2UoL15cXEQrL2csICcnKSwgMTApIHx8IDA7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGFnTGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkQW5ub3RhdGVkVGFnVGFzayA9IGV4cG9ydHMuYWRkVGFnVGFzayA9IGV4cG9ydHMudGFnTGlzdFRhc2sgPSB2b2lkIDA7XG5jb25zdCBUYWdMaXN0XzEgPSByZXF1aXJlKFwiLi4vcmVzcG9uc2VzL1RhZ0xpc3RcIik7XG4vKipcbiAqIFRhc2sgdXNlZCBieSBgZ2l0LnRhZ3NgXG4gKi9cbmZ1bmN0aW9uIHRhZ0xpc3RUYXNrKGN1c3RvbUFyZ3MgPSBbXSkge1xuICAgIGNvbnN0IGhhc0N1c3RvbVNvcnQgPSBjdXN0b21BcmdzLnNvbWUoKG9wdGlvbikgPT4gL14tLXNvcnQ9Ly50ZXN0KG9wdGlvbikpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHM6IFsndGFnJywgJy1sJywgLi4uY3VzdG9tQXJnc10sXG4gICAgICAgIHBhcnNlcih0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gVGFnTGlzdF8xLnBhcnNlVGFnTGlzdCh0ZXh0LCBoYXNDdXN0b21Tb3J0KTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZXhwb3J0cy50YWdMaXN0VGFzayA9IHRhZ0xpc3RUYXNrO1xuLyoqXG4gKiBUYXNrIHVzZWQgYnkgYGdpdC5hZGRUYWdgXG4gKi9cbmZ1bmN0aW9uIGFkZFRhZ1Rhc2sobmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHM6IFsndGFnJywgbmFtZV0sXG4gICAgICAgIHBhcnNlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWUgfTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmFkZFRhZ1Rhc2sgPSBhZGRUYWdUYXNrO1xuLyoqXG4gKiBUYXNrIHVzZWQgYnkgYGdpdC5hZGRUYWdgXG4gKi9cbmZ1bmN0aW9uIGFkZEFubm90YXRlZFRhZ1Rhc2sobmFtZSwgdGFnTWVzc2FnZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgICAgY29tbWFuZHM6IFsndGFnJywgJy1hJywgJy1tJywgdGFnTWVzc2FnZSwgbmFtZV0sXG4gICAgICAgIHBhcnNlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWUgfTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmFkZEFubm90YXRlZFRhZ1Rhc2sgPSBhZGRBbm5vdGF0ZWRUYWdUYXNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFnLmpzLm1hcCIsImNvbnN0IHtHaXRFeGVjdXRvcn0gPSByZXF1aXJlKCcuL2xpYi9ydW5uZXJzL2dpdC1leGVjdXRvcicpO1xuY29uc3Qge1NpbXBsZUdpdEFwaX0gPSByZXF1aXJlKCcuL2xpYi9zaW1wbGUtZ2l0LWFwaScpO1xuXG5jb25zdCB7U2NoZWR1bGVyfSA9IHJlcXVpcmUoJy4vbGliL3J1bm5lcnMvc2NoZWR1bGVyJyk7XG5jb25zdCB7R2l0TG9nZ2VyfSA9IHJlcXVpcmUoJy4vbGliL2dpdC1sb2dnZXInKTtcbmNvbnN0IHtjb25maWd1cmF0aW9uRXJyb3JUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3Rhc2snKTtcbmNvbnN0IHtcbiAgIGFzQXJyYXksXG4gICBmaWx0ZXJBcnJheSxcbiAgIGZpbHRlclByaW1pdGl2ZXMsXG4gICBmaWx0ZXJTdHJpbmcsXG4gICBmaWx0ZXJTdHJpbmdPclN0cmluZ0FycmF5LFxuICAgZmlsdGVyVHlwZSxcbiAgIGdldFRyYWlsaW5nT3B0aW9ucyxcbiAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudCxcbiAgIHRyYWlsaW5nT3B0aW9uc0FyZ3VtZW50XG59ID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKTtcbmNvbnN0IHthcHBseVBhdGNoVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9hcHBseS1wYXRjaCcpXG5jb25zdCB7YnJhbmNoVGFzaywgYnJhbmNoTG9jYWxUYXNrLCBkZWxldGVCcmFuY2hlc1Rhc2ssIGRlbGV0ZUJyYW5jaFRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvYnJhbmNoJyk7XG5jb25zdCB7Y2hlY2tJZ25vcmVUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL2NoZWNrLWlnbm9yZScpO1xuY29uc3Qge2NoZWNrSXNSZXBvVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9jaGVjay1pcy1yZXBvJyk7XG5jb25zdCB7Y2xvbmVUYXNrLCBjbG9uZU1pcnJvclRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvY2xvbmUnKTtcbmNvbnN0IHtjbGVhbldpdGhPcHRpb25zVGFzaywgaXNDbGVhbk9wdGlvbnNBcnJheX0gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9jbGVhbicpO1xuY29uc3Qge2NvbW1pdFRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvY29tbWl0Jyk7XG5jb25zdCB7ZGlmZlN1bW1hcnlUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL2RpZmYnKTtcbmNvbnN0IHtmZXRjaFRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvZmV0Y2gnKTtcbmNvbnN0IHttb3ZlVGFza30gPSByZXF1aXJlKFwiLi9saWIvdGFza3MvbW92ZVwiKTtcbmNvbnN0IHtwdWxsVGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9wdWxsJyk7XG5jb25zdCB7cHVzaFRhZ3NUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3B1c2gnKTtcbmNvbnN0IHthZGRSZW1vdGVUYXNrLCBnZXRSZW1vdGVzVGFzaywgbGlzdFJlbW90ZXNUYXNrLCByZW1vdGVUYXNrLCByZW1vdmVSZW1vdGVUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3JlbW90ZScpO1xuY29uc3Qge2dldFJlc2V0TW9kZSwgcmVzZXRUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3Jlc2V0Jyk7XG5jb25zdCB7c3Rhc2hMaXN0VGFza30gPSByZXF1aXJlKCcuL2xpYi90YXNrcy9zdGFzaC1saXN0Jyk7XG5jb25zdCB7YWRkU3ViTW9kdWxlVGFzaywgaW5pdFN1Yk1vZHVsZVRhc2ssIHN1Yk1vZHVsZVRhc2ssIHVwZGF0ZVN1Yk1vZHVsZVRhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3Mvc3ViLW1vZHVsZScpO1xuY29uc3Qge2FkZEFubm90YXRlZFRhZ1Rhc2ssIGFkZFRhZ1Rhc2ssIHRhZ0xpc3RUYXNrfSA9IHJlcXVpcmUoJy4vbGliL3Rhc2tzL3RhZycpO1xuY29uc3Qge3N0cmFpZ2h0VGhyb3VnaEJ1ZmZlclRhc2ssIHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2t9ID0gcmVxdWlyZSgnLi9saWIvdGFza3MvdGFzaycpO1xuXG5mdW5jdGlvbiBHaXQgKG9wdGlvbnMsIHBsdWdpbnMpIHtcbiAgIHRoaXMuX2V4ZWN1dG9yID0gbmV3IEdpdEV4ZWN1dG9yKFxuICAgICAgb3B0aW9ucy5iaW5hcnksIG9wdGlvbnMuYmFzZURpcixcbiAgICAgIG5ldyBTY2hlZHVsZXIob3B0aW9ucy5tYXhDb25jdXJyZW50UHJvY2Vzc2VzKSwgcGx1Z2lucyxcbiAgICk7XG4gICB0aGlzLl9sb2dnZXIgPSBuZXcgR2l0TG9nZ2VyKCk7XG59XG5cbihHaXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTaW1wbGVHaXRBcGkucHJvdG90eXBlKSkuY29uc3RydWN0b3IgPSBHaXQ7XG5cbi8qKlxuICogTG9nZ2luZyB1dGlsaXR5IGZvciBwcmludGluZyBvdXQgaW5mbyBvciBlcnJvciBtZXNzYWdlcyB0byB0aGUgdXNlclxuICogQHR5cGUge0dpdExvZ2dlcn1cbiAqIEBwcml2YXRlXG4gKi9cbkdpdC5wcm90b3R5cGUuX2xvZ2dlciA9IG51bGw7XG5cbi8qKlxuICogU2V0cyB0aGUgcGF0aCB0byBhIGN1c3RvbSBnaXQgYmluYXJ5LCBzaG91bGQgZWl0aGVyIGJlIGBnaXRgIHdoZW4gdGhlcmUgaXMgYW4gaW5zdGFsbGF0aW9uIG9mIGdpdCBhdmFpbGFibGUgb25cbiAqIHRoZSBzeXN0ZW0gcGF0aCwgb3IgYSBmdWxseSBxdWFsaWZpZWQgcGF0aCB0byB0aGUgZXhlY3V0YWJsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZFxuICogQHJldHVybnMge0dpdH1cbiAqL1xuR2l0LnByb3RvdHlwZS5jdXN0b21CaW5hcnkgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgdGhpcy5fZXhlY3V0b3IuYmluYXJ5ID0gY29tbWFuZDtcbiAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXRzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlIGZvciB0aGUgc3Bhd25lZCBjaGlsZCBwcm9jZXNzLCBlaXRoZXIgc3VwcGx5IGJvdGggYSBuYW1lIGFuZCB2YWx1ZSBhcyBzdHJpbmdzIG9yXG4gKiBhIHNpbmdsZSBvYmplY3QgdG8gZW50aXJlbHkgcmVwbGFjZSB0aGUgY3VycmVudCBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gW3ZhbHVlXVxuICogQHJldHVybnMge0dpdH1cbiAqL1xuR2l0LnByb3RvdHlwZS5lbnYgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5fZXhlY3V0b3IuZW52ID0gbmFtZTtcbiAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5fZXhlY3V0b3IuZW52ID0gdGhpcy5fZXhlY3V0b3IuZW52IHx8IHt9KVtuYW1lXSA9IHZhbHVlO1xuICAgfVxuXG4gICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTGlzdCB0aGUgc3Rhc2gocykgb2YgdGhlIGxvY2FsIHJlcG9cbiAqL1xuR2l0LnByb3RvdHlwZS5zdGFzaExpc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdGFzaExpc3RUYXNrKFxuICAgICAgICAgdHJhaWxpbmdPcHRpb25zQXJndW1lbnQoYXJndW1lbnRzKSB8fCB7fSxcbiAgICAgICAgIGZpbHRlckFycmF5KG9wdGlvbnMpICYmIG9wdGlvbnMgfHwgW11cbiAgICAgICksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVDbG9uZVRhc2sgKGFwaSwgdGFzaywgcmVwb1BhdGgsIGxvY2FsUGF0aCkge1xuICAgaWYgKHR5cGVvZiByZXBvUGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBjb25maWd1cmF0aW9uRXJyb3JUYXNrKGBnaXQuJHsgYXBpIH0oKSByZXF1aXJlcyBhIHN0cmluZyAncmVwb1BhdGgnYCk7XG4gICB9XG5cbiAgIHJldHVybiB0YXNrKHJlcG9QYXRoLCBmaWx0ZXJUeXBlKGxvY2FsUGF0aCwgZmlsdGVyU3RyaW5nKSwgZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpO1xufVxuXG5cbi8qKlxuICogQ2xvbmUgYSBnaXQgcmVwb1xuICovXG5HaXQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBjcmVhdGVDbG9uZVRhc2soJ2Nsb25lJywgY2xvbmVUYXNrLCAuLi5hcmd1bWVudHMpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBNaXJyb3IgYSBnaXQgcmVwb1xuICovXG5HaXQucHJvdG90eXBlLm1pcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgY3JlYXRlQ2xvbmVUYXNrKCdtaXJyb3InLCBjbG9uZU1pcnJvclRhc2ssIC4uLmFyZ3VtZW50cyksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIE1vdmVzIG9uZSBvciBtb3JlIGZpbGVzIHRvIGEgbmV3IGRlc3RpbmF0aW9uLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9naXQtc2NtLmNvbS9kb2NzL2dpdC1tdlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBmcm9tXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9cbiAqL1xuR2l0LnByb3RvdHlwZS5tdiA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2sobW92ZVRhc2soZnJvbSwgdG8pLCB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG59O1xuXG4vKipcbiAqIEludGVybmFsbHkgdXNlcyBwdWxsIGFuZCB0YWdzIHRvIGdldCB0aGUgbGlzdCBvZiB0YWdzIHRoZW4gY2hlY2tzIG91dCB0aGUgbGF0ZXN0IHRhZy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5jaGVja291dExhdGVzdFRhZyA9IGZ1bmN0aW9uICh0aGVuKSB7XG4gICB2YXIgZ2l0ID0gdGhpcztcbiAgIHJldHVybiB0aGlzLnB1bGwoZnVuY3Rpb24gKCkge1xuICAgICAgZ2l0LnRhZ3MoZnVuY3Rpb24gKGVyciwgdGFncykge1xuICAgICAgICAgZ2l0LmNoZWNrb3V0KHRhZ3MubGF0ZXN0LCB0aGVuKTtcbiAgICAgIH0pO1xuICAgfSk7XG59O1xuXG4vKipcbiAqIENvbW1pdHMgY2hhbmdlcyBpbiB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeSAtIHdoZW4gc3BlY2lmaWMgZmlsZSBwYXRocyBhcmUgc3VwcGxpZWQsIG9ubHkgY2hhbmdlcyBvbiB0aG9zZVxuICogZmlsZXMgd2lsbCBiZSBjb21taXR0ZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IG1lc3NhZ2VcbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBbZmlsZXNdXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5jb21taXQgPSBmdW5jdGlvbiAobWVzc2FnZSwgZmlsZXMsIG9wdGlvbnMsIHRoZW4pIHtcbiAgIGNvbnN0IG5leHQgPSB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKTtcbiAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG5cbiAgIGlmIChmaWx0ZXJTdHJpbmdPclN0cmluZ0FycmF5KG1lc3NhZ2UpKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKC4uLmFzQXJyYXkobWVzc2FnZSkpO1xuICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2Fybignc2ltcGxlLWdpdCBkZXByZWNhdGlvbiBub3RpY2U6IGdpdC5jb21taXQ6IHJlcXVpcmVzIHRoZSBjb21taXQgbWVzc2FnZSB0byBiZSBzdXBwbGllZCBhcyBhIHN0cmluZy9zdHJpbmdbXSwgdGhpcyB3aWxsIGJlIGFuIGVycm9yIGluIHZlcnNpb24gMycpO1xuICAgfVxuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGNvbW1pdFRhc2soXG4gICAgICAgICBtZXNzYWdlcyxcbiAgICAgICAgIGFzQXJyYXkoZmlsdGVyVHlwZShmaWxlcywgZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheSwgW10pKSxcbiAgICAgICAgIFsuLi5maWx0ZXJUeXBlKG9wdGlvbnMsIGZpbHRlckFycmF5LCBbXSksIC4uLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIDAsIHRydWUpXVxuICAgICAgKSxcbiAgICAgIG5leHRcbiAgICk7XG59O1xuXG4vKipcbiAqIFB1bGwgdGhlIHVwZGF0ZWQgY29udGVudHMgb2YgdGhlIGN1cnJlbnQgcmVwb1xuICovXG5HaXQucHJvdG90eXBlLnB1bGwgPSBmdW5jdGlvbiAocmVtb3RlLCBicmFuY2gsIG9wdGlvbnMsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgcHVsbFRhc2soZmlsdGVyVHlwZShyZW1vdGUsIGZpbHRlclN0cmluZyksIGZpbHRlclR5cGUoYnJhbmNoLCBmaWx0ZXJTdHJpbmcpLCBnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIEZldGNoIHRoZSB1cGRhdGVkIGNvbnRlbnRzIG9mIHRoZSBjdXJyZW50IHJlcG8uXG4gKlxuICogQGV4YW1wbGVcbiAqICAgLmZldGNoKCd1cHN0cmVhbScsICdtYXN0ZXInKSAvLyBmZXRjaGVzIGZyb20gbWFzdGVyIG9uIHJlbW90ZSBuYW1lZCB1cHN0cmVhbVxuICogICAuZmV0Y2goZnVuY3Rpb24gKCkge30pIC8vIHJ1bnMgZmV0Y2ggYWdhaW5zdCBkZWZhdWx0IHJlbW90ZSBhbmQgYnJhbmNoIGFuZCBjYWxscyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcmVtb3RlXVxuICogQHBhcmFtIHtzdHJpbmd9IFticmFuY2hdXG4gKi9cbkdpdC5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbiAocmVtb3RlLCBicmFuY2gpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgZmV0Y2hUYXNrKGZpbHRlclR5cGUocmVtb3RlLCBmaWx0ZXJTdHJpbmcpLCBmaWx0ZXJUeXBlKGJyYW5jaCwgZmlsdGVyU3RyaW5nKSwgZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBEaXNhYmxlcy9lbmFibGVzIHRoZSB1c2Ugb2YgdGhlIGNvbnNvbGUgZm9yIHByaW50aW5nIHdhcm5pbmdzIGFuZCBlcnJvcnMsIGJ5IGRlZmF1bHQgbWVzc2FnZXMgYXJlIG5vdCBzaG93biBpblxuICogYSBwcm9kdWN0aW9uIGVudmlyb25tZW50LlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2lsZW5jZVxuICogQHJldHVybnMge0dpdH1cbiAqL1xuR2l0LnByb3RvdHlwZS5zaWxlbnQgPSBmdW5jdGlvbiAoc2lsZW5jZSkge1xuICAgY29uc29sZS53YXJuKCdzaW1wbGUtZ2l0IGRlcHJlY2F0aW9uIG5vdGljZTogZ2l0LnNpbGVudDogbG9nZ2luZyBzaG91bGQgYmUgY29uZmlndXJlZCB1c2luZyB0aGUgYGRlYnVnYCBsaWJyYXJ5IC8gYERFQlVHYCBlbnZpcm9ubWVudCB2YXJpYWJsZSwgdGhpcyB3aWxsIGJlIGFuIGVycm9yIGluIHZlcnNpb24gMycpO1xuICAgdGhpcy5fbG9nZ2VyLnNpbGVudCghIXNpbGVuY2UpO1xuICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIExpc3QgYWxsIHRhZ3MuIFdoZW4gdXNpbmcgZ2l0IDIuNy4wIG9yIGFib3ZlLCBpbmNsdWRlIGFuIG9wdGlvbnMgb2JqZWN0IHdpdGggYFwiLS1zb3J0XCI6IFwicHJvcGVydHktbmFtZVwiYCB0b1xuICogc29ydCB0aGUgdGFncyBieSB0aGF0IHByb3BlcnR5IGluc3RlYWQgb2YgdXNpbmcgdGhlIGRlZmF1bHQgc2VtYW50aWMgdmVyc2lvbmluZyBzb3J0LlxuICpcbiAqIE5vdGUsIHN1cHBseWluZyB0aGlzIG9wdGlvbiB3aGVuIGl0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgeW91ciBHaXQgdmVyc2lvbiB3aWxsIGNhdXNlIHRoZSBvcGVyYXRpb24gdG8gZmFpbC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS50YWdzID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgdGFnTGlzdFRhc2soZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBSZWJhc2VzIHRoZSBjdXJyZW50IHdvcmtpbmcgY29weS4gT3B0aW9ucyBjYW4gYmUgc3VwcGxpZWQgZWl0aGVyIGFzIGFuIGFycmF5IG9mIHN0cmluZyBwYXJhbWV0ZXJzXG4gKiB0byBiZSBzZW50IHRvIHRoZSBgZ2l0IHJlYmFzZWAgY29tbWFuZCwgb3IgYSBzdGFuZGFyZCBvcHRpb25zIG9iamVjdC5cbiAqL1xuR2l0LnByb3RvdHlwZS5yZWJhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soWydyZWJhc2UnLCAuLi5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKV0pLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cylcbiAgICk7XG59O1xuXG4vKipcbiAqIFJlc2V0IGEgcmVwb1xuICovXG5HaXQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKG1vZGUpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgcmVzZXRUYXNrKGdldFJlc2V0TW9kZShtb2RlKSwgZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBSZXZlcnQgb25lIG9yIG1vcmUgY29tbWl0cyBpbiB0aGUgbG9jYWwgd29ya2luZyBjb3B5XG4gKi9cbkdpdC5wcm90b3R5cGUucmV2ZXJ0ID0gZnVuY3Rpb24gKGNvbW1pdCkge1xuICAgY29uc3QgbmV4dCA9IHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpO1xuXG4gICBpZiAodHlwZW9mIGNvbW1pdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgICAgY29uZmlndXJhdGlvbkVycm9yVGFzaygnQ29tbWl0IG11c3QgYmUgYSBzdHJpbmcnKSxcbiAgICAgICAgIG5leHQsXG4gICAgICApO1xuICAgfVxuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soWydyZXZlcnQnLCAuLi5nZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzLCAwLCB0cnVlKSwgY29tbWl0XSksXG4gICAgICBuZXh0XG4gICApO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaWdodHdlaWdodCB0YWcgdG8gdGhlIGhlYWQgb2YgdGhlIGN1cnJlbnQgYnJhbmNoXG4gKi9cbkdpdC5wcm90b3R5cGUuYWRkVGFnID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgIGNvbnN0IHRhc2sgPSAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKVxuICAgICAgPyBhZGRUYWdUYXNrKG5hbWUpXG4gICAgICA6IGNvbmZpZ3VyYXRpb25FcnJvclRhc2soJ0dpdC5hZGRUYWcgcmVxdWlyZXMgYSB0YWcgbmFtZScpO1xuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayh0YXNrLCB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSk7XG59O1xuXG4vKipcbiAqIEFkZCBhbiBhbm5vdGF0ZWQgdGFnIHRvIHRoZSBoZWFkIG9mIHRoZSBjdXJyZW50IGJyYW5jaFxuICovXG5HaXQucHJvdG90eXBlLmFkZEFubm90YXRlZFRhZyA9IGZ1bmN0aW9uICh0YWdOYW1lLCB0YWdNZXNzYWdlKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGFkZEFubm90YXRlZFRhZ1Rhc2sodGFnTmFtZSwgdGFnTWVzc2FnZSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIENoZWNrIG91dCBhIHRhZyBvciByZXZpc2lvbiwgYW55IG51bWJlciBvZiBhZGRpdGlvbmFsIGFyZ3VtZW50cyBjYW4gYmUgcGFzc2VkIHRvIHRoZSBgZ2l0IGNoZWNrb3V0YCBjb21tYW5kXG4gKiBieSBzdXBwbHlpbmcgZWl0aGVyIGEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICovXG5HaXQucHJvdG90eXBlLmNoZWNrb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgY29uc3QgY29tbWFuZHMgPSBbJ2NoZWNrb3V0JywgLi4uZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cywgdHJ1ZSldO1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmRzKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgb3V0IGEgcmVtb3RlIGJyYW5jaFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2hOYW1lIG5hbWUgb2YgYnJhbmNoXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RhcnRQb2ludCAoZS5nIG9yaWdpbi9kZXZlbG9wbWVudClcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0aGVuXVxuICovXG5HaXQucHJvdG90eXBlLmNoZWNrb3V0QnJhbmNoID0gZnVuY3Rpb24gKGJyYW5jaE5hbWUsIHN0YXJ0UG9pbnQsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLmNoZWNrb3V0KFsnLWInLCBicmFuY2hOYW1lLCBzdGFydFBvaW50XSwgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xufTtcblxuLyoqXG4gKiBDaGVjayBvdXQgYSBsb2NhbCBicmFuY2hcbiAqL1xuR2l0LnByb3RvdHlwZS5jaGVja291dExvY2FsQnJhbmNoID0gZnVuY3Rpb24gKGJyYW5jaE5hbWUsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLmNoZWNrb3V0KFsnLWInLCBicmFuY2hOYW1lXSwgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cykpO1xufTtcblxuLyoqXG4gKiBEZWxldGUgYSBsb2NhbCBicmFuY2hcbiAqL1xuR2l0LnByb3RvdHlwZS5kZWxldGVMb2NhbEJyYW5jaCA9IGZ1bmN0aW9uIChicmFuY2hOYW1lLCBmb3JjZURlbGV0ZSwgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBkZWxldGVCcmFuY2hUYXNrKGJyYW5jaE5hbWUsIHR5cGVvZiBmb3JjZURlbGV0ZSA9PT0gXCJib29sZWFuXCIgPyBmb3JjZURlbGV0ZSA6IGZhbHNlKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogRGVsZXRlIG9uZSBvciBtb3JlIGxvY2FsIGJyYW5jaGVzXG4gKi9cbkdpdC5wcm90b3R5cGUuZGVsZXRlTG9jYWxCcmFuY2hlcyA9IGZ1bmN0aW9uIChicmFuY2hOYW1lcywgZm9yY2VEZWxldGUsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgZGVsZXRlQnJhbmNoZXNUYXNrKGJyYW5jaE5hbWVzLCB0eXBlb2YgZm9yY2VEZWxldGUgPT09IFwiYm9vbGVhblwiID8gZm9yY2VEZWxldGUgOiBmYWxzZSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIExpc3QgYWxsIGJyYW5jaGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3QgfCBzdHJpbmdbXX0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5icmFuY2ggPSBmdW5jdGlvbiAob3B0aW9ucywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBicmFuY2hUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGxpc3Qgb2YgbG9jYWwgYnJhbmNoZXNcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5icmFuY2hMb2NhbCA9IGZ1bmN0aW9uICh0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGJyYW5jaExvY2FsVGFzaygpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBFeGVjdXRlcyBhbnkgY29tbWFuZCBhZ2FpbnN0IHRoZSBnaXQgYmluYXJ5LlxuICovXG5HaXQucHJvdG90eXBlLnJhdyA9IGZ1bmN0aW9uIChjb21tYW5kcykge1xuICAgY29uc3QgY3JlYXRlUmVzdENvbW1hbmRzID0gIUFycmF5LmlzQXJyYXkoY29tbWFuZHMpO1xuICAgY29uc3QgY29tbWFuZCA9IFtdLnNsaWNlLmNhbGwoY3JlYXRlUmVzdENvbW1hbmRzID8gYXJndW1lbnRzIDogY29tbWFuZHMsIDApO1xuXG4gICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbW1hbmQubGVuZ3RoICYmIGNyZWF0ZVJlc3RDb21tYW5kczsgaSsrKSB7XG4gICAgICBpZiAoIWZpbHRlclByaW1pdGl2ZXMoY29tbWFuZFtpXSkpIHtcbiAgICAgICAgIGNvbW1hbmQuc3BsaWNlKGksIGNvbW1hbmQubGVuZ3RoIC0gaSk7XG4gICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgIH1cblxuICAgY29tbWFuZC5wdXNoKFxuICAgICAgLi4uZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cywgMCwgdHJ1ZSksXG4gICApO1xuXG4gICB2YXIgbmV4dCA9IHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpO1xuXG4gICBpZiAoIWNvbW1hbmQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgICAgIGNvbmZpZ3VyYXRpb25FcnJvclRhc2soJ1JhdzogbXVzdCBzdXBwbHkgb25lIG9yIG1vcmUgY29tbWFuZCB0byBleGVjdXRlJyksXG4gICAgICAgICBuZXh0LFxuICAgICAgKTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kKSwgbmV4dCk7XG59O1xuXG5HaXQucHJvdG90eXBlLnN1Ym1vZHVsZUFkZCA9IGZ1bmN0aW9uIChyZXBvLCBwYXRoLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGFkZFN1Yk1vZHVsZVRhc2socmVwbywgcGF0aCksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG5HaXQucHJvdG90eXBlLnN1Ym1vZHVsZVVwZGF0ZSA9IGZ1bmN0aW9uIChhcmdzLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHVwZGF0ZVN1Yk1vZHVsZVRhc2soZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cywgdHJ1ZSkpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuR2l0LnByb3RvdHlwZS5zdWJtb2R1bGVJbml0ID0gZnVuY3Rpb24gKGFyZ3MsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgaW5pdFN1Yk1vZHVsZVRhc2soZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cywgdHJ1ZSkpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuR2l0LnByb3RvdHlwZS5zdWJNb2R1bGUgPSBmdW5jdGlvbiAob3B0aW9ucywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdWJNb2R1bGVUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbkdpdC5wcm90b3R5cGUubGlzdFJlbW90ZSA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgbGlzdFJlbW90ZXNUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogQWRkcyBhIHJlbW90ZSB0byB0aGUgbGlzdCBvZiByZW1vdGVzLlxuICovXG5HaXQucHJvdG90eXBlLmFkZFJlbW90ZSA9IGZ1bmN0aW9uIChyZW1vdGVOYW1lLCByZW1vdGVSZXBvLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGFkZFJlbW90ZVRhc2socmVtb3RlTmFtZSwgcmVtb3RlUmVwbywgZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGFuIGVudHJ5IGJ5IG5hbWUgZnJvbSB0aGUgbGlzdCBvZiByZW1vdGVzLlxuICovXG5HaXQucHJvdG90eXBlLnJlbW92ZVJlbW90ZSA9IGZ1bmN0aW9uIChyZW1vdGVOYW1lLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHJlbW92ZVJlbW90ZVRhc2socmVtb3RlTmFtZSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgcmVtb3Rlcywgc2V0dGluZyB0aGUgb3B0aW9uYWwgdmVyYm9zZSBhcmd1bWVudCB0byB0cnVlIGluY2x1ZGVzIGFkZGl0aW9uYWxcbiAqIGRldGFpbCBvbiB0aGUgcmVtb3RlcyB0aGVtc2VsdmVzLlxuICovXG5HaXQucHJvdG90eXBlLmdldFJlbW90ZXMgPSBmdW5jdGlvbiAodmVyYm9zZSwgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBnZXRSZW1vdGVzVGFzayh2ZXJib3NlID09PSB0cnVlKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogQ2FsbCBhbnkgYGdpdCByZW1vdGVgIGZ1bmN0aW9uIHdpdGggYXJndW1lbnRzIHBhc3NlZCBhcyBhbiBhcnJheSBvZiBzdHJpbmdzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0aGVuXVxuICovXG5HaXQucHJvdG90eXBlLnJlbW90ZSA9IGZ1bmN0aW9uIChvcHRpb25zLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHJlbW90ZVRhc2soZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cykpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuLyoqXG4gKiBDYWxsIGFueSBgZ2l0IHRhZ2AgZnVuY3Rpb24gd2l0aCBhcmd1bWVudHMgcGFzc2VkIGFzIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4gKlxuICogQHBhcmFtIHtzdHJpbmdbXX0gb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUudGFnID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIGNvbnN0IGNvbW1hbmQgPSBnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKTtcblxuICAgaWYgKGNvbW1hbmRbMF0gIT09ICd0YWcnKSB7XG4gICAgICBjb21tYW5kLnVuc2hpZnQoJ3RhZycpO1xuICAgfVxuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soY29tbWFuZCksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKVxuICAgKTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyByZXBvc2l0b3J5IHNlcnZlciBpbmZvXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUudXBkYXRlU2VydmVySW5mbyA9IGZ1bmN0aW9uICh0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHN0cmFpZ2h0VGhyb3VnaFN0cmluZ1Rhc2soWyd1cGRhdGUtc2VydmVyLWluZm8nXSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG4vKipcbiAqIFB1c2hlcyB0aGUgY3VycmVudCB0YWcgY2hhbmdlcyB0byBhIHJlbW90ZSB3aGljaCBjYW4gYmUgZWl0aGVyIGEgVVJMIG9yIG5hbWVkIHJlbW90ZS4gV2hlbiBub3Qgc3BlY2lmaWVkIHVzZXMgdGhlXG4gKiBkZWZhdWx0IGNvbmZpZ3VyZWQgcmVtb3RlIHNwZWMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtyZW1vdGVdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5wdXNoVGFncyA9IGZ1bmN0aW9uIChyZW1vdGUsIHRoZW4pIHtcbiAgIGNvbnN0IHRhc2sgPSBwdXNoVGFnc1Rhc2soe3JlbW90ZTogZmlsdGVyVHlwZShyZW1vdGUsIGZpbHRlclN0cmluZyl9LCBnZXRUcmFpbGluZ09wdGlvbnMoYXJndW1lbnRzKSk7XG5cbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2ssIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgbmFtZWQgZmlsZXMgZnJvbSBzb3VyY2UgY29udHJvbC5cbiAqL1xuR2l0LnByb3RvdHlwZS5ybSA9IGZ1bmN0aW9uIChmaWxlcykge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsncm0nLCAnLWYnLCAuLi5hc0FycmF5KGZpbGVzKV0pLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cylcbiAgICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIG5hbWVkIGZpbGVzIGZyb20gc291cmNlIGNvbnRyb2wgYnV0IGtlZXBzIHRoZW0gb24gZGlzayByYXRoZXIgdGhhbiBkZWxldGluZyB0aGVtIGVudGlyZWx5LiBUb1xuICogY29tcGxldGVseSByZW1vdmUgdGhlIGZpbGVzLCB1c2UgYHJtYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gZmlsZXNcbiAqL1xuR2l0LnByb3RvdHlwZS5ybUtlZXBMb2NhbCA9IGZ1bmN0aW9uIChmaWxlcykge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsncm0nLCAnLS1jYWNoZWQnLCAuLi5hc0FycmF5KGZpbGVzKV0pLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cylcbiAgICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBsaXN0IG9mIG9iamVjdHMgaW4gYSB0cmVlIGJhc2VkIG9uIGNvbW1pdCBoYXNoLiBQYXNzaW5nIGluIGFuIG9iamVjdCBoYXNoIHJldHVybnMgdGhlIG9iamVjdCdzIGNvbnRlbnQsXG4gKiBzaXplLCBhbmQgdHlwZS5cbiAqXG4gKiBQYXNzaW5nIFwiLXBcIiB3aWxsIGluc3RydWN0IGNhdC1maWxlIHRvIGRldGVybWluZSB0aGUgb2JqZWN0IHR5cGUsIGFuZCBkaXNwbGF5IGl0cyBmb3JtYXR0ZWQgY29udGVudHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbdGhlbl1cbiAqL1xuR2l0LnByb3RvdHlwZS5jYXRGaWxlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9jYXRGaWxlKCd1dGYtOCcsIGFyZ3VtZW50cyk7XG59O1xuXG5HaXQucHJvdG90eXBlLmJpbmFyeUNhdEZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICByZXR1cm4gdGhpcy5fY2F0RmlsZSgnYnVmZmVyJywgYXJndW1lbnRzKTtcbn07XG5cbkdpdC5wcm90b3R5cGUuX2NhdEZpbGUgPSBmdW5jdGlvbiAoZm9ybWF0LCBhcmdzKSB7XG4gICB2YXIgaGFuZGxlciA9IHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmdzKTtcbiAgIHZhciBjb21tYW5kID0gWydjYXQtZmlsZSddO1xuICAgdmFyIG9wdGlvbnMgPSBhcmdzWzBdO1xuXG4gICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgICAgIGNvbmZpZ3VyYXRpb25FcnJvclRhc2soJ0dpdC5jYXRGaWxlOiBvcHRpb25zIG11c3QgYmUgc3VwcGxpZWQgYXMgYW4gYXJyYXkgb2Ygc3RyaW5ncycpLFxuICAgICAgICAgaGFuZGxlcixcbiAgICAgICk7XG4gICB9XG5cbiAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICBjb21tYW5kLnB1c2guYXBwbHkoY29tbWFuZCwgb3B0aW9ucyk7XG4gICB9XG5cbiAgIGNvbnN0IHRhc2sgPSBmb3JtYXQgPT09ICdidWZmZXInXG4gICAgICA/IHN0cmFpZ2h0VGhyb3VnaEJ1ZmZlclRhc2soY29tbWFuZClcbiAgICAgIDogc3RyYWlnaHRUaHJvdWdoU3RyaW5nVGFzayhjb21tYW5kKTtcblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2sodGFzaywgaGFuZGxlcik7XG59O1xuXG5HaXQucHJvdG90eXBlLmRpZmYgPSBmdW5jdGlvbiAob3B0aW9ucywgdGhlbikge1xuICAgY29uc3QgY29tbWFuZCA9IFsnZGlmZicsIC4uLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMpXTtcblxuICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgY29tbWFuZC5zcGxpY2UoMSwgMCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLl9sb2dnZXIud2FybignR2l0I2RpZmY6IHN1cHBseWluZyBvcHRpb25zIGFzIGEgc2luZ2xlIHN0cmluZyBpcyBub3cgZGVwcmVjYXRlZCwgc3dpdGNoIHRvIGFuIGFycmF5IG9mIHN0cmluZ3MnKTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmQpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuR2l0LnByb3RvdHlwZS5kaWZmU3VtbWFyeSA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgZGlmZlN1bW1hcnlUYXNrKGdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIDEpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbkdpdC5wcm90b3R5cGUuYXBwbHlQYXRjaCA9IGZ1bmN0aW9uIChwYXRjaGVzKSB7XG4gICBjb25zdCB0YXNrID0gIWZpbHRlclN0cmluZ09yU3RyaW5nQXJyYXkocGF0Y2hlcylcbiAgICAgID8gY29uZmlndXJhdGlvbkVycm9yVGFzayhgZ2l0LmFwcGx5UGF0Y2ggcmVxdWlyZXMgb25lIG9yIG1vcmUgc3RyaW5nIHBhdGNoZXMgYXMgdGhlIGZpcnN0IGFyZ3VtZW50YClcbiAgICAgIDogYXBwbHlQYXRjaFRhc2soYXNBcnJheShwYXRjaGVzKSwgZ2V0VHJhaWxpbmdPcHRpb25zKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIHRhc2ssXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59XG5cbkdpdC5wcm90b3R5cGUucmV2cGFyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICBjb25zdCBjb21tYW5kcyA9IFsncmV2LXBhcnNlJywgLi4uZ2V0VHJhaWxpbmdPcHRpb25zKGFyZ3VtZW50cywgdHJ1ZSldO1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKGNvbW1hbmRzLCB0cnVlKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbi8qKlxuICogU2hvdyB2YXJpb3VzIHR5cGVzIG9mIG9iamVjdHMsIGZvciBleGFtcGxlIHRoZSBmaWxlIGF0IGEgY2VydGFpbiBjb21taXRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFt0aGVuXVxuICovXG5HaXQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAob3B0aW9ucywgdGhlbikge1xuICAgcmV0dXJuIHRoaXMuX3J1blRhc2soXG4gICAgICBzdHJhaWdodFRocm91Z2hTdHJpbmdUYXNrKFsnc2hvdycsIC4uLmdldFRyYWlsaW5nT3B0aW9ucyhhcmd1bWVudHMsIDEpXSksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKVxuICAgKTtcbn07XG5cbi8qKlxuICovXG5HaXQucHJvdG90eXBlLmNsZWFuID0gZnVuY3Rpb24gKG1vZGUsIG9wdGlvbnMsIHRoZW4pIHtcbiAgIGNvbnN0IHVzaW5nQ2xlYW5PcHRpb25zQXJyYXkgPSBpc0NsZWFuT3B0aW9uc0FycmF5KG1vZGUpO1xuICAgY29uc3QgY2xlYW5Nb2RlID0gdXNpbmdDbGVhbk9wdGlvbnNBcnJheSAmJiBtb2RlLmpvaW4oJycpIHx8IGZpbHRlclR5cGUobW9kZSwgZmlsdGVyU3RyaW5nKSB8fCAnJztcbiAgIGNvbnN0IGN1c3RvbUFyZ3MgPSBnZXRUcmFpbGluZ09wdGlvbnMoW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIHVzaW5nQ2xlYW5PcHRpb25zQXJyYXkgPyAxIDogMCkpO1xuXG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGNsZWFuV2l0aE9wdGlvbnNUYXNrKGNsZWFuTW9kZSwgY3VzdG9tQXJncyksXG4gICAgICB0cmFpbGluZ0Z1bmN0aW9uQXJndW1lbnQoYXJndW1lbnRzKSxcbiAgICk7XG59O1xuXG5HaXQucHJvdG90eXBlLmV4ZWMgPSBmdW5jdGlvbiAodGhlbikge1xuICAgY29uc3QgdGFzayA9IHtcbiAgICAgIGNvbW1hbmRzOiBbXSxcbiAgICAgIGZvcm1hdDogJ3V0Zi04JyxcbiAgICAgIHBhcnNlciAoKSB7XG4gICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoZW4oKTtcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH07XG5cbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKHRhc2spO1xufTtcblxuLyoqXG4gKiBDbGVhcnMgdGhlIHF1ZXVlIG9mIHBlbmRpbmcgY29tbWFuZHMgYW5kIHJldHVybnMgdGhlIHdyYXBwZXIgaW5zdGFuY2UgZm9yIGNoYWluaW5nLlxuICpcbiAqIEByZXR1cm5zIHtHaXR9XG4gKi9cbkdpdC5wcm90b3R5cGUuY2xlYXJRdWV1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgIC8vIFRPRE86XG4gICAvLyB0aGlzLl9leGVjdXRvci5jbGVhcigpO1xuICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGEgcGF0aG5hbWUgb3IgcGF0aG5hbWVzIGFyZSBleGNsdWRlZCBieSAuZ2l0aWdub3JlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBhdGhuYW1lc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW3RoZW5dXG4gKi9cbkdpdC5wcm90b3R5cGUuY2hlY2tJZ25vcmUgPSBmdW5jdGlvbiAocGF0aG5hbWVzLCB0aGVuKSB7XG4gICByZXR1cm4gdGhpcy5fcnVuVGFzayhcbiAgICAgIGNoZWNrSWdub3JlVGFzayhhc0FycmF5KChmaWx0ZXJUeXBlKHBhdGhuYW1lcywgZmlsdGVyU3RyaW5nT3JTdHJpbmdBcnJheSwgW10pKSkpLFxuICAgICAgdHJhaWxpbmdGdW5jdGlvbkFyZ3VtZW50KGFyZ3VtZW50cyksXG4gICApO1xufTtcblxuR2l0LnByb3RvdHlwZS5jaGVja0lzUmVwbyA9IGZ1bmN0aW9uIChjaGVja1R5cGUsIHRoZW4pIHtcbiAgIHJldHVybiB0aGlzLl9ydW5UYXNrKFxuICAgICAgY2hlY2tJc1JlcG9UYXNrKGZpbHRlclR5cGUoY2hlY2tUeXBlLCBmaWx0ZXJTdHJpbmcpKSxcbiAgICAgIHRyYWlsaW5nRnVuY3Rpb25Bcmd1bWVudChhcmd1bWVudHMpLFxuICAgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2l0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdpdEluc3RhbmNlRmFjdG9yeSA9IGV4cG9ydHMuZ2l0RXhwb3J0RmFjdG9yeSA9IGV4cG9ydHMuZXNNb2R1bGVGYWN0b3J5ID0gdm9pZCAwO1xuY29uc3QgYXBpXzEgPSByZXF1aXJlKFwiLi9hcGlcIik7XG5jb25zdCBwbHVnaW5zXzEgPSByZXF1aXJlKFwiLi9wbHVnaW5zXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuY29uc3QgR2l0ID0gcmVxdWlyZSgnLi4vZ2l0Jyk7XG4vKipcbiAqIEFkZHMgdGhlIG5lY2Vzc2FyeSBwcm9wZXJ0aWVzIHRvIHRoZSBzdXBwbGllZCBvYmplY3QgdG8gZW5hYmxlIGl0IGZvciB1c2UgYXNcbiAqIHRoZSBkZWZhdWx0IGV4cG9ydCBvZiBhIG1vZHVsZS5cbiAqXG4gKiBFZzogYG1vZHVsZS5leHBvcnRzID0gZXNNb2R1bGVGYWN0b3J5KHsgc29tZXRoaW5nICgpIHt9IH0pYFxuICovXG5mdW5jdGlvbiBlc01vZHVsZUZhY3RvcnkoZGVmYXVsdEV4cG9ydCkge1xuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhkZWZhdWx0RXhwb3J0LCB7XG4gICAgICAgIF9fZXNNb2R1bGU6IHsgdmFsdWU6IHRydWUgfSxcbiAgICAgICAgZGVmYXVsdDogeyB2YWx1ZTogZGVmYXVsdEV4cG9ydCB9LFxuICAgIH0pO1xufVxuZXhwb3J0cy5lc01vZHVsZUZhY3RvcnkgPSBlc01vZHVsZUZhY3Rvcnk7XG5mdW5jdGlvbiBnaXRFeHBvcnRGYWN0b3J5KGZhY3RvcnksIGV4dHJhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGZhY3RvcnkuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgYXBpXzEuZGVmYXVsdCwgZXh0cmEgfHwge30pO1xufVxuZXhwb3J0cy5naXRFeHBvcnRGYWN0b3J5ID0gZ2l0RXhwb3J0RmFjdG9yeTtcbmZ1bmN0aW9uIGdpdEluc3RhbmNlRmFjdG9yeShiYXNlRGlyLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcGx1Z2lucyA9IG5ldyBwbHVnaW5zXzEuUGx1Z2luU3RvcmUoKTtcbiAgICBjb25zdCBjb25maWcgPSB1dGlsc18xLmNyZWF0ZUluc3RhbmNlQ29uZmlnKGJhc2VEaXIgJiYgKHR5cGVvZiBiYXNlRGlyID09PSAnc3RyaW5nJyA/IHsgYmFzZURpciB9IDogYmFzZURpcikgfHwge30sIG9wdGlvbnMpO1xuICAgIGlmICghdXRpbHNfMS5mb2xkZXJFeGlzdHMoY29uZmlnLmJhc2VEaXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBhcGlfMS5kZWZhdWx0LkdpdENvbnN0cnVjdEVycm9yKGNvbmZpZywgYENhbm5vdCB1c2Ugc2ltcGxlLWdpdCBvbiBhIGRpcmVjdG9yeSB0aGF0IGRvZXMgbm90IGV4aXN0YCk7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbmZpZy5jb25maWcpKSB7XG4gICAgICAgIHBsdWdpbnMuYWRkKHBsdWdpbnNfMS5jb21tYW5kQ29uZmlnUHJlZml4aW5nUGx1Z2luKGNvbmZpZy5jb25maWcpKTtcbiAgICB9XG4gICAgY29uZmlnLnByb2dyZXNzICYmIHBsdWdpbnMuYWRkKHBsdWdpbnNfMS5wcm9ncmVzc01vbml0b3JQbHVnaW4oY29uZmlnLnByb2dyZXNzKSk7XG4gICAgY29uZmlnLnRpbWVvdXQgJiYgcGx1Z2lucy5hZGQocGx1Z2luc18xLnRpbWVvdXRQbHVnaW4oY29uZmlnLnRpbWVvdXQpKTtcbiAgICBjb25maWcuc3Bhd25PcHRpb25zICYmIHBsdWdpbnMuYWRkKHBsdWdpbnNfMS5zcGF3bk9wdGlvbnNQbHVnaW4oY29uZmlnLnNwYXduT3B0aW9ucykpO1xuICAgIHBsdWdpbnMuYWRkKHBsdWdpbnNfMS5lcnJvckRldGVjdGlvblBsdWdpbihwbHVnaW5zXzEuZXJyb3JEZXRlY3Rpb25IYW5kbGVyKHRydWUpKSk7XG4gICAgY29uZmlnLmVycm9ycyAmJiBwbHVnaW5zLmFkZChwbHVnaW5zXzEuZXJyb3JEZXRlY3Rpb25QbHVnaW4oY29uZmlnLmVycm9ycykpO1xuICAgIHJldHVybiBuZXcgR2l0KGNvbmZpZywgcGx1Z2lucyk7XG59XG5leHBvcnRzLmdpdEluc3RhbmNlRmFjdG9yeSA9IGdpdEluc3RhbmNlRmFjdG9yeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpdC1mYWN0b3J5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5naXRQID0gdm9pZCAwO1xuY29uc3QgZ2l0X3Jlc3BvbnNlX2Vycm9yXzEgPSByZXF1aXJlKFwiLi4vZXJyb3JzL2dpdC1yZXNwb25zZS1lcnJvclwiKTtcbmNvbnN0IGdpdF9mYWN0b3J5XzEgPSByZXF1aXJlKFwiLi4vZ2l0LWZhY3RvcnlcIik7XG5jb25zdCBmdW5jdGlvbk5hbWVzQnVpbGRlckFwaSA9IFtcbiAgICAnY3VzdG9tQmluYXJ5JywgJ2VudicsICdvdXRwdXRIYW5kbGVyJywgJ3NpbGVudCcsXG5dO1xuY29uc3QgZnVuY3Rpb25OYW1lc1Byb21pc2VBcGkgPSBbXG4gICAgJ2FkZCcsXG4gICAgJ2FkZEFubm90YXRlZFRhZycsXG4gICAgJ2FkZENvbmZpZycsXG4gICAgJ2FkZFJlbW90ZScsXG4gICAgJ2FkZFRhZycsXG4gICAgJ2FwcGx5UGF0Y2gnLFxuICAgICdiaW5hcnlDYXRGaWxlJyxcbiAgICAnYnJhbmNoJyxcbiAgICAnYnJhbmNoTG9jYWwnLFxuICAgICdjYXRGaWxlJyxcbiAgICAnY2hlY2tJZ25vcmUnLFxuICAgICdjaGVja0lzUmVwbycsXG4gICAgJ2NoZWNrb3V0JyxcbiAgICAnY2hlY2tvdXRCcmFuY2gnLFxuICAgICdjaGVja291dExhdGVzdFRhZycsXG4gICAgJ2NoZWNrb3V0TG9jYWxCcmFuY2gnLFxuICAgICdjbGVhbicsXG4gICAgJ2Nsb25lJyxcbiAgICAnY29tbWl0JyxcbiAgICAnY3dkJyxcbiAgICAnZGVsZXRlTG9jYWxCcmFuY2gnLFxuICAgICdkZWxldGVMb2NhbEJyYW5jaGVzJyxcbiAgICAnZGlmZicsXG4gICAgJ2RpZmZTdW1tYXJ5JyxcbiAgICAnZXhlYycsXG4gICAgJ2ZldGNoJyxcbiAgICAnZ2V0UmVtb3RlcycsXG4gICAgJ2luaXQnLFxuICAgICdsaXN0Q29uZmlnJyxcbiAgICAnbGlzdFJlbW90ZScsXG4gICAgJ2xvZycsXG4gICAgJ21lcmdlJyxcbiAgICAnbWVyZ2VGcm9tVG8nLFxuICAgICdtaXJyb3InLFxuICAgICdtdicsXG4gICAgJ3B1bGwnLFxuICAgICdwdXNoJyxcbiAgICAncHVzaFRhZ3MnLFxuICAgICdyYXcnLFxuICAgICdyZWJhc2UnLFxuICAgICdyZW1vdGUnLFxuICAgICdyZW1vdmVSZW1vdGUnLFxuICAgICdyZXNldCcsXG4gICAgJ3JldmVydCcsXG4gICAgJ3JldnBhcnNlJyxcbiAgICAncm0nLFxuICAgICdybUtlZXBMb2NhbCcsXG4gICAgJ3Nob3cnLFxuICAgICdzdGFzaCcsXG4gICAgJ3N0YXNoTGlzdCcsXG4gICAgJ3N0YXR1cycsXG4gICAgJ3N1Yk1vZHVsZScsXG4gICAgJ3N1Ym1vZHVsZUFkZCcsXG4gICAgJ3N1Ym1vZHVsZUluaXQnLFxuICAgICdzdWJtb2R1bGVVcGRhdGUnLFxuICAgICd0YWcnLFxuICAgICd0YWdzJyxcbiAgICAndXBkYXRlU2VydmVySW5mbydcbl07XG5mdW5jdGlvbiBnaXRQKC4uLmFyZ3MpIHtcbiAgICBsZXQgZ2l0O1xuICAgIGxldCBjaGFpbiA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIHRyeSB7XG4gICAgICAgIGdpdCA9IGdpdF9mYWN0b3J5XzEuZ2l0SW5zdGFuY2VGYWN0b3J5KC4uLmFyZ3MpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjaGFpbiA9IFByb21pc2UucmVqZWN0KGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZGVyUmV0dXJuKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZUFwaTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hhaW5SZXR1cm4oKSB7XG4gICAgICAgIHJldHVybiBjaGFpbjtcbiAgICB9XG4gICAgY29uc3QgcHJvbWlzZUFwaSA9IFsuLi5mdW5jdGlvbk5hbWVzQnVpbGRlckFwaSwgLi4uZnVuY3Rpb25OYW1lc1Byb21pc2VBcGldLnJlZHVjZSgoYXBpLCBuYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzQXN5bmMgPSBmdW5jdGlvbk5hbWVzUHJvbWlzZUFwaS5pbmNsdWRlcyhuYW1lKTtcbiAgICAgICAgY29uc3QgdmFsaWQgPSBpc0FzeW5jID8gYXN5bmNXcmFwcGVyKG5hbWUsIGdpdCkgOiBzeW5jV3JhcHBlcihuYW1lLCBnaXQsIGFwaSk7XG4gICAgICAgIGNvbnN0IGFsdGVybmF0aXZlID0gaXNBc3luYyA/IGNoYWluUmV0dXJuIDogYnVpbGRlclJldHVybjtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFwaSwgbmFtZSwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IGdpdCA/IHZhbGlkIDogYWx0ZXJuYXRpdmUsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXBpO1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gcHJvbWlzZUFwaTtcbiAgICBmdW5jdGlvbiBhc3luY1dyYXBwZXIoZm4sIGdpdCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlIGludGVyZmFjZSByZXF1aXJlcyB0aGF0IGhhbmRsZXJzIGFyZSBub3Qgc3VwcGxpZWQgaW5saW5lLCAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3RyYWlsaW5nIGZ1bmN0aW9uIG5vdCBhbGxvd2VkIGluIGNhbGwgdG8gJyArIGZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjaGFpbi50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QodG9FcnJvcihlcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgZ2l0W2ZuXS5hcHBseShnaXQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN5bmNXcmFwcGVyKGZuLCBnaXQsIGFwaSkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGdpdFtmbl0oLi4uYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gYXBpO1xuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuZ2l0UCA9IGdpdFA7XG5mdW5jdGlvbiB0b0Vycm9yKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGVycm9yID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBnaXRfcmVzcG9uc2VfZXJyb3JfMS5HaXRSZXNwb25zZUVycm9yKGVycm9yKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb21pc2Utd3JhcHBlZC5qcy5tYXAiLCJcbmNvbnN0IHtnaXRQfSA9IHJlcXVpcmUoJy4vbGliL3J1bm5lcnMvcHJvbWlzZS13cmFwcGVkJyk7XG5jb25zdCB7ZXNNb2R1bGVGYWN0b3J5LCBnaXRJbnN0YW5jZUZhY3RvcnksIGdpdEV4cG9ydEZhY3Rvcnl9ID0gcmVxdWlyZSgnLi9saWIvZ2l0LWZhY3RvcnknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBlc01vZHVsZUZhY3RvcnkoXG4gICBnaXRFeHBvcnRGYWN0b3J5KGdpdEluc3RhbmNlRmFjdG9yeSwge2dpdFB9KVxuKTtcbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IE9ic2lkaWFuR2l0IGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IEJyYW5jaEluZm8sIEZpbGVTdGF0dXNSZXN1bHQsIFN0YXR1cyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdpdE1hbmFnZXIge1xuICAgIHJlYWRvbmx5IHBsdWdpbjogT2JzaWRpYW5HaXQ7XG4gICAgcmVhZG9ubHkgYXBwOiBBcHA7XG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBPYnNpZGlhbkdpdCkge1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5hcHAgPSBwbHVnaW4uYXBwO1xuICAgIH1cblxuICAgIGFic3RyYWN0IHN0YXR1cygpOiBQcm9taXNlPFN0YXR1cz47XG5cbiAgICBhYnN0cmFjdCBjb21taXRBbGwobWVzc2FnZT86IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPjtcblxuICAgIGFic3RyYWN0IHB1bGwoKTogUHJvbWlzZTxudW1iZXI+O1xuXG4gICAgYWJzdHJhY3QgcHVzaCgpOiBQcm9taXNlPG51bWJlcj47XG5cbiAgICBhYnN0cmFjdCBjYW5QdXNoKCk6IFByb21pc2U8Ym9vbGVhbj47XG5cbiAgICBhYnN0cmFjdCBjaGVja1JlcXVpcmVtZW50cygpOiBQcm9taXNlPFwidmFsaWRcIiB8IFwibWlzc2luZy1yZXBvXCIgfCBcIndyb25nLXNldHRpbmdzXCIgfCBcIm1pc3NpbmctZ2l0XCI+O1xuXG4gICAgYWJzdHJhY3QgYnJhbmNoSW5mbygpOiBQcm9taXNlPEJyYW5jaEluZm8+O1xuXG4gICAgYWJzdHJhY3QgY2hlY2tvdXQoYnJhbmNoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgYWJzdHJhY3QgaW5pdCgpOiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgYWJzdHJhY3Qgc2V0Q29uZmlnKHBhdGg6IHN0cmluZywgdmFsdWU6IGFueSk6IFByb21pc2U8dm9pZD47XG5cbiAgICBhYnN0cmFjdCBnZXRDb25maWcocGF0aDogc3RyaW5nKTogUHJvbWlzZTxhbnk+O1xuXG4gICAgYWJzdHJhY3QgZmV0Y2goKTogUHJvbWlzZTx2b2lkPjtcblxuICAgIGFzeW5jIGZvcm1hdENvbW1pdE1lc3NhZ2UoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWl0TWVzc2FnZTtcblxuICAgICAgICBpZiAodGVtcGxhdGUuaW5jbHVkZXMoXCJ7e251bUZpbGVzfX1cIikpIHtcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSBhd2FpdCB0aGlzLnN0YXR1cygpO1xuICAgICAgICAgICAgbGV0IG51bUZpbGVzID0gc3RhdHVzLmNoYW5nZWQubGVuZ3RoO1xuICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwie3tudW1GaWxlc319XCIsIFN0cmluZyhudW1GaWxlcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlLmluY2x1ZGVzKFwie3tmaWxlc319XCIpKSB7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gYXdhaXQgdGhpcy5zdGF0dXMoKTtcblxuICAgICAgICAgICAgbGV0IGNoYW5nZXNldDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXTsgfSA9IHt9O1xuICAgICAgICAgICAgc3RhdHVzLmNoYW5nZWQuZm9yRWFjaCgodmFsdWU6IEZpbGVTdGF0dXNSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuaW5kZXggaW4gY2hhbmdlc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZXNldFt2YWx1ZS5pbmRleF0ucHVzaCh2YWx1ZS5wYXRoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzZXRbdmFsdWUuaW5kZXhdID0gW3ZhbHVlLnBhdGhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgY2h1bmtzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBbYWN0aW9uLCBmaWxlc10gb2YgT2JqZWN0LmVudHJpZXMoY2hhbmdlc2V0KSkge1xuICAgICAgICAgICAgICAgIGNodW5rcy5wdXNoKGFjdGlvbiArIFwiIFwiICsgZmlsZXMuam9pbihcIiBcIikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBjaHVua3Muam9pbihcIiwgXCIpO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoXCJ7e2ZpbGVzfX1cIiwgZmlsZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1vbWVudCA9ICh3aW5kb3cgYXMgYW55KS5tb21lbnQ7XG4gICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShcbiAgICAgICAgICAgIFwie3tkYXRlfX1cIixcbiAgICAgICAgICAgIG1vbWVudCgpLmZvcm1hdCh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21taXREYXRlRm9ybWF0KVxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MubGlzdENoYW5nZWRGaWxlc0luTWVzc2FnZUJvZHkpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgKyBcIlxcblxcblwiICsgXCJBZmZlY3RlZCBmaWxlczpcIiArIFwiXFxuXCIgKyAoYXdhaXQgdGhpcy5zdGF0dXMoKSkuc3RhZ2VkLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBGaWxlU3lzdGVtQWRhcHRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHNpbXBsZUdpdCwgKiBhcyBzaW1wbGUgZnJvbSBcInNpbXBsZS1naXRcIjtcbmltcG9ydCB7IEdpdE1hbmFnZXIgfSBmcm9tIFwiLi9naXRNYW5hZ2VyXCI7XG5pbXBvcnQgT2JzaWRpYW5HaXQgZnJvbSBcIi4vbWFpblwiO1xuaW1wb3J0IHsgQnJhbmNoSW5mbywgRmlsZVN0YXR1c1Jlc3VsdCwgUGx1Z2luU3RhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgU2ltcGxlR2l0IGV4dGVuZHMgR2l0TWFuYWdlciB7XG4gICAgZ2l0OiBzaW1wbGUuU2ltcGxlR2l0O1xuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogT2JzaWRpYW5HaXQpIHtcbiAgICAgICAgc3VwZXIocGx1Z2luKTtcblxuICAgICAgICBjb25zdCBhZGFwdGVyID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlciBhcyBGaWxlU3lzdGVtQWRhcHRlcjtcbiAgICAgICAgY29uc3QgcGF0aCA9IGFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcblxuICAgICAgICBpZiAodGhpcy5pc0dpdEluc3RhbGxlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmdpdCA9IHNpbXBsZUdpdChwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHN0YXR1cygpOiBQcm9taXNlPHtcbiAgICAgICAgY2hhbmdlZDogRmlsZVN0YXR1c1Jlc3VsdFtdO1xuICAgICAgICBzdGFnZWQ6IHN0cmluZ1tdO1xuICAgICAgICBjb25mbGljdGVkOiBzdHJpbmdbXTtcbiAgICB9PiB7XG4gICAgICAgIHRoaXMucGx1Z2luLnNldFN0YXRlKFBsdWdpblN0YXRlLnN0YXR1cyk7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2l0LnN0YXR1cygpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hhbmdlZDogc3RhdHVzLmZpbGVzLFxuICAgICAgICAgICAgc3RhZ2VkOiBzdGF0dXMuc3RhZ2VkLFxuICAgICAgICAgICAgY29uZmxpY3RlZDogc3RhdHVzLmNvbmZsaWN0ZWQsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgY29tbWl0QWxsKG1lc3NhZ2U/OiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudXBkYXRlU3VibW9kdWxlcykge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0U3RhdGUoUGx1Z2luU3RhdGUuY29tbWl0KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZ2l0LnN1Yk1vZHVsZShbXCJmb3JlYWNoXCIsIFwiLS1yZWN1cnNpdmVcIiwgYGdpdCBhZGQgLUEgJiYgaWYgWyAhIC16IFwiJChnaXQgc3RhdHVzIC0tcG9yY2VsYWluKVwiIF07IHRoZW4gZ2l0IGNvbW1pdCAtbSBcIiR7bWVzc2FnZSA/PyBhd2FpdCB0aGlzLmZvcm1hdENvbW1pdE1lc3NhZ2UoKX1cIjsgZmlgXSwgKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0U3RhdGUoUGx1Z2luU3RhdGUuYWRkKTtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQuYWRkKFxuICAgICAgICAgICAgXCIuLypcIiwgKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5jb21taXQpO1xuXG4gICAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5naXQuY29tbWl0KG1lc3NhZ2UgPz8gYXdhaXQgdGhpcy5mb3JtYXRDb21taXRNZXNzYWdlKCkpKS5zdW1tYXJ5LmNoYW5nZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgcHVsbCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5wdWxsKTtcbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnVwZGF0ZVN1Ym1vZHVsZXMpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdpdC5zdWJNb2R1bGUoW1widXBkYXRlXCIsIFwiLS1yZW1vdGVcIiwgXCItLW1lcmdlXCIsIFwiLS1yZWN1cnNpdmVcIl0sIChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuXG4gICAgICAgIGNvbnN0IHB1bGxSZXN1bHQgPSBhd2FpdCB0aGlzLmdpdC5wdWxsKFtcIi0tbm8tcmViYXNlXCJdLFxuICAgICAgICAgICAgYXN5bmMgKGVycjogRXJyb3IgfCBudWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kaXNwbGF5RXJyb3IoYFB1bGwgZmFpbGVkICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2l0LnN0YXR1cygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLmNvbmZsaWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uaGFuZGxlQ29uZmxpY3Qoc3RhdHVzLmNvbmZsaWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBwdWxsUmVzdWx0LmZpbGVzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBhc3luYyBwdXNoKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRoaXMucGx1Z2luLnNldFN0YXRlKFBsdWdpblN0YXRlLnN0YXR1cyk7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2l0LnN0YXR1cygpO1xuICAgICAgICBjb25zdCB0cmFja2luZ0JyYW5jaCA9IHN0YXR1cy50cmFja2luZztcbiAgICAgICAgY29uc3QgY3VycmVudEJyYW5jaCA9IHN0YXR1cy5jdXJyZW50O1xuICAgICAgICBjb25zdCByZW1vdGVDaGFuZ2VkRmlsZXMgPSAoYXdhaXQgdGhpcy5naXQuZGlmZlN1bW1hcnkoW2N1cnJlbnRCcmFuY2gsIHRyYWNraW5nQnJhbmNoXSkpLmNoYW5nZWQ7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0U3RhdGUoUGx1Z2luU3RhdGUucHVzaCk7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy51cGRhdGVTdWJtb2R1bGVzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmdpdC5lbnYoeyAuLi5wcm9jZXNzLmVudiwgXCJPQlNJRElBTl9HSVRcIjogMSB9KS5zdWJNb2R1bGUoW1wiZm9yZWFjaFwiLCBcIi0tcmVjdXJzaXZlXCIsIGB0cmFja2luZz0kKGdpdCBmb3ItZWFjaC1yZWYgLS1mb3JtYXQ9JyUodXBzdHJlYW06c2hvcnQpJyBcIiQoZ2l0IHN5bWJvbGljLXJlZiAtcSBIRUFEKVwiKTsgZWNobyAkdHJhY2tpbmc7IGlmIFsgISAteiBcIiQoZ2l0IGRpZmYgLS1zaG9ydHN0YXQgJHRyYWNraW5nKVwiIF07IHRoZW4gZ2l0IHB1c2g7IGZpYF0sIChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuXG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5naXQuZW52KHsgLi4ucHJvY2Vzcy5lbnYsIFwiT0JTSURJQU5fR0lUXCI6IDEgfSkucHVzaCgoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcblxuICAgICAgICByZXR1cm4gcmVtb3RlQ2hhbmdlZEZpbGVzO1xuICAgIH1cblxuXG4gICAgYXN5bmMgY2FuUHVzaCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gYWxsb3cgcHVzaGluZyBpbiBzdWJtb2R1bGVzIGV2ZW4gaWYgdGhlIHJvb3QgaGFzIG5vIGNoYW5nZXMuXG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy51cGRhdGVTdWJtb2R1bGVzID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLmdpdC5zdGF0dXMoKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgICAgIGNvbnN0IHRyYWNraW5nQnJhbmNoID0gc3RhdHVzLnRyYWNraW5nO1xuICAgICAgICBjb25zdCBjdXJyZW50QnJhbmNoID0gc3RhdHVzLmN1cnJlbnQ7XG4gICAgICAgIGNvbnN0IHJlbW90ZUNoYW5nZWRGaWxlcyA9IChhd2FpdCB0aGlzLmdpdC5kaWZmU3VtbWFyeShbY3VycmVudEJyYW5jaCwgdHJhY2tpbmdCcmFuY2hdKSkuY2hhbmdlZDtcblxuICAgICAgICByZXR1cm4gcmVtb3RlQ2hhbmdlZEZpbGVzICE9PSAwO1xuICAgIH1cblxuICAgIGFzeW5jIGNoZWNrUmVxdWlyZW1lbnRzKCk6IFByb21pc2U8XCJ2YWxpZFwiIHwgXCJtaXNzaW5nLXJlcG9cIiB8IFwibWlzc2luZy1naXRcIiB8IFwid3Jvbmctc2V0dGluZ3NcIj4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNHaXRJbnN0YWxsZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwibWlzc2luZy1naXRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShhd2FpdCB0aGlzLmdpdC5jaGVja0lzUmVwbygpKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwibWlzc2luZy1yZXBvXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29uZmlnID0gKGF3YWl0IHRoaXMuZ2l0Lmxpc3RDb25maWcoKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSkpLmFsbDtcbiAgICAgICAgY29uc3QgdXNlciA9IGNvbmZpZ1tcInVzZXIubmFtZVwiXTtcbiAgICAgICAgY29uc3QgZW1haWwgPSBjb25maWdbXCJ1c2VyLmVtYWlsXCJdO1xuICAgICAgICBjb25zdCByZW1vdGVVUkwgPSBjb25maWdbXCJyZW1vdGUub3JpZ2luLnVybFwiXTtcblxuICAgICAgICBpZiAoIXVzZXIgfHwgIWVtYWlsIHx8ICFyZW1vdGVVUkwpIHtcbiAgICAgICAgICAgIHJldHVybiBcIndyb25nLXNldHRpbmdzXCI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJ2YWxpZFwiO1xuICAgIH1cblxuICAgIGFzeW5jIGJyYW5jaEluZm8oKTogUHJvbWlzZTxCcmFuY2hJbmZvPiB7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2l0LnN0YXR1cygoZXJyOiBhbnkpID0+IHRoaXMub25FcnJvcihlcnIpKTtcbiAgICAgICAgY29uc3QgYnJhbmNoZXMgPSBhd2FpdCB0aGlzLmdpdC5icmFuY2goW1wiLS1uby1jb2xvclwiXSwgKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN1cnJlbnQ6IHN0YXR1cy5jdXJyZW50LFxuICAgICAgICAgICAgdHJhY2tpbmc6IHN0YXR1cy50cmFja2luZyxcbiAgICAgICAgICAgIGJyYW5jaGVzOiBicmFuY2hlcy5hbGwsXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGFzeW5jIGNoZWNrb3V0KGJyYW5jaDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0LmNoZWNrb3V0KGJyYW5jaCwgKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgfTtcblxuICAgIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0LmluaXQoZmFsc2UpO1xuICAgIH07XG5cbiAgICBhc3luYyBzZXRDb25maWcocGF0aDogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZ2l0LmFkZENvbmZpZyhwYXRoLCB2YWx1ZSwgKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgfTtcblxuICAgIGFzeW5jIGdldENvbmZpZyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBjb25maWcgPSBhd2FpdCB0aGlzLmdpdC5saXN0Q29uZmlnKChlcnI6IGFueSkgPT4gdGhpcy5vbkVycm9yKGVycikpO1xuICAgICAgICByZXR1cm4gY29uZmlnLmFsbFtwYXRoXTtcbiAgICB9XG5cbiAgICBhc3luYyBmZXRjaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5naXQuZmV0Y2goKGVycjogYW55KSA9PiB0aGlzLm9uRXJyb3IoZXJyKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0dpdEluc3RhbGxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N0ZXZldWt4L2dpdC1qcy9pc3N1ZXMvNDAyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBzcGF3blN5bmMoJ2dpdCcsIFsnLS12ZXJzaW9uJ10sIHtcbiAgICAgICAgICAgIHN0ZGlvOiAnaWdub3JlJ1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY29tbWFuZC5lcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjb21tYW5kLmVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uRXJyb3IoZXJyb3I6IEVycm9yIHwgbnVsbCkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmRpc3BsYXlFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBOb3RpY2UsIFBsdWdpbiwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IENoYW5nZWRGaWxlc01vZGFsIH0gZnJvbSBcInNyYy9tb2RhbHMvY2hhbmdlZEZpbGVzTW9kYWxcIjtcbmltcG9ydCB7IEN1c3RvbU1lc3NhZ2VNb2RhbCB9IGZyb20gXCJzcmMvbW9kYWxzL2N1c3RvbU1lc3NhZ2VNb2RhbFwiO1xuaW1wb3J0IHsgUHJvbWlzZVF1ZXVlIH0gZnJvbSBcInNyYy9wcm9taXNlUXVldWVcIjtcbmltcG9ydCB7IE9ic2lkaWFuR2l0U2V0dGluZ3NUYWIgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBTdGF0dXNCYXIgfSBmcm9tIFwic3JjL3N0YXR1c0JhclwiO1xuaW1wb3J0IHsgR2l0TWFuYWdlciB9IGZyb20gXCIuL2dpdE1hbmFnZXJcIjtcbmltcG9ydCB7IFNpbXBsZUdpdCB9IGZyb20gXCIuL3NpbXBsZUdpdFwiO1xuaW1wb3J0IHsgUGx1Z2luU3RhdGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgT2JzaWRpYW5HaXRTZXR0aW5ncyB7XG4gICAgY29tbWl0TWVzc2FnZTogc3RyaW5nO1xuICAgIGNvbW1pdERhdGVGb3JtYXQ6IHN0cmluZztcbiAgICBhdXRvU2F2ZUludGVydmFsOiBudW1iZXI7XG4gICAgYXV0b1B1bGxJbnRlcnZhbDogbnVtYmVyO1xuICAgIGF1dG9QdWxsT25Cb290OiBib29sZWFuO1xuICAgIGRpc2FibGVQdXNoOiBib29sZWFuO1xuICAgIHB1bGxCZWZvcmVQdXNoOiBib29sZWFuO1xuICAgIGRpc2FibGVQb3B1cHM6IGJvb2xlYW47XG4gICAgbGlzdENoYW5nZWRGaWxlc0luTWVzc2FnZUJvZHk6IGJvb2xlYW47XG4gICAgc2hvd1N0YXR1c0JhcjogYm9vbGVhbjtcbiAgICB1cGRhdGVTdWJtb2R1bGVzOiBib29sZWFuO1xufVxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogT2JzaWRpYW5HaXRTZXR0aW5ncyA9IHtcbiAgICBjb21taXRNZXNzYWdlOiBcInZhdWx0IGJhY2t1cDoge3tkYXRlfX1cIixcbiAgICBjb21taXREYXRlRm9ybWF0OiBcIllZWVktTU0tREQgSEg6bW06c3NcIixcbiAgICBhdXRvU2F2ZUludGVydmFsOiAwLFxuICAgIGF1dG9QdWxsSW50ZXJ2YWw6IDAsXG4gICAgYXV0b1B1bGxPbkJvb3Q6IGZhbHNlLFxuICAgIGRpc2FibGVQdXNoOiBmYWxzZSxcbiAgICBwdWxsQmVmb3JlUHVzaDogdHJ1ZSxcbiAgICBkaXNhYmxlUG9wdXBzOiBmYWxzZSxcbiAgICBsaXN0Q2hhbmdlZEZpbGVzSW5NZXNzYWdlQm9keTogZmFsc2UsXG4gICAgc2hvd1N0YXR1c0JhcjogdHJ1ZSxcbiAgICB1cGRhdGVTdWJtb2R1bGVzOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9ic2lkaWFuR2l0IGV4dGVuZHMgUGx1Z2luIHtcbiAgICBnaXRNYW5hZ2VyOiBHaXRNYW5hZ2VyO1xuICAgIHNldHRpbmdzOiBPYnNpZGlhbkdpdFNldHRpbmdzO1xuICAgIHN0YXR1c0JhcjogU3RhdHVzQmFyO1xuICAgIHN0YXRlOiBQbHVnaW5TdGF0ZTtcbiAgICB0aW1lb3V0SURCYWNrdXA6IG51bWJlcjtcbiAgICB0aW1lb3V0SURQdWxsOiBudW1iZXI7XG4gICAgbGFzdFVwZGF0ZTogbnVtYmVyO1xuICAgIGdpdFJlYWR5ID0gZmFsc2U7XG4gICAgcHJvbWlzZVF1ZXVlOiBQcm9taXNlUXVldWUgPSBuZXcgUHJvbWlzZVF1ZXVlKCk7XG4gICAgY29uZmxpY3RPdXRwdXRGaWxlID0gXCJjb25mbGljdC1maWxlcy1vYnNpZGlhbi1naXQubWRcIjtcblxuICAgIHNldFN0YXRlKHN0YXRlOiBQbHVnaW5TdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyPy5kaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgYXN5bmMgb25sb2FkKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbG9hZGluZyAnICsgdGhpcy5tYW5pZmVzdC5uYW1lICsgXCIgcGx1Z2luXCIpO1xuICAgICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgT2JzaWRpYW5HaXRTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJwdWxsXCIsXG4gICAgICAgICAgICBuYW1lOiBcIlB1bGwgZnJvbSByZW1vdGUgcmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMucHJvbWlzZVF1ZXVlLmFkZFRhc2soKCkgPT4gdGhpcy5wdWxsQ2hhbmdlc0Zyb21SZW1vdGUoKSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJwdXNoXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkNvbW1pdCAqYWxsKiBjaGFuZ2VzIGFuZCBwdXNoIHRvIHJlbW90ZSByZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5wcm9taXNlUXVldWUuYWRkVGFzaygoKSA9PiB0aGlzLmNyZWF0ZUJhY2t1cChmYWxzZSkpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJjb21taXQtcHVzaC1zcGVjaWZpZWQtbWVzc2FnZVwiLFxuICAgICAgICAgICAgbmFtZTogXCJDb21taXQgYW5kIHB1c2ggYWxsIGNoYW5nZXMgd2l0aCBzcGVjaWZpZWQgbWVzc2FnZVwiLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IG5ldyBDdXN0b21NZXNzYWdlTW9kYWwodGhpcykub3BlbigpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJsaXN0LWNoYW5nZWQtZmlsZXNcIixcbiAgICAgICAgICAgIG5hbWU6IFwiTGlzdCBjaGFuZ2VkIGZpbGVzXCIsXG4gICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5zdGF0dXMoKTtcbiAgICAgICAgICAgICAgICBuZXcgQ2hhbmdlZEZpbGVzTW9kYWwodGhpcywgc3RhdHVzLmNoYW5nZWQpLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNob3dTdGF0dXNCYXIpIHtcbiAgICAgICAgICAgIC8vIGluaXQgc3RhdHVzQmFyXG4gICAgICAgICAgICBsZXQgc3RhdHVzQmFyRWwgPSB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQmFyID0gbmV3IFN0YXR1c0JhcihzdGF0dXNCYXJFbCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwoXG4gICAgICAgICAgICAgICAgd2luZG93LnNldEludGVydmFsKCgpID0+IHRoaXMuc3RhdHVzQmFyLmRpc3BsYXkoKSwgMTAwMClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uTGF5b3V0UmVhZHkoKCkgPT4gdGhpcy5pbml0KCkpO1xuXG4gICAgfVxuXG4gICAgYXN5bmMgb251bmxvYWQoKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SURCYWNrdXApO1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEUHVsbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgJyArIHRoaXMubWFuaWZlc3QubmFtZSArIFwiIHBsdWdpblwiKTtcbiAgICB9XG4gICAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcbiAgICB9XG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVMYXN0QXV0byhkYXRlOiBEYXRlLCBtb2RlOiBcImJhY2t1cFwiIHwgXCJwdWxsXCIpIHtcbiAgICAgICAgaWYgKG1vZGUgPT09IFwiYmFja3VwXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm1hbmlmZXN0LmlkICsgXCI6bGFzdEF1dG9CYWNrdXBcIiwgZGF0ZS50b1N0cmluZygpKTtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSBcInB1bGxcIikge1xuICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubWFuaWZlc3QuaWQgKyBcIjpsYXN0QXV0b1B1bGxcIiwgZGF0ZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGxvYWRMYXN0QXV0bygpOiBQcm9taXNlPHsgXCJiYWNrdXBcIjogRGF0ZSwgXCJwdWxsXCI6IERhdGU7IH0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiYmFja3VwXCI6IG5ldyBEYXRlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLm1hbmlmZXN0LmlkICsgXCI6bGFzdEF1dG9CYWNrdXBcIikgPz8gXCJcIiksXG4gICAgICAgICAgICBcInB1bGxcIjogbmV3IERhdGUod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubWFuaWZlc3QuaWQgKyBcIjpsYXN0QXV0b1B1bGxcIikgPz8gXCJcIilcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5naXRNYW5hZ2VyID0gbmV3IFNpbXBsZUdpdCh0aGlzKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLmNoZWNrUmVxdWlyZW1lbnRzKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJtaXNzaW5nLWdpdFwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihcIkNhbm5vdCBydW4gZ2l0IGNvbW1hbmRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJtaXNzaW5nLXJlcG9cIjpcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIkNhbid0IGZpbmQgYSB2YWxpZCBnaXQgcmVwb3NpdG9yeS4gUGxlYXNlIGNyZWF0ZSBvbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ3cm9uZy1zZXR0aW5nc1wiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihcIk5vdCBhbGwgb2YgdGhlIHJlcXVpcmVkIGNvbmZpZ3MgYXJlIHNldC4gU2VlIFJFQURNRVwiKTtcbiAgICAgICAgICAgICAgICBjYXNlIFwidmFsaWRcIjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naXRSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoUGx1Z2luU3RhdGUuaWRsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1B1bGxPbkJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvbWlzZVF1ZXVlLmFkZFRhc2soKCkgPT4gdGhpcy5wdWxsQ2hhbmdlc0Zyb21SZW1vdGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdEF1dG9zID0gYXdhaXQgdGhpcy5sb2FkTGFzdEF1dG8oKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvU2F2ZUludGVydmFsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMuc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbCAtIChNYXRoLnJvdW5kKCgobm93LmdldFRpbWUoKSAtIGxhc3RBdXRvcy5iYWNrdXAuZ2V0VGltZSgpKSAvIDEwMDApIC8gNjApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvQmFja3VwKGRpZmYgPD0gMCA/IDAgOiBkaWZmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvUHVsbEludGVydmFsID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMuc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCAtIChNYXRoLnJvdW5kKCgobm93LmdldFRpbWUoKSAtIGxhc3RBdXRvcy5wdWxsLmdldFRpbWUoKSkgLyAxMDAwKSAvIDYwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1B1bGwoZGlmZiA8PSAwID8gMCA6IGRpZmYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU29tZXRoaW5nIHdlaXJkIGhhcHBlbmVkLiBUaGUgJ2NoZWNrUmVxdWlyZW1lbnRzJyByZXN1bHQgaXMgXCIgKyByZXN1bHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHB1bGxDaGFuZ2VzRnJvbVJlbW90ZSgpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICBpZiAoIXRoaXMuZ2l0UmVhZHkpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmdpdFJlYWR5KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZmlsZXNVcGRhdGVkID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnB1bGwoKTtcbiAgICAgICAgaWYgKGZpbGVzVXBkYXRlZCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoYFB1bGxlZCBuZXcgY2hhbmdlcy4gJHtmaWxlc1VwZGF0ZWR9IGZpbGVzIHVwZGF0ZWRgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoXCJFdmVyeXRoaW5nIGlzIHVwLXRvLWRhdGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5naXRNYW5hZ2VyIGluc3RhbmNlb2YgU2ltcGxlR2l0KSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBhd2FpdCB0aGlzLmdpdE1hbmFnZXIuc3RhdHVzKCk7XG4gICAgICAgICAgICBpZiAoc3RhdHVzLmNvbmZsaWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUVycm9yKGBZb3UgaGF2ZSAke3N0YXR1cy5jb25mbGljdGVkLmxlbmd0aH0gY29uZmxpY3QgZmlsZXNgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoUGx1Z2luU3RhdGUuaWRsZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlQmFja3VwKGZyb21BdXRvQmFja3VwOiBib29sZWFuLCBjb21taXRNZXNzYWdlPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghdGhpcy5naXRSZWFkeSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmdpdFJlYWR5KSByZXR1cm47XG5cbiAgICAgICAgaWYgKCFmcm9tQXV0b0JhY2t1cCkge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLmNvbmZsaWN0T3V0cHV0RmlsZSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5kZWxldGUoZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2l0TWFuYWdlciBpbnN0YW5jZW9mIFNpbXBsZUdpdCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnN0YXR1cygpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgY29uZmxpY3QgZmlsZXMgb24gYXV0byBiYWNrdXBcbiAgICAgICAgICAgIGlmIChmcm9tQXV0b0JhY2t1cCAmJiBzdGF0dXMuY29uZmxpY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5pZGxlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihgRGlkIG5vdCBjb21taXQsIGJlY2F1c2UgeW91IGhhdmUgJHtzdGF0dXMuY29uZmxpY3RlZC5sZW5ndGh9IGNvbmZsaWN0IGZpbGVzLiBQbGVhc2UgcmVzb2x2ZSB0aGVtIGFuZCBjb21taXQgcGVyIGNvbW1hbmQuYCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb25mbGljdChzdGF0dXMuY29uZmxpY3RlZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hhbmdlZEZpbGVzID0gKGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5zdGF0dXMoKSkuY2hhbmdlZDtcblxuICAgICAgICBpZiAoY2hhbmdlZEZpbGVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgY29tbWl0ZWRGaWxlcyA9IGF3YWl0IHRoaXMuZ2l0TWFuYWdlci5jb21taXRBbGwoY29tbWl0TWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlNZXNzYWdlKGBDb21taXR0ZWQgJHtjb21taXRlZEZpbGVzfSBmaWxlc2ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TWVzc2FnZShcIk5vIGNoYW5nZXMgdG8gY29tbWl0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmRpc2FibGVQdXNoKSB7XG4gICAgICAgICAgICBpZiAoIShhd2FpdCB0aGlzLmdpdE1hbmFnZXIuYnJhbmNoSW5mbygpKS50cmFja2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUVycm9yKFwiRGlkIG5vdCBwdXNoLiBObyB0cmFja2luZyBicmFuY2ggaXMgc2V0ISBQbGVhc2Ugc2V0IG9uZSBpbiB0aGUgc2V0dGluZ3NcIiwgMTAwMDApO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoUGx1Z2luU3RhdGUuaWRsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIFByZXZlbnQgcGx1Z2luIHRvIHB1bGwvcHVzaCBhdCBldmVyeSBjYWxsIG9mIGNyZWF0ZUJhY2t1cC4gT25seSBpZiB1bnB1c2hlZCBjb21taXRzIGFyZSBwcmVzZW50XG4gICAgICAgICAgICBpZiAoYXdhaXQgdGhpcy5naXRNYW5hZ2VyLmNhblB1c2goKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnB1bGxCZWZvcmVQdXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1bGxlZEZpbGVzTGVuZ3RoID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnB1bGwoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHB1bGxlZEZpbGVzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TWVzc2FnZShgUHVsbGVkICR7cHVsbGVkRmlsZXNMZW5ndGh9IGZpbGVzIGZyb20gcmVtb3RlYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZWZyZXNoIGJlY2F1c2Ugb2YgcHVsbFxuICAgICAgICAgICAgICAgIGxldCBzdGF0dXM6IGFueTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5naXRNYW5hZ2VyIGluc3RhbmNlb2YgU2ltcGxlR2l0ICYmIChzdGF0dXMgPSBhd2FpdCB0aGlzLmdpdE1hbmFnZXIuc3RhdHVzKCkpLmNvbmZsaWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlFcnJvcihgQ2Fubm90IHB1c2guIFlvdSBoYXZlICR7c3RhdHVzLmNvbmZsaWN0ZWQubGVuZ3RofSBjb25mbGljdCBmaWxlc2ApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUNvbmZsaWN0KHN0YXR1cy5jb25mbGljdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB1c2hlZEZpbGVzID0gYXdhaXQgdGhpcy5naXRNYW5hZ2VyLnB1c2goKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TWVzc2FnZShgUHVzaGVkICR7cHVzaGVkRmlsZXN9IGZpbGVzIHRvIHJlbW90ZWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TWVzc2FnZShcIk5vIGNoYW5nZXMgdG8gcHVzaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0YXRlKFBsdWdpblN0YXRlLmlkbGUpO1xuICAgIH1cblxuICAgIHN0YXJ0QXV0b0JhY2t1cChtaW51dGVzPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudGltZW91dElEQmFja3VwID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9taXNlUXVldWUuYWRkVGFzaygoKSA9PiB0aGlzLmNyZWF0ZUJhY2t1cCh0cnVlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlTGFzdEF1dG8obmV3IERhdGUoKSwgXCJiYWNrdXBcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b0JhY2t1cCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChtaW51dGVzID8/IHRoaXMuc2V0dGluZ3MuYXV0b1NhdmVJbnRlcnZhbCkgKiA2MDAwMFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHN0YXJ0QXV0b1B1bGwobWludXRlcz86IG51bWJlcikge1xuICAgICAgICB0aGlzLnRpbWVvdXRJRFB1bGwgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2VRdWV1ZS5hZGRUYXNrKCgpID0+IHRoaXMucHVsbENoYW5nZXNGcm9tUmVtb3RlKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUxhc3RBdXRvKG5ldyBEYXRlKCksIFwicHVsbFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUHVsbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChtaW51dGVzID8/IHRoaXMuc2V0dGluZ3MuYXV0b1B1bGxJbnRlcnZhbCkgKiA2MDAwMFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNsZWFyQXV0b0JhY2t1cCgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMudGltZW91dElEQmFja3VwKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEQmFja3VwKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjbGVhckF1dG9QdWxsKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy50aW1lb3V0SURQdWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElEUHVsbCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlQ29uZmxpY3QoY29uZmxpY3RlZDogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShQbHVnaW5TdGF0ZS5jb25mbGljdGVkKTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBbXG4gICAgICAgICAgICBcIiMgQ29uZmxpY3QgZmlsZXNcIixcbiAgICAgICAgICAgIFwiUGxlYXNlIHJlc29sdmUgdGhlbSBhbmQgY29tbWl0IHBlciBjb21tYW5kIChUaGlzIGZpbGUgd2lsbCBiZSBkZWxldGVkIGJlZm9yZSB0aGUgY29tbWl0KS5cIixcbiAgICAgICAgICAgIC4uLmNvbmZsaWN0ZWQubWFwKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZSk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5maWxlVG9MaW5rdGV4dChmaWxlLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgLSBbWyR7bGlua31dXWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAtIE5vdCBhIGZpbGU6ICR7ZX1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMud3JpdGVBbmRPcGVuRmlsZShsaW5lcy5qb2luKFwiXFxuXCIpKTtcbiAgICB9XG5cbiAgICBhc3luYyB3cml0ZUFuZE9wZW5GaWxlKHRleHQ6IHN0cmluZykge1xuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLndyaXRlKHRoaXMuY29uZmxpY3RPdXRwdXRGaWxlLCB0ZXh0KTtcblxuICAgICAgICBsZXQgZmlsZUlzQWxyZWFkeU9wZW5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUFsbExlYXZlcyhsZWFmID0+IHtcbiAgICAgICAgICAgIGlmIChsZWFmLmdldERpc3BsYXlUZXh0KCkgIT0gXCJcIiAmJiB0aGlzLmNvbmZsaWN0T3V0cHV0RmlsZS5zdGFydHNXaXRoKGxlYWYuZ2V0RGlzcGxheVRleHQoKSkpIHtcbiAgICAgICAgICAgICAgICBmaWxlSXNBbHJlYWR5T3BlbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZmlsZUlzQWxyZWFkeU9wZW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dCh0aGlzLmNvbmZsaWN0T3V0cHV0RmlsZSwgXCIvXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVnaW9uOiBkaXNwbGF5aW5nIC8gZm9ybWF0dGluZyBtZXNzYWdlc1xuICAgIGRpc3BsYXlNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZywgdGltZW91dDogbnVtYmVyID0gNCAqIDEwMDApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXI/LmRpc3BsYXlNZXNzYWdlKG1lc3NhZ2UudG9Mb3dlckNhc2UoKSwgdGltZW91dCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmRpc2FibGVQb3B1cHMpIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UobWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgZ2l0IG9ic2lkaWFuIG1lc3NhZ2U6ICR7bWVzc2FnZX1gKTtcbiAgICB9XG4gICAgZGlzcGxheUVycm9yKG1lc3NhZ2U6IHN0cmluZywgdGltZW91dDogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgICAgICBuZXcgTm90aWNlKG1lc3NhZ2UpO1xuICAgICAgICBjb25zb2xlLmxvZyhgZ2l0IG9ic2lkaWFuIGVycm9yOiAke21lc3NhZ2V9YCk7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyPy5kaXNwbGF5TWVzc2FnZShtZXNzYWdlLnRvTG93ZXJDYXNlKCksIHRpbWVvdXQpO1xuICAgIH1cbn0iXSwibmFtZXMiOlsiRnV6enlTdWdnZXN0TW9kYWwiLCJTdWdnZXN0TW9kYWwiLCJTZXR0aW5nIiwiTm90aWNlIiwiUGx1Z2luU2V0dGluZ1RhYiIsImdpdF9lcnJvcl8xIiwicmVxdWlyZSQkMCIsIm9zIiwidHR5IiwidXRpbCIsInJlcXVpcmUkJDEiLCJ0aGlzIiwiZnNfMSIsImZpbGVfZXhpc3RzXzEiLCJ1dGlsXzEiLCJhcmd1bWVudF9maWx0ZXJzXzEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJ1dGlsc18xIiwidGFza19jb25maWd1cmF0aW9uX2Vycm9yXzEiLCJ0YXNrXzEiLCJDbGVhblN1bW1hcnlfMSIsImNoZWNrX2lzX3JlcG9fMSIsImNsZWFuXzEiLCJjb25maWdfMSIsImdpdF9jb25zdHJ1Y3RfZXJyb3JfMSIsImdpdF9wbHVnaW5fZXJyb3JfMSIsImdpdF9yZXNwb25zZV9lcnJvcl8xIiwicmVzZXRfMSIsImRlYnVnXzEiLCJnaXRfbG9nZ2VyXzEiLCJ0YXNrc19wZW5kaW5nX3F1ZXVlXzEiLCJ0YXNrIiwiZ2l0RXJyb3IiLCJjaGlsZF9wcm9jZXNzXzEiLCJnaXRfZXhlY3V0b3JfY2hhaW5fMSIsInBhcnNlX2RpZmZfc3VtbWFyeV8xIiwicGFyc2VfbGlzdF9sb2dfc3VtbWFyeV8xIiwicGFyc2VfcmVtb3RlX29iamVjdHNfMSIsInBhcnNlX3JlbW90ZV9tZXNzYWdlc18xIiwiTWVyZ2VTdW1tYXJ5XzEiLCJwYXJzZV9wdWxsXzEiLCJwYXJzZV9tZXJnZV8xIiwicGFyc2VfcHVzaF8xIiwidGFza19jYWxsYmFja18xIiwiY2hhbmdlX3dvcmtpbmdfZGlyZWN0b3J5XzEiLCJoYXNoX29iamVjdF8xIiwiaW5pdF8xIiwibWVyZ2VfMSIsInB1c2hfMSIsInN0YXR1c18xIiwibG9nXzEiLCJwcm9taXNlX2RlZmVycmVkXzEiLCJCcmFuY2hEZWxldGVTdW1tYXJ5XzEiLCJCcmFuY2hTdW1tYXJ5XzEiLCJwYXJzZV9icmFuY2hfZGVsZXRlXzEiLCJwYXJzZV9icmFuY2hfMSIsIkNoZWNrSWdub3JlXzEiLCJwYXJzZV9jb21taXRfMSIsInBhcnNlX2ZldGNoXzEiLCJwYXJzZV9tb3ZlXzEiLCJHZXRSZW1vdGVTdW1tYXJ5XzEiLCJyZXF1aXJlJCQ4IiwicmVxdWlyZSQkOSIsInJlcXVpcmUkJDEwIiwicmVxdWlyZSQkMTEiLCJyZXF1aXJlJCQxMiIsInJlcXVpcmUkJDEzIiwicmVxdWlyZSQkMTQiLCJyZXF1aXJlJCQxNSIsInJlcXVpcmUkJDE2IiwicmVxdWlyZSQkMTciLCJyZXF1aXJlJCQxOCIsInJlcXVpcmUkJDE5IiwicmVxdWlyZSQkMjAiLCJyZXF1aXJlJCQyMSIsInJlcXVpcmUkJDIyIiwicGx1Z2lucyIsInBsdWdpbnNfMSIsIkdpdCIsImdpdF9mYWN0b3J5XzEiLCJzaW1wbGVHaXQiLCJzcGF3blN5bmMiLCJURmlsZSIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxLQUFLLElBQUk7QUFDN0MsUUFBUSxNQUFNLElBQUksU0FBUyxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2xHLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUNEO0FBQ08sSUFBSSxRQUFRLEdBQUcsV0FBVztBQUNqQyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNyRCxRQUFRLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdELFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFZLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLFNBQVM7QUFDVCxRQUFRLE9BQU8sQ0FBQyxDQUFDO0FBQ2pCLE1BQUs7QUFDTCxJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDM0MsRUFBQztBQTRCRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxD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LElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDcEMsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2xCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDcEMsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2xCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDcEMsR0FBRztBQUNILEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ25CLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDckIsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2xCLElBQUksT0FBTyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2xCLElBQUksT0FBTyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEMsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2xCLElBQUksT0FBTyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUMsR0FBRztBQUNILEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2xCLElBQUksT0FBTyxNQUFN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QVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLFNBQVM7QUFDVixDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxHQUFHO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLENBQUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsT0FBTyxD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RTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsRUFBRTtBQUNMLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FBRztBQUNOLEdBQUcsR0FB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Q0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksS0FBS0EsS0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJQSxLQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUlBLEtBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzTSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksS0FBS0EsS0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJQSxLQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEssSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEtBQUtBLEtBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSUEsS0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xLLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUFLQSxLQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUlBLEtBQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0SyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENB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
