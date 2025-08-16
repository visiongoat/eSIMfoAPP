const express = require('express');
const path = require('path');
const app = express();

// Basic static file serving
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/attached_assets', express.static(path.join(__dirname, '..', 'attached_assets')));

// Simple test endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>eSIM App Test</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family: Arial; margin: 20px; background: #f0f0f0;">
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #2563eb;">✅ Preview Çalışıyor!</h1>
        <p><strong>Zaman:</strong> ${new Date().toLocaleString('tr-TR')}</p>
        <p><strong>Port:</strong> ${process.env.PORT || 5000}</p>
        <p><strong>Test Başarılı!</strong> Server erişilebilir durumda.</p>
        <hr>
        <h2>Özellikler:</h2>
        <ul>
          <li>✅ QR kod dokunma kaydetme</li>
          <li>✅ Manuel kurulum modalı</li>
          <li>✅ Satın alma akışı</li>
        </ul>
        <p style="color: #059669;"><strong>Bu sayfayı görüyorsanız preview sistemi çalışıyor demektir!</strong></p>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`External: https://${process.env.REPLIT_DEV_DOMAIN || 'localhost:' + PORT}`);
});