import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function jsonDbPlugin() {
  const handler = (req, res, next) => {
    if (req.url === '/api/save-db' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const dbPath = path.resolve(__dirname, 'data/db.json');
          const srcDbPath = path.resolve(__dirname, 'src/data/db.json');
          const publicDbPath = path.resolve(__dirname, 'public/db.json');
          const parsed = JSON.parse(body);
          const jsonString = JSON.stringify(parsed, null, 2);
          fs.writeFileSync(dbPath, jsonString, 'utf-8');
          if (fs.existsSync(path.dirname(srcDbPath))) {
            fs.writeFileSync(srcDbPath, jsonString, 'utf-8');
          }
          if (fs.existsSync(path.dirname(publicDbPath))) {
            fs.writeFileSync(publicDbPath, jsonString, 'utf-8');
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Saved to db.json on disk' }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    } else if (req.url === '/api/get-db' && req.method === 'GET') {
      try {
        const dbPath = path.resolve(__dirname, 'data/db.json');
        if (fs.existsSync(dbPath)) {
          const data = fs.readFileSync(dbPath, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'db.json not found' }));
        }
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    } else {
      next();
    }
  };

  return {
    name: 'json-db-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), jsonDbPlugin()],
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/data/**', '**/db.json', '**/src/data/**', '**/public/**']
    }
  }
});
