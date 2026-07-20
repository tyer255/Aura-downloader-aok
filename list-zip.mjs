import AdmZip from 'adm-zip';
const zip = new AdmZip('./public/project.zip');
zip.getEntries().forEach(e => console.log(e.entryName));
