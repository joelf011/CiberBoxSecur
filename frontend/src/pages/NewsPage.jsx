import React, { useState, useEffect } from "react";
import { Spinner, Alert, Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import FeaturedNewsCard from "../components/News/FeaturedNewsCard";
import NewsArticleCard from "../components/News/NewsArticleCard";
import LayoutWebsite from "../components/LayoutWebsite";
import { articlesApi } from "../api/articlesApi";
import { categoriesApi } from "../api/categoriesApi"; 

const NewsPage = () => {
  // --- Estados de Artigos ---
  const [featuredData, setFeaturedData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  
  // --- Estados de Filtros ---
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Estados para a Pesquisa em Tempo Real
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Guarda o valor após o utilizador parar de escrever
  
  // --- Estados de Feedback ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 6;

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'; 
    if (path.startsWith('http')) return path;
    const baseUrl = 'http://localhost:5000';
    return `${baseUrl}/${path}`;
  };

  const formatArticle = (dbArticle) => ({
    id: dbArticle.id,
    slug: dbArticle.slug,
    title: dbArticle.title,
    categories: dbArticle.Categories && dbArticle.Categories.length > 0 
      ? dbArticle.Categories.map(cat => cat.name) 
      : ["Notícia"],
    excerpt: dbArticle.summary || "Sem resumo disponível.",
    date: dbArticle.published_date || dbArticle.createdAt,
    image: getImageUrl(dbArticle.cover_image)
  });

  // 1. Carregar as categorias disponíveis para o Dropdown
  useEffect(() => {
    categoriesApi.getAllCategories()
      .then(setCategoriesList)
      .catch(() => console.error("Erro ao carregar categorias"));
  }, []);

  // 2. Lógica do DEBOUNCE (Pesquisa em Tempo Real)
  useEffect(() => {
    // Define um temporizador: só atualiza a pesquisa real se o utilizador parar de escrever durante 500ms
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    // Se o utilizador escrever outra letra antes dos 500ms, limpa o temporizador anterior
    return () => clearTimeout(handler);
  }, [searchInput]);

  // 3. Carregar os artigos
  const loadData = async (currentOffset, category = selectedCategory, search = debouncedSearch) => {
    if (currentOffset === 0) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      const response = await articlesApi.getPublicArticles(limit, currentOffset, category, search);

      if (currentOffset === 0) {
        setFeaturedData(response.featured ? formatArticle(response.featured) : null);
        setArticles(response.newsGrid.map(formatArticle));
      } else {
        setArticles(prev => [...prev, ...response.newsGrid.map(formatArticle)]);
      }

      setTotal(response.total);
    } catch (err) {
      setError('Não foi possível carregar as notícias. ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Atualizar sempre que a Categoria ou a Pesquisa Debounced mudam
  useEffect(() => {
    setOffset(0);
    loadData(0, selectedCategory, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch]);

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    loadData(nextOffset, selectedCategory, debouncedSearch);
  };

  const isFiltering = selectedCategory || debouncedSearch;

  return (
    <LayoutWebsite>
      <div className="container py-5 animate-fade-in">
        
        {/* --- BARRA DE PESQUISA E FILTROS --- */}
        <div className=" mb-5">
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-white text-muted border-end-0">
                  <FontAwesomeIcon icon={faFilter} />
                </InputGroup.Text>
                <Form.Select 
                  className="border-start-0 bg-white shadow-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas as Categorias</option>
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text className="bg-white text-muted border-end-0">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Comece a escrever para pesquisar artigos..."
                  className="shadow-none border-start-0"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Mostrar indicação visual se houver filtros ativos para o utilizador poder limpar */}
          {isFiltering && (
            <div className="mt-3 pt-3 border-top small text-muted d-flex align-items-center">
              <span className="me-2 fw-semibold">A filtrar por:</span>
              {debouncedSearch && <span className="badge bg-primary bg-opacity-10 text-primary border border-primary me-2">"{debouncedSearch}"</span>}
              {selectedCategory && (
                <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">
                  {categoriesList.find(c => c.id == selectedCategory)?.name || 'Categoria'}
                </span>
              )}
              <Button 
                variant="link" 
                className="p-0 ms-auto text-danger text-decoration-none fw-semibold" 
                onClick={() => { setSelectedCategory(''); setSearchInput(''); setDebouncedSearch(''); }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>

        {/* RENDERIZAÇÃO DE ESTADOS */}
        {isLoading && offset === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5 className="text-muted">A procurar artigos...</h5>
          </div>
        ) : error ? (
          <Alert variant="danger" className="rounded-4 border-0 shadow-sm mt-4 text-center p-5">
            <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="mb-3 text-danger" />
            <h4>Ups! Algo correu mal.</h4>
            <p className="mb-0">{error}</p>
          </Alert>
        ) : (
          <>
            {/* Notícia em Destaque (Só aparece se NÃO estivermos a filtrar) */}
            {featuredData && !isFiltering && <FeaturedNewsCard article={featuredData} />}

            {/* Grelha de Notícias */}
            <div className="row g-4 mt-2">
              {articles.map((article) => (
                <div className="col-12 col-md-6 col-lg-4" key={article.id}>
                  <NewsArticleCard article={article} />
                </div>
              ))}
              
              {articles.length === 0 && isFiltering && (
                <div className="col-12 text-center text-muted py-5 border rounded-4 bg-light">
                  <h5 className="fw-bold mb-2">Sem resultados</h5>
                  <p className="mb-0">Não encontrámos artigos que correspondam à sua pesquisa.</p>
                </div>
              )}

              {articles.length === 0 && !featuredData && !isFiltering && (
                <div className="col-12 text-center text-muted py-5 border rounded-4 bg-light">
                  <h5 className="fw-bold mb-2">Sem notícias disponíveis</h5>
                  <p className="mb-0">Ainda não existem artigos publicados. Fique atento às novidades!</p>
                </div>
              )}
            </div>

            {/* Botão Carregar Mais */}
            {articles.length < total && (
              <div className="d-flex justify-content-center mt-5">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="btn btn-outline-primary fw-semibold px-5 py-2 rounded-pill shadow-sm"
                >
                  {isLoading ? <Spinner size="sm" /> : 'Carregar Mais Notícias'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutWebsite>
  );
};

export default NewsPage;