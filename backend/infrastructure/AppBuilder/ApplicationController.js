
const path = require("path");
const fs = require("fs-extra");
const { createAppExportZip, extractAppImportZip } = require("./zipUtils.js");
const { PATHS, listDefinitionFilesForApp, listServerScriptsForApp, listClientScriptsForApp } = require("./fileUtils.js");

module.exports = {
  async exportApplication(req, res, next) {
    try {
      const appId = req.params.appId;
      const zipPath = path.join(PATHS.tmpDir, `${appId}_export_${Date.now()}.zip`);
      await createAppExportZip(appId, zipPath);
      res.download(zipPath, `${appId}_export.zip`, async () => { await fs.remove(zipPath) });
    } catch (e) { next(e); }
  },

  async importApplication(req, res, next) {
    try {
      const appId = req.params.appId;
      if (!req.file) return res.status(400).json({ error: "No file" });
      const result = await extractAppImportZip(req.file.path, appId);
      await fs.remove(req.file.path);
      res.json({ message: "Imported", result });
    } catch (e) { next(e); }
  },

  async listDefinitionsForApp(req, res, next) {
    try {
      const appId = req.params.appId;
      res.json({
        definitions: await listDefinitionFilesForApp(appId),
        serverScripts: await listServerScriptsForApp(appId),
        clientScripts: await listClientScriptsForApp(appId)
      });
    } catch (e) { next(e); }
  }
};
