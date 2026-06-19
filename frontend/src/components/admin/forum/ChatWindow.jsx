import React from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, faPaperclip, faPaperPlane, 
  faDownload, faFileAlt, faUserCircle 
} from "@fortawesome/free-solid-svg-icons";

/**
 * Janela de chat estática usada como protótipo visual.
 * O fluxo real de tickets usa TicketChatWindow com mensagens vindas da API.
 */
const ChatWindow = ({ thread, onBack }) => {
  // Dados simulados para manter o layout disponível sem backend ligado a este componente.
  const messages = [
    { id: 1, text: "Bom dia. Já submetemos a matriz de ativos. Podem validar?", time: "10:30", isSelf: false, author: "Carlos Costa" },
    { id: 2, text: "Recebemos o ficheiro. Vamos analisar e damos feedback até ao final do dia.", time: "10:45", isSelf: true, author: "João Silva (Tu)" },
  ];

  return (
    <div className="d-flex flex-column h-100 animate-fade-in">
      {/* Cabeçalho do chat prototipado. */}
      <Card.Header className="bg-white p-3 border-bottom d-flex align-items-center gap-3 shrink-0 shadow-sm">
        <Button variant="light" className="rounded-circle border-0" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <div className="flex-grow-1">
          <h4 className="h6 fw-bold mb-0 text-dark">{thread.title}</h4>
          <small className="text-muted">Aberto há 2 horas</small>
        </div>
      </Card.Header>

      {/* Área rolável com mensagens simuladas. */}
      <Card.Body className="bg-light bg-opacity-50 overflow-auto p-4 custom-scrollbar flex-grow-1">
        <div className="d-flex flex-column gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`d-flex flex-column ${msg.isSelf ? 'align-items-end' : 'align-items-start'}`}>
              <div className="d-flex align-items-center gap-2 mb-1 px-1">
                {!msg.isSelf && <FontAwesomeIcon icon={faUserCircle} className="text-secondary small" />}
                <span className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>{msg.author}</span>
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>{msg.time}</span>
              </div>
              
              <div 
                className={`p-3 rounded-4 shadow-sm text-sm ${msg.isSelf ? 'bg-primary text-white rounded-tr-0' : 'bg-white text-dark border rounded-tl-0'}`}
                style={{ maxWidth: '85%', lineHeight: '1.5' }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Exemplo visual de anexo para validar o layout. */}
          <div className="d-flex align-items-start gap-2">
            <div className="bg-white border p-3 rounded-4 shadow-sm d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                <FontAwesomeIcon icon={faFileAlt} size="lg" />
              </div>
              <div className="me-3">
                <div className="fw-bold small text-dark">matriz_ativos_v1.xlsx</div>
                <div className="text-muted" style={{ fontSize: '0.65rem' }}>1.2 MB • Excel</div>
              </div>
              <Button variant="light" size="sm" className="rounded-circle">
                <FontAwesomeIcon icon={faDownload} />
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>

      {/* Entrada fixa no fundo para espelhar a experiência real de chat. */}
      <Card.Footer className="bg-white p-3 border-top shrink-0">
        <InputGroup className="bg-light rounded-4 border-0 p-1">
          <Button variant="link" className="text-secondary border-0 px-3 hover-text-primary">
            <FontAwesomeIcon icon={faPaperclip} />
          </Button>
          <Form.Control
            placeholder="Escreva a sua resposta..."
            className="bg-transparent border-0 shadow-none py-2"
            as="textarea"
            rows={1}
            style={{ resize: 'none' }}
          />
          <Button 
            className="rounded-4 px-4 ms-2 border-0 shadow-sm d-flex align-items-center" 
            style={{ backgroundColor: '#8b5cf6' }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </InputGroup>
      </Card.Footer>
    </div>
  );
};

export default ChatWindow;
