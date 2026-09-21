import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_BACKEND_PROXY_TARGET ?? 'http://localhost:4000';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      // Browser code calls the same origin (/api). Vite forwards that traffic
      // to the local Nest server, so preview users never try to reach their
      // own localhost.
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
