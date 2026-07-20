import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const zip = new AdmZip();
const sourceDir = './';
const outputFile = './public/project.zip';

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

function addDirectory(dir, zipPath) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'public' || file.startsWith('gradle-8') || file.endsWith('.zip') || file.endsWith('.mjs')) continue;
    
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      addDirectory(filePath, path.join(zipPath, file));
    } else {
      zip.addLocalFile(filePath, zipPath);
      const entry = zip.getEntry(path.join(zipPath, file).replace(/\\/g, '/'));
      if (entry) {
        const isExecutable = file === 'gradlew' || file.endsWith('.sh');
        const attr = isExecutable ? 0o755 : 0o644;
        entry.header.attr = (attr << 16) | 0;
      }
    }
  }
}

addDirectory(sourceDir, '');
zip.writeZip(outputFile);
console.log(`Successfully created ${outputFile}`);
