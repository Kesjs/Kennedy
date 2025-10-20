import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3002,
    open: true,
    strictPort: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3002,
    }
  },
  
  resolve: {
    alias: {
      // Alias pour les chemins absolus
      '@': path.resolve(__dirname, './src'),
      // Rediriger postgrest-js vers notre shim
      '@supabase/postgrest-js': path.resolve(__dirname, './src/utils/postgrest-shim.js')
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
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@supabase/postgrest-js'],
    esbuildOptions: {
      // Forcer le chargement du shim pour postgrest-js
      alias: {
        '@supabase/postgrest-js': path.resolve(__dirname, './src/utils/postgrest-shim.js')
      }
    }
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  }
});
