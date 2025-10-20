import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/index.jsx')
        },
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['@supabase/supabase-js', '@tanstack/react-query'],
          },
        },
      },
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 1000,
    },
    
    server: {
      port: 3002,
      open: true,
      strictPort: true,
      host: '0.0.0.0',
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3002,
      }
    },
    
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@supabase/supabase-js', '@supabase/postgrest-js', '@supabase/node-fetch', '@fontsource/inter', '@fontsource/poppins'],
      force: true
    },

    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
  };
});
