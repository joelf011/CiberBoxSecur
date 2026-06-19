/**
 * Ponto de entrada da aplicação React.
 * Monta a árvore de componentes no elemento #root do index.html.
 * O BrowserRouter é inicializado aqui para que todas as rotas definidas no App.jsx funcionem.
 */
import React from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter ativa o sistema de rotas do React Router para toda a aplicação */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
