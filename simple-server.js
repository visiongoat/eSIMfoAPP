// Ultra-basit HTTP server - network test için
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  });
  
  if (req.url === '/status') {
    res.end(`OK - ${new Date().toISOString()}`);
    return;
  }
  
  res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Network Test - eSIM</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { 
      font-family: Arial; 
      background: #667eea; 
      color: white; 
      text-align: center; 
      padding: 50px 20px; 
    }
    .container { 
      background: rgba(255,255,255,0.1); 
      padding: 30px; 
      border-radius: 15px; 
      max-width: 400px; 
      margin: 0 auto; 
    }
    .success { color: #10b981; font-size: 48px; }
    .info { margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✓</div>
    <h1>Network BAŞARILI</h1>
    <div class="info">Server: Aktif</div>
    <div class="info">Port: 3001</div>
    <div class="info">Time: ${new Date().toLocaleString('tr-TR')}</div>
    <div class="info">IP: ${req.socket.remoteAddress || 'Unknown'}</div>
    <div class="info">User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'Unknown'}</div>
    <p>Bu sayfa görünüyorsa network bağlantınız çalışıyor.</p>
  </div>
</body>
</html>
  `);
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log('External should be available at replit.dev domain');
});