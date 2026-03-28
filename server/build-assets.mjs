import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const jsEntry = path.join(root, 'assets/js/main.js');
const cssEntry = path.join(root, 'assets/css/app.css');

const jsOut = path.join(root, 'assets/js/main.min.js');
const cssOut = path.join(root, 'assets/css/app.min.css');

await build({
    entryPoints: [jsEntry],
    outfile: jsOut,
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'es2020',
    legalComments: 'none'
});

await build({
    entryPoints: [cssEntry],
    outfile: cssOut,
    bundle: true,
    minify: true,
    target: 'es2020',
    external: ['../fonts/*', '/assets/fonts/*'],
    legalComments: 'none'
});

console.log('Built assets/js/main.min.js and assets/css/app.min.css');
