import React from 'react';
import { MailWarning, ChevronRight, ShieldAlert } from 'lucide-react'; 

export default function ContactInfo() {
  return (
    <div className="text-start"> {/* Garante que nada fica centrado por acidente */}
      <h3 className="h2 fw-bold mb-4 text-white">Informações de Contacto</h3>
      <div className="d-flex flex-column gap-4">
        
        {/* Item: Email */}
        <div className="d-flex align-items-start gap-4">
          <div 
            className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '48px', height: '48px' }}
          >
            <MailWarning className="text-info" size={24} />
          </div>
          <div>
            <h4 className="h5 fw-semibold text-white mb-1">Email</h4>
            <p className="text-white-50 mb-0">contacto@cyberboxsecur.pt</p>
          </div>
        </div>

        {/* Item: Telefone */}
        <div className="d-flex align-items-start gap-4">
          <div 
            className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '48px', height: '48px' }}
          >
            <ChevronRight className="text-info" size={24} />
          </div>
          <div>
            <h4 className="h5 fw-semibold text-white mb-1">Telefone</h4>
            <p className="text-white-50 mb-0">+351 210 000 000</p>
          </div>
        </div>

        {/* Item: Morada */}
        <div className="d-flex align-items-start gap-4">
          <div 
            className="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '48px', height: '48px' }}
          >
            <ShieldAlert className="text-info" size={24} />
          </div>
          <div>
            <h4 className="h5 fw-semibold text-white mb-1">Morada</h4>
            <p className="text-white-50 mb-0" style={{ maxWidth: '300px' }}>
              Parque das Nações, Edifício Cyber, Coimbra, Portugal
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}