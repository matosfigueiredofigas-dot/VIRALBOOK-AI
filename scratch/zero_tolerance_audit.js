const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allFiles = getAllFiles(srcDir);

// Patterns to look for hardcoded Portuguese/English text in JSX/TSX
// Strings inside JSX tags: >[A-Za-zÀ-ÿ0-9\s,.!?\-\/:\(\)]+<
// Attributes: placeholder="...", title="...", label="..."

const ignoreFiles = [
  'src/locales/pt.ts',
  'src/locales/en.ts',
  'src/locales/es.ts',
  'src/types/i18n.ts'
];

let issuesFound = [];

allFiles.forEach(file => {
  const relativePath = path.relative(process.cwd(), file);
  if (ignoreFiles.some(ig => relativePath.endsWith(path.normalize(ig)))) return;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Ignore imports, comments, console.log, Tailwind classes
    if (line.trim().startsWith('import') || line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    // Check for hardcoded text inside JSX tags like >Texto<
    const jsxTextMatches = line.match(/>([^<>{}]+)</g);
    if (jsxTextMatches) {
      jsxTextMatches.forEach(m => {
        const text = m.replace('>', '').replace('<', '').trim();
        // Ignore single punctuation, numbers, symbols, icons
        if (text.length > 1 && !/^[0-9\s\-+*%.\/#]+$/.test(text) && !/^\s*$/.test(text)) {
          issuesFound.push({ file: relativePath, lineNum: index + 1, type: 'JSX Text', text });
        }
      });
    }

    // Check for attributes like placeholder="...", title="..."
    const attrMatches = line.match(/(placeholder|title|aria-label)="([^"]+)"/g);
    if (attrMatches) {
      attrMatches.forEach(m => {
        const [, attr, val] = m.match(/(placeholder|title|aria-label)="([^"]+)"/) || [];
        if (val && !val.includes('{') && !val.startsWith('http') && val.length > 1) {
          issuesFound.push({ file: relativePath, lineNum: index + 1, type: `Attr ${attr}`, text: val });
        }
      });
    }
  });
});

console.log(`ZERO TOLERANCE AUDIT FINDINGS: ${issuesFound.length} items found.\n`);

const grouped = {};
issuesFound.forEach(item => {
  if (!grouped[item.file]) grouped[item.file] = [];
  grouped[item.file].push(item);
});

Object.keys(grouped).forEach(f => {
  console.log(`📁 ${f} (${grouped[f].length} occurrences)`);
  grouped[f].slice(0, 5).forEach(i => {
    console.log(`   L${i.lineNum} [${i.type}]: "${i.text}"`);
  });
  if (grouped[f].length > 5) {
    console.log(`   ... and ${grouped[f].length - 5} more.`);
  }
  console.log('');
});
