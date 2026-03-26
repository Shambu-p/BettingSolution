const fs = require('fs');
const path = require('path');

/**
 * Updates the import and export sections of a target TypeScript file
 * based on other files in the same directory.
 * * @param {string} directoryPath - The path to the directory containing the files.
 * @param {string} targetFilename - The name of the file to update (e.g., 'index.ts').
 */
function updateTsFile(directoryPath, targetFilename) {
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

// --- USAGE EXAMPLE ---
// You can run this script directly. 
// Adjust '.' to your specific folder path if the script is not in the same folder.
// Adjust 'index.ts' to the name of the file you want to update.

const TARGET_DIR = '.'; 
const TARGET_FILE = 'index.ts'; // Change this to your actual file name

// Create a dummy index.ts for testing if it doesn't exist (Optional, for demonstration)
if (!fs.existsSync(path.join(TARGET_DIR, TARGET_FILE))) {
    // Updated dummy content to use the new markers
    const dummyContent = `/*** import section ***/\n\n/*** import section ***/\n\nexport default {\n    /*** export section ***/\n\n    /*** export section ***/\n};`;
    fs.writeFileSync(path.join(TARGET_DIR, TARGET_FILE), dummyContent);
    console.log("Created dummy index.ts for testing.");
}

try {
    updateTsFile(TARGET_DIR, TARGET_FILE);
} catch (error) {
    console.error("An error occurred:", error);
}