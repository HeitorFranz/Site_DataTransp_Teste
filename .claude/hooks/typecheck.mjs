// PostToolUse hook: after Claude edits a .ts/.tsx/.astro file, run `astro check`
// and report type errors in that file only. Errors elsewhere are ignored so
// existing problems in other files don't fire on every edit.
// Exit code 2 sends stderr back to Claude so it can fix the errors.
import { execSync } from 'node:child_process';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

const input = JSON.parse(raw || '{}');
const filePath = input.tool_input?.file_path ?? '';
if (!/\.(ts|tsx|mts|astro)$/.test(filePath)) process.exit(0);

const siteDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const target = relative(siteDir, resolve(filePath)).replaceAll('\\', '/');
if (target.startsWith('..') || /^(node_modules|dist|\.astro|founder-skill)\//.test(target)) process.exit(0);

let output;
try {
  output = execSync('npx --no-install astro check --minimumSeverity error', {
    cwd: siteDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
} catch (error) {
  output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
}

const errors = output
  .replace(/\x1b\[[0-9;]*m/g, '')
  .split(/\r?\n/)
  .filter((line) => line.startsWith(`${target}:`) && line.includes(' - error '));

if (errors.length > 0) {
  console.error(`astro check found ${errors.length} type error(s) in ${target}:\n${errors.join('\n')}`);
  process.exit(2);
}
