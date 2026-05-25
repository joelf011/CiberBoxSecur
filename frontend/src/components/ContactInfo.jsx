import React from "react";

function ContactInfo({ email, telefone, morada }) {
  return (
    <div className="text-start">
      <h3 className="h2 fw-bold mb-4 text-white">Informações de Contacto</h3>
      <div className="d-flex flex-column gap-4">
        <div className="d-flex align-items-start gap-4">
          <div
            className="bg-secondary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "48px", height: "48px" }}
          >
            <i className="fa-solid fa-envelope fs-5 text-info"></i>
          </div>
          <div>
            <h4 className="h5 fw-semibold text-white mb-1">Email</h4>
            <p className="text-white-50 mb-0">{email}</p>
          </div>
        </div>
        <div className="d-flex align-items-start gap-4">
          <div
            className="bg-secondary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "48px", height: "48px" }}
          >
            <i className="fa-solid fa-phone fs-5 text-info"></i>
          </div>
          <div>
            <h4 className="h5 fw-semibold text-white mb-1">Telefone</h4>
            <p className="text-white-50 mb-0">{telefone}</p>
          </div>
        </div>
        <div className="d-flex align-items-start gap-4">
          <div
            className="bg-secondary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: "48px", height: "48px" }}
          >
            <i className="fa-solid fa-location-dot fs-5 text-info"></i>
          </div>
          <div>
            <h4 className="h5 fw-semibold text-white mb-1">Morada</h4>
            <p className="text-white-50 mb-0" style={{ maxWidth: "300px" }}>
              {morada}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
