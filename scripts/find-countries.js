const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const filesWithCountry = [];

function searchDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/country/i.test(content)) {
        filesWithCountry.push(fullPath);
      }
    }
  });
}

searchDir(srcDir);
console.log("Found files containing 'country' (case-insensitive):");
filesWithCountry.forEach(f => {
  console.log("- " + path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/'));
});
