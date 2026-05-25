import React from "react";

function PorqueEscolher({ titulo, subtitulo, motivos }) {
  return (
    <section className="py-5 bg-white">
      <div className="container px-4 py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="display-6 fw-bold text-dark mb-4">{titulo}</h2>
            <p className="fs-5 text-secondary">{subtitulo}</p>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          {motivos.map((motivo, index) => (
            <div className="col-md-4" key={index}>
              <div className="p-4 p-md-5 rounded-4 bg-light border h-100 text-center">
                <div
                  className={`d-inline-flex align-items-center justify-content-center p-4 rounded-circle mb-4 ${motivo.corFundoIcone} ${motivo.corTextoIcone}`}
                >
                  <i className={`${motivo.icone} fs-2`}></i>
                </div>

                <h3 className="h5 fw-bold text-dark mb-4">
                  {motivo.tituloCard}
                </h3>

                <p className="text-secondary mb-0 lh-lg">{motivo.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PorqueEscolher;
