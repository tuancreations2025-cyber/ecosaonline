const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');

const viteBin =
  process.platform === 'win32'
    ? join(__dirname, '..', 'node_modules', '.bin', 'vite.cmd')
    : join(__dirname, '..', 'node_modules', '.bin', 'vite');

if (!existsSync(viteBin)) {
  execFileSync('npm', ['ci'], { stdio: 'inherit' });
}
