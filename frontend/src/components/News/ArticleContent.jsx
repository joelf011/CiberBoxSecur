import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaPrint, FaTags } from 'react-icons/fa';
import ShareDropdown from '../ShareDropdown';

/**
 * Página de detalhe completo de um artigo de notícias.
 *
 * Responsável por:
 * - Exibir o cabeçalho (título, categorias, data).
 * - Disponibilizar ações de partilha social (ShareDropdown) e impressão.
 * - Renderizar o corpo do artigo via HTML injetado (dangerouslySetInnerHTML).
 *
 * Recebe o objeto `article` como prop (dados vindos da API/backend).
 */
const ArticleContent = ({ article }) => {
  const navigate = useNavigate();

  // Formata a data para o formato local português (ex: "19 de junho de 2026").
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
      
      {/* Cabeçalho do artigo: botão voltar, título, categorias, data e ações */}
      <header className="py-5 bg-white border-bottom border-light">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              
              {/* Navegação de retorno à listagem de notícias */}
              <button
                type="button"
                onClick={() => navigate('/noticias')}
                className="btn btn-link text-decoration-none text-primary p-0 d-flex align-items-center gap-2 mb-4 fw-semibold"
              >
                <FaArrowLeft/>
                Voltar
              </button>

              {/* Título do artigo */}
              <h1 className="fw-bolder text-dark mb-4">
                {article.title}
              </h1>

              {/* Categorias associadas ao artigo */}
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

              {/* Barra de metadados (data) e ações (partilha e impressão) */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 border-top border-light pt-4 mt-4">
                
                {/* Data de publicação */}
                <div className="d-flex align-items-center gap-2 text-secondary">
                  <FaCalendarAlt />
                  <span className="fw-medium">{formatDate(article.date)}</span>
                </div>

                {/* Ações: partilha social e impressão */}
                <div className="d-flex flex-wrap align-items-center gap-3">
                  {/* Componente reutilizável de partilha social */}
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

      {/* Imagem principal do artigo */}
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

      {/* Corpo do artigo */}
      <section className="pb-5">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              
              {/* Conteúdo HTML injetado — proveniente do editor do backoffice */}
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