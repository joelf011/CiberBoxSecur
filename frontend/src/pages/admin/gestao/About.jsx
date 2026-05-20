import React from 'react';

const About = () => {
  return (
    <div className="w-100">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Sobre Nós</h4>
        <p className="text-muted small">Gere a apresentação e história da tua organização</p>
      </div>

      <div className="border border-2 border-dashed bg-light rounded-4 p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '250px' }}>
        <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center fw-bold text-secondary mb-3" style={{ width: '40px', height: '40px' }}>
          i
        </div>
        <p className="text-muted fw-medium small mb-0">
          Os campos para a secção "Sobre" serão carregados aqui.
        </p>
      </div>
    </div>
  );
};

export default About;