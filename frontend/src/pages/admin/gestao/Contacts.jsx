import React from 'react';

const Contacts = () => {
  return (
    <div className="w-100">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Contactos</h4>
        <p className="text-muted small">Informações de contacto da organização</p>
      </div>

      <div className="d-flex flex-column gap-3">
        
        {/* Email Principal */}
        <div className="form-group">
          <label className="form-label fw-bold text-dark small mb-2 ms-1">
            Email Principal
          </label>
          <input 
            type="email" 
            className="form-control rounded-3 p-3" 
            defaultValue="geral@cyberrisk.pt"
          />
        </div>

        {/* Telefone */}
        <div className="form-group">
          <label className="form-label fw-bold text-dark small mb-2 ms-1">
            Telefone
          </label>
          <input 
            type="text" 
            className="form-control rounded-3 p-3" 
            defaultValue="+351 210 000 000"
          />
        </div>

        {/* Morada Sede */}
        <div className="form-group">
          <label className="form-label fw-bold text-dark small mb-2 ms-1">
            Morada Sede
          </label>
          <input 
            type="text" 
            className="form-control rounded-3 p-3" 
            defaultValue="Av. da Liberdade 110, 1250-146 Lisboa"
          />
        </div>

      </div>
    </div>
  );
};

export default Contacts;