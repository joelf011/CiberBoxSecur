import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Pagination, Spinner, Alert, Modal, Form, Accordion, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faPlus, faEdit, faTrash, faRefresh, faCheckDouble, faTimes } from "@fortawesome/free-solid-svg-icons";
import { rolesApi } from '../../api/rolesApi';
import { Alerts } from '../../utils/Alerts';

// AGRUPAMENTO
const moduleMapping = {
  'USER': 'Gestão de Utilizadores', 'USERS': 'Gestão de Utilizadores',
  'ROLE': 'Cargos e Permissões', 'ROLES': 'Cargos e Permissões',
  'PERMISSION': 'Cargos e Permissões', 'PERMISSIONS': 'Cargos e Permissões',
  'COMPANY': 'Gestão de Empresas', 'COMPANIES': 'Gestão de Empresas',
  'TICKET': 'Suporte Técnico', 'TICKETS': 'Suporte Técnico', 'CHAT': 'Suporte Técnico',
  'INCIDENT': 'Gestão de Incidentes', 'INCIDENTS': 'Gestão de Incidentes',
  'ASSET': 'Gestão de Ativos', 'ASSETS': 'Gestão de Ativos',
  'DOCUMENT': 'Gestão de Documentos', 'DOCUMENTS': 'Gestão de Documentos',
  'ARTICLE': 'Publicações e Notícias', 'ARTICLES': 'Publicações e Notícias', 'CATEGORY': 'Publicações e Notícias',
  'REPORT': 'Relatórios e Conformidade', 'REPORTS': 'Relatórios e Conformidade',
  'AUDIT_LOGS': 'Auditoria de Segurança'
};

const actionTranslation = {
  'CREATE': 'Criar', 'VIEW': 'Visualizar', 'UPDATE': 'Editar', 
  'DELETE': 'Eliminar', 'RESTORE': 'Restaurar', 'MANAGE': 'Gerir Tudo', 'USE': 'Utilizar'
};

