#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, 'templates');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// ── Load available templates ──

function loadTemplates() {
  const dirs = fs.readdirSync(TEMPLATES_DIR).filter((d) =>
    fs.statSync(path.join(TEMPLATES_DIR, d)).isDirectory() &&
    fs.existsSync(path.join(TEMPLATES_DIR, d, 'template.json'))
  );
  return dirs.map((d) => {
    const manifest = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, d, 'template.json'), 'utf8'));
    return { dir: d, ...manifest };
  });
}

// ── Interactive template picker ──

async function pickTemplate(templates, preselected) {
  if (preselected) {
    const match = templates.find((t) => t.name === preselected || t.dir === preselected);
    if (match) return match;
    console.error(`Template "${preselected}" not found. Available: ${templates.map((t) => t.name).join(', ')}`);
    process.exit(1);
  }

  console.log('\nAvailable templates:\n');
  templates.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name.padEnd(14)} — ${t.description}`);
  });
  console.log();

  const choice = await ask(`Choose a template [1-${templates.length}] (default 1): `);
  const idx = (parseInt(choice, 10) || 1) - 1;
  if (idx < 0 || idx >= templates.length) {
    console.error('Invalid choice.');
    process.exit(1);
  }
  return templates[idx];
}

// ── Copy directory recursively, replacing tokens ──

const TOKEN_FILES = new Set([
  'package.json', 'app.json', 'index.html', 'README.md',
  'App.tsx', 'main.tsx', 'shell.tsx', 'splash.ts', 'AppGlasses.tsx', 'selectors.ts',
]);

function copyDir(src, dest, tokens) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === 'template.json' || entry.name === 'node_modules') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, tokens);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      if (TOKEN_FILES.has(entry.name) || entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.json') || entry.name.endsWith('.html') || entry.name.endsWith('.md')) {
        for (const [key, value] of Object.entries(tokens)) {
          content = content.replaceAll(key, value);
        }
      }
      fs.writeFileSync(destPath, content);
    }
  }
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  let appName = null;
  let templateName = null;

  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--template' || args[i] === '-t') {
      templateName = args[++i];
    } else if (!args[i].startsWith('-')) {
      appName = args[i];
    }
  }

  console.log(`
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░  @even-toolkit/create-even-app    ░
  ░  G2 Smart Glasses App Scaffold    ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  `);

  // App name
  if (!appName) {
    appName = await ask('App name (e.g. my-app): ');
  }
  if (!appName) {
    console.error('App name is required.');
    process.exit(1);
  }

  const dir = path.resolve(process.cwd(), appName);
  if (fs.existsSync(dir)) {
    console.error(`Directory "${appName}" already exists.`);
    process.exit(1);
  }

  // Template selection
  const templates = loadTemplates();
  if (templates.length === 0) {
    console.error('No templates found in templates/ directory.');
    process.exit(1);
  }
  const template = await pickTemplate(templates, templateName);

  // Package ID
  const defaultId = `com.${appName.replace(/[^a-z0-9]/g, '')}.g2`;
  const packageId = await ask(`Package ID (${defaultId}): `) || defaultId;

  const displayName = appName
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  rl.close();

  console.log(`\nScaffolding "${displayName}" with "${template.name}" template...\n`);

  // Copy template with token replacement
  const tokens = {
    '{{APP_NAME}}': appName,
    '{{DISPLAY_NAME}}': displayName,
    '{{DISPLAY_NAME_UPPER}}': displayName.toUpperCase(),
    '{{PACKAGE_ID}}': packageId,
  };
  copyDir(path.join(TEMPLATES_DIR, template.dir), dir, tokens);

  console.log(`Done! Next steps:\n`);
  console.log(`  cd ${appName}`);
  console.log(`  npm install`);
  console.log(`  npm run dev\n`);
  console.log(`  # Build for Even Hub:`);
  console.log(`  npm run build`);
  console.log(`  npx @evenrealities/evenhub-cli pack app.json dist\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
