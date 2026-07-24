const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function getAllTsxFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllTsxFiles(fullPath, arrayOfFiles);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllTsxFiles(srcDir);

const unlocalizedFiles = [];

allFiles.forEach(file => {
  const relPath = path.relative(srcDir, file);
  // Ignore locales, types, api routes for UI scanning (or handle api separately)
  if (relPath.startsWith('locales') || relPath.startsWith('types')) {
    return;
  }

  const content = fs.readFileSync(file, 'utf8');
  const usesLang = content.includes('useLanguage') || content.includes('LanguageContext');

  // Regex to check if file has literal text in JSX like >Some Text< or placeholder="Text"
  const hasJsxText = />\s*([A-Za-z\u00C0-\u00FF][A-Za-z0-9\u00C0-\u00FF\s,.:!?()'-]{3,})\s*</.test(content) ||
                     /placeholder=["']([A-Za-z\u00C0-\u00FF][^"']{3,})["']/.test(content) ||
                     /title=["']([A-Za-z\u00C0-\u00FF][^"']{3,})["']/.test(content);

  if (!usesLang && hasJsxText) {
    unlocalizedFiles.push({ file: relPath, size: fs.statSync(file).size });
  }
});

console.log(`FOUND ${unlocalizedFiles.length} FILES REQUIRING I18N MIGRATION:`);
unlocalizedFiles.forEach(f => {
  console.log(`- ${f.file} (${(f.size/1024).toFixed(1)} KB)`);
});
