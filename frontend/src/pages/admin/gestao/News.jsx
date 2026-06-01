import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

const News = () => {
  return (
    <div className="w-100">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Notícias e Artigos</h4>
        <p className="text-muted small">Gestão do blog e atualidades</p>
      </div>

      <div className="border border-2 border-dashed bg-light rounded-4 p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
        <div className="text-secondary opacity-50 mb-3" style={{ fontSize: '48px' }}>
          <FontAwesomeIcon icon={faNewspaper} />
        </div>
        <p className="text-muted fw-medium small mb-0" style={{ maxWidth: '350px' }}>
          A listagem e edição de notícias ficará disponível aqui.
        </p>
      </div>
    </div>
  );
};

export default News;