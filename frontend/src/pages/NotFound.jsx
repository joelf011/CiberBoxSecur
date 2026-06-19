import React from 'react';

// Página 404 — apresentada quando a rota não corresponde a nenhum caminho definido no React Router.
const NotFound = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center text-center" style={{ minHeight: '80vh', fontFamily: 'sans-serif' }}>
      <div className="card shadow-sm border-0 rounded-4 p-5 bg-white" style={{ maxWidth: '450px' }}>
        <h1 className="fw-bold display-1 mb-2" style={{ color: '#0d6efd' }}>404</h1>
        <h4 className="fw-bold text-dark mb-3">Página não encontrada</h4>
        <p className="text-muted small mb-4">
          O endereço que tentaste aceder não existe ou foi alterado.
        </p>
        <a href="/" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}>
          Voltar para o Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;