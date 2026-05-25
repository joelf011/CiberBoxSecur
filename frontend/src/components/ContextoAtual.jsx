import React from "react";

function ContextoAtual({ titulo, textoInicial, itens, textoFinal }) {
  return (
    <section id="context" className="py-5 bg-white">
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="display-6 fw-bold text-dark mb-5 text-center">
              {titulo}
            </h2>
            <div className="bg-light rounded-4 p-4 p-md-5 border">
              <p className="fs-6 lh-lg mb-5">{textoInicial}</p>
              <div className="row g-4 mb-5">
                {itens.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className={`p-3 ${item.corFundo} ${item.corTexto} rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center`}
                      >
                        <i className={`${item.icone} fs-4`}></i>
                      </div>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">
                          {item.tituloItem}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Texto Final Dinâmico */}
              <p className="fs-6 lh-lg mb-0">{textoFinal}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContextoAtual;
