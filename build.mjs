import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');   // yyyymmddhhmm
const r = await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', target: 'es2019', write: false });
const esc = (x) => x.replace(/<\/script/gi, '<\\/script');
const js = esc(r.outputFiles[0].text);
const ezCss = readFileSync('ui-kit/ezui.css', 'utf8');
const ezJs = esc(readFileSync('ui-kit/ezui.js', 'utf8'));
const tpl = readFileSync('template.html', 'utf8');

let html = tpl
  .replace('/*__EZUI_CSS__*/', () => ezCss)
  .replace('/*__EZUI_JS__*/', () => ezJs)
  .replace('/*__BUNDLE__*/', () => js)
  .replace('__BUILD__', stamp);
mkdirSync('dist', { recursive: true });
writeFileSync('dist/gembalap.html', html);
writeFileSync('dist/index.html', html);
writeFileSync('version.json', JSON.stringify({ name: 'Gembalap', version: pkg.version, build: stamp }) + '\n');
console.log('OK dist/index.html', Math.round(html.length / 1024) + ' KB, build', stamp);

// versi artifact: tanpa doctype/html/head/body (dibungkus otomatis saat publish), tanpa manifest/SW
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>/)[0];
const style = html.match(/<style>[\s\S]*?<\/style>/g).filter((x) => x.includes('--ink'))[0];
const bodyInner = html.slice(html.indexOf('<body>') + 6).replace(/<script>if\('serviceWorker'[\s\S]*$/, '');
const art = '<title>Gembalap</title>\n' + fonts + '\n' + style.replace('<style>', '<style>\n:root{color-scheme:light}\n') + '\n' + bodyInner.replace(/<link rel="stylesheet" href="https:\/\/fonts[^>]*>\s*/, '').replace(/<style>[\s\S]*?<\/style>/, '');
writeFileSync('dist/gembalap-artifact.html', art);
console.log('OK dist/gembalap-artifact.html');
