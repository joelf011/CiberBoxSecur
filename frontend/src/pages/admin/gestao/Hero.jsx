import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading, faAlignLeft, faLink, faMousePointer } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  return (
    <div className="w-100">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Hero Section</h4>
        <p className="text-muted small">Configura o banner principal da tua página inicial</p>
      </div>

      <div className="d-flex flex-column gap-3">
        
        {/* Título Principal */}
        <div className="form-group">
          <label className="form-label fw-bold text-secondary small d-flex align-items-center gap-2 mb-2">
            Título Principal
          </label>
          <input 
            type="text" 
            className="form-control form-control-lg rounded-3" 
            defaultValue="Cibersegurança para organizações que não podem parar"
          />
        </div>

        {/* Subtítulo */}
        <div className="form-group">
          <label className="form-label fw-bold text-secondary small d-flex align-items-center gap-2 mb-2">
            Subtítulo
          </label>
          <textarea 
            rows={4}
            className="form-control rounded-3" 
            type="text"
            defaultValue="Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos."
          />
        </div>

        {/* Texto do Botão */}
        <div className="form-group">
          <label className="form-label fw-bold text-secondary small d-flex align-items-center gap-2 mb-2">
            Texto do Botão
          </label>
          <input 
            type="text" 
            className="form-control rounded-3" 
            defaultValue="Fale Connosco"
          />
        </div>

        {/* Link do Botão */}
        <div className="form-group">
          <label className="form-label fw-bold text-secondary small d-flex align-items-center gap-2 mb-2">
            Link do Botão
          </label>
          <input 
            type="text" 
            className="form-control rounded-3" 
            defaultValue="#contact"
          />
        </div>

      </div>
    </div>
  );
};

export default Hero;