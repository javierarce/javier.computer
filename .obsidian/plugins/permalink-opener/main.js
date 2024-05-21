/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => Opener,
  openUrl: () => openUrl
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  keyName: "permalink",
  devUrl: "http://127.0.0.1:4000",
  prodUrl: ""
};
var openUrl = (url) => {
  window.open(url);
};
var Opener = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "open-dev-url",
      name: "Open page on development site",
      checkCallback: (checking) => {
        var _a;
        let file = this.app.workspace.getActiveFile();
        if (!file)
          return false;
        if (checking)
          return true;
        let metadata = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
        let name = file.basename;
        let permalink = (0, import_obsidian.parseFrontMatterEntry)(metadata, this.settings.keyName);
        if (!permalink) {
          permalink = name.toLowerCase().split(" ").join("-");
        }
        let url = this.settings.devUrl.replace(/\/+$/, "") + "/" + permalink.replace(/^\/+/, "");
        openUrl(url);
        return true;
      }
    });
    this.addCommand({
      id: "open-prod-url",
      name: "Open page on live site",
      checkCallback: (checking) => {
        var _a;
        let file = this.app.workspace.getActiveFile();
        if (!file)
          return false;
        if (checking)
          return true;
        let metadata = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
        let name = file.basename;
        let permalink = (0, import_obsidian.parseFrontMatterEntry)(metadata, this.settings.keyName);
        if (!permalink) {
          permalink = name.toLowerCase().split(" ").join("-");
        }
        let url = this.settings.prodUrl.replace(/\/+$/, "") + "/" + permalink.replace(/^\/+/, "");
        openUrl(url);
        return true;
      }
    });
    this.addSettingTab(new OpenerSettingTab(this.app, this));
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var OpenerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Permalink property name").setDesc("The file property used to populate the page slug").addText((text) => text.setPlaceholder("permalink").setValue(this.plugin.settings.keyName).onChange(async (value) => {
      console.log("Key name: " + value);
      this.plugin.settings.keyName = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Live site base URL").setDesc("The production URL for your site").addText((text) => text.setPlaceholder("http://").setValue(this.plugin.settings.prodUrl).onChange(async (value) => {
      console.log("Prod URL: " + value);
      this.plugin.settings.prodUrl = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("Development site base URL").setDesc("The staging URL for your site").addText((text) => text.setPlaceholder("http://").setValue(this.plugin.settings.devUrl).onChange(async (value) => {
      console.log("Dev URL: " + value);
      this.plugin.settings.devUrl = value;
      await this.plugin.saveSettings();
    }));
  }
};
