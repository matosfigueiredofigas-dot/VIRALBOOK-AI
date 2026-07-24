const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const results = {
  filesWithUseLanguage: [],
  filesWithoutUseLanguage: [],
  localesComparison: {}
};

allFiles.forEach(file => {
  const relativePath = path.relative(srcDir, file);
  const content = fs.readFileSync(file, 'utf8');

  // Ignore locales files themselves, types, api routes
  if (relativePath.startsWith('locales') || relativePath.startsWith('types') || relativePath.startsWith('api')) {
    return;
  }

  const usesLanguage = content.includes('useLanguage');
  if (usesLanguage) {
    results.filesWithUseLanguage.push(relativePath);
  } else {
    results.filesWithoutUseLanguage.push(relativePath);
  }
});

console.log('=== FILES WITH useLanguage (' + results.filesWithUseLanguage.length + ') ===');
console.log(results.filesWithUseLanguage.join('\n'));

console.log('\n=== FILES WITHOUT useLanguage (' + results.filesWithoutUseLanguage.length + ') ===');
console.log(results.filesWithoutUseLanguage.join('\n'));
