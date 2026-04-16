import React from 'react';
import { Calendar } from 'lucide-react';

const NewsArticleCard = ({ article }) => {
  // Can be moved to a generic utils file
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  return (
    <article className="card h-100 shadow-sm border border-light rounded-4 overflow-hidden">
      {/* Image Container */}
      <div className="position-relative bg-light" style={{ height: '12rem', overflow: 'hidden' }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-100 h-100 object-fit-cover"
        />
      </div>

      <div className="card-body p-4">
        {/* Title */}
        <h3 className="card-title h5 fw-bold text-dark mb-3">
          {article.title}
        </h3>

        {/* Category Badges */}
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

        {/* Excerpt */}
        <p className="card-text text-secondary small mb-4" style={{ lineHeight: '1.6' }}>
          {article.excerpt}
        </p>
      </div>

      {/* Footer */}
      <div className="card-footer bg-transparent border-top border-light py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column gap-1 small text-secondary">
          <div className="d-flex align-items-center gap-2">
            <Calendar style={{ width: '14px', height: '14px' }} />
            <span>{formatDate(article.date)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsArticleCard;