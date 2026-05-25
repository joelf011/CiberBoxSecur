import React from "react";

function ContactForm() {
  return (
    <form className="bg-secondary bg-opacity-10 p-4 rounded-4 border border-secondary border-opacity-25 shadow-sm">
      <div className="mb-3">
        <label className="form-label text-white-50 fw-medium">Nome</label>
        <input
          type="text"
          className="form-control bg-dark bg-opacity-50 border-secondary border-opacity-50 text-white"
          placeholder="O seu nome"
        />
      </div>

      <div className="mb-3">
        <label className="form-label text-white-50 fw-medium">E-mail</label>
        <input
          type="email"
          className="form-control bg-dark bg-opacity-50 border-secondary border-opacity-50 text-white"
          placeholder="email@empresa.com"
        />
      </div>

      <div className="mb-4">
        <label className="form-label text-white-50 fw-medium">Mensagem</label>
        <textarea
          rows="4"
          className="form-control bg-dark bg-opacity-50 border-secondary border-opacity-50 text-white"
          placeholder="Como podemos ajudar?"
        ></textarea>
      </div>

      <button
        type="button"
        className="btn btn-primary fw-semibold d-inline-flex align-items-center justify-content-center gap-2 w-100"
      >
        Enviar Mensagem
      </button>
    </form>
  );
}

export default ContactForm;
