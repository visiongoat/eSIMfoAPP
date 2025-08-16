import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Mark app as loading
console.log('🚀 eSIM App starting...');

// Create root and render app
const root = createRoot(document.getElementById("root")!);

try {
  root.render(<App />);
  
  // Mark successful load for mobile debugging
  setTimeout(() => {
    document.body.classList.add('app-loaded');
    console.log('✅ eSIM App loaded successfully');
  }, 100);
  
} catch (error) {
  console.error('❌ eSIM App failed to load:', error);
  
  // Fallback UI for errors
  root.render(
    <div style={{
      padding: '40px 20px',
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>⚠️ Yükleme Hatası</h1>
        <p>Uygulama başlatılamadı</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Yeniden Dene
        </button>
      </div>
    </div>
  );
}
