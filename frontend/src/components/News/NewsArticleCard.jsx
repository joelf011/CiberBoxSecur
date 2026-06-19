import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

/**
 * Card compacto de artigo utilizado na grelha de listagem de notícias.
 * Exibe imagem, título (com link para detalhe via slug), categorias, excerto e data.
 * O link "stretched-link" torna todo o card clicável.
 */
const NewsArticleCard = ({ article }) => {
  // Pode ser extraída para um ficheiro de utilitários genérico.
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  return (
    <article className="card h-100 shadow-sm border border-light rounded-4 overflow-hidden">
      {/* Imagem do artigo com proporção 16:9 */}
      <div className="ratio ratio-16x9 bg-light border-bottom border-light">
        <img
          src={article.image}
          alt={article.title}
          className="object-fit-cover"
        />
      </div>

      <div className="card-body p-4">
        {/* Título com link para a página de detalhe */}
        <h3 className="card-title h5 fw-bold text-dark mb-3">
          <Link to={`/noticias/${article.slug}`} className="text-dark text-decoration-none stretched-link">
            {article.title}
          </Link>
        </h3>

        {/* Badges de categorias */}
        <div className="mb-3 d-flex flex-wrap gap-2">
          {article.categories.map((category, index) => (
            <span 
              key={index} 
              className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Excerto resumido */}
        <p className="card-text text-secondary small mb-4">
          {article.excerpt}
        </p>
      </div>

      {/* Rodapé do card com data de publicação */}
      <div className="card-footer bg-transparent border-top border-light py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column gap-1 small text-secondary">
          <div className="d-flex align-items-center gap-2">
            <FaCalendarAlt />
            <span>{formatDate(article.date)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsArticleCard;