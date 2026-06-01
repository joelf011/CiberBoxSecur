import React from 'react';

const Services = () => {
  return (
    <div className="w-100">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Serviços</h4>
        <p className="text-muted small">Gestão das áreas de atuação ('Como ajudamos')</p>
      </div>

      <div className="d-flex flex-column gap-3 mb-4">
        
        {/* Card 1 */}
        <div className="card bg-light p-4 border rounded-4">
          <input 
            type="text" 
            className="form-control fw-bold border-0 bg-white mb-3 p-3 rounded-3" 
            defaultValue="Implementação da Diretiva NIS2" 
          />
          <textarea 
            rows={2} 
            className="form-control border-0 bg-white p-3 rounded-3" 
            style={{ resize: 'none' }}
            defaultValue="Análise de enquadramento da entidade. Avaliação de maturidade de cibersegurança." 
          />
        </div>

        {/* Card 2 */}
        <div className="card bg-light p-4 border rounded-4">
          <input 
            type="text" 
            className="form-control fw-bold border-0 bg-white mb-3 p-3 rounded-3" 
            defaultValue="Auditorias de Cibersegurança" 
          />
          <textarea 
            rows={2} 
            className="form-control border-0 bg-white p-3 rounded-3" 
            style={{ resize: 'none' }}
            defaultValue="Análise de vulnerabilidades. Revisão da arquitetura de segurança." 
          />
        </div>

      </div>

      {/* Botão lilás idêntico ao Figma */}
      <button className="btn fw-bold d-flex align-items-center gap-2 rounded-3 border-0" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
        + Adicionar Serviço
      </button>
    </div>
  );
};

export default Services;