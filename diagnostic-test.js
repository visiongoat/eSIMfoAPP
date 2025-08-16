// Replit Infrastructure Diagnostic Test
const https = require('https');
const http = require('http');

console.log('=== Replit Infrastructure Diagnostic ===');
console.log('Time:', new Date().toISOString());

// Test 1: Local server check
const localServer = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Local Test</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family: Arial; text-align: center; padding: 50px;">
      <h1>Local Server Test</h1>
      <p>Time: ${new Date().toLocaleString()}</p>
      <p>Status: Server Running</p>
    </body>
    </html>
  `);
});

localServer.listen(8080, '0.0.0.0', () => {
  console.log('Local diagnostic server started on port 8080');
});

// Test 2: External connectivity check
function testConnection(hostname, port = 443) {
  return new Promise((resolve) => {
    const options = {
      hostname,
      port,
      method: 'GET',
      timeout: 5000
    };
    
    const req = https.request(options, (res) => {
      console.log(`Connection to ${hostname}: SUCCESS (${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`Connection to ${hostname}: FAILED - ${err.code}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      console.log(`Connection to ${hostname}: TIMEOUT`);
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Run tests
async function runDiagnostics() {
  console.log('\n=== Connectivity Tests ===');
  
  await testConnection('google.com');
  await testConnection('replit.com');
  await testConnection('09004862-5261-4aba-a3f0-851185a3053e-00-asnzibgjpsfs.kirk.replit.dev');
  
  console.log('\n=== Environment Info ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('REPLIT_DOMAINS:', process.env.REPLIT_DOMAINS);
  
  setTimeout(() => {
    console.log('\nDiagnostic complete. Local server running on port 8080');
  }, 3000);
}

runDiagnostics();