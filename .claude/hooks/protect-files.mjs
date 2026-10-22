// PreToolUse hook: block Claude from writing local secrets and the npm lock file.
// Exit code 2 blocks the tool call and shows stderr to Claude.
import { basename } from 'node:path';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

const input = JSON.parse(raw || '{}');
const filePath = input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? '';
const name = basename(filePath);

const isSecretEnv = (name === '.env' || name.startsWith('.env.')) && name !== '.env.example';

if (isSecretEnv) {
  console.error(`Blocked: ${name} holds local secrets (SMTP credentials). Edit .env.example instead, or ask the user to change ${name} themselves.`);
  process.exit(2);
}

if (name === 'package-lock.json') {
  console.error('Blocked: package-lock.json is generated. Change package.json and run npm install instead.');
  process.exit(2);
}
