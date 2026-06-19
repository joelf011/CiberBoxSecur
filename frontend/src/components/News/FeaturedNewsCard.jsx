import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

/**
 * Card de destaque para a notícia principal na página de listagem de notícias.
 * Apresenta a imagem, título, categorias, excerto e data num layout horizontal.
 * Navega para o detalhe do artigo via slug ao clicar no botão "Ler Artigo".
 */
const FeaturedNewsCard = ({ article }) => {
  const navigate = useNavigate();

  // Formata a data para o formato local português.
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  return (
    <div className="container px-0 mb-5">
      <div className="card border-0 shadow rounded-4 overflow-hidden bg-light">
        <div className="row g-0">
          
          {/* Secção da imagem de destaque */}
          <div className="col-md-6 position-relative">
            <img
              src={article.image}
              alt={article.title}
              className="w-100 h-100 object-fit-cover"
              style={{ minHeight: '320px' }} // Good minimum height on mobile
            />
          </div>

          {/* Secção de conteúdo: título, categorias, excerto e CTA */}
          <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
            
            {/* Título do artigo em destaque */}
            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: '2rem', lineHeight: '1.2' }}>
              {article.title}
            </h2>

            {/* Categorias do artigo */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {article.categories.map((category, index) => (
                <span 
                  key={index} 
                  className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold">
                  {category}
                </span>
              ))}
            </div>

            {/* Excerto resumido do artigo */}
            <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
              {article.excerpt}
            </p>

            {/* Data de publicação */}
            <div className="d-flex align-items-center gap-2 small text-secondary mb-4">
              <FaCalendarAlt />
              <span>{formatDate(article.date)}</span>
            </div>

            {/* Botão de navegação para o detalhe do artigo */}
            <div>
              <button 
              type = "button"
              onClick={() => navigate(`/noticias/${article.slug}`)} 
              className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all">
                Ler Artigo <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsCard;