import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

const FeaturedNewsCard = ({ article }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  return (
    <div className="container px-0 mb-5">
      <div className="card border-0 shadow rounded-4 overflow-hidden bg-light">
        <div className="row g-0">
          
          {/* Image Section */}
          <div className="col-md-6 position-relative">
            <img
              src={article.image}
              alt={article.title}
              className="w-100 h-100 object-fit-cover"
              style={{ minHeight: '320px' }} // Good minimum height on mobile
            />
          </div>

          {/* Content Section */}
          <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
            
            {/* Title */}
            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: '2rem', lineHeight: '1.2' }}>
              {article.title}
            </h2>

            {/* Categories */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {article.categories.map((category, index) => (
                <span 
                  key={index} 
                  className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold">
                  {category}
                </span>
              ))}
            </div>

            {/* Excerpt */}
            <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
              {article.excerpt}
            </p>

            {/* Meta Data (Date) */}
            <div className="d-flex align-items-center gap-2 small text-secondary mb-4">
              <FaCalendarAlt />
              <span>{formatDate(article.date)}</span>
            </div>

            {/* CTA */}
            <div>
              <button 
              type = "button"
              onClick={() => navigate(`news//§{article.id}`)}
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