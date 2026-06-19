import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faUserCircle,
  faChevronLeft,
  faPaperclip,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import forumApi from "../../../api/forumApi";
import api from "../../../api/axiosConfig";

/**
 * Responsável por:
 * - Mostrar e enviar mensagens de um ticket assumido.
 * - Suportar anexos via multipart/form-data para o backend.
 *
 * Fluxo:
 * Ticket selecionado -> /tickets/:id/messages -> /chats/messages -> Estado local.
 */
const TicketChatWindow = ({ ticket, currentUser, onBack }) => {
  // Aguarda pelos dados do utilizador antes de calcular autoria das mensagens.
  if (!currentUser) {
    return (
      <Card className="h-100 d-flex align-items-center justify-content-center border-0 shadow-sm rounded-4">
        <Card.Body className="text-center text-muted">
          <Spinner animation="border" role="status" className="mb-3" />
          <p>A carregar dados de utilizador...</p>
        </Card.Body>
      </Card>
    );
  }

  const currentUserId = currentUser.id;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Recarrega mensagens quando muda ticket, gestor atribuído ou estado.
  useEffect(() => {
    if (ticket) {
      loadMessages();
    }
  }, [ticket?.id, ticket?.assigned_to_user_id, ticket?.status]);

  const loadMessages = async () => {
    // Evita flicker em atualizações posteriores mantendo mensagens já visíveis.
    if (messages.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await forumApi.getTicketMessages(ticket.id);
      setMessages(data || []);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Falha ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim() && !attachment) return;

    setSending(true);
    setError(null);
    try {
      const formData = new FormData();
      if (ticket.id) formData.append("ticket_id", ticket.id);
      if (messageContent.trim()) formData.append("content", messageContent);
      if (attachment) formData.append("attachment", attachment);

      const response = await api.post("/chats/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newMessage = response.data;

      const actualMessage = newMessage?.data ? newMessage.data : newMessage;
      setMessages([...messages, actualMessage]);
      setMessageContent("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      scrollToBottom();

      // Atualização otimista local evita recarregar a lista e perder o ticket aberto.
    } catch (error) {
      console.error("Failed to send message:", error);
      setError(
        error.response?.data?.error ||
          "Falha ao enviar mensagem. Por favor, tente novamente.",
      );
    } finally {
      setSending(false);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <Card className="h-100 d-flex align-items-center justify-content-center">
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">A carregar mensagens...</span>
          </Spinner>
          <p className="text-muted">A carregar mensagens...</p>
        </Card.Body>
      </Card>
    );
  }

  // Resolve avatar vindo da BD, localStorage ou caminho relativo de upload.
  const renderAvatar = (user) => {
    if (!user || !user.avatar) {
      return (
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-secondary"
          style={{ fontSize: "1.75rem" }}
        />
      );
    }

    let avatarUrl = user.avatar;
    // Base64 vem do cropper de perfil; caminhos relativos vêm do backend.
    if (
      !user.avatar.startsWith("data:image") &&
      !user.avatar.startsWith("http")
    ) {
      // Constrói URL absoluto sem duplicar barras entre host e caminho.
      const baseUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
        : "http://localhost:5000";
      const separator = user.avatar.startsWith("/") ? "" : "/";
      avatarUrl = `${baseUrl}${separator}${user.avatar}`;
    }

    return (
      <img
        src={avatarUrl}
        alt={`${user.name || "User"}'s avatar`}
        className="rounded-circle object-fit-cover shadow-sm border border-secondary border-opacity-25"
        style={{ width: "28px", height: "28px" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${user.name ? user.name.charAt(0) : "U"}&background=random`;
        }}
      />
    );
  };

  if (!ticket) {
    return (
      <Card className="h-100 d-flex align-items-center justify-content-center">
        <Card.Body className="text-center text-muted">
          <p>Nenhum chat disponível para este ticket</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="d-flex flex-column h-100 animate-fade-in border-0 shadow-sm rounded-4 overflow-hidden">
      {/* Cabeçalho do ticket aberto. */}
      <Card.Header className="bg-white p-3 border-bottom d-flex align-items-center gap-3 shrink-0 shadow-sm">
        <Button
          variant="light"
          size="sm"
          className="rounded-circle border-0"
          onClick={onBack}
          title="Voltar à lista"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <div className="flex-grow-1">
          <h6 className="h6 fw-bold mb-0 text-dark">
            Ticket #{ticket.id} - Chat
          </h6>
          <small className="text-muted">{ticket.subject}</small>
        </div>
      </Card.Header>

      {/* Histórico de mensagens devolvido pelo backend. */}
      <Card.Body className="bg-light bg-opacity-50 overflow-auto p-4 custom-scrollbar flex-grow-1">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {messages.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Ainda sem mensagens. Inicie a conversa!</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {messages.map((msg) => {
              const isSelf = msg.sender_id === currentUserId;

              // msg.User traz a versão persistida; currentUser serve apenas de fallback local.
              const messageUser = isSelf ? msg.User || currentUser : msg.User;

              return (
                <div
                  key={msg.id}
                  className={`d-flex flex-column ${isSelf ? "align-items-end" : "align-items-start"}`}
                >
                  {/* Inverte avatar e nome nas mensagens enviadas pelo próprio utilizador. */}
                  <div
                    className={`d-flex align-items-center gap-2 mb-1 px-1 ${isSelf ? "flex-row-reverse" : ""}`}
                  >
                    {renderAvatar(messageUser)}
                    <span
                      className="fw-bold text-dark"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {isSelf ? "Tu" : msg.User?.name || "Gestor"}
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-4 shadow-sm text-sm ${
                      isSelf
                        ? "bg-primary text-white rounded-tr-0"
                        : "bg-white text-dark border rounded-tl-0"
                    }`}
                    style={{
                      maxWidth: "85%",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.content && <div>{msg.content}</div>}
                    {msg.attachment && (
                      <div
                        className={`mt-2 p-2 rounded ${isSelf ? "bg-white bg-opacity-25" : "bg-light"} border`}
                      >
                        <a
                          href={
                            msg.attachment.startsWith("http")
                              ? msg.attachment
                              : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : "http://localhost:5000"}${msg.attachment.startsWith("/") ? "" : "/"}${msg.attachment}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-decoration-none small d-flex align-items-center gap-2 ${isSelf ? "text-white" : "text-primary"}`}
                        >
                          <FontAwesomeIcon icon={faPaperclip} />
                          Ficheiro Anexado
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card.Body>

      {/* Entrada bloqueada quando o ticket não foi assumido ou já está fechado. */}
      <Card.Footer className="bg-white p-3 border-top shrink-0">
        {!ticket.assigned_to_user_id ? (
          <div className="text-center text-muted p-2 bg-light rounded-3 border">
            <small>
              O chat será ativado assim que um gestor assumir este ticket.
            </small>
          </div>
        ) : ticket.status === "Closed" ? (
          <div className="text-center text-muted p-2 bg-light rounded-3 border">
            <small>
              Este ticket encontra-se fechado. Não é possível enviar novas
              mensagens.
            </small>
          </div>
        ) : (
          <Form onSubmit={handleSendMessage}>
            {attachment && (
              <div className="px-3 py-2 mx-1 mb-2 bg-light border rounded-3 d-flex align-items-center justify-content-between animate-fade-in">
                <small className="text-muted d-flex align-items-center gap-2 text-truncate">
                  <FontAwesomeIcon icon={faPaperclip} />
                  {attachment.name}
                </small>
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger p-0 border-0 shadow-none"
                  onClick={() => {
                    setAttachment(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </div>
            )}
            <InputGroup className="bg-light rounded-4 border-0 p-1">
              <Button
                variant="light"
                className="rounded-4 px-3 border-0 shadow-sm text-secondary me-2 bg-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                <FontAwesomeIcon icon={faPaperclip} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt,.csv"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 50 * 1024 * 1024) {
                    setError(
                      "O ficheiro é demasiado grande. O limite máximo é 50MB.",
                    );
                    e.target.value = "";
                    return;
                  }
                  setAttachment(file);
                }}
              />
              <Form.Control
                placeholder="Escreva a sua mensagem..."
                className="bg-transparent border-0 shadow-none py-2"
                as="textarea"
                rows={1}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                disabled={sending}
                style={{ resize: "none", maxHeight: "100px" }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button
                variant="primary"
                type="submit"
                className="rounded-4 px-4 ms-2 border-0 shadow-sm d-flex align-items-center"
                disabled={sending || (!messageContent.trim() && !attachment)}
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
