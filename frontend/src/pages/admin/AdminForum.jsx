import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from "@fortawesome/free-solid-svg-icons";

// Importar os novos componentes
import ClientSidebar from '../../components/admin/forum/ClientSidebar';
import ThreadList from '../../components/admin/forum/ThreadList';
import ChatWindow from '../../components/admin/forum/ChatWindow';

const AdminForum = () => {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedThreadId, setSelectedThreadId] = useState(null);

    // MOCK DATA (Virá da DB futuramente)
    const clients = [
        { id: 'c1', name: 'TechCorp SA', unread: 2 },
        { id: 'c2', name: 'Banco Finance', unread: 0 },
        { id: 'c3', name: 'Hospitais Lda', unread: 5 },
    ];

    const threads = [
        { id: 't1', clientId: 'c1', title: 'Avaliação de Ativos', desc: 'Discussão sobre inventário...', time: '10:30 Hoje', unread: true },
        { id: 't2', clientId: 'c1', title: 'Erro no Report Q1', desc: 'Dúvidas sobre conformidade...', time: 'Ontem', unread: false },
    ];

    const activeClient = clients.find(c => c.id === selectedClientId);
    const activeThread = threads.find(t => t.id === selectedThreadId);
    const clientThreads = threads.filter(t => t.clientId === selectedClientId);

    return (
        <div className="py-2 h-100">
            <div className="mb-4">
                <h2 className="fs-4 fw-bold text-dark">Fórum de Comunicação</h2>
                <p className="text-muted small">Fale diretamente com os clientes e gira os tickets de suporte.</p>
            </div>

            <Row className="g-4 h-100">
                {/* COLUNA ESQUERDA: LISTA DE TICKETS */}
                <Col lg={8} xl={9}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden" style={{ minHeight: '600px' }}>
                        {!selectedClientId ? (
                            /* 1. NENHUM CLIENTE SELECIONADO */
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-5">
                                <div className="bg-light rounded-circle p-4 mb-3">
                                    <FontAwesomeIcon icon={faComments} size="3x" className="text-secondary opacity-25" />
                                </div>
                                <h4 className="fw-bold text-dark">Selecione um Cliente</h4>
                                <p className="text-muted mx-auto" style={{ maxWidth: '350px' }}>
                                    Escolha um cliente na lista lateral para visualizar os tickets abertos.
                                </p>
                            </Card.Body>
                        ) : selectedThreadId ? (
                            /* 2. TICKET SELECIONADO -> MOSTRA O CHAT */
                            <ChatWindow
                                thread={activeThread}
                                onBack={() => setSelectedThreadId(null)}
                            />
                        ) : (
                            /* 3. CLIENTE SELECIONADO MAS SEM TICKET -> MOSTRA LISTA DE TICKETS */
                            <ThreadList
                                activeClient={activeClient}
                                threads={clientThreads}
                                onSelectThread={setSelectedThreadId}
                            />
                        )}
                    </Card>
                </Col>

                {/* COLUNA DIREITA: LISTA DE CLIENTES */}
                <Col lg={4} xl={3}>
                    <ClientSidebar
                        clients={clients}
                        selectedClientId={selectedClientId}
                        onSelectClient={(id) => {
                            setSelectedClientId(id);
                            setSelectedThreadId(null); // Resetar thread ao mudar de cliente
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default AdminForum;