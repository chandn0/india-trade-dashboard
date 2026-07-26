import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targetFile = path.join(root, 'data/domestic_value_chain_opportunities.json');

const beforeContent = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, 'utf8') : null;

console.log('Rebuilding domestic value chain opportunities dataset...');
execSync('node scripts/build_domestic_value_chain_opportunities.js', {
  cwd: root,
  stdio: 'inherit',
});

const afterContent = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, 'utf8') : null;

if (beforeContent === null) {
  console.error(
    'Error: data/domestic_value_chain_opportunities.json did not exist prior to build.',
  );
  process.exit(1);
}

if (beforeContent !== afterContent) {
  console.error(
    '\nError: data/domestic_value_chain_opportunities.json is stale or inconsistent with its inputs.',
  );
  console.error('Please run "npm run build:value-chains" and commit the updated dataset.\n');
  process.exit(1);
}

console.log('Generated value-chain data is consistent and up-to-date.');
