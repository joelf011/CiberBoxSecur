import React from "react";

function Hero({ titulo, subtitulo, textoBotao, imagemFundo }) {
  const heroStyle = {
    position: "relative",
    backgroundColor: "#0f172a",
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('${imagemFundo}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "100px 0",
  };

  return (
    <section style={heroStyle} className="text-white">
      <div className="container px-4">
        <div className="row">
          <div className="col-lg-8">
            <h1 className="display-3 fw-bold mb-4 tracking-tight">{titulo}</h1>

            <p className="lead fs-4 text-white-50 mb-5">{subtitulo}</p>

            <button className="btn btn-primary fw-semibold d-inline-flex align-items-center gap-2">
              {textoBotao} <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
