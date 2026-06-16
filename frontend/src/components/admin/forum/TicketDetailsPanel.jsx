import React, { useState } from 'react';
import { Card, Button, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faFlag, faClock, faUser, faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import forumApi from '../../../api/forumApi';

const TicketDetailsPanel = ({ ticket, currentUserId, isAdmin, onClaim, onRefresh }) => {
    const [claiming, setClaiming] = useState(false);
    const [updating, setUpdating] = useState(false);

    if (!ticket) {
        return (
            <Card className="h-100 d-flex align-items-center justify-content-center border-0 shadow-sm rounded-4">
                <Card.Body className="text-center text-muted">
                    <p>Selecione um ticket para ver os detalhes</p>
                </Card.Body>
            </Card>
        );
    }

    const handleClaim = async () => {
        setClaiming(true);
        try {
            await forumApi.claimTicket(ticket.id, currentUserId);
            onRefresh();
        } catch (error) {
            console.error('Failed to claim ticket:', error);
        } finally {
            setClaiming(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            await forumApi.updateTicketStatus(ticket.id, newStatus);
            onRefresh();
        } catch (error) {
            console.error('Failed to update ticket status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Open': return 'info';
            case 'In Progress': return 'warning';
            case 'Resolved': return 'success';
            case 'Closed': return 'secondary';
            default: return 'light';
        }
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority) {
            case 'Low': return 'info';
            case 'Medium': return 'warning';
            case 'High': return 'orange'; // Bootstrap doesn't have orange natively, we can use warning or custom
            case 'Critical': return 'danger';
            default: return 'light';
        }
    };

    const getCategoryBadgeVariant = (category) => {
        switch (category) {
            case 'Emergency': return 'danger';
            case 'Billing': return 'success';
            case 'Technical': return 'info';
            default: return 'secondary';
        }
    };

    const isOwner = ticket.opened_by_user_id === currentUserId;
    const isClaimed = !!ticket.assigned_to_user_id;
    const isAssignedToMe = ticket.assigned_to_user_id === currentUserId;

    return (
        <Card className="h-100 border-0 shadow-sm rounded-4 animate-fade-in d-flex flex-column overflow-hidden">
            {/* Header */}
            <Card.Header className="bg-white border-bottom p-3 shrink-0">
                <h5 className="mb-2 fw-bold text-dark">{ticket.subject}</h5>
                <div className="d-flex gap-2 flex-wrap">
                    <Badge bg={getStatusBadgeVariant(ticket.status)}>
                        {{ 'Open': 'Aberto', 'In Progress': 'Em Progresso', 'Resolved': 'Resolvido', 'Closed': 'Fechado' }[ticket.status] || ticket.status}
                    </Badge>
                    <Badge bg={getPriorityBadgeVariant(ticket.priority)}>
                        <FontAwesomeIcon icon={faFlag} className="me-1" />
                        {{ 'Low': 'Baixa', 'Medium': 'Média', 'High': 'Alta', 'Critical': 'Crítica' }[ticket.priority] || ticket.priority}
                    </Badge>
                    <Badge bg={getCategoryBadgeVariant(ticket.category)} text="white">
                        <FontAwesomeIcon icon={faTag} className="me-1" />
                        {{ 'Support': 'Suporte', 'Billing': 'Faturação', 'Emergency': 'Emergência', 'Technical': 'Técnico' }[ticket.category] || ticket.category}
                    </Badge>
                </div>
            </Card.Header>

            {/* Body - Description and Details */}
            <Card.Body className="overflow-auto flex-grow-1 p-4 custom-scrollbar">
                <div className="mb-4">
                    <h6 className="text-muted fw-bold mb-2">Descrição</h6>
                    <p className="text-dark" style={{ lineHeight: '1.6' }}>
                        {ticket.description}
                    </p>
                </div>

                <hr className="my-4" />

                {/* Ticket Metadata */}
                <Row className="mb-4">
                    <Col xs={6} className="mb-3">
                        <small className="text-muted fw-bold">ID do Ticket</small>
                        <p className="text-dark font-monospace">#{ticket.id}</p>
                    </Col>
                    <Col xs={6} className="mb-3">
                        <small className="text-muted fw-bold">Criado em</small>
                        <p className="text-dark">
                            <FontAwesomeIcon icon={faClock} className="me-2 text-secondary" />
                            {new Date(ticket.createdAt).toLocaleDateString()} às{' '}
                            {new Date(ticket.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </Col>
                    <Col xs={6} className="mb-3">
                        <small className="text-muted fw-bold">Estado</small>
                        <p className="text-dark">
                            <Badge bg={getStatusBadgeVariant(ticket.status)}>
                                {{ 'Open': 'Aberto', 'In Progress': 'Em Progresso', 'Resolved': 'Resolvido', 'Closed': 'Fechado' }[ticket.status] || ticket.status}
                            </Badge>
                        </p>
                    </Col>
                    <Col xs={6} className="mb-3">
                        <small className="text-muted fw-bold">Atribuído a</small>
                        <p className="text-dark">
                            {isClaimed ? (
                                <span>
                                    <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" />
                                    {ticket.assigned_to_user_id === currentUserId ? 'Tu' : 'Gestor'}
                                </span>
                            ) : (
                                <span className="text-muted">Não atribuído</span>
                            )}
                        </p>
                    </Col>
                </Row>

                <hr className="my-4" />

                {/* Status Change Buttons */}
                {isAssignedToMe && (
                    <div className="mb-4">
                        <small className="text-muted fw-bold d-block mb-2">Alterar Estado</small>
                        <div className="d-flex gap-2 flex-wrap">
                            {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                                <Button
                                    key={status}
                                    variant={ticket.status === status ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    disabled={updating}
                                    onClick={() => handleStatusChange(status)}
                                >
                                    {updating && ticket.status !== status ? (
                                        <Spinner animation="border" size="sm" className="me-2" />
                                    ) : null}
                                    {{ 'Open': 'Aberto', 'In Progress': 'Em Progresso', 'Resolved': 'Resolvido', 'Closed': 'Fechado' }[status] || status}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </Card.Body>

            {/* Footer - Action Buttons */}
            <Card.Footer className="bg-light border-top p-3 shrink-0">
                {!isClaimed && isAdmin && (
                    <Button
                        variant="primary"
                        className="w-100"
                        disabled={claiming}
                        onClick={handleClaim}
                    >
                        {claiming ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                A assumir...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCheck} className="me-2" />
                                Assumir este Ticket
                            </>
                        )}
                    </Button>
                )}
                {isAssignedToMe && ticket.status !== 'Closed' && (
                    <Button
                        variant="outline-secondary"
                        className="w-100"
                        disabled={updating}
                        onClick={() => handleStatusChange('Closed')}
                    >
                        {updating ? 'A fechar...' : 'Fechar Ticket'}
                    </Button>
                )}
                {isOwner && !isClaimed && (
                    <div className="alert alert-info mb-0">
                        <small>A aguardar que um gestor assuma este ticket...</small>
                    </div>
                )}
            </Card.Footer>
        </Card>
    );
};

export default TicketDetailsPanel;
