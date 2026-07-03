const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldScript = `    <!-- PWA Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
            .catch((err) => console.error('Service Worker registration failed:', err));
        });
      }
    </script>`;

const newScript = `    <!-- PWA Service Worker Registration -->
    <script>
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
    </script>`;

code = code.replace(oldScript, newScript);
fs.writeFileSync('index.html', code);
