import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress Vite HMR WebSocket connection errors in the AI Studio environment
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.toLowerCase().includes('websocket')) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (event.message && event.message.toLowerCase().includes('websocket')) {
    event.preventDefault();
  }
});

// Prevent unwanted pinch-to-zoom and gesture zooming on mobile devices to preserve fixed proportions
document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && (args[0].toLowerCase().includes('websocket') || args[0].includes('failed to connect to websocket') || args[0].includes('WebSocket closed without opened'))) {
    return;
  }
  originalConsoleError(...args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].toLowerCase().includes('websocket')) {
    return;
  }
  originalConsoleWarn(...args);
};

const originalConsoleLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string' && args[0].toLowerCase().includes('websocket')) {
    return;
  }
  originalConsoleLog(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
