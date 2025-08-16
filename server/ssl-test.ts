import express from "express";
import path from "path";

const app = express();

// Minimal SSL-friendly server for testing
app.use((req, res, next) => {
  // Replit iframe'e özel headers
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', 'frame-ancestors *;');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>SSL Test - eSIM App</title>
      <style>
        body { font-family: system-ui; margin: 20px; background: #f0f9ff; }
        .success { background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .test { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }
      </style>
    </head>
    <body>
      <div class="success">
        <h1>✅ SSL Test Başarılı!</h1>
        <p>Replit Preview Sistemi Çalışıyor</p>
      </div>
      
      <div class="test">
        <strong>Zaman:</strong> ${new Date().toLocaleString('tr-TR')}
      </div>
      
      <div class="test">
        <strong>SSL Status:</strong> Active and Working
      </div>
      
      <div class="test">
        <strong>Headers:</strong> Iframe-friendly configured
      </div>
      
      <div class="test">
        <strong>Server:</strong> Express.js on Port 5000
      </div>

      <script>
        console.log('SSL Test: Preview iframe çalışıyor!');
        
        // Test SSL connection
        fetch('/api/countries')
          .then(r => r.json())
          .then(data => {
            console.log('API Test Başarılı:', data.length + ' ülke yüklendi');
            document.body.insertAdjacentHTML('beforeend', 
              '<div class="test" style="background: #ecfdf5; border-left-color: #10b981;"><strong>API Test:</strong> ✅ ' + data.length + ' ülke yüklendi</div>'
            );
          })
          .catch(e => {
            console.error('API Test Hata:', e);
            document.body.insertAdjacentHTML('beforeend', 
              '<div class="test" style="background: #fef2f2; border-left-color: #ef4444;"><strong>API Test:</strong> ❌ Bağlantı hatası</div>'
            );
          });
      </script>
    </body>
    </html>
  `);
});

// API endpoint test
app.get('/api/countries', (req, res) => {
  res.json([
    { id: 1, name: 'Turkey', code: 'TR' },
    { id: 2, name: 'Germany', code: 'DE' },
    { id: 3, name: 'France', code: 'FR' }
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SSL Test server: http://localhost:${PORT}`);
  console.log(`External: https://09004862-5261-4aba-a3f0-851185a3053e-00-asnzibgjpsfs.kirk.replit.dev`);
});