// Checks every src/data/projectN/ folder: valid JSON, required fields present,
// local image/video/page paths exist in public/. Exits with code 1 on errors.
// Usage: npm run check-content

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DATA_DIR = 'src/data';
const PUBLIC_DIR = 'public';

// Required fields per section, taken from what the components render.
// 'text' = non-empty string, 'list' = non-empty array, 'file' = string pointing to a file in public/.
// Fields of list items are listed under 'items'. Fields not listed here are optional.
const SCHEMA = {
  header: { logoUrl: 'file' },
  hero: {
    headline: 'text',
    subheadline: 'text',
    imageUrl: 'file',
    cta1: { text: 'text', link: 'text' },
    cta2: { text: 'text', link: 'text' },
  },
  credentials: { logos: { list: { url: 'file', name: 'text' } } },
  features: { title: 'text', items: { list: { title: 'text', description: 'text', imageUrl: 'file' } } },
  users: { title: 'text', items: { list: { title: 'text', description: 'text', imageUrl: 'file' } } },
  faq: { title: 'text', items: { list: { question: 'text', answer: 'text' } } },
  ctaSection: { headline: 'text' },
  footer: { copyright: 'text', links: { list: { text: 'text', link: 'text' } } },
};

const PRICING_ITEM = {
  title: 'text', features: 'list', price: 'text', priceInformation: 'text', buttonText: 'text', buttonLink: 'text',
};

// Optional fields that point to files; checked only if they are set.
const OPTIONAL_FILE_FIELDS = ['videoUrl', 'screenshotUrl', 'imageUrl', 'url', 'logoUrl'];

const isExternal = (p) => /^(https?:|mailto:|tel:|#)/.test(p);
const fileExists = (p) => fs.existsSync(path.join(PUBLIC_DIR, p.split(/[?#]/)[0]));

function checkFields(value, schema, where, errors) {
  for (const [key, rule] of Object.entries(schema)) {
    const v = value?.[key];
    const at = `${where}.${key}`;

    if (rule === 'text') {
      if (typeof v !== 'string' || !v.trim()) errors.push(`${at}: missing or empty text`);
    } else if (rule === 'list') {
      if (!Array.isArray(v) || v.length === 0) errors.push(`${at}: missing or empty list`);
    } else if (rule === 'file') {
      if (typeof v !== 'string' || !v.trim()) errors.push(`${at}: missing file path`);
    } else if (rule.list) {
      if (!Array.isArray(v) || v.length === 0) errors.push(`${at}: missing or empty list`);
      else v.forEach((item, i) => checkFields(item, rule.list, `${at}[${i}]`, errors));
    } else if (typeof v !== 'object' || v === null) {
      errors.push(`${at}: missing section`);
    } else {
      checkFields(v, rule, at, errors);
    }
  }
}

// Walk the whole file and verify every local path in a file field exists.
function checkFiles(value, where, errors) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => checkFiles(v, `${where}[${i}]`, errors));
  } else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) {
      const at = `${where}.${key}`;
      const isFileField = OPTIONAL_FILE_FIELDS.includes(key);
      const isFooterLink = /^\.?footer\.links\[\d+\]$/.test(where) && key === 'link';
      if ((isFileField || isFooterLink) && typeof v === 'string' && v.trim() && !isExternal(v)) {
        if (!fileExists(v)) errors.push(`${at}: file not found: public/${v}`);
      } else {
        checkFiles(v, at, errors);
      }
    }
  }
}

function checkContent(data) {
  const errors = [];
  checkFields(data, SCHEMA, '', errors);

  const cta = data.ctaSection;
  if (cta?.pricingItems) {
    if (!Array.isArray(cta.pricingItems)) errors.push('ctaSection.pricingItems: must be a list');
    else cta.pricingItems.forEach((item, i) => checkFields(item, PRICING_ITEM, `ctaSection.pricingItems[${i}]`, errors));
  } else if (cta) {
    checkFields(cta, { cta1: { text: 'text', link: 'text' }, cta2: { text: 'text', link: 'text' } }, 'ctaSection', errors);
  }

  checkFiles(data, '', errors);
  return errors.map((e) => e.replace(/^\./, ''));
}

// Warn when the DE and EN version of a project have lists of different length.
function compareLanguages(de, en, where = '', warnings = []) {
  if (Array.isArray(de) && Array.isArray(en)) {
    if (de.length !== en.length) warnings.push(`${where}: ${de.length} entries in DE, ${en.length} in EN`);
    de.slice(0, en.length).forEach((v, i) => compareLanguages(v, en[i], `${where}[${i}]`, warnings));
  } else if (de && en && typeof de === 'object' && typeof en === 'object') {
    for (const key of Object.keys(de)) {
      if (key in en) compareLanguages(de[key], en[key], where ? `${where}.${key}` : key, warnings);
    }
  }
  return warnings;
}

const projects = fs.readdirSync(DATA_DIR)
  .filter((name) => /^project\d+$/.test(name))
  .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));

let errorCount = 0;
let warningCount = 0;

if (projects.length === 0) {
  console.error(`No project folders found in ${DATA_DIR}/`);
  process.exit(1);
}

for (const project of projects) {
  const loaded = {};
  const lines = [];

  for (const lang of ['de', 'en']) {
    const file = path.join(DATA_DIR, project, `content-${lang}.json`);
    if (!fs.existsSync(file)) continue;
    try {
      loaded[lang] = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      lines.push(`  ✗ content-${lang}.json: invalid JSON – ${err.message}`);
      errorCount++;
      continue;
    }
    for (const e of checkContent(loaded[lang])) {
      lines.push(`  ✗ content-${lang}.json: ${e}`);
      errorCount++;
    }
  }

  const langs = ['de', 'en'].filter((l) => fs.existsSync(path.join(DATA_DIR, project, `content-${l}.json`)));
  if (langs.length === 0) {
    lines.push('  ✗ no content-de.json or content-en.json found');
    errorCount++;
  }

  if (loaded.de && loaded.en) {
    for (const w of compareLanguages(loaded.de, loaded.en)) {
      lines.push(`  ! ${w}`);
      warningCount++;
    }
  }

  const mode = langs.length === 2 ? 'BI' : (langs[0] ?? '-').toUpperCase();
  console.log(`${project} (${mode})${lines.length ? '' : ' ✓'}`);
  lines.forEach((l) => console.log(l));
}

console.log(`\n${projects.length} project(s), ${errorCount} error(s), ${warningCount} warning(s)`);
process.exit(errorCount > 0 ? 1 : 0);
