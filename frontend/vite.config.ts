import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import http from 'node:http';

function apiProxyPlugin(): Plugin {
  return {
    name: 'api-proxy-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        const headers = { ...req.headers };
        delete headers.host;

        const proxyReq = http.request(
          {
            hostname: '127.0.0.1',
            port: 5000,
            path: req.url,
            method: req.method,
            headers,
          },
          (backendRes) => {
            res.writeHead(backendRes.statusCode || 200, backendRes.headers);
            backendRes.pipe(res);
          }
        );

        proxyReq.on('error', () => {
          // Backend is offline - return 503 silently without logging ECONNREFUSED stack traces
          if (!res.headersSent) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                offline: true,
                message: 'Backend server offline, using local offline mode',
              })
            );
          }
        });

        if (req.method !== 'GET' && req.method !== 'HEAD') {
          req.pipe(proxyReq);
        } else {
          proxyReq.end();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiProxyPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});

