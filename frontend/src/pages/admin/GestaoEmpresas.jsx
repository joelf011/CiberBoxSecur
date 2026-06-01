import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Row, Col, Form, InputGroup, Badge, Pagination, Spinner, Alert, Modal, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit, faTrash, faBuilding, faRefresh, faPhone, faUserTie, faUserShield } from "@fortawesome/free-solid-svg-icons";

import { companiesApi } from '../../api/companiesApi'; 
import { usersApi } from '../../api/usersApi';
import { Alerts } from '../../utils/Alerts';

const GestaoEmpresas = () => {
  // Estados Globais
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados Modal e Formulário
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', nif: '', phone: '', address: '',
    client_owner_id: '', emergency_admin_id: '', assigned_admins: []
  });

  // Estados das Barras de Pesquisa no Modal
  const [clientSearch, setClientSearch] = useState('');
  const [sosSearch, setSosSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  // Fechar Modal
  const handleClose = () => {
    setShowModal(false);
    setEditingCompanyId(null);
  };

  // Abrir Modal para Criar
  const handleShow = () => {
    setEditingCompanyId(null);
    setFormData({ name: '', nif: '', phone: '', address: '', client_owner_id: '', emergency_admin_id: '', assigned_admins: [] });
    setClientSearch(''); setSosSearch(''); setAdminSearch('');
    setShowModal(true);
  };

  // Abrir Modal para Editar
  const handleEditClick = (company) => {
    setEditingCompanyId(company.id);
    setFormData({ 
      name: company.name, nif: company.nif, phone: company.phone || '', address: company.address || '',
      client_owner_id: company.client_owner_id || '',
      emergency_admin_id: company.emergency_admin_id || '',
      assigned_admins: company.AssignedAdmins?.map(admin => admin.id) || []
    });
    setClientSearch(''); setSosSearch(''); setAdminSearch('');
    setShowModal(true);
  };

  // Toggle para múltiplos Gestores (Checkboxes)
  const handleToggleAdmin = (adminId) => {
    setFormData(prev => ({
      ...prev,
      assigned_admins: prev.assigned_admins.includes(adminId) 
        ? prev.assigned_admins.filter(id => id !== adminId) 
        : [...prev.assigned_admins, adminId]
    }));
  };

  // Carregar Dados da API
  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const [companiesData, usersData] = await Promise.all([
        companiesApi.getCompanies(),
        usersApi.getUsers()
      ]);
      setCompanies(companiesData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Ações de Tabela e Formulário
  const handleToggleStatus = async (company) => {
    try {
      const newStatus = !company.is_active;
      await companiesApi.updateCompany(company.id, { ...company, is_active: newStatus });
      setCompanies(companies.map(c => c.id === company.id ? { ...c, is_active: newStatus } : c));
      Alerts.success(`Empresa ${newStatus ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (err) { Alerts.error(`Erro: ${err.message}`); }
  };

  const handleDelete = async (companyId) => {
    const result = await Alerts.confirmDelete("Vais eliminar esta empresa. Todos os utilizadores associados poderão perder o acesso!");
    if (result.isConfirmed) {
      try {
        await companiesApi.deleteCompany(companyId);
        setCompanies(companies.filter(c => c.id !== companyId));
        Alerts.success("Empresa eliminada com sucesso!");
      } catch (err) { Alerts.error(`Erro: ${err.message}`); }
    }
  };

  const handleSubmitCompany = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCompanyId) {
        await companiesApi.updateCompany(editingCompanyId, formData);
        Alerts.success("Empresa atualizada com sucesso!");
      } else {
        await companiesApi.createCompany(formData);
        Alerts.success("Empresa criada com sucesso!");
      }
      handleClose(); fetchData(); 
    } catch (err) { Alerts.error(`Erro ao guardar: ${err.message}`);
    } finally { setIsSubmitting(false); }
  };

  // --- FILTROS DE PESQUISA (Tabela Principal) ---
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(company.nif).includes(searchTerm)
  );

  // --- LÓGICA DE FILTRAGEM DE CONTAS ATIVAS NO MODAL ---
  const activeAdminUsers = users.filter(u => 
    (u.role_id === 1 || u.role_id === 2) && 
    (u.is_active || formData.emergency_admin_id === u.id || formData.assigned_admins.includes(u.id))
  ); 

  const activeClientUsers = users.filter(u => 
    (u.role_id === 3 || !u.role_id) && 
    (u.is_active || formData.client_owner_id === u.id)
  ); 

  const searchedClients = activeClientUsers.filter(u => u.name.toLowerCase().includes(clientSearch.toLowerCase()) || u.email.toLowerCase().includes(clientSearch.toLowerCase()));
  const searchedSOS = activeAdminUsers.filter(u => u.name.toLowerCase().includes(sosSearch.toLowerCase()));
  const searchedAdmins = activeAdminUsers.filter(u => u.name.toLowerCase().includes(adminSearch.toLowerCase()));

  return (
    <div className="animate-fade-in py-2">
      {/* CABEÇALHO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faBuilding} className="text-primary me-2" /> Gestão de Empresas
          </h2>
          <p className="text-muted small">Controlo e estado das empresas.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="rounded-3 border" onClick={fetchData} title="Recarregar dados">
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
          <Button variant="primary" className="rounded-3 border-0 fw-bold d-flex align-items-center gap-2 shadow-sm" onClick={handleShow}>
            <FontAwesomeIcon icon={faPlus} /> Adicionar Empresa
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS PRINCIPAL */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col md={6} lg={4}>
              <InputGroup className="bg-light rounded-3 border-0 px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Pesquisar por nome ou NIF..."
                  className="bg-transparent border-0 shadow-none py-2"
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
          <span className="text-muted">A ligar ao servidor...</span>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
          <strong>Erro de Ligação:</strong> {error}
        </Alert>
      ) : (
        /* TABELA DE EMPRESAS */
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                <tr>
                  <th className="px-4 py-3 text-muted">Empresa (NIF)</th>
                  <th className="py-3 text-muted">Cliente</th>
                  <th className="py-3 text-muted">Contacto SOS (Ciberbox)</th>
                  <th className="py-3 text-muted">Estado</th>
                  <th className="px-4 py-3 text-muted text-end">Ações</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Nenhuma empresa encontrada.</td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td className="px-4 py-3">
                        <div className="fw-bold text-dark">{company.name}</div>
                        <div className="text-muted small">NIF: {company.nif}</div>
                      </td>
                      <td className="py-3">
                        {company.ClientOwner ? (
                          <div>
                            <span className="fw-medium text-dark">{company.ClientOwner.name}</span>
                            <div className="text-muted small"><FontAwesomeIcon icon={faPhone} className="me-1" /> {company.ClientOwner.phone || 'Sem telefone'}</div>
                          </div>
                        ) : (
                          <span className="text-muted fst-italic">Não atribuído</span>
                        )}
                      </td>
                      <td className="py-3">
                        {company.EmergencyAdmin ? (
                          <div>
                            <span className="fw-medium text-dark">{company.EmergencyAdmin.name}</span>
                            <div className="text-muted small"><FontAwesomeIcon icon={faPhone} className="me-1" /> {company.EmergencyAdmin.phone || 'Sem telefone'}</div>
                          </div>
                        ) : (
                          <span className="text-muted fst-italic">Sem SOS definido</span>
                        )}
                      </td>
                      <td className="py-3">
                        <Form.Check 
                          type="switch" id={`switch-${company.id}`} checked={company.is_active}
                          onChange={() => handleToggleStatus(company)}
                          label={<Badge bg={company.is_active ? 'success' : 'danger'} className="fw-normal bg-opacity-75 ms-2 text-white">{company.is_active ? 'Ativa' : 'Suspensa'}</Badge>}
                        />
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="me-2 text-primary shadow-sm border" onClick={() => handleEditClick(company)}><FontAwesomeIcon icon={faEdit} /></Button>
                        <Button variant="light" size="sm" className="text-danger shadow-sm border" onClick={() => handleDelete(company.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* MODAL ADICIONAR / EDITAR EMPRESA */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered backdrop="static" className="modal-dialog-scrollable">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-bold">
            {editingCompanyId ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form id="companyForm" onSubmit={handleSubmitCompany}>
            
            <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">Dados da Entidade</h6>
            <Row className="g-3 mb-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Designação Social</Form.Label>
                  <Form.Control type="text" placeholder="Ex: Tech Solutions, Lda" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">NIF / Identificação</Form.Label>
                  <Form.Control type="number" placeholder="Ex: 501234567" required value={formData.nif} onChange={(e) => setFormData({...formData, nif: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Telefone de Contacto</Form.Label>
                  <Form.Control type="text" placeholder="Ex: +351 210 000 000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Morada / Sede</Form.Label>
                  <Form.Control type="text" placeholder="Ex: Rua Central, Lote 1" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">Estrutura e Acessos</h6>
            <Row className="g-3">
              
              {/* PESQUISA DE CLIENTE */}
              <Col md={6}>
                <Form.Label className="small fw-bold text-secondary">Dono / Representante Legal</Form.Label>
                <Card className="shadow-none border border-secondary border-opacity-25 rounded-3">
                  <Card.Header className="p-0 border-bottom-0 bg-white rounded-top-3">
                    <InputGroup size="sm">
                      <InputGroup.Text className="bg-transparent border-0 text-muted px-3"><FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
                      <Form.Control className="bg-transparent border-0 shadow-none py-2" placeholder="Pesquisar cliente ativo..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} />
                    </InputGroup>
                  </Card.Header>
                  <div style={{ maxHeight: '160px', overflowY: 'auto' }} className="border-top custom-scrollbar">
                    <ListGroup variant="flush">
                      <ListGroup.Item action as="button" type="button" className={`py-2 ${formData.client_owner_id === '' ? 'active bg-primary' : ''}`} onClick={() => setFormData({...formData, client_owner_id: ''})}>
                        <small className={formData.client_owner_id === '' ? 'text-white' : 'text-muted'}>Nenhum Cliente Atribuído</small>
                      </ListGroup.Item>
                      {searchedClients.map(user => (
                        <ListGroup.Item action as="button" type="button" key={user.id} className={`py-2 d-flex align-items-center ${formData.client_owner_id === user.id ? 'active bg-primary border-primary' : ''}`} onClick={() => setFormData({...formData, client_owner_id: user.id})}>
                          <FontAwesomeIcon icon={faUserTie} className={`me-2 ${formData.client_owner_id === user.id ? 'text-white' : 'text-secondary opacity-50'}`} />
                          <div className="w-100 text-start">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-medium small">{user.name}</span>
                              {!user.is_active && <Badge bg="danger" className="bg-opacity-75 small fw-normal" style={{ fontSize: '0.6rem' }}>Inativo</Badge>}
                            </div>
                            <div className="small opacity-75" style={{ fontSize: '0.70rem', lineHeight: '1' }}>{user.email}</div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Card>
              </Col>
              
              {/* PESQUISA DE CONTACTO SOS */}
              <Col md={6}>
                <Form.Label className="small fw-bold text-danger">Contacto de Emergência (SOS)</Form.Label>
                <Card className="shadow-none border border-danger border-opacity-25 rounded-3">
                  <Card.Header className="p-0 border-bottom-0 bg-white rounded-top-3">
                    <InputGroup size="sm">
                      <InputGroup.Text className="bg-transparent border-0 text-muted px-3"><FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
                      <Form.Control className="bg-transparent border-0 shadow-none py-2" placeholder="Pesquisar gestor ativo..." value={sosSearch} onChange={e => setSosSearch(e.target.value)} />
                    </InputGroup>
                  </Card.Header>
                  <div style={{ maxHeight: '160px', overflowY: 'auto' }} className="border-top custom-scrollbar">
                    <ListGroup variant="flush">
                      <ListGroup.Item action as="button" type="button" className={`py-2 ${formData.emergency_admin_id === '' ? 'active bg-danger border-danger' : ''}`} onClick={() => setFormData({...formData, emergency_admin_id: ''})}>
                        <small className={formData.emergency_admin_id === '' ? 'text-white' : 'text-muted'}>Sem SOS Definido</small>
                      </ListGroup.Item>
                      {searchedSOS.map(user => (
                        <ListGroup.Item action as="button" type="button" key={user.id} className={`py-2 d-flex align-items-center ${formData.emergency_admin_id === user.id ? 'active bg-danger border-danger' : ''}`} onClick={() => setFormData({...formData, emergency_admin_id: user.id})}>
                          <FontAwesomeIcon icon={faUserShield} className={`me-2 ${formData.emergency_admin_id === user.id ? 'text-white' : 'text-danger opacity-50'}`} />
                          <div className="w-100 text-start">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-medium small">{user.name}</span>
                              {!user.is_active && <Badge bg="danger" className="bg-opacity-75 small fw-normal" style={{ fontSize: '0.6rem' }}>Inativo</Badge>}
                            </div>
                            <div className="small opacity-75" style={{ fontSize: '0.70rem', lineHeight: '1' }}>{user.phone || 'Sem telemóvel registado'}</div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Card>
              </Col>

              {/* MÚLTIPLOS GESTORES (LISTA DE UTILIZADORES ADMINS) */}
              <Col xs={12} className="mt-4">
                <Card className="shadow-none border border-secondary border-opacity-25 rounded-3 overflow-hidden">
                  <Card.Header className="bg-light p-3 d-flex justify-content-between align-items-center border-bottom">
                    <div>
                      <h6 className="mb-0 fw-bold text-dark fs-6">Gestores Cibersecur Alocados</h6>
                      <small className="text-muted">Selecione os utilizadores da sua equipa técnica que vão gerir esta empresa.</small>
                    </div>
                    <Badge bg="primary" className="fs-6 px-3 py-2 rounded-pill shadow-sm">{formData.assigned_admins.length} selecionados</Badge>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="bg-white p-2 border-bottom">
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-transparent border-0 text-muted"><FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
                        <Form.Control className="bg-transparent border-0 shadow-none" placeholder="Filtrar equipa por nome..." value={adminSearch} onChange={e => setAdminSearch(e.target.value)} />
                      </InputGroup>
                    </div>
                    <div className="p-3 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {searchedAdmins.length === 0 ? (
                        <div className="text-center text-muted small fst-italic py-3">Nenhum utilizador disponível com esse nome.</div>
                      ) : (
                        <Row className="g-3">
                          {searchedAdmins.map(admin => (
                            <Col md={6} lg={4} key={admin.id}>
                              <Card className={`border h-100 shadow-sm cursor-pointer ${formData.assigned_admins.includes(admin.id) ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-white'}`} onClick={() => handleToggleAdmin(admin.id)} style={{ cursor: 'pointer' }}>
                                <Card.Body className="p-2 d-flex align-items-center">
                                  <Form.Check type="checkbox" id={`admin-${admin.id}`} checked={formData.assigned_admins.includes(admin.id)} onChange={() => {}} className="me-2 fs-5 pointer-events-none" />
                                  <div className="w-100 overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-center gap-1">
                                      <span className="small fw-bold text-dark lh-sm text-truncate">{admin.name}</span>
                                      {!admin.is_active && <Badge bg="danger" className="bg-opacity-75 p-1 fw-normal" style={{ fontSize: '0.55rem' }}>Inativo</Badge>}
                                    </div>
                                    <div className="text-muted text-truncate" style={{ fontSize: '0.65rem' }}>{admin.email}</div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 mt-3">
          <Button variant="light" onClick={handleClose} className="border shadow-sm px-4">Cancelar</Button>
          <Button variant="primary" type="submit" form="companyForm" className="shadow-sm fw-bold px-4" disabled={isSubmitting}>
            {isSubmitting ? 'A guardar...' : (editingCompanyId ? 'Guardar Alterações' : 'Registar Empresa')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestaoEmpresas;