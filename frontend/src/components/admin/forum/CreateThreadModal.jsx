import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faAlignLeft,
  faTag,
  faFlag,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import forumApi from "../../../api/forumApi";
import { Alerts } from "../../../utils/Alerts";
import api from "../../../api/axiosConfig";

/**
 * Responsável por:
 * - Criar tickets a partir do cliente ou da equipa interna.
 * - Carregar empresas apenas quando o utilizador pode abrir ticket por uma empresa.
 *
 * Fluxo:
 * Modal -> /companies opcional -> forumApi.createTicket -> Atualização da lista.
 */
const CreateTicketModal = ({ show, onHide, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "Support",
    priority: "Medium",
    company_id: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  // Fail-safe: clientes nunca escolhem empresa, mesmo que tenham permissões antigas em cache.
  const isStaff =
    user &&
    Number(user.role_id) !== 3 &&
    (Number(user.role_id) === 1 ||
      Number(user.role_id) === 2 ||
      (user.permissions && user.permissions.includes("UPDATE_TICKET")));

  // Staff precisa de escolher a empresa associada ao ticket.
  useEffect(() => {
    if (show && isStaff) {
      const fetchCompanies = async () => {
        try {
          // axiosConfig injeta o token e usa o URL de API configurado no ambiente.
          const response = await api.get("/companies");
          setCompanies(response.data);
        } catch (err) {
          console.error("Failed to load companies:", err);
        }
      };
      fetchCompanies();
    }
  }, [show, isStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim()) {
      setError("O assunto é obrigatório");
      return;
    }

    if (!formData.description.trim()) {
      setError("A descrição é obrigatória");
      return;
    }

    if (isStaff && !formData.company_id) {
      setError("Por favor, selecione uma empresa para este ticket.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        company_id: isStaff ? formData.company_id : user?.company_id,
      };

      await forumApi.createTicket(payload);

      // Limpa o formulário para a próxima abertura do modal.
      setFormData({
        subject: "",
        description: "",
        category: "Support",
        priority: "Medium",
        company_id: "",
      });

      onHide();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setError(
        error.response?.data?.error ||
          "Falha ao criar ticket. Por favor, tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="animate-fade-in">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          Abrir Novo Ticket de Suporte
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-4">
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {/* Campo principal usado na listagem de tickets. */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faPen} className="me-2" /> Assunto
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              placeholder="Ex: Problema com a recuperação de password"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            />
          </Form.Group>

          {/* Descrição enviada ao backend como corpo do ticket. */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faAlignLeft} className="me-2" /> Descrição
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Descreva o seu problema ou pedido..."
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
              style={{ resize: "none" }}
            />
          </Form.Group>

          {/* Empresa obrigatória apenas para staff que cria tickets por clientes. */}
          {isStaff && (
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-secondary text-uppercase">
                <FontAwesomeIcon icon={faBuilding} className="me-2" /> Empresa
              </Form.Label>
              <Form.Select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
                disabled={loading}
                className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
              >
                <option value="">Selecione uma empresa...</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Categoria operacional usada para triagem. */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faTag} className="me-2" /> Categoria
            </Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            >
              <option value="Support">Suporte</option>
              <option value="Billing">Faturação</option>
              <option value="Emergency">Emergência</option>
              <option value="Technical">Técnico</option>
            </Form.Select>
          </Form.Group>

          {/* Prioridade inicial ajustável depois por gestores. */}
          <Form.Group className="mb-2">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faFlag} className="me-2" /> Prioridade
              (Opcional)
            </Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            >
              <option value="Low">Baixa</option>
              <option value="Medium">Média</option>
              <option value="High">Alta</option>
              <option value="Critical">Crítica</option>
            </Form.Select>
          </Form.Group>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            Um gestor irá rever e responder ao seu ticket em breve.
          </small>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 pb-4 px-4">
          <Button
            variant="light"
            onClick={onHide}
            className="rounded-3 px-4 fw-medium border-0"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="rounded-3 px-4 border-0 shadow-sm fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />A
                criar...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Criar Ticket
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTicketModal;
