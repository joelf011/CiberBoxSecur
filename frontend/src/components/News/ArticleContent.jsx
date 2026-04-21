import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaPrint, FaTags } from 'react-icons/fa';
import ShareDropdown from '../ShareDropdown';

const ArticleContent = ({ article }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!article) return <div className="container py-5 text-center">A carregar notícia...</div>;

  return (
    <article className="bg-white w-100">
      
      {/* Article Header Section */}
      <header className="py-5 bg-white border-bottom border-light">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              
              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate('/news')}
                className="btn btn-link text-decoration-none text-primary p-0 d-flex align-items-center gap-2 mb-4 fw-semibold"
              >
                <FaArrowLeft/>
                Voltar
              </button>

              {/* Title */}
              <h1 className="fw-bolder text-dark mb-4">
                {article.title}
              </h1>

              {/* Categories */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {article.categories?.map((category, index) => (
                  <span 
                    key={index} 
                    className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Meta Info & Actions Bar */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 border-top border-light pt-4 mt-4">
                
                {/* Date */}
                <div className="d-flex align-items-center gap-2 text-secondary">
                  <FaCalendarAlt />
                  <span className="fw-medium">{formatDate(article.date)}</span>
                </div>

                {/* Actions (Share & Print) */}
                <div className="d-flex flex-wrap align-items-center gap-3">
                  {/* Share Component */}
                  <ShareDropdown title={article.title} url={window.location.href} />
                  
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn btn-light fw-semibold d-inline-flex align-items-center gap-2 text-secondary"
                  >
                    <FaPrint />
                    Imprimir
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Hero Image Section */}
      <section className="py-4 py-lg-5">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8"> 
              <div className="ratio ratio-21x9 rounded-4 overflow-hidden shadow-sm bg-light">
                <img
                  src={article.image}
                  alt={article.title}
                  className="object-fit-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body Section */}
      <section className="pb-5">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              
              {/* Injected HTML Content */}
              <div 
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>
      </section>

    </article>
  );
};

export default ArticleContent;