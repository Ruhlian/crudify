import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// 👇 Importa BrowserRouter
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 👇 Envuélvelo aquí */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  
);

reportWebVitals();
