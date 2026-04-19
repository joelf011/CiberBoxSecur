import React from 'react';

export default function Section({ id, title, subtitle, bgColor = "bg-dark", children }) {
  return (
    <section id={id} className={`py-5 ${bgColor} text-white`}>
      <div className="container">
        
        {/* Cabeçalho dinâmico da Secção */}
        <div className="text-center mb-5">
          {title && <h2 className="display-5 fw-bold mb-3">{title}</h2>}
          {subtitle && <p className="lead text-white-50">{subtitle}</p>}
        </div>

        {/* Aqui é onde o conteúdo específico de cada secção vai ser injetado */}
        {children}

      </div>
    </section>
  );
}