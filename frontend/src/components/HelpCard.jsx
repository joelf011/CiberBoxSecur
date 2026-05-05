import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HelpCard = ({ title, description, icon, color }) => {
  return (
    <div 
      className="card h-100 shadow-sm border overflow-hidden rounded-3"
      style={{ borderTopColor: color }}
    >
      <div style={{ height: '6px', backgroundColor: color }}></div>
      <div className="card-body p-4">
        <div className="mb-3" style={{ color: color }}>
          {/* Usamos o componente do Font Awesome aqui */}
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
        <h5 className="fw-bold">{title}</h5>
        <p className="text-muted small">{description}</p>
      </div>
    </div>
  );
};

export default HelpCard;