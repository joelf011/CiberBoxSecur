import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
  Pagination,
  Spinner,
  Alert,
  Modal,
  Nav,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserPlus,
  faEdit,
  faTrash,
  faUsers,
  faRefresh,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { usersApi } from "../../api/usersApi";
import { Alerts } from "../../utils/Alerts";

const GestaoUtilizadores = () => {
  // Estados
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Estados Modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Adicionado o campo 'phone' no estado inicial
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
  });

  // Funções Modal
  const handleClose = () => {
    setShowModal(false);
    setEditingUserId(null);
  };

  const handleShow = () => {
    setEditingUserId(null);
    // Limpar também o campo phone ao abrir para criar novo
    setFormData({ name: "", email: "", phone: "", role_id: "" });
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    // Puxar o phone da base de dados ao editar
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role_id: user.role_id || "",
    });
    setShowModal(true);
  };

  // Carregar Dados da API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        usersApi.getUsers(),
        usersApi.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ações da Tabela
  const handleToggleStatus = async (user) => {
    if (currentUser && currentUser.id === user.id) {
      return Alerts.error("Não podes desativar a tua própria conta.");
    }
    try {
      const newStatus = !user.is_active;
      await usersApi.updateUser(user.id, { ...user, is_active: newStatus });
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, is_active: newStatus } : u,
        ),
      );
    } catch (err) {
      Alerts.error(`Erro: ${err.message}`);
    }
  };

  const handleResendActivation = async (userId) => {
    try {
      const message = await usersApi.resendActivation(userId);
      Alerts.success(message || "Convite reenviado com sucesso!");
    } catch (err) {
      Alerts.error(`Erro: ${err.message}`);
    }
  };

  const handleDelete = async (userId) => {
    const result = await Alerts.confirmDelete(
      "Vais eliminar este utilizador do sistema.",
    );
    if (result.isConfirmed) {
      try {
        await usersApi.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
        Alerts.success("Utilizador eliminado com sucesso!");
      } catch (err) {
        Alerts.error(`Erro: ${err.message}`);
      }
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUserId) {
        await usersApi.updateUser(editingUserId, formData);
        Alerts.success("Utilizador atualizado com sucesso!");
      } else {
        await usersApi.createUser(formData);
        Alerts.success("Utilizador criado e convite enviado!");
      }
      handleClose();
      fetchData(); // Recarrega a tabela para ver o resultado
    } catch (err) {
      Alerts.error(`Erro ao guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtro de Pesquisa e Tabs
  const filteredUsers = users.filter((user) => {
    const termo = searchTerm.toLowerCase();
    const nomeDoCargo = roles.find((r) => r.id === user.role_id)?.name || "";

    const matchesSearch =
      user.name.toLowerCase().includes(termo) ||
      user.email.toLowerCase().includes(termo) ||
      nomeDoCargo.toLowerCase().includes(termo);

    const matchesTab = activeTab === "Todos" || nomeDoCargo === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in py-2">
      {/* CABEÇALHO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faUsers} className="text-primary me-2" />{" "}
            Gestão de Utilizadores
          </h2>
          <p className="text-muted small">
            Controlo de acessos, cargos e estado das contas.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="rounded-3 border"
            onClick={fetchData}
            title="Recarregar dados"
          >
            <FontAwesomeIcon icon={faRefresh} />
          </Button>
          <Button
            variant="primary"
            className="rounded-3 border-0 fw-bold d-flex align-items-center gap-2 shadow-sm"
            onClick={handleShow}
          >
            <FontAwesomeIcon icon={faUserPlus} /> Adicionar Utilizador
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "Todos"}
                onClick={() => setActiveTab("Todos")}
              >
                Todos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "Admin"}
                onClick={() => setActiveTab("Admin")}
              >
                Admin
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "Gestor"}
                onClick={() => setActiveTab("Gestor")}
              >
                Gestor
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "Cliente"}
                onClick={() => setActiveTab("Cliente")}
              >
                Cliente
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Row className="g-3">
            <Col md={6} lg={4}>
              <InputGroup className="bg-light rounded-3 border-0 px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Pesquisar por nome ou email..."
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
        /* TABELA DE UTILIZADORES */
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead
                className="bg-light border-bottom text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
              >
                <tr>
                  <th className="px-4 py-3 text-muted">Nome</th>
                  <th className="py-3 text-muted">Email</th>
                  <th className="py-3 text-muted">Cargo</th>
                  <th className="py-3 text-muted">Estado</th>
                  <th className="px-4 py-3 text-muted text-end">Ações</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.85rem" }}>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      {searchTerm
                        ? "Nenhum utilizador encontrado com essa pesquisa."
                        : "Nenhum utilizador encontrado na base de dados."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 fw-bold text-dark">
                        {user.name}
                      </td>
                      <td className="py-3 text-muted">{user.email}</td>
                      <td className="py-3">
                        <Badge
                          bg="light"
                          text="dark"
                          className="border fw-normal"
                        >
                          {roles.find((r) => r.id === user.role_id)?.name ||
                            `Sem Cargo`}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Form.Check
                          type="switch"
                          id={`switch-${user.id}`}
                          checked={user.is_active}
                          onChange={() => handleToggleStatus(user)}
                          disabled={currentUser && currentUser.id === user.id}
                          label={
                            <Badge
                              bg={
                                user.activation_token
                                  ? "warning"
                                  : user.is_active
                                    ? "success"
                                    : "danger"
                              }
                              className={`fw-normal bg-opacity-75 ms-2 ${user.activation_token ? "text-dark" : ""}`}
                            >
                              {user.activation_token
                                ? "Pendente"
                                : user.is_active
                                  ? "Ativo"
                                  : "Inativo"}
                            </Badge>
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-end">
                        {currentUser && currentUser.id === user.id ? (
                          <span className="text-muted small fst-italic me-3">
                            A tua conta
                          </span>
                        ) : (
                          <>
                            {user.activation_token && (
                              <Button
                                variant="light"
                                size="sm"
                                className="me-2 text-warning shadow-sm border"
                                title="Reenviar e-mail de ativação"
                                onClick={() => handleResendActivation(user.id)}
                              >
                                <FontAwesomeIcon icon={faPaperPlane} />
                              </Button>
                            )}
                            <Button
                              variant="light"
                              size="sm"
                              className="me-2 text-primary shadow-sm border"
                              onClick={() => handleEditClick(user)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="text-danger shadow-sm border"
                              title="Eliminar utilizador"
                              onClick={() => handleDelete(user.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          <Card.Footer className="bg-white border-0 p-3 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Total: {filteredUsers.length} utilizadores listados
            </small>
            <Pagination className="mb-0">
              <Pagination.Prev disabled />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Next disabled />
            </Pagination>
          </Card.Footer>
        </Card>
      )}

      {/* ADICIONAR / EDITAR UTILIZADOR */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-bold">
            {editingUserId ? "Editar Utilizador" : "Adicionar Novo Utilizador"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="userForm" onSubmit={handleSubmitUser}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">
                Nome Completo
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: João Silva"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">
                E-mail
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="exemplo@cyberrisk.pt"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>

            {/* --- NOVO CAMPO DE TELEFONE --- */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">
                Telefone / Telemóvel
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: +351 912 345 678"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">
                Cargo
              </Form.Label>
              <Form.Select
                required
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: Number(e.target.value) })
                }
              >
                <option value="" disabled>
                  Selecione um cargo
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            onClick={handleClose}
            className="border shadow-sm"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="userForm"
            className="shadow-sm fw-bold"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "A guardar..."
              : editingUserId
                ? "Guardar Alterações"
                : "Guardar Utilizador"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestaoUtilizadores;
