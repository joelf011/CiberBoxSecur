import React from 'react';
import { Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, faExclamationCircle, faSpinner, faCheckCircle, faChartLine 
} from '@fortawesome/free-solid-svg-icons';

// Importações do Chart.js
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Registar os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

const Dashboard = () => {
  // LÓGICA DE PERMISSÕES
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = loggedInUser.permissions?.includes('VIEW_ALL_INCIDENTS') || loggedInUser.role_id === 1;

  // DADOS FALSOS (MOCK DATA)
  const kpiData = {
    open: isAdmin ? 45 : 2,
    investigating: isAdmin ? 12 : 1,
    resolved: isAdmin ? 128 : 5,
    critical: isAdmin ? 3 : 0
  };

  const recentIncidents = [
    { id: 1042, title: 'Servidor de Email em baixo', status: 'Open', severity: 'High', date: 'Hoje, 10:30' },
    { id: 1041, title: 'Tentativa de Login Suspeita', status: 'Investigating', severity: 'Medium', date: 'Hoje, 09:15' },
    { id: 1040, title: 'Atualização de Firewall falhou', status: 'Resolved', severity: 'Low', date: 'Ontem' },
  ];

  // CONFIGURAÇÃO DOS GRÁFICOS (CHART.JS)
  const barData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [
      {
        label: 'Incidentes',
        data: isAdmin ? [40, 30, 45, 25, 55] : [1, 0, 2, 1, 3],
        backgroundColor: '#0d6efd',
        borderRadius: 4,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
      x: { grid: { display: false } }
    }
  };

  const pieData = {
    labels: ['Phishing', 'Ransomware', 'Hardware', 'Outros'],
    datasets: [
      {
        data: isAdmin ? [40, 10, 30, 20] : [2, 0, 5, 1],
        backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#6c757d'],
        borderWidth: 0,
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
  };

  return (
    <div className="animate-fade-in py-2">
      
      {/* CABEÇALHO (Botão de refresh removido) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faChartLine} className="text-primary me-2" /> Dashboard
          </h2>
          <p className="text-muted small mb-0">
            Olá, <strong>{loggedInUser.name || 'Utilizador'}</strong> 👋. 
            {isAdmin ? ' Aqui tens o resumo global da plataforma.' : ' Aqui tens o resumo dos teus serviços.'}
          </p>
        </div>
      </div>

      {/* SECÇÃO 1: CARTÕES KPI */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>Abertos</p>
                <h3 className="fw-bold mb-0 text-dark">{kpiData.open}</h3>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                <FontAwesomeIcon icon={faExclamationCircle} size="lg" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>Em Investigação</p>
                <h3 className="fw-bold mb-0 text-dark">{kpiData.investigating}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                <FontAwesomeIcon icon={faSpinner} size="lg" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>Resolvidos</p>
                <h3 className="fw-bold mb-0 text-dark">{kpiData.resolved}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                <FontAwesomeIcon icon={faCheckCircle} size="lg" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-primary bg-opacity-10">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-primary small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>Críticos Ativos</p>
                <h3 className="fw-bold mb-0 text-primary">{kpiData.critical}</h3>
              </div>
              <div className="text-primary">
                <FontAwesomeIcon icon={faShieldAlt} size="2x" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SECÇÃO 2: GRÁFICOS */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Body className="p-4">
              <h5 className="fs-6 fw-bold text-dark mb-4">Volume de Incidentes (Últimos 5 meses)</h5>
              <div style={{ height: '300px', position: 'relative' }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Body className="p-4">
              <h5 className="fs-6 fw-bold text-dark mb-4">Tipologia de Ataques</h5>
              <div style={{ height: '300px', position: 'relative' }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SECÇÃO 3: TABELA DE AÇÃO RÁPIDA */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
          <h5 className="fs-6 fw-bold text-dark mb-2">Incidentes Recentes</h5>
        </Card.Header>
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light border-bottom text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <tr>
                <th className="px-4 py-3 text-muted">Ticket ID</th>
                <th className="py-3 text-muted">Resumo do Problema</th>
                <th className="py-3 text-muted">Estado</th>
                <th className="py-3 text-muted">Criticidade</th>
                <th className="px-4 py-3 text-muted text-end">Data</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.85rem' }}>
              {recentIncidents.map((inc) => (
                <tr key={inc.id} style={{ cursor: 'pointer' }}>
                  <td className="px-4 py-3 fw-bold text-secondary">#{inc.id}</td>
                  <td className="py-3 fw-medium text-dark">{inc.title}</td>
                  <td className="py-3">
                    <Badge bg={inc.status === 'Open' ? 'danger' : inc.status === 'Resolved' ? 'success' : 'warning'} className="fw-normal">
                      {inc.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge bg="light" text="dark" className="border fw-normal">{inc.severity}</Badge>
                  </td>
                  <td className="px-4 py-3 text-end text-muted">{inc.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;