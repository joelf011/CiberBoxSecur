import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPlus, faBuilding, faClock } from "@fortawesome/free-solid-svg-icons";

const ThreadList = ({ activeClient, threads, onSelectThread }) => {
  return (
    <>
      <Card.Header className="bg-white p-4 border-bottom border-light d-flex justify-content-between align-items-center">
        <div>
          <h3 className="h5 fw-bold mb-0 text-dark">
            <FontAwesomeIcon icon={faBuilding} className="text-primary me-2" />
            {activeClient?.name}
          </h3>
          <small className="text-muted">Tickets de suporte ativos</small>
        </div>
        <Button variant="primary" className="rounded-3 px-3 border-0 shadow-sm" style={{ backgroundColor: '#8b5cf6' }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Nova Thread
        </Button>
      </Card.Header>

      <Card.Body className="bg-light bg-opacity-25 p-4">
        <div className="d-flex flex-column gap-3">
          {threads.map(thread => (
            <Card 
              key={thread.id} 
              className={`border-0 shadow-sm rounded-4 transition-all cursor-pointer ${thread.unread ? 'border-start border-4 border-primary' : ''}`}
              onClick={() => onSelectThread(thread.id)}
            >
              <Card.Body className="p-4 d-flex gap-3">
                <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${thread.unread ? 'bg-primary-subtle text-primary' : 'bg-light text-secondary'}`} style={{ width: '48px', height: '48px' }}>
                  <FontAwesomeIcon icon={faComments} />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className={`h6 mb-0 ${thread.unread ? 'fw-bold text-dark' : 'fw-semibold text-secondary'}`}>{thread.title}</h5>
                    <small className="text-muted"><FontAwesomeIcon icon={faClock} className="me-1" /> {thread.time}</small>
                  </div>
                  <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '500px' }}>{thread.desc}</p>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </>
  );
};

export default ThreadList;