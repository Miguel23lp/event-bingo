import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';  // Import our global styles after Bootstrap
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
)
