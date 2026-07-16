const fs = require('fs');
let code = fs.readFileSync('public/sw.js', 'utf8');

// Change cache version
code = code.replace(/const CACHE_NAME = "lean-strong-tracker-v2";/, 'const CACHE_NAME = "lean-strong-tracker-v3";');

const fetchStart = `self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith('blob:')) return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  
  // Do not cache or intercept development paths or API requests
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@vite/') ||
    url.pathname.startsWith('/@react-refresh') ||
    url.pathname.startsWith('/node_modules/.vite/') ||
    url.searchParams.has('t') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }
`;

code = code.replace(/self\.addEventListener\("fetch", \(event\) => {[\s\S]*?if \(!event\.request\.url\.startsWith\('http'\)\) return;/, fetchStart);

// Let's also check where Cache-first behavior is applied for non-hashed resources.
// The prompt says: "Cache-first behavior may be used for actual production assets that are safe to cache, such as: Vite-generated hashed JavaScript files under /assets/ ... For non-hashed or potentially changing resources, prefer network-first behavior with an offline cached fallback."
// Let's look at the sw.js content.
fs.writeFileSync('public/sw.js', code);
console.log('patched sw.js phase 1');
