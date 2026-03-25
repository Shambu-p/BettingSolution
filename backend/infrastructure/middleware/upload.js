
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const tmpDir = path.resolve(process.cwd(), "tmp_uploads");
fs.ensureDirSync(tmpDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

module.exports = multer({ storage });

