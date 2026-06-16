import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Spinner, Modal, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faNewspaper, faImage, faTags, faSearch, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { articlesApi } from '../../api/articlesApi';
import { categoriesApi } from '../../api/categoriesApi';
import { Alerts } from '../../utils/Alerts';

const GestaoNoticias = () => {
  // --- Estados Globais ---
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- Estados do Modal de Artigos ---
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', summary: '', content_body: '', status: 'Draft', published_date: '', category_ids: []
  });

  // --- Estados do Modal de Categorias ---
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  
  // Verificação de permissões do utilizador logado
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasCategoryPermission = loggedInUser.permissions?.includes('CREATE_CATEGORY') || loggedInUser.Role?.name === 'ADMIN';

  // --- Carregamento Inicial ---
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [articlesData, categoriesData] = await Promise.all([
        articlesApi.getAllAdminArticles(),
        categoriesApi.getAllCategories()
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Erro ao carregar os dados das notícias.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // LÓGICA DE ARTIGOS
  // ==========================================
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const autoSlug = newTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title: newTitle, slug: autoSlug });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({ ...formData, category_ids: selectedOptions });
  };

  const handleOpenArticleModal = (article = null) => {
    if (article) {
      setIsEditingArticle(true);
      setCurrentArticleId(article.id);
      setFormData({
        title: article.title,
        slug: article.slug,
        summary: article.summary || '',
        content_body: article.content_body || '',
        status: article.status,
        published_date: article.published_date || '',
        category_ids: article.Categories ? article.Categories.map(cat => cat.id) : [] 
      });
    } else {
      setIsEditingArticle(false);
      setCurrentArticleId(null);
      setFormData({ title: '', slug: '', summary: '', content_body: '', status: 'Draft', published_date: '', category_ids: [] });
    }
    setImageFile(null);
    setShowArticleModal(true);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('slug', formData.slug);
      submitData.append('summary', formData.summary);
      submitData.append('content_body', formData.content_body);
      submitData.append('status', formData.status);
      submitData.append('category_ids', JSON.stringify(formData.category_ids)); 
      
      if (formData.published_date) submitData.append('published_date', formData.published_date);
      if (imageFile) submitData.append('cover_image', imageFile);

      if (isEditingArticle) {
        await articlesApi.updateArticle(currentArticleId, submitData);
        Alerts.success('Artigo atualizado com sucesso!');
      } else {
        await articlesApi.createArticle(submitData);
        Alerts.success('Novo artigo criado com sucesso!');
      }
      
      setShowArticleModal(false);
      fetchData();
    } catch (error) {
      Alerts.error(error.response?.data?.error || 'Erro ao guardar o artigo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArticleDelete = async (id) => {
    const result = await Alerts.confirmDelete("Vais eliminar este artigo. Esta ação é irreversível!");
    if (result.isConfirmed) {
      try {
        await articlesApi.deleteArticle(id);
        Alerts.success('Artigo eliminado com sucesso!');
        fetchData();
      } catch (error) {
        Alerts.error('Erro ao eliminar o artigo.');
      }
    }
  };

  // ==========================================
  // LÓGICA DE CATEGORIAS
  // ==========================================
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryName('');
    setEditingCategoryId(null);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategoryId) {
        await categoriesApi.updateCategory(editingCategoryId, { name: categoryName });
        Alerts.success('Categoria atualizada!');
      } else {
        await categoriesApi.createCategory({ name: categoryName });
        Alerts.success('Categoria criada!');
      }
      setCategoryName('');
      setEditingCategoryId(null);
      const updatedCategories = await categoriesApi.getAllCategories();
      setCategories(updatedCategories);
    } catch (error) {
      Alerts.error(error.response?.data?.error || 'Erro ao guardar a categoria.');
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
  };

  const handleDeleteCategory = async (id) => {
    const result = await Alerts.confirmDelete("Apagar esta categoria irá removê-la de todos os artigos associados.");
    if (result.isConfirmed) {
      try {
        await categoriesApi.deleteCategory(id);
        Alerts.success('Categoria apagada com sucesso!');
        const updatedCategories = await categoriesApi.getAllCategories();
        setCategories(updatedCategories);
        fetchData(); 
      } catch (error) {
        Alerts.error('Erro ao apagar a categoria.');
      }
    }
  };

  // --- FILTROS DE PESQUISA ---
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in py-2">
      {/* CABEÇALHO DA PÁGINA */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faNewspaper} className="text-primary me-2" /> Gestão de Notícias
          </h2>
          <p className="text-muted small">Crie, edite e publique artigos no website principal.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="rounded-3 border" onClick={fetchData} title="Recarregar dados">
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
          {hasCategoryPermission && (
            <Button variant="outline-secondary" className="rounded-3 fw-bold shadow-sm bg-white" onClick={() => setShowCategoryModal(true)}>
              <FontAwesomeIcon icon={faTags} className="me-2" /> Categorias
            </Button>
          )}
          <Button variant="primary" className="rounded-3 border-0 fw-bold d-flex align-items-center gap-2 shadow-sm" onClick={() => handleOpenArticleModal()}>
            <FontAwesomeIcon icon={faPlus} /> Novo Artigo
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col md={6} lg={4}>
              <InputGroup className="bg-light rounded-3 border-0 px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Pesquisar por título do artigo..."
                  className="bg-transparent border-0 shadow-none py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ERRO OU CARREGAMENTO */}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" className="me-2" />
          <span className="text-muted">A carregar artigos...</span>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
          <strong>Erro de Ligação:</strong> {error}
        </Alert>
      ) : (
        /* TABELA DE ARTIGOS */
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <tr>
                  <th className="px-4 py-3 text-muted">ID / Data</th>
                  <th className="py-3 text-muted">Título</th>
                  <th className="py-3 text-muted">Categorias</th>
                  <th className="py-3 text-muted">Estado</th>
                  <th className="px-4 py-3 text-muted text-end">Ações</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {filteredArticles.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">Nenhum artigo encontrado.</td></tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-4 py-3 font-monospace text-muted">
                        <div className="fw-bold text-dark">#{article.id}</div>
                        <small style={{ fontSize: '0.75rem' }}>
                          {new Date(article.createdAt).toLocaleDateString('pt-PT')}
                        </small>
                      </td>
                      <td className="py-3 fw-medium text-dark">{article.title}</td>
                      <td className="py-3">
                        {article.Categories && article.Categories.length > 0 ? (
                          article.Categories.map(cat => (
                             <Badge key={cat.id} bg="light" text="primary" className="me-1 border border-primary">{cat.name}</Badge>
                          ))
                        ) : (
                          <span className="text-muted small fst-italic">Sem categoria</span>
                        )}
                      </td>
                      <td className="py-3">
                        {article.status === 'Published' 
                          ? <Badge bg="success" className="bg-opacity-75 fw-normal">Publicado</Badge> 
                          : <Badge bg="secondary" className="bg-opacity-75 fw-normal">Rascunho</Badge>
                        }
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="me-2 text-primary shadow-sm border" onClick={() => handleOpenArticleModal(article)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="light" size="sm" className="text-danger shadow-sm border" onClick={() => handleArticleDelete(article.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* ========================================== */}
      {/* MODAL 1: CRIAR/EDITAR ARTIGO                 */}
      {/* ========================================== */}
      <Modal show={showArticleModal} onHide={() => setShowArticleModal(false)} size="lg" centered backdrop="static" className="modal-dialog-scrollable">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-bold">{isEditingArticle ? 'Editar Artigo' : 'Novo Artigo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form id="articleForm" onSubmit={handleArticleSubmit}>
            
            <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">Informações Gerais</h6>
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Título do Artigo</Form.Label>
                  <Form.Control type="text" required value={formData.title} onChange={handleTitleChange} placeholder="Ex: Nova Diretiva de Segurança..." />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Slug (URL amigável)</Form.Label>
                  <Form.Control type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="nova-diretiva" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Data de Publicação</Form.Label>
                  <Form.Control type="date" value={formData.published_date} onChange={(e) => setFormData({...formData, published_date: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">Classificação e Imagem</h6>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Estado de Publicação</Form.Label>
                  <Form.Select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="Draft">Rascunho (Oculto)</option>
                    <option value="Published">Publicado (Visível no site)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Categorias <span className="text-muted fw-normal">(Ctrl+Click)</span></Form.Label>
                  <Form.Select multiple value={formData.category_ids} onChange={handleCategoryChange} style={{ height: '70px' }}>
                    {categories.length === 0 && <option disabled>Sem categorias criadas</option>}
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary"><FontAwesomeIcon icon={faImage} className="me-2"/>Imagem de Capa</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">Conteúdo Escrito</h6>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Resumo Corto (Excerto)</Form.Label>
                  <Form.Control as="textarea" rows={2} value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Conteúdo Completo</Form.Label>
                  <Form.Control as="textarea" rows={6} value={formData.content_body} onChange={(e) => setFormData({...formData, content_body: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 mt-3">
          <Button variant="light" onClick={() => setShowArticleModal(false)} className="border shadow-sm px-4">Cancelar</Button>
          <Button variant="primary" type="submit" form="articleForm" className="shadow-sm fw-bold px-4" disabled={isSubmitting}>
            {isSubmitting ? 'A guardar...' : (isEditingArticle ? 'Guardar Alterações' : 'Publicar Artigo')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ========================================== */}
      {/* MODAL 2: GERIR CATEGORIAS                    */}
      {/* ========================================== */}
      <Modal show={showCategoryModal} onHide={handleCloseCategoryModal} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-bold">Gerir Categorias</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form onSubmit={handleSaveCategory} className="mb-4 bg-light p-3 rounded-3 border">
            <Form.Label className="small fw-bold text-secondary">{editingCategoryId ? 'Editar Categoria' : 'Nova Categoria'}</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control type="text" placeholder="Nome da Categoria..." value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
              <Button type="submit" variant={editingCategoryId ? "success" : "primary"}>
                {editingCategoryId ? "Guardar" : "Adicionar"}
              </Button>
              {editingCategoryId && (
                <Button variant="outline-secondary" onClick={() => { setEditingCategoryId(null); setCategoryName(''); }}>Cancelar</Button>
              )}
            </div>
          </Form>

          <h6 className="fw-bold text-secondary mb-3">Categorias Existentes</h6>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }} className="custom-scrollbar border rounded-3">
            <ul className="list-group list-group-flush">
              {categories.length === 0 && (
                <li className="list-group-item text-muted text-center py-4 bg-light fst-italic">Nenhuma categoria criada.</li>
              )}
              {categories.map(cat => (
                <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="fw-medium text-dark">{cat.name}</span>
                  <div>
                    <Button variant="light" size="sm" className="text-primary border shadow-sm me-2" onClick={() => handleEditCategory(cat)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="light" size="sm" className="text-danger border shadow-sm" onClick={() => handleDeleteCategory(cat.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default GestaoNoticias;