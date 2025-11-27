import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數 (VITE_ 開頭的變數)
  // Fix: Property 'cwd' does not exist on type 'Process' - casting to any to resolve TS error
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 重要：GitHub Pages 專案名稱通常不是根目錄，這裡需設定為 '/您的儲存庫名稱/'
    // 如果您不確定，使用 './' (相對路徑) 通常也能運作，但在某些路由下可能會有問題
    base: './', 
    define: {
      // 為了讓 @google/genai SDK (使用 process.env.API_KEY) 在瀏覽器端運作
      // 我們必須在建置時將環境變數替換進去
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.VITE_FINNHUB_API_KEY': JSON.stringify(env.VITE_FINNHUB_API_KEY || ''),
    },
  };
});