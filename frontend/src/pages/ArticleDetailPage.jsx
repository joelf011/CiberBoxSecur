import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArticleContent from '../components/News/ArticleContent';
import LayoutWebsite from '../components/LayoutWebsite';
import { articlesApi } from '../api/articlesApi';
import { Spinner } from 'react-bootstrap';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper para construir o URL da imagem
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200';
    if (path.startsWith('http')) return path;
    
    const baseUrl = 'http://localhost:5000';
    return `${baseUrl}/${path}`;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const dbArticle = await articlesApi.getArticleBySlug(slug);
        
        // Transformar os dados da BD
        const formattedArticle = {
          title: dbArticle.title,
          categories: dbArticle.Categories ? dbArticle.Categories.map(cat => cat.name) : [],
          date: dbArticle.published_date || dbArticle.createdAt,
          image: getImageUrl(dbArticle.cover_image),
          content: dbArticle.content_body,
          summary: dbArticle.summary
        };

        setArticle(formattedArticle);
      } catch (err) {
        console.error(err);
        setError('Não foi possível encontrar a notícia.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <LayoutWebsite>
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">A carregar o artigo...</p>
        </div>
      </LayoutWebsite>
    );
  }

  if (error || !article) {
    return (
      <LayoutWebsite>
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
          <h1 className="display-1 text-muted fw-bold mb-3">404</h1>
          <h2 className="h4 text-dark mb-4">{error || 'Artigo não encontrado'}</h2>
          <Link to="/noticias" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
            Voltar às Notícias
          </Link>
        </div>
      </LayoutWebsite>
    );
  }

  return (
    <LayoutWebsite>
      <div className="bg-light min-vh-100 d-flex flex-column">
        <main className="flex-grow-1">
          <ArticleContent article={article} />
        </main>
      </div>
    </LayoutWebsite>
  );
};

export default ArticleDetailPage;