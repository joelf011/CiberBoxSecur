import React from "react";
import { useState } from 'react';

function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("A enviar...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "a63aa348-1b7f-4968-9310-d6a891fbe353");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult("Formulário enviado com sucesso!");
        event.target.reset();
      } else {
        console.error("Erro no envio:", data);
        setResult(data.message || "Ocorreu um erro ao enviar o formulário.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      setResult("Erro de ligação. Por favor, verifica a tua internet.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-secondary bg-opacity-10 p-4 rounded-4 border border-secondary border-opacity-25 shadow-sm">
      {/* Campos Ocultos para Web3Forms (Segurança e Entregabilidade) */}
      <input type="hidden" name="subject" value="Novo Contacto - Portal CiberBoxSecur" />
      <input type="hidden" name="from_name" value="Sistema CiberBoxSecur" />
      
      {/* Honeypot: Campo armadilha invisível. Bots preenchem isto e o Web3Forms bloqueia o envio. Humanos não veem. */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

      <div className="mb-3">
        <label htmlFor="name" className="form-label text-white-50 fw-medium">Nome</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control bg-dark bg-opacity-50 border-secondary border-opacity-50 text-white"
          placeholder="O seu nome"
          required
          maxLength="50"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label text-white-50 fw-medium">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control bg-dark bg-opacity-50 border-secondary border-opacity-50 text-white"
          placeholder="email@empresa.com"
          required
          maxLength="100"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="form-label text-white-50 fw-medium">Mensagem</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className="form-control bg-dark bg-opacity-50 border-secondary border-opacity-50 text-white"
          placeholder="Como podemos ajudar?"
          required
          maxLength="5000"
        ></textarea>
      </div>

      <button
        type="submit"
        className="btn btn-primary fw-semibold d-inline-flex align-items-center justify-content-center gap-2 w-100"
      >
        Enviar Mensagem
      </button>

      {result && (
        <div className="mt-3 text-center text-info small fw-bold">
          {result}
        </div>
      )}
    </form>
  );
}

export default ContactForm;
