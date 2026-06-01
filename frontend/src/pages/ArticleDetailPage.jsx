import React from 'react';
import ArticleContent from '../components/News/ArticleContent';

const ArticleDetailPage = () => {
  // TODO - Read URL ID and load from DB
  const mockArticle = {
    title: "Como a Diretiva NIS2 Vai Transformar a Segurança Empresarial",
    categories: ["Legislação", "Cibersegurança"],
    date: "2026-04-16",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p class="fs-5 lh-lg text-secondary mb-4">A nova Diretiva Europeia NIS2 representa a mudança mais significativa na legislação de cibersegurança da última década.</p>
      <h3 class="fw-bold text-dark mt-5 mb-4">O Que Muda na Prática?</h3>
      <p class="text-secondary lh-lg mb-4">O âmbito foi alargado para incluir médias e grandes empresas de setores cruciais.</p>
    `
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <ArticleContent article={mockArticle} />
      </main>
    </div>
  );
};

export default ArticleDetailPage;