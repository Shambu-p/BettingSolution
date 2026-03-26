
function validateDefinitionAndFile(def, fileName){
  if(!def || typeof def!=='object') return new Error("Invalid JSON");
  if(!def.id) return new Error("Missing id");
  if(!def.application_id) return new Error("Missing application_id");
  if(!fileName.startsWith(def.application_id+"-")) return new Error("Filename must start with app id");
  return null;
}

function validateScriptFileName(f){
  if(!f.endsWith(".js")) return new Error("Must end with .js");
  return null;
}

function validateClientScriptFileName(f){
  if(!f.endsWith(".ts")) return new Error("Must end with .ts");
  return null;
}

module.exports={ validateDefinitionAndFile, validateScriptFileName, validateClientScriptFileName };
