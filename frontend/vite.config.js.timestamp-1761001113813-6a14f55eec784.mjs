// vite.config.js
import { defineConfig } from "file:///C:/Users/ELITEBOOK/Documents/gazoduc-invest/frontend/node_modules/.pnpm/vite@5.4.20_@types+node@24.8.1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ELITEBOOK/Documents/gazoduc-invest/frontend/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.20_@types+node@24.8.1_/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import tailwindcss from "file:///C:/Users/ELITEBOOK/Documents/gazoduc-invest/frontend/node_modules/.pnpm/tailwindcss@3.4.18/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/ELITEBOOK/Documents/gazoduc-invest/frontend/node_modules/.pnpm/autoprefixer@10.4.21_postcss@8.5.6/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "C:\\Users\\ELITEBOOK\\Documents\\gazoduc-invest\\frontend";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    open: true,
    strictPort: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3002
    }
  },
  resolve: {
    alias: {
      // Alias pour les chemins absolus
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      // Rediriger postgrest-js vers notre shim
      "@supabase/postgrest-js": path.resolve(__vite_injected_original_dirname, "./src/utils/postgrest-shim.js")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "src/index.jsx")
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          vendor: ["@supabase/supabase-js", "@tanstack/react-query"]
        }
      }
    },
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1e3
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["@supabase/postgrest-js"],
    esbuildOptions: {
      // Forcer le chargement du shim pour postgrest-js
      alias: {
        "@supabase/postgrest-js": path.resolve(__vite_injected_original_dirname, "./src/utils/postgrest-shim.js")
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFTElURUJPT0tcXFxcRG9jdW1lbnRzXFxcXGdhem9kdWMtaW52ZXN0XFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFTElURUJPT0tcXFxcRG9jdW1lbnRzXFxcXGdhem9kdWMtaW52ZXN0XFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9FTElURUJPT0svRG9jdW1lbnRzL2dhem9kdWMtaW52ZXN0L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAyLFxuICAgIG9wZW46IHRydWUsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUwMDEnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXG4gICAgICAgIHdzOiB0cnVlLFxuICAgICAgfVxuICAgIH0sXG4gICAgaG1yOiB7XG4gICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgcG9ydDogMzAwMixcbiAgICB9XG4gIH0sXG4gIFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIC8vIEFsaWFzIHBvdXIgbGVzIGNoZW1pbnMgYWJzb2x1c1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIC8vIFJlZGlyaWdlciBwb3N0Z3Jlc3QtanMgdmVycyBub3RyZSBzaGltXG4gICAgICAnQHN1cGFiYXNlL3Bvc3RncmVzdC1qcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscy9wb3N0Z3Jlc3Qtc2hpbS5qcycpXG4gICAgfVxuICB9LFxuICBcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC5qc3gnKVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICByZWFjdDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIHZlbmRvcjogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnLCAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICB9LFxuICBcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgIGV4Y2x1ZGU6IFsnQHN1cGFiYXNlL3Bvc3RncmVzdC1qcyddLFxuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAvLyBGb3JjZXIgbGUgY2hhcmdlbWVudCBkdSBzaGltIHBvdXIgcG9zdGdyZXN0LWpzXG4gICAgICBhbGlhczoge1xuICAgICAgICAnQHN1cGFiYXNlL3Bvc3RncmVzdC1qcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscy9wb3N0Z3Jlc3Qtc2hpbS5qcycpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdGFpbHdpbmRjc3MsXG4gICAgICAgIGF1dG9wcmVmaXhlcixcbiAgICAgIF0sXG4gICAgfSxcbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBWLFNBQVMsb0JBQW9CO0FBQ3ZYLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFKekIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBRWpCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLElBQUk7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBLE1BQ1YsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUE7QUFBQSxNQUVMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQTtBQUFBLE1BRXBDLDBCQUEwQixLQUFLLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsSUFDbkY7QUFBQSxFQUNGO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLEtBQUssUUFBUSxrQ0FBVyxlQUFlO0FBQUEsTUFDL0M7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLE9BQU8sQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDaEQsUUFBUSxDQUFDLHlCQUF5Qix1QkFBdUI7QUFBQSxRQUMzRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxtQkFBbUI7QUFBQSxJQUNuQix1QkFBdUI7QUFBQSxFQUN6QjtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxJQUNsRCxTQUFTLENBQUMsd0JBQXdCO0FBQUEsSUFDbEMsZ0JBQWdCO0FBQUE7QUFBQSxNQUVkLE9BQU87QUFBQSxRQUNMLDBCQUEwQixLQUFLLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsTUFDbkY7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBRUEsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
