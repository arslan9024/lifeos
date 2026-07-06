import { spawn } from 'node:child_process';
import { checkHealth } from './check-health.mjs';

const isWindows = process.platform === 'win32';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await checkHealth('http://localhost:5000');
      return;
    } catch {
      await wait(500);
    }
  }

  throw new Error('Server did not become healthy within timeout window.');
}

function stopServer(child) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.kill();
    }, 4000);

    child.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });

    child.kill('SIGINT');
  });
}

async function run() {
  console.log('[smoke] Starting server process...');

  const child = isWindows
    ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm --prefix server run start'], {
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    : spawn('npm', ['--prefix', 'server', 'run', 'start'], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[smoke][server] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[smoke][server:err] ${chunk}`);
  });

  try {
    await waitForServer();
    console.log('[smoke] Server health checks passed.');
  } finally {
    await stopServer(child);
    console.log('[smoke] Server process stopped.');
  }
}

run().catch((error) => {
  console.error('[smoke] FAILED', error.message);
  process.exit(1);
});
