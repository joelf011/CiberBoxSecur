import React from "react";
import { Link } from "react-router-dom";

const darkSection = {
  backgroundColor: "#0f172a",
  color: "white",
};

function Regulamentacao({
  titulo,
  textoInicio,
  nomeDiretiva,
  linkDiretiva,
  textoFim,
  cards,
}) {
  return (
    <section style={darkSection} className="py-5 text-white">
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="display-6 fw-bold mb-5 text-center">{titulo}</h2>
            <div className="bg-secondary bg-opacity-10 rounded-4 p-4 p-md-5 border border-secondary border-opacity-50 shadow-sm">
              <p className="fs-6 text-white-50 lh-lg mb-5">
                {textoInicio}{" "}
                <Link
                  to={linkDiretiva}
                  className="fw-bold text-info text-decoration-none"
                >
                  {nomeDiretiva}
                </Link>
                {textoFim}
              </p>

              <div className="row g-4">
                {cards.map((card, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="bg-dark-custom p-4 rounded-4 border border-secondary border-opacity-25 bg-opacity-50 h-100">
                      <div
                        className={`d-inline-flex p-3 ${card.corFundo} ${card.corTexto} rounded-3 mb-3`}
                      >
                        <i className={`${card.icone} fs-4`}></i>
                      </div>

                      <h3 className="h6 fw-bold text-white mb-0">
                        {card.tituloCard}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Regulamentacao;
