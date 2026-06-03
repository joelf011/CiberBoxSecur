import React, { useState } from 'react';
import { Card, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import TicketList from './TicketList';

const TicketSidebar = ({
    tickets,
    selectedTicketId,
    onSelectTicket,
    loading,
    onCreateNew,
    viewMode = 'admin'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toString().includes(searchTerm);

        if (filterStatus === 'all') return matchesSearch;
        return matchesSearch && ticket.status === filterStatus;
    });

    return (
        <Card className="h-100 border-0 shadow-sm rounded-4 d-flex flex-column overflow-hidden">
            {/* Header */}
            <Card.Header className="bg-gradient p-3 border-0 shrink-0">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0 fw-bold text-dark">
                        {viewMode === 'admin' ? 'Ticket Pool' : 'My Tickets'}
                    </h5>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onCreateNew}
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>

                {/* Search */}
                <InputGroup size="sm" className="mb-2">
                    <InputGroup.Text className="bg-white border-0">
                        <FontAwesomeIcon icon={faSearch} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search by subject or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-light border-0"
                    />
                </InputGroup>

                {/* Filter Buttons */}
                {viewMode === 'admin' && (
                    <div className="d-flex gap-2 flex-wrap" style={{ marginTop: '8px' }}>
                        {['all', 'Open', 'In Progress', 'Resolved'].map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? 'primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => setFilterStatus(status)}
                                className="text-nowrap"
                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            >
                                {status === 'all' ? 'All' : status}
                            </Button>
                        ))}
                    </div>
                )}
            </Card.Header>

            {/* Ticket List */}
            <Card.Body className="flex-grow-1 p-0 overflow-hidden">
                <TicketList
                    tickets={filteredTickets}
                    selectedTicketId={selectedTicketId}
                    onSelectTicket={onSelectTicket}
                    loading={loading}
                />
            </Card.Body>

            {/* Footer - Counter */}
            <Card.Footer className="bg-light p-3 border-top text-muted small shrink-0">
                <span>{filteredTickets.length} ticket(s)</span>
                {searchTerm && <span className="ms-2">matching "{searchTerm}"</span>}
            </Card.Footer>
        </Card>
    );
};

export default TicketSidebar;
