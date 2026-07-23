import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');

const enrichmentDir = path.join(root, 'data/enrichment');
const files = fs.readdirSync(enrichmentDir).filter((f) => f.endsWith('.csv'));

const manifest = {
  generated_at: new Date().toISOString(),
  datasets: {},
};

for (const file of files) {
  const filePath = path.join(enrichmentDir, file);
  const stat = fs.statSync(filePath);
  const content = fs.readFileSync(filePath);

  // checksum
  const hash = crypto.createHash('sha256');
  hash.update(content);
  const checksum = hash.digest('hex');

  // rows
  const rows =
    content
      .toString('utf8')
      .split('\n')
      .filter((r) => r.trim()).length - 1; // excluding header

  manifest.datasets[file] = {
    modified_at: stat.mtime.toISOString(),
    size_bytes: stat.size,
    row_count: rows,
    checksum_sha256: checksum,
    staleness_warning:
      Date.now() - stat.mtimeMs > 1000 * 60 * 60 * 24 * 30 ? 'Over 30 days old' : false,
  };
}

fs.writeFileSync(path.join(root, 'data/manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Generated data/manifest.json');
