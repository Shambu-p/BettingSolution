
const fs = require("fs-extra");
const path = require("path");

const PATHS = {
  definitionsDir: "./configuration/definitions",
  serverScriptDir: "./controller/scripts/server_script",
  // clientScriptDir: "./configuration/client_script",
  buttonScriptsDir: "../frontend/src/Scripts/ButtonScripts",
  FieldOnChangeScripts: "../frontend/src/Scripts/FieldOnChangeScripts",
  FormOnLoadScripts: "../frontend/src/Scripts/FormOnLoadScripts",
  FormOnSubmitScripts: "../frontend/src/Scripts/FormOnSubmitScripts",
  ListOnLoadScripts: "../frontend/src/Scripts/ListOnLoadScripts",
  tmpDir: "./tmp_uploads"
};

async function ensureBaseDirs() {
  await fs.ensureDir(PATHS.definitionsDir);
  await fs.ensureDir(PATHS.serverScriptDir);
  await fs.ensureDir(PATHS.buttonScriptsDir);
  await fs.ensureDir(PATHS.FieldOnChangeScripts);
  await fs.ensureDir(PATHS.FormOnLoadScripts);
  await fs.ensureDir(PATHS.FormOnSubmitScripts);
  await fs.ensureDir(PATHS.ListOnLoadScripts);
  await fs.ensureDir(PATHS.tmpDir);
}

function appFilePrefix(appId){ return appId + "-"; }

async function readDefinitionFile(fileName){
  return JSON.parse(await fs.readFile(path.join(PATHS.definitionsDir,fileName),"utf8"));
}

async function writeDefinitionFile(fileName,obj){
  await fs.writeFile(path.join(PATHS.definitionsDir,fileName),JSON.stringify(obj,null,2));
}

async function deleteDefinitionFile(fileName){
  await fs.remove(path.join(PATHS.definitionsDir,fileName));
}

async function listAllDefinitionFiles(){
  await ensureBaseDirs();
  return (await fs.readdir(PATHS.definitionsDir)).filter(f=>f.endsWith(".json"));
}

async function listDefinitionFilesForApp(appId){
  return (await listAllDefinitionFiles()).filter(f=>f.startsWith(appId+"-"));
}

async function listServerScriptsForApp(appId){
  return (await fs.readdir(PATHS.serverScriptDir)).filter(f=>f.startsWith(appId+"-"));
}

async function listClientScriptsForApp(appId){
  return [
    ...(await fs.readdir(PATHS.buttonScriptsDir)).filter(f=>f.startsWith(appId+"-")),
    ...(await fs.readdir(PATHS.FieldOnChangeScripts)).filter(f=>f.startsWith(appId+"-")),
    ...(await fs.readdir(PATHS.FormOnLoadScripts)).filter(f=>f.startsWith(appId+"-")),
    ...(await fs.readdir(PATHS.FormOnSubmitScripts)).filter(f=>f.startsWith(appId+"-")),
    ...(await fs.readdir(PATHS.ListOnLoadScripts)).filter(f=>f.startsWith(appId+"-")),
  ];
}

/**
 * Updates the import and export sections of a target TypeScript file
 * based on other files in the same directory.
 * @param {string} directoryPath - The path to the directory containing the files.
 * @param {string} targetFilename - The name of the file to update (e.g., 'index.ts').
 */
function updateClientScriptLoader(directoryPath, targetFilename) {
  const targetFilePath = path.join(directoryPath, targetFilename);

  if (!fs.existsSync(targetFilePath)) {
      console.error(`Target file not found: ${targetFilePath}`);
      return;
  }

  // 1. Scan directory for matching files
  const files = fs.readdirSync(directoryPath);
  
  const importStatements = [];
  const exportEntries = [];

  files.forEach(file => {
      // Skip the target file itself
      if (file === targetFilename) return;

      // Filter: Must be .ts and follow naming convention (app-object.ts)
      // The prompt specifies files have an application name, a hyphen, then object name.
      if (file.endsWith('.ts') && file.includes('-')) {
          
          // Remove extension
          const fileNameNoExt = path.basename(file, '.ts');

          // Generate Alias: Replace '-' with '_'
          const importAlias = fileNameNoExt.replace(/-/g, '_');

          // Create Import Statement
          // Example: import application_update_action from "./application-update_action";
          importStatements.push(`import ${importAlias} from "./${fileNameNoExt}";`);

          // Create Export Entry
          exportEntries.push(`    ${importAlias}`); // Indented for clean formatting
      }
  });

  // 2. Read the target file content
  let fileContent = fs.readFileSync(targetFilePath, 'utf8');

  // 3. Define Regex for the sections
  // We capture the markers so we can put them back in the replacement
  // Updated to match /*** import section ***/
  const importSectionRegex = /(\/\*\*\* import section \*\*\*\/)([\s\S]*?)(\/\*\*\* import section \*\*\*\/)/;
  // Updated to match /*** export section ***/
  const exportSectionRegex = /(\/\*\*\* export section \*\*\*\/)([\s\S]*?)(\/\*\*\* export section \*\*\*\/)/;

  // 4. Construct new section content
  const newImportContent = `\n${importStatements.join('\n')}\n`;
  const newExportContent = `\n${exportEntries.join(',\n')}\n`; // Joined with commas for the object

  // 5. Perform Replacements
  if (importSectionRegex.test(fileContent)) {
      fileContent = fileContent.replace(importSectionRegex, `$1${newImportContent}$3`);
  } else {
      console.warn("Warning: '/*** import section ***/' markers not found.");
  }

  if (exportSectionRegex.test(fileContent)) {
      fileContent = fileContent.replace(exportSectionRegex, `$1${newExportContent}$3`);
  } else {
      console.warn("Warning: '/*** export section ***/' markers not found.");
  }

  // 6. Write back to file
  fs.writeFileSync(targetFilePath, fileContent, 'utf8');
  console.log(`Successfully updated ${targetFilename} with ${importStatements.length} entries.`);
}

module.exports={
  PATHS,
  ensureBaseDirs, appFilePrefix,
  readDefinitionFile, writeDefinitionFile,
  deleteDefinitionFile, listAllDefinitionFiles,
  listDefinitionFilesForApp, listServerScriptsForApp,
  listClientScriptsForApp, updateClientScriptLoader
};
