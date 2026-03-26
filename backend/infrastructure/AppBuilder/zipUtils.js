
const archiver = require("archiver");
const unzipper = require("unzipper");
const fs = require("fs-extra");
const path = require("path");
const { PATHS, ensureBaseDirs } = require("./fileUtils.js");

async function createAppExportZip(appId,outZipPath){
  await ensureBaseDirs();
  return new Promise(async(resolve,reject)=>{
    const output=fs.createWriteStream(outZipPath);
    const archive=archiver("zip",{zlib:{level:9}});
    output.on("close",()=>resolve());
    archive.on("error",err=>reject(err));
    archive.pipe(output);

    const defs=await fs.readdir(PATHS.definitionsDir);
    defs.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.definitionsDir,f),{name:"definitions/"+f});
    });

    const srv=await fs.readdir(PATHS.serverScriptDir);
    srv.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.serverScriptDir,f),{name:"server_script/"+f});
    });

    // const cli=await fs.readdir(PATHS.clientScriptDir);
    // cli.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
    //   archive.file(path.join(PATHS.clientScriptDir,f),{name:"client_script/"+f});
    // });
    
    const btn=await fs.readdir(PATHS.buttonScriptsDir);
    btn.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.buttonScriptsDir,f),{name:"button_scripts/"+f});
    });

    const field_on_change=await fs.readdir(PATHS.FieldOnChangeScripts);
    field_on_change.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.FieldOnChangeScripts,f),{name:"field_on_change_scripts/"+f});
    });

    const form_on_load=await fs.readdir(PATHS.FormOnLoadScripts);
    form_on_load.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.FormOnLoadScripts,f),{name:"form_on_load_scripts/"+f});
    });

    const list_on_load=await fs.readdir(PATHS.ListOnLoadScripts);
    list_on_load.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.ListOnLoadScripts,f),{name:"list_on_load_scripts/"+f});
    });

    const form_on_submit=await fs.readdir(PATHS.FormOnSubmitScripts);
    form_on_submit.filter(f=>f.startsWith(appId+"-")).forEach(f=>{
      archive.file(path.join(PATHS.FormOnSubmitScripts,f),{name:"form_on_submit_scripts/"+f});
    });



    await archive.finalize();
  });
}

async function extractAppImportZip(zipPath,appId){
  await ensureBaseDirs();
  const extractDir=path.join(PATHS.tmpDir,"import_"+Date.now());
  await fs.ensureDir(extractDir);

  await fs.createReadStream(zipPath).pipe(unzipper.Extract({path:extractDir})).promise();

  const defsDir=path.join(extractDir,"definitions");
  const srvDir=path.join(extractDir,"server_script");
  // const cliDir=path.join(extractDir,"client_script");
  const btnDir=path.join(extractDir,"button_scripts");
  const field_on_change_dir=path.join(extractDir,"field_on_change_scripts");
  const form_on_load_dir=path.join(extractDir,"form_on_load_scripts");
  const list_on_load_dir=path.join(extractDir,"list_on_load_scripts");
  const form_on_submit_dir=path.join(extractDir,"form_on_submit_scripts");

  let result={definitions:0,server:0,client:0};

  if(await fs.pathExists(defsDir)){
    const files=await fs.readdir(defsDir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid definition filename "+f);
      await fs.copy(path.join(defsDir,f),path.join(PATHS.definitionsDir,f),{overwrite:true});
      result.definitions++;
    }
  }

  if(await fs.pathExists(srvDir)){
    const files=await fs.readdir(srvDir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid server script filename "+f);
      await fs.copy(path.join(srvDir,f),path.join(PATHS.serverScriptDir,f),{overwrite:true});
      result.server++;
    }
  }

  // if(await fs.pathExists(cliDir)){
  //   const files=await fs.readdir(cliDir);
  //   for(const f of files){
  //     if(!f.startsWith(appId+"-")) throw new Error("Invalid client script filename "+f);
  //     await fs.copy(path.join(cliDir,f),path.join(PATHS.clientScriptDir,f),{overwrite:true});
  //     result.client++;
  //   }
  // }

  if(await fs.pathExists(btnDir)){
    const files=await fs.readdir(btnDir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid button script filename "+f);
      await fs.copy(path.join(btnDir,f),path.join(PATHS.buttonScriptsDir,f),{overwrite:true});
      result.client++;
    }
  }

  if(await fs.pathExists(field_on_change_dir)){
    const files=await fs.readdir(field_on_change_dir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid field on change script filename "+f);
      await fs.copy(path.join(field_on_change_dir,f),path.join(PATHS.FieldOnChangeScripts,f),{overwrite:true});
      result.client++;
    }
  }

  if(await fs.pathExists(form_on_load_dir)){
    const files=await fs.readdir(form_on_load_dir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid form on load script filename "+f);
      await fs.copy(path.join(form_on_load_dir,f),path.join(PATHS.FormOnLoadScripts,f),{overwrite:true});
      result.client++;
    }
  }

  if(await fs.pathExists(list_on_load_dir)){
    const files=await fs.readdir(list_on_load_dir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid list on load script filename "+f);
      await fs.copy(path.join(list_on_load_dir,f),path.join(PATHS.ListOnLoadScripts,f),{overwrite:true});
      result.client++;
    }
  }

  if(await fs.pathExists(form_on_submit_dir)){
    const files=await fs.readdir(form_on_submit_dir);
    for(const f of files){
      if(!f.startsWith(appId+"-")) throw new Error("Invalid form on submit script filename "+f);
      await fs.copy(path.join(form_on_submit_dir,f),path.join(PATHS.FormOnSubmitScripts,f),{overwrite:true});
      result.client++;
    }
  }

  await fs.remove(extractDir);
  return result;
}

module.exports={ createAppExportZip, extractAppImportZip };
