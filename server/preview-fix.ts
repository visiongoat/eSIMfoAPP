import express from "express";
import cors from "cors";
import path from "path";

const app = express();

// CORS ayarları - preview için kritik
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Security headers - preview iframe için
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/attached_assets', express.static(path.join(__dirname, '..', 'attached_assets')));

// Test endpoint
app.get('/preview-test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preview Test - eSIM App</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; margin: 0; }
        .container { max-width: 400px; margin: 50px auto; padding: 30px; text-align: center; }
        .success { color: #10b981; font-size: 24px; margin-bottom: 20px; }
        .info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success">✅ Preview Çalışıyor!</div>
        <div class="info">
          <strong>Test Başarılı:</strong> ${new Date().toLocaleString('tr-TR')}
        </div>
        <div class="info">
          <strong>eSIM App Özellikleri:</strong><br>
          • QR kod dokunma kaydetme<br>
          • Manuel kurulum modalı<br>
          • Satın alma akışı<br>
        </div>
        <button class="button" onclick="location.href='/'">Ana Uygulamaya Git</button>
      </div>
    </body>
    </html>
  `);
});

// Ana uygulama için proxy
app.get('/', (req, res) => {
  res.redirect('/preview-test');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Preview fix server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/preview-test`);
});