const fs = require('fs');
const path = require('path');

function walk(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walk(fullPath, results);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));
const matches = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('.auth.getUser()') || content.includes('auth.getUser(')) {
    matches.push(file);
  }
});

console.log("Files containing getUser check:");
matches.forEach(m => console.log("- " + path.relative(path.join(__dirname, '..'), m)));
