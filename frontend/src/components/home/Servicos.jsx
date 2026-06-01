import React from "react";
import HelpCard from "./HelpCard";

function Servicos({ titulo, subtitulo, servicos }) {
  return (
    <section id="services" className="py-5 bg-light">
      <div className="container px-4">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-6 fw-bold text-dark mb-3">{titulo}</h2>
            <p className="fs-5 text-secondary">{subtitulo}</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="row g-4">
              {servicos.map((servico, index) => (
                <div className="col-md-6" key={index}>
                  <HelpCard
                    title={servico.titulo}
                    description={servico.descricao}
                    icon={servico.icone}
                    color={`var(--bs-${servico.corTema})`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Servicos;
