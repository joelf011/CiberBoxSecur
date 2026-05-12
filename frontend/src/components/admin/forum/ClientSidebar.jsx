import React from 'react';
import { Card, InputGroup, Form, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCircle } from "@fortawesome/free-solid-svg-icons";

const ClientSidebar = ({ clients, selectedClientId, onSelectClient }) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Header className="bg-white p-4 border-0">
        <h4 className="h6 fw-bold mb-3">Lista de Clientes</h4>
        <InputGroup className="bg-light rounded-3 border-0 px-2">
          <InputGroup.Text className="bg-transparent border-0 text-muted">
            <FontAwesomeIcon icon={faSearch} size="sm" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Procurar..."
            className="bg-transparent border-0 shadow-none small py-2"
          />
        </InputGroup>
      </Card.Header>

      <ListGroup variant="flush" className="p-2 pt-0">
        {clients.map(client => (
          <ListGroup.Item 
            key={client.id}
            action
            onClick={() => onSelectClient(client.id)}
            className={`border-0 rounded-3 mb-1 d-flex align-items-center justify-content-between py-3 ${selectedClientId === client.id ? 'bg-primary-subtle' : ''}`}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="position-relative">
                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '11px' }}>
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                
              </div>
              <div>
                <div className="fw-bold text-dark small">{client.name}</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>Gestão NIS2</div>
              </div>
            </div>
            {client.unread > 0 && (
              <Badge bg="danger" pill style={{ fontSize: '0.65rem' }}>{client.unread}</Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default ClientSidebar;