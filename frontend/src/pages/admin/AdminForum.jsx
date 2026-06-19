import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import TicketSidebar from "../../components/admin/forum/TicketSidebar";
import TicketDetailsPanel from "../../components/admin/forum/TicketDetailsPanel";
import TicketChatWindow from "../../components/admin/forum/TicketChatWindow";
import CreateTicketModal from "../../components/admin/forum/CreateThreadModal";
import forumApi from "../../api/forumApi";
import api from "../../api/axiosConfig";

/**
 * Responsável por:
 * - Gerir a lista de tickets, filtros, paginação e detalhe selecionado.
 * - Coordenar chat e painel de detalhes com dados vindos da API.
 *
 * Fluxo:
 * Backoffice -> /tickets e /companies -> TicketSidebar/TicketChatWindow -> Atualização da UI.
 */
const AdminForum = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filtros e paginação são enviados como query params para o backend.
  const [filters, setFilters] = useState({
    searchTerm: "",
    filterStatus: "all",
    filterPriority: "",
    filterCategory: "",
    filterCompany: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const [companies, setCompanies] = useState([]);

  // Reutiliza o utilizador guardado no login para decidir permissões de gestão.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Debounce evita pedidos repetidos enquanto o utilizador ajusta filtros.
  useEffect(() => {
    if (!currentUser) return;

    const delayDebounceFn = setTimeout(() => {
      loadTickets();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentUser, refreshKey, filters, pagination.currentPage]);

  // Gestores/admins precisam da lista de empresas para filtrar tickets por cliente.
  useEffect(() => {
    if (currentUser && isManagerOrAdmin()) {
      api
        .get("/companies")
        .then((res) => setCompanies(res.data))
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  // Mantém o detalhe sincronizado com a lista paginada devolvida pela API.
  useEffect(() => {
    if (!selectedTicketId || !tickets.length) {
      setSelectedTicket(null);
      return;
    }

    const ticket = tickets.find((t) => t.id === selectedTicketId);
    setSelectedTicket(ticket || null);
  }, [selectedTicketId, tickets]);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      // O backend compõe a query de tickets a partir destes filtros.
      const response = await api.get("/tickets", {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.searchTerm,
          status: filters.filterStatus,
          priority: filters.filterPriority,
          category: filters.filterCategory,
          company_id: filters.filterCompany,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });

      if (response.data && response.data.data) {
        setTickets(response.data.data);
        setPagination((prev) => ({
          ...prev,
          totalRecords: response.data.total_records || 0,
          totalPages: response.data.total_pages || 1,
        }));
      } else {
        // Suporta respostas antigas que ainda não vinham paginadas.
        setTickets(response.data);
        setPagination((prev) => ({
          ...prev,
          totalRecords: response.data.length,
          totalPages: 1,
        }));
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Falha ao carregar tickets");
    } finally {
      setLoading(false);
    }
  };

  const isManagerOrAdmin = () => {
    const roleId = Number(currentUser?.role_id);
    if (roleId === 3) return false; // Fail-safe: Cargo Cliente nunca atua como Gestor
    return (
      roleId === 1 ||
      roleId === 2 ||
      currentUser?.permissions?.includes("UPDATE_TICKET")
    );
  };

  // Ao alterar filtros, regressa à primeira página para evitar offsets inválidos.
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Mantém a paginação alinhada com a nova pesquisa.
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const handleBack = () => {
    setSelectedTicketId(null);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedTicketId(null);
  };

  const handleTicketCreated = () => {
    setShowCreateModal(false);
    handleRefresh();
  };

  if (!currentUser) {
    return (
      <div className="py-2">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">A carregar...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div
      className="py-2 d-flex flex-column"
      style={{ height: "calc(100vh - 85px)" }}
    >
      <div className="mb-3 flex-shrink-0">
        <h2 className="fs-4 fw-bold text-dark mb-1">
          <FontAwesomeIcon icon={faComments} className="text-primary me-2" />{" "}
          Fórum de Clientes
        </h2>
        <p className="text-muted small">
          {isManagerOrAdmin()
            ? "Faça a gestão e responda aos tickets de suporte."
            : "Veja e faça a gestão dos seus tickets de suporte."}
        </p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* minHeight: 0 permite scroll interno correto dentro do layout flex. */}
      <Row className="g-3 flex-grow-1 m-0" style={{ minHeight: 0 }}>
        {!selectedTicket ? (
          /* Vista 1: lista de tickets com filtros e paginação. */
          <Col xs={12} className="h-100 px-0">
            <TicketSidebar
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={handleSelectTicket}
              onCreateNew={() => setShowCreateModal(true)}
              loading={loading}
              viewMode={isManagerOrAdmin() ? "admin" : "client"}
              filters={filters}
              onFilterChange={handleFilterChange}
              pagination={pagination}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, currentPage: page }))
              }
              companies={companies}
            />
          </Col>
        ) : (
          /* Vista 2: ticket aberto com chat e detalhes laterais. */
          <>
            {/* Janela de chat associada ao ticket selecionado. */}
            <Col lg={8} className="h-100 mb-3 mb-lg-0">
              {selectedTicket.assigned_to_user_id ? (
                <TicketChatWindow
                  ticket={selectedTicket}
                  currentUser={currentUser}
                  onBack={handleBack}
                />
              ) : (
                <Card className="h-100 d-flex flex-column shadow-sm border-0 rounded-4 overflow-hidden">
                  <Card.Header className="bg-white p-3 border-bottom d-flex align-items-center gap-3 shrink-0 shadow-sm">
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-circle border-0"
                      onClick={handleBack}
                      title="Voltar à lista"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    <div className="flex-grow-1">
                      <h6 className="h6 fw-bold mb-0 text-dark">
                        Ticket #{selectedTicket.id}
                      </h6>
                    </div>
                  </Card.Header>
                  <Card.Body className="d-flex align-items-center justify-content-center text-center p-4">
                    <p className="text-muted mb-0">
                      Este ticket ainda não foi atribuído. O chat estará
                      disponível assim que um gestor o assumir.
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Painel de metadados, estado e ações do ticket. */}
            <Col lg={4} className="h-100">
              <TicketDetailsPanel
                ticket={selectedTicket}
                currentUserId={currentUser.id}
                isAdmin={isManagerOrAdmin()}
                onClaim={handleRefresh}
                onRefresh={handleRefresh}
              />
            </Col>
          </>
        )}
      </Row>

      {/* Modal reutilizado para criar tickets sem abandonar a página. */}
      <CreateTicketModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleTicketCreated}
      />
    </div>
  );
};

export default AdminForum;
