import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUserCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import forumApi from '../../../api/forumApi';

const TicketChatWindow = ({ ticket, currentUserId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Load messages on component mount or when ticket changes
    useEffect(() => {
        if (ticket) {
            loadMessages();
        }
    }, [ticket?.id, ticket?.assigned_to_user_id, ticket?.status]);

    const loadMessages = async () => {
        // Só mostra o ecrã inteiro de loading se for a primeira vez que carrega o chat
        if (messages.length === 0) {
            setLoading(true);
        }
        setError(null);
        try {
            const data = await forumApi.getTicketMessages(ticket.id);
            setMessages(data || []);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages:', error);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        setSending(true);
        setError(null);
        try {
            // Passamos null no chatId, o ID do ticket no 2º argumento, e o texto no 3º
            const newMessage = await forumApi.sendMessageToTicket(null, ticket.id, messageContent);

            // A API devolve o formato { message: "...", data: { ... } }
            // Extraímos a mensagem real para o React conseguir ler o sender_id e o content
            const actualMessage = newMessage?.data ? newMessage.data : newMessage;
            setMessages([...messages, actualMessage]);
            setMessageContent('');
            scrollToBottom();

            // Removido o onMessageSent() propositadamente. A mensagem já é 
            // atualizada no chat instantaneamente pelo setMessages acima.
            // Assim evitamos que o componente pai recarregue a lista e feche o ticket.
        } catch (error) {
            console.error('Failed to send message:', error);
            setError(error.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (loading && messages.length === 0) {
        return (
            <Card className="h-100 d-flex align-items-center justify-content-center">
                <Card.Body className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading messages...</span>
                    </Spinner>
                    <p className="text-muted">Loading messages...</p>
                </Card.Body>
            </Card>
        );
    }

    if (!ticket) {
        return (
            <Card className="h-100 d-flex align-items-center justify-content-center">
                <Card.Body className="text-center text-muted">
                    <p>No chat available for this ticket</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="d-flex flex-column h-100 animate-fade-in border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Header */}
            <Card.Header className="bg-white p-3 border-bottom d-flex align-items-center gap-3 shrink-0 shadow-sm">
                <Button variant="light" size="sm" className="rounded-circle border-0" onClick={onBack} title="Voltar à lista">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <div className="flex-grow-1">
                    <h6 className="h6 fw-bold mb-0 text-dark">Ticket #{ticket.id} - Chat</h6>
                    <small className="text-muted">{ticket.subject}</small>
                </div>
            </Card.Header>

            {/* Messages Area */}
            <Card.Body className="bg-light bg-opacity-50 overflow-auto p-4 custom-scrollbar flex-grow-1">
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                {messages.length === 0 ? (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`d-flex flex-column ${msg.sender_id === currentUserId ? 'align-items-end' : 'align-items-start'}`}
                            >
                                <div className="d-flex align-items-center gap-2 mb-1 px-1">
                                    {msg.sender_id !== currentUserId && (
                                        <FontAwesomeIcon icon={faUserCircle} className="text-secondary small" />
                                    )}
                                    <span className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
                                        {msg.sender_id === currentUserId ? 'You' : (msg.User?.name || 'Manager')}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div
                                    className={`p-3 rounded-4 shadow-sm text-sm ${
                                        msg.sender_id === currentUserId
                                            ? 'bg-primary text-white rounded-tr-0'
                                            : 'bg-white text-dark border rounded-tl-0'
                                    }`}
                                    style={{ maxWidth: '85%', lineHeight: '1.5', wordBreak: 'break-word' }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </Card.Body>

            {/* Message Input */}
            <Card.Footer className="bg-white p-3 border-top shrink-0">
                {!ticket.assigned_to_user_id ? (
                    <div className="text-center text-muted p-2 bg-light rounded-3 border">
                        <small>O chat será ativado assim que um gestor assumir este ticket.</small>
                    </div>
                ) : ticket.status === 'Closed' ? (
                    <div className="text-center text-muted p-2 bg-light rounded-3 border">
                        <small>Este ticket encontra-se fechado. Não é possível enviar novas mensagens.</small>
                    </div>
                ) : (
                    <Form onSubmit={handleSendMessage}>
                        <InputGroup className="bg-light rounded-4 border-0 p-1">
                            <Form.Control
                                placeholder="Escreva a sua mensagem..."
                                className="bg-transparent border-0 shadow-none py-2"
                                as="textarea"
                                rows={1}
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                disabled={sending}
                                style={{ resize: 'none', maxHeight: '100px' }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                className="rounded-4 px-4 ms-2 border-0 shadow-sm d-flex align-items-center"
                                style={{ backgroundColor: '#8b5cf6' }}
                                disabled={sending || !messageContent.trim()}
                            >
                                {sending ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                )}
                            </Button>
                        </InputGroup>
                    </Form>
                )}
            </Card.Footer>
        </Card>
    );
};

export default TicketChatWindow;
