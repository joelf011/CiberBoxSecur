import React from 'react';
import { ListGroup, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faCircle, faBuilding } from '@fortawesome/free-solid-svg-icons';

const TicketList = ({ tickets, selectedTicketId, onSelectTicket, loading }) => {
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Open': return 'info';
            case 'In Progress': return 'warning';
            case 'Resolved': return 'success';
            case 'Closed': return 'secondary';
            default: return 'light';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return '#0dcaf0';
            case 'Medium': return '#ffc107';
            case 'High': return '#fd7e14';
            case 'Critical': return '#dc3545';
            default: return '#6c757d';
        }
    };

    if (loading) {
        return (
            <ListGroup className="animate-fade-in">
                {[1, 2, 3].map((i) => (
                    <ListGroup.Item key={i} className="placeholder-wave">
                        <div className="placeholder col-12 mb-2" style={{ height: '1rem' }}></div>
                        <div className="placeholder col-8" style={{ height: '0.75rem' }}></div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    }

    if (tickets.length === 0) {
        return (
            <Card className="text-center p-4 bg-light border-0">
                <p className="text-muted mb-0">Nenhum ticket encontrado</p>
            </Card>
        );
    }

    return (
        <ListGroup className="animate-fade-in custom-scrollbar h-100" style={{ overflowY: 'auto' }}>
            {tickets.map((ticket) => (
                <ListGroup.Item
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket.id)}
                    className={`cursor-pointer border-0 border-bottom p-3 transition ${
                        selectedTicketId === ticket.id ? 'bg-light border-start border-primary border-5' : 'hover:bg-light'
                    }`}
                    style={{
                        cursor: 'pointer',
                        backgroundColor: selectedTicketId === ticket.id ? '#f8f9fa' : 'white',
                        borderLeft: selectedTicketId === ticket.id ? '4px solid #8b5cf6' : 'none',
                        paddingLeft: selectedTicketId === ticket.id ? '12px' : '16px'
                    }}
                >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0 fw-bold text-dark flex-grow-1 text-truncate">
                            {ticket.subject}
                        </h6>
                        <Badge
                            bg={getStatusBadgeVariant(ticket.status)}
                            className="ms-2 flex-shrink-0"
                            style={{ fontSize: '0.65rem' }}
                        >
                            {{ 'Open': 'Aberto', 'In Progress': 'Em Progresso', 'Resolved': 'Resolvido', 'Closed': 'Fechado' }[ticket.status] || ticket.status}
                        </Badge>
                    </div>

                    <p className="mb-2 text-dark small text-truncate" style={{ lineHeight: '1.4' }}>
                        {ticket.description}
                    </p>

                    <div className="d-flex gap-2 align-items-center mb-2">
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{ color: getPriorityColor(ticket.priority), fontSize: '0.5rem' }}
                        />
                        <small className="text-muted">
                            <FontAwesomeIcon icon={faFlag} className="me-1" />
                            {{ 'Low': 'Baixa', 'Medium': 'Média', 'High': 'Alta', 'Critical': 'Crítica' }[ticket.priority] || ticket.priority}
                        </small>
                        <Badge 
                            bg={ticket.category === 'Emergency' ? 'danger' : 'secondary'} 
                            className="ms-2" 
                            style={{ fontSize: '0.65rem', opacity: 0.8 }}
                        >
                            {{ 'Support': 'Suporte', 'Billing': 'Faturação', 'Emergency': 'Emergência', 'Technical': 'Técnico' }[ticket.category] || ticket.category}
                        </Badge>
                        {ticket.Company?.name && (
                            <Badge bg="light" text="dark" className="border ms-1 text-truncate" style={{ fontSize: '0.65rem', maxWidth: '130px' }} title={ticket.Company.name}>
                                <FontAwesomeIcon icon={faBuilding} className="text-secondary me-1" />
                                {ticket.Company.name}
                            </Badge>
                        )}
                        {ticket.assigned_to_user_id && (
                            <Badge bg="light" text="dark" className="ms-auto" style={{ fontSize: '0.65rem' }}>
                                Atribuído
                            </Badge>
                        )}
                    </div>

                    <small className="text-muted d-block">
                        {new Date(ticket.createdAt).toLocaleDateString()} às{' '}
                        {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default TicketList;
