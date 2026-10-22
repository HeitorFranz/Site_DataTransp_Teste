// Stop hook: run `npm run build` when Claude finishes a turn.
// If the build fails, exit code 2 keeps Claude working and shows it the error.
// stop_hook_active is set when Claude is already continuing because of this
// hook, so we skip that run to avoid an endless loop.
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

const input = JSON.parse(raw || '{}');
if (input.stop_hook_active) process.exit(0);

const siteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

try {
  execSync('npm run build', { cwd: siteDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '');
  const tail = output.trim().split(/\r?\n/).slice(-30).join('\n');
  console.error(`npm run build falhou. Corrija antes de terminar:\n${tail}`);
  process.exit(2);
}