const GestaoCargos = () => {
  // Estados da Página
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados do Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Dados do Formulário
  const [roleName, setRoleName] = useState('');
  const [selectedPermsIds, setSelectedPermsIds] = useState([]); // Array de IDs ativados

  // Carregar dados
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rolesData, permsData] = await Promise.all([
        rolesApi.getRoles(),
        rolesApi.getPermissions()
      ]);
      setRoles(rolesData);
      setAllPermissions(permsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Agrupamento
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const parts = perm.name.split('_');
    const action = parts[0]; 
    const entity = parts.slice(1).join('_');
    
    const moduleName = moduleMapping[entity] || 'Outras Permissões';
    const translatedAction = actionTranslation[action] || action;

    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push({ ...perm, actionName: translatedAction });
    return acc;
  }, {});

  // Modal
  const handleCreateClick = () => {
    setSelectedRole(null);
    setRoleName('');
    setSelectedPermsIds([]);
    setShowModal(true);
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setRoleName(role.name);
    // Preenche o array com os IDs das permissões que o cargo já tem
    setSelectedPermsIds(role.Permissions?.map(p => p.id) || []);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Checkboxes
  const handleTogglePermission = (permId) => {
    setSelectedPermsIds(prev => 
      prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
    );
  };

  // Selecionar tudo
  const handleToggleModule = (modulePerms) => {
    const moduleIds = modulePerms.map(p => p.id);
    const allSelected = moduleIds.every(id => selectedPermsIds.includes(id));

    if (allSelected) {
      // Remove todos os IDs
      setSelectedPermsIds(prev => prev.filter(id => !moduleIds.includes(id)));
    } else {
      // Adiciona os que faltam
      setSelectedPermsIds(prev => [...new Set([...prev, ...moduleIds])]);
    }
  };

  // Guardar na bd
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPermsIds.length === 0) return Alerts.error('O cargo tem de ter pelo menos uma permissão.');
    
    setIsSubmitting(true);
    const payload = { name: roleName, permissions: selectedPermsIds };

    try {
      if (selectedRole) {
        await rolesApi.updateRole(selectedRole.id, payload);
        Alerts.success('Cargo atualizado com sucesso!');
      } else {
        await rolesApi.createRole(payload);
        Alerts.success('Novo cargo criado com sucesso!');
      }
      handleCloseModal();
      fetchData(); // Recarrega a tabela
    } catch (err) {
      Alerts.error(`Erro ao guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    const result = await Alerts.confirmDelete(`Vais eliminar o cargo "${roleName}". Utilizadores com este cargo poderão perder acesso!`);
    if (result.isConfirmed) {
      try {
        await rolesApi.deleteRole(roleId);
        setRoles(roles.filter(r => r.id !== roleId));
        Alerts.success("Cargo eliminado com sucesso!");
      } catch (err) {
        Alerts.error(err.message);
      }
    }
  };

  return (
    <div className="animate-fade-in py-2">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faUserShield} className="text-primary me-2" /> Gestão de Cargos
          </h2>
          <p className="text-muted small">Gestão de cargos e permissões.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" className="rounded-3 border" onClick={fetchData} title="Recarregar">
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
          <Button variant="primary" className="rounded-3 border-0 fw-bold d-flex align-items-center gap-2 shadow-sm" onClick={handleCreateClick}>
            <FontAwesomeIcon icon={faPlus} /> Adicionar Cargo
          </Button>
        </div>
      </div>

      {/* Tabela de cargos */}
      {isLoading ? (
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <tr>
                <th className="px-4 py-3 text-muted" >Nome do Cargo</th>
                <th className="py-3 text-muted" >Permissões Ativas</th>
                <th className="px-4 py-3 text-muted text-end" >Ações</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-4 py-3 fw-bold text-dark">{role.name}</td>
                  <td className="py-3 text-muted">
                    <div className="d-flex flex-wrap gap-1">
                      {role.Permissions?.slice(0, 4).map(p => (
                        <Badge key={p.id} bg="light" text="dark" className="border fw-normal">{p.name}</Badge>
                      ))}
                      {role.Permissions?.length > 4 && (
                        <Badge bg="secondary" className="fw-bold bg-opacity-75">+{role.Permissions.length - 4} extras</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                        {role.id === 1 ? (
                            <Badge className="bg-opacity-25 text-dark border shadow-sm">
                            <FontAwesomeIcon icon={faUserShield} className="me-1 text-primary" /> Protegido
                            </Badge>
                        ) : (
                            <>
                            <Button variant="light" size="sm" className="me-2 text-primary shadow-sm border" onClick={() => handleEditClick(role)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button variant="light" size="sm" className="text-danger shadow-sm border" onClick={() => handleDeleteRole(role.id, role.name)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                            </>
                        )}
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal (Criar/Editar) */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered backdrop="static" className="modal-dialog-scrollable">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-bold">
            {selectedRole ? `Editar Cargo: ${selectedRole.name}` : 'Criar Novo Cargo de Segurança'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form id="roleForm" onSubmit={handleSubmit}>
            
            {/* Nome do Cargo */}
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-secondary">Designação do Cargo</Form.Label>
              <Form.Control 
                type="text" placeholder="Ex: Cliente" required
                className="bg-light border-0 py-2"
                value={roleName} onChange={(e) => setRoleName(e.target.value)}
                disabled={selectedRole?.id === 1} // Não deixa mudar o nome do Admin
              />
            </Form.Group>

            {/* Matriz de Permissões */}
            <div className="mb-2 d-flex justify-content-between align-items-end">
              <Form.Label className="small fw-bold text-secondary mb-0">Matriz de Permissões</Form.Label>
              <Badge bg="primary" className="fw-normal">{selectedPermsIds.length} selecionadas</Badge>
            </div>

            <Accordion className="shadow-sm">
              {Object.entries(groupedPermissions).map(([moduleName, perms], index) => {
                // Verifica se todas as permissões do módulo estão selecionadas
                const allSelected = perms.every(p => selectedPermsIds.includes(p.id));

                return (
                  <Accordion.Item eventKey={index.toString()} key={moduleName} className="border-bottom">
                    <Accordion.Header>
                      <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                        <span className="fw-bold text-dark">{moduleName}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                      
                      {/* Botão de selecionar tudo */}
                      <div className="d-flex justify-content-end mb-3 pb-2 border-bottom">
                        <Button 
                          variant={allSelected ? "outline-danger" : "outline-primary"} 
                          size="sm" className="fw-bold"
                          onClick={() => handleToggleModule(perms)}
                        >
                          <FontAwesomeIcon icon={allSelected ? faTimes : faCheckDouble} className="me-2" />
                          {allSelected ? 'Remover Tudo' : 'Selecionar Tudo'}
                        </Button>
                      </div>

                      {/* Lista de permissões */}
                      <Row className="g-3">
                        {perms.map((perm) => (
                          <Col md={6} key={perm.id}>
                            <Card className={`border ${selectedPermsIds.includes(perm.id) ? 'border-primary bg-white' : 'border-light'} shadow-sm h-100`}>
                              <Card.Body className="p-3 d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="fw-bold text-dark mb-1">{perm.actionName}</div>
                                  <div className="text-muted" style={{ fontSize: '0.70rem', lineHeight: '1.2' }}>
                                    {perm.description}
                                  </div>
                                </div>
                                <Form.Check 
                                  type="switch" 
                                  id={`switch-${perm.id}`}
                                  className="ms-3 fs-5"
                                  checked={selectedPermsIds.includes(perm.id)}
                                  onChange={() => handleTogglePermission(perm.id)}
                                />
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0 mt-3">
          <Button variant="light" onClick={handleCloseModal} className="border shadow-sm">Cancelar</Button>
          <Button variant="primary" type="submit" form="roleForm" className="shadow-sm fw-bold" disabled={isSubmitting}>
            {isSubmitting ? 'A guardar...' : 'Guardar Cargo'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestaoCargos;