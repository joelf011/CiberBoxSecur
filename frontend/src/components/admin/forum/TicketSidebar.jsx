import React, { useState } from 'react';
import { Card, Form, InputGroup, Button, Row, Col, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import TicketList from './TicketList';

/**
 * Responsável por:
 * - Apresentar filtros e paginação da fila de tickets.
 * - Propagar alterações para a página pai, que consulta o backend.
 */
const TicketSidebar = ({
    tickets,
    selectedTicketId,
    onSelectTicket,
    loading,
    onCreateNew,
    viewMode = 'admin',
    filters = {},
    onFilterChange,
    pagination = {},
    onPageChange,
    companies = []
}) => {
    const { searchTerm = '', filterStatus = 'all', filterPriority = '', filterCategory = '', filterCompany = '', startDate = '', endDate = '' } = filters;
    const { currentPage = 1, totalPages = 1, totalRecords = 0 } = pagination;

    const handleChange = (field) => (e) => {
        onFilterChange({ ...filters, [field]: e.target.value });
    };

    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <Card className=" border-0 shadow-sm rounded-4 d-flex flex-column overflow-hidden">
            {/* Cabeçalho da fila e ação de criação. */}
            <Card.Header className="bg-gradient p-3 border-0 shrink-0">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0 fw-bold text-dark">
                        {viewMode === 'admin' ? 'Fila de Tickets' : 'Os Meus Tickets'}
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

                {/* Pesquisa enviada ao backend através da página pai. */}
                <InputGroup size="sm" className="mb-2">
                    <InputGroup.Text className="bg-light border-0">
                        <FontAwesomeIcon icon={faSearch} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Pesquisar por assunto, ID ou empresa..."
                        value={searchTerm}
                        onChange={handleChange('searchTerm')}
                        className="bg-light border-0"
                    />
                </InputGroup>

                {/* Filtros avançados convertidos em query params. */}
                <Row className="g-2">
                    <Col xs={6} md={viewMode === 'admin' ? 3 : 4}>
                        <Form.Select size="sm" className="bg-light border-0 text-muted" value={filterStatus} onChange={handleChange('filterStatus')}>
                            <option value="all">Todos os Estados</option>
                            <option value="Open">Aberto</option>
                            <option value="In Progress">Em Progresso</option>
                            <option value="Resolved">Resolvido</option>
                            <option value="Closed">Fechado</option>
                        </Form.Select>
                    </Col>
                    <Col xs={6} md={viewMode === 'admin' ? 3 : 4}>
                        <Form.Select size="sm" className="bg-light border-0 text-muted" value={filterPriority} onChange={handleChange('filterPriority')}>
                            <option value="">Todas as Prioridades</option>
                            <option value="Low">Baixa</option>
                            <option value="Medium">Média</option>
                            <option value="High">Alta</option>
                            <option value="Critical">Crítica</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md={viewMode === 'admin' ? 3 : 4}>
                        <Form.Select size="sm" className="bg-light border-0 text-muted" value={filterCategory} onChange={handleChange('filterCategory')}>
                            <option value="">Todas as Categorias</option>
                            <option value="Support">Suporte</option>
                            <option value="Billing">Faturação</option>
                            <option value="Emergency">Emergência</option>
                            <option value="Technical">Técnico</option>
                        </Form.Select>
                    </Col>
                    {viewMode === 'admin' && (
                        <Col xs={12} md={3}>
                            <Form.Select size="sm" className="bg-light border-0 text-muted" value={filterCompany} onChange={handleChange('filterCompany')}>
                                <option value="">Todas as Empresas</option>
                                {companies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Form.Select>
                        </Col>
                    )}
                    <Col xs={6}>
                        <Form.Control type="date" size="sm" className="bg-light border-0 text-muted" value={startDate} onChange={handleChange('startDate')} />
                    </Col>
                    <Col xs={6}>
                        <Form.Control type="date" size="sm" className="bg-light border-0 text-muted" value={endDate} onChange={handleChange('endDate')} />
                    </Col>
                </Row>
            </Card.Header>

            {/* Lista renderizada a partir da resposta paginada da API. */}
            <Card.Body className="flex-grow-1 p-0 overflow-hidden">
                <TicketList
                    tickets={tickets}
                    selectedTicketId={selectedTicketId}
                    onSelectTicket={onSelectTicket}
                    loading={loading}
                />
            </Card.Body>

            {/* Paginação controlada pelo total devolvido pelo backend. */}
            <Card.Footer className="bg-white p-3 border-top d-flex justify-content-between align-items-center shrink-0 flex-wrap gap-2">
                <small className="text-muted">Total: {totalRecords} ticket(s)</small>
                <Pagination size="sm" className="mb-0">
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(Math.max(currentPage - 1, 1))} />
                    {paginationItems}
                    <Pagination.Next disabled={currentPage === totalPages || totalPages === 0} onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} />
                </Pagination>
            </Card.Footer>
        </Card>
    );
};

export default TicketSidebar;
