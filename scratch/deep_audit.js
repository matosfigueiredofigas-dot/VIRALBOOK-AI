const fs = require('fs');
const path = require('path');

// 1. Compare locale dictionary keys
const ptPath = path.join(__dirname, '../src/locales/pt.ts');
const enPath = path.join(__dirname, '../src/locales/en.ts');
const esPath = path.join(__dirname, '../src/locales/es.ts');

function getObjectKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Simple extraction of top-level section keys
  const sections = {};
  const lines = content.split('\n');
  let currentSection = null;

  lines.forEach(line => {
    const sectionMatch = line.match(/^\s*([a-zA-Z0-9_]+):\s*\{/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      sections[currentSection] = [];
    } else if (currentSection) {
      const keyMatch = line.match(/^\s*([a-zA-Z0-9_]+):/);
      if (keyMatch && keyMatch[1] !== '}') {
        sections[currentSection].push(keyMatch[1]);
      }
    }
  });

  return sections;
}

const ptKeys = getObjectKeys(ptPath);
const enKeys = getObjectKeys(enPath);
const esKeys = getObjectKeys(esPath);

console.log('--- SECTIONS IN PT ---');
console.log(Object.keys(ptKeys));

console.log('\n--- SECTIONS IN EN ---');
console.log(Object.keys(enKeys));

console.log('\n--- SECTIONS IN ES ---');
console.log(Object.keys(esKeys));

// Compare keys in sections
const allSections = new Set([...Object.keys(ptKeys), ...Object.keys(enKeys), ...Object.keys(esKeys)]);
allSections.forEach(section => {
  const pt = ptKeys[section] || [];
  const en = enKeys[section] || [];
  const es = esKeys[section] || [];

  const missingInEn = pt.filter(k => !en.includes(k));
  const missingInEs = pt.filter(k => !es.includes(k));

  if (missingInEn.length > 0) {
    console.log(`[MISMATCH EN] Section '${section}' missing in EN: ${missingInEn.join(', ')}`);
  }
  if (missingInEs.length > 0) {
    console.log(`[MISMATCH ES] Section '${section}' missing in ES: ${missingInEs.join(', ')}`);
  }
});

// 2. Scan component files for hardcoded Portuguese words or text literals
const componentsDir = path.join(__dirname, '../src/components');
const appDir = path.join(__dirname, '../src/app');

function scanJSXHardcoded(dirPath) {
  const files = fs.readdirSync(dirPath, { recursive: true });
  const textMatches = [];

  files.forEach(relFile => {
    const fullPath = path.join(dirPath, relFile);
    if (!fs.statSync(fullPath).isFile()) return;
    if (!fullPath.endsWith('.tsx')) return;

    const content = fs.readFileSync(fullPath, 'utf8');
    const usesLang = content.includes('useLanguage');

    // Check for common Portuguese strings in JSX
    const ptRegex = /(["'>])([A-Z\u00C0-\u00FF][a-zA-Z0-9\u00C0-\u00FF\s,.:!?()-]{4,})(["'<])/g;
    let match;
    const ptStringsFound = [];

    // Simple heuristic: check if file has hardcoded PT text without t.
    if (!usesLang) {
      textMatches.push({
        file: path.relative(path.join(__dirname, '..'), fullPath),
        usesLang: false,
        size: fs.statSync(fullPath).size
      });
    }
  });

  return textMatches;
}

console.log('\n--- UI COMPONENTS MISSING I18N SUPPORT ---');
const unlocalized = scanJSXHardcoded(componentsDir);
unlocalized.forEach(u => console.log(`- ${u.file} (${(u.size/1024).toFixed(1)} KB)`));

console.log('\n--- PAGES MISSING I18N SUPPORT ---');
const unlocalizedPages = scanJSXHardcoded(appDir);
unlocalizedPages.forEach(u => console.log(`- ${u.file} (${(u.size/1024).toFixed(1)} KB)`));
