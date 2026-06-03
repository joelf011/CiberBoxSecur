import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from "@fortawesome/free-solid-svg-icons";

import TicketSidebar from '../../components/admin/forum/TicketSidebar';
import TicketDetailsPanel from '../../components/admin/forum/TicketDetailsPanel';
import TicketChatWindow from '../../components/admin/forum/TicketChatWindow';
import CreateTicketModal from '../../components/admin/forum/CreateThreadModal';
import forumApi from '../../api/forumApi';

const AdminForum = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Get current user from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // Load tickets on mount and when refreshKey changes
    useEffect(() => {
        if (!currentUser) return;
        loadTickets();
    }, [currentUser, refreshKey]);

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
            const data = await forumApi.getTickets();

            // Filter based on user role
            let filtered = data;
            if (!isAdmin()) {
                // Clients see only their own tickets
                filtered = data.filter(t => t.opened_by_user_id === currentUser.id);
            }

            setTickets(filtered);
        } catch (err) {
            console.error('Failed to load tickets:', err);
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = () => {
        return currentUser?.role_id === 1 || currentUser?.permissions?.includes('UPDATE_TICKET');
    };

    const handleSelectTicket = (ticketId) => {
        setSelectedTicketId(ticketId);
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
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="py-2 h-100">
            <div className="mb-4">
                <h2 className="fs-4 fw-bold text-dark">Support Helpdesk</h2>
                <p className="text-muted small">
                    {isAdmin()
                        ? 'Manage and respond to support tickets.'
                        : 'View and manage your support tickets.'}
                </p>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Row className="g-4 h-100">
                {/* LEFT: TICKET SIDEBAR */}
                <Col lg={3} className="mb-3 mb-lg-0">
                    <TicketSidebar
                        tickets={tickets}
                        selectedTicketId={selectedTicketId}
                        onSelectTicket={handleSelectTicket}
                        onCreateNew={() => setShowCreateModal(true)}
                        loading={loading}
                        viewMode={isAdmin() ? 'admin' : 'client'}
                    />
                </Col>

                {/* CENTER: TICKET DETAILS & CHAT */}
                <Col lg={9}>
                    <Row className="g-3 h-100">
                        {!selectedTicket ? (
                            <Col xs={12} className="h-100">
                                <Card className="border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '600px' }}>
                                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                                        <div className="bg-light rounded-circle p-4 mb-3">
                                            <FontAwesomeIcon icon={faComments} size="3x" className="text-secondary opacity-25" />
                                        </div>
                                        <h4 className="fw-bold text-dark">Select a Ticket</h4>
                                        <p className="text-muted mx-auto" style={{ maxWidth: '350px' }}>
                                            {isAdmin()
                                                ? 'Choose a ticket from the list to view details and communicate with the client.'
                                                : 'Select one of your tickets to view details and communicate with support.'}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ) : (
                            <>
                                {/* TOP: TICKET DETAILS PANEL */}
                                <Col xs={12} md={4} className="mb-3 mb-md-0">
                                    <TicketDetailsPanel
                                        ticket={selectedTicket}
                                        currentUserId={currentUser.id}
                                        isAdmin={isAdmin()}
                                        onClaim={handleRefresh}
                                        onRefresh={handleRefresh}
                                    />
                                </Col>

                                {/* BOTTOM/RIGHT: CHAT WINDOW */}
                                {selectedTicket.assigned_to_user_id ? (
                                    <Col xs={12} md={8}>
                                        <TicketChatWindow
                                            ticket={selectedTicket}
                                            currentUserId={currentUser.id}
                                            onMessageSent={handleRefresh}
                                        />
                                    </Col>
                                ) : (
                                    <Col xs={12} md={8}>
                                        <Card className="h-100 d-flex align-items-center justify-content-center shadow-sm" style={{ minHeight: '400px' }}>
                                            <Card.Body className="text-center">
                                                <p className="text-muted mb-0">
                                                    This ticket is not yet claimed. Once a manager claims it, the chat will be available.
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
                            </>
                        )}
                    </Row>
                </Col>
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