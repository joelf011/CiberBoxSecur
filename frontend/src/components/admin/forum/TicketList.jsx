import React from 'react';
import { ListGroup, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faCircle } from '@fortawesome/free-solid-svg-icons';

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
                <p className="text-muted mb-0">No tickets found</p>
            </Card>
        );
    }

    return (
        <ListGroup className="animate-fade-in custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
                            Ticket #{ticket.id}
                        </h6>
                        <Badge
                            bg={getStatusBadgeVariant(ticket.status)}
                            className="ms-2 flex-shrink-0"
                            style={{ fontSize: '0.65rem' }}
                        >
                            {ticket.status}
                        </Badge>
                    </div>

                    <p className="mb-2 text-dark small" style={{ lineHeight: '1.4' }}>
                        {ticket.subject}
                    </p>

                    <div className="d-flex gap-2 align-items-center mb-2">
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{ color: getPriorityColor(ticket.priority), fontSize: '0.5rem' }}
                        />
                        <small className="text-muted">
                            <FontAwesomeIcon icon={faFlag} className="me-1" />
                            {ticket.priority}
                        </small>
                        {ticket.assigned_to_user_id && (
                            <Badge bg="light" text="dark" className="ms-auto" style={{ fontSize: '0.65rem' }}>
                                Assigned
                            </Badge>
                        )}
                    </div>

                    <small className="text-muted d-block">
                        {new Date(ticket.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default TicketList;
