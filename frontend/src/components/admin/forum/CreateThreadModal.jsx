import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faAlignLeft } from "@fortawesome/free-solid-svg-icons";

const CreateThreadModal = ({ show, onHide, clientName, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered className="animate-fade-in">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          Nova Thread para {clientName}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={onSubmit}>
        <Modal.Body className="py-4">
          {/* Campo de Título */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faPen} className="me-2" /> Título do Tópico
            </Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Ex: Auditoria Interna NIS2" 
              required
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
            />
          </Form.Group>

          {/* Campo de Mensagem Inicial */}
          <Form.Group className="mb-2">
            <Form.Label className="small fw-bold text-secondary text-uppercase">
              <FontAwesomeIcon icon={faAlignLeft} className="me-2" /> Mensagem Inicial
            </Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              placeholder="Descreva o objetivo desta thread ou deixe uma mensagem para o cliente..." 
              required
              className="py-2 rounded-3 border-light-subtle shadow-sm shadow-none"
              style={{ resize: 'none' }}
            />
          </Form.Group>
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
            O cliente receberá uma notificação assim que a thread for criada.
          </small>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 pb-4 px-4">
          <Button variant="light" onClick={onHide} className="rounded-3 px-4 fw-medium border-0">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="rounded-3 px-4 border-0 shadow-sm fw-bold" 
            style={{ backgroundColor: '#8b5cf6' }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Criar Thread
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateThreadModal;