const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const swScript = `<script type="module">
      if (import.meta.env.PROD) {
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
              .then((reg) => {
                console.log('Service Worker registered successfully:', reg.scope);
                if (navigator.onLine) {
                  reg.update();
                }
              })
              .catch((err) => console.error('Service Worker registration failed:', err));
          });
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });
        }
      } else {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
              registration.unregister();
            }
          });
        }
        if ('caches' in window) {
          caches.keys().then((keys) => {
            for (const key of keys) {
              if (key.startsWith('lean-strong-tracker-')) {
                caches.delete(key);
              }
            }
          });
        }
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          if (!sessionStorage.getItem('sw-dev-reloaded')) {
            sessionStorage.setItem('sw-dev-reloaded', 'true');
            window.location.reload();
          }
        }
      }
    </script>`;

code = code.replace(/<script>\s*if \('serviceWorker' in navigator\) {[\s\S]*?<\/script>/, swScript);

fs.writeFileSync('index.html', code);
console.log('patched index.html');
