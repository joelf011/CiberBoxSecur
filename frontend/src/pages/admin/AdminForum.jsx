import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import TicketSidebar from '../../components/admin/forum/TicketSidebar';
import TicketDetailsPanel from '../../components/admin/forum/TicketDetailsPanel';
import TicketChatWindow from '../../components/admin/forum/TicketChatWindow';
import CreateTicketModal from '../../components/admin/forum/CreateThreadModal';
import forumApi from '../../api/forumApi';
import api from '../../api/axiosConfig';

const AdminForum = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Estados de Filtros e Paginação
    const [filters, setFilters] = useState({
        searchTerm: '', filterStatus: 'all', filterPriority: '', 
        filterCategory: '', filterCompany: '', startDate: '', endDate: ''
    });
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 });
    const [companies, setCompanies] = useState([]);

    // Get current user from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // Load tickets com debounce e monitorização dos filtros
    useEffect(() => {
        if (!currentUser) return;
        
        const delayDebounceFn = setTimeout(() => {
            loadTickets();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [currentUser, refreshKey, filters, pagination.currentPage]);

    // Carrega a lista de Empresas (Apenas para Gestores/Admins) para o dropdown do filtro
    useEffect(() => {
        if (currentUser && isManagerOrAdmin()) {
            api.get('/companies')
               .then(res => setCompanies(res.data))
               .catch(err => console.error(err));
        }
    }, [currentUser]);

    // Load selected ticket details
    useEffect(() => {
        if (!selectedTicketId || !tickets.length) {
            setSelectedTicket(null);
            return;
        }

        const ticket = tickets.find(t => t.id === selectedTicketId);
        setSelectedTicket(ticket || null);
    }, [selectedTicketId, tickets]);

    const loadTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            // Realiza a pesquisa usando as query params de forma direta
            const response = await api.get('/tickets', {
                params: {
                    page: pagination.currentPage, limit: pagination.limit,
                    search: filters.searchTerm, status: filters.filterStatus,
                    priority: filters.filterPriority, category: filters.filterCategory,
                    company_id: filters.filterCompany, startDate: filters.startDate, endDate: filters.endDate
                }
            });
            
            if (response.data && response.data.data) {
                setTickets(response.data.data);
                setPagination(prev => ({ ...prev, totalRecords: response.data.total_records || 0, totalPages: response.data.total_pages || 1 }));
            } else {
                // Fallback de retro-compatibilidade
                setTickets(response.data);
                setPagination(prev => ({ ...prev, totalRecords: response.data.length, totalPages: 1 }));
            }
        } catch (err) {
            console.error('Failed to load tickets:', err);
            setError('Falha ao carregar tickets');
        } finally {
            setLoading(false);
        }
    };

    const isManagerOrAdmin = () => {
        const roleId = Number(currentUser?.role_id);
        if (roleId === 3) return false; // Fail-safe: Cargo Cliente nunca atua como Gestor
        return roleId === 1 || roleId === 2 || currentUser?.permissions?.includes('UPDATE_TICKET');
    };

    // Handler dinâmico para reiniciar a página se um filtro for alterado
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Volta à página 1 sempre que pesquisa
    };

    const handleSelectTicket = (ticketId) => {
        setSelectedTicketId(ticketId);
    };

    const handleBack = () => {
        setSelectedTicketId(null);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
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
        <div className="py-2 d-flex flex-column" style={{ height: 'calc(100vh - 85px)' }}>
            <div className="mb-3 flex-shrink-0">
                <h2 className="fs-4 fw-bold text-dark">Fórum de Clientes</h2>
                <p className="text-muted small">
                    {isManagerOrAdmin()
                        ? 'Faça a gestão e responda aos tickets de suporte.'
                        : 'Veja e faça a gestão dos seus tickets de suporte.'}
                </p>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {/* O estilo minHeight: 0 é crucial para o Flexbox não quebrar o layout e ativar o scroll interno */}
            <Row className="g-3 flex-grow-1 m-0" style={{ minHeight: 0 }}>
                {!selectedTicket ? (
                    /* VIEW 1: TICKET POOL (LISTA) */
                    <Col xs={12} lg={10} xl={8} className="mx-auto h-100 px-0">
                        <TicketSidebar
                            tickets={tickets}
                            selectedTicketId={selectedTicketId}
                            onSelectTicket={handleSelectTicket}
                            onCreateNew={() => setShowCreateModal(true)}
                            loading={loading}
                            viewMode={isManagerOrAdmin() ? 'admin' : 'client'}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            pagination={pagination}
                            onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                            companies={companies}
                        />
                    </Col>
                ) : (
                    /* VIEW 2: TICKET ABERTO (CHAT + DETALHES) */
                    <>
                        {/* LEFT/CENTER: CHAT WINDOW */}
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
                                        <Button variant="light" size="sm" className="rounded-circle border-0" onClick={handleBack} title="Voltar à lista">
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </Button>
                                        <div className="flex-grow-1">
                                            <h6 className="h6 fw-bold mb-0 text-dark">Ticket #{selectedTicket.id}</h6>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="d-flex align-items-center justify-content-center text-center p-4">
                                        <p className="text-muted mb-0">
                                            Este ticket ainda não foi atribuído. O chat estará disponível assim que um gestor o assumir.
                                        </p>
                                    </Card.Body>
                                </Card>
                            )}
                        </Col>

                        {/* RIGHT: TICKET DETAILS PANEL */}
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

            {/* CREATE TICKET MODAL */}
            <CreateTicketModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleTicketCreated}
            />
        </div>
    );
};

export default AdminForum;