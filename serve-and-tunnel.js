const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3333;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Try with .html extension
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath += '.html';
  }
  
  // Default to index.html for SPA routes
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log('🚀 Lancement du tunnel...');
  
  // Start localtunnel
  const lt = exec(`npx lt --port ${PORT} --subdomain maison-lauze-vins-2024`);
  
  lt.stdout.on('data', (data) => {
    console.log(data);
    if (data.includes('your url is:')) {
      const url = data.match(/https:\/\/[^\s]+/);
      if (url) {
        console.log('\n🌐 ====================================');
        console.log('🔗 URL DU SITE:');
        console.log(url[0]);
        console.log('====================================\n');
        
        // Save URL to file
        fs.writeFileSync('.tunnel-url.txt', url[0]);
      }
    }
  });
  
  lt.stderr.on('data', (data) => {
    console.error(data);
  });
});
