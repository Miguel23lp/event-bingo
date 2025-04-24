import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './Home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/CriarCartao" element={<App />} />
        <Route path="/" element={<Home />} />    
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
