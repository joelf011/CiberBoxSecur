import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Badge, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, faExclamationCircle, faSpinner, faCheckCircle, faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import { dashboardApi } from '../../api/dashboardApi';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

/**
 * Responsável por:
 * - Mostrar KPIs, gráficos e incidentes recentes do utilizador autenticado.
 * - Consumir dados agregados já filtrados pelo backend.
 *
 * Fluxo:
 * Dashboard -> dashboardApi -> /dashboard -> Incidents -> Gráficos e tabela.
 */
// Regista os componentes necessários do Chart.js antes de renderizar gráficos.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement);

const Dashboard = () => {
  // Navegação usada para abrir o detalhe de um incidente a partir da tabela.
  const navigate = useNavigate();

  // Permissões locais apenas ajustam textos; o backend decide o âmbito dos dados.
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = loggedInUser.permissions?.includes('VIEW_ALL_INCIDENTS') || loggedInUser.role_id === 1;

  // Estado de carregamento da chamada agregada ao backend.
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega métricas já agregadas pelo service do dashboard.
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Não foi possível carregar os dados do painel. ' + (err.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Mostra feedback enquanto a API ainda não devolveu dados.
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h5 className="text-muted">A carregar estatísticas...</h5>
      </div>
    );
  }

  // Falhas da API são apresentadas sem desmontar o layout do backoffice.
  if (error) {
    return (
      <Alert variant="danger" className="rounded-4 border-0 shadow-sm mt-4">
        <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
        <strong>Erro:</strong> {error}
      </Alert>
    );
  }

  // Dados vindos do backend: KPIs, gráficos e tabela de incidentes.
  const { kpis, barChartData, pieChartData, recentIncidents } = dashboardData;

  // Adapta o formato da API ao formato esperado pelo Chart.js.
  const barData = {
    labels: barChartData.map(item => item.name),
    datasets: [
      {
        label: 'Incidentes',
        data: barChartData.map(item => item.incidentes),
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
      y: { beginAtZero: true, grid: { borderDash: [5, 5] }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } }
    }
  };

  const pieData = {
    labels: pieChartData.length > 0 ? pieChartData.map(item => item.name) : ['Sem Dados'],
    datasets: [
      {
        data: pieChartData.length > 0 ? pieChartData.map(item => item.value) : [1],
        backgroundColor: pieChartData.length > 0 
          ? ['#0d6efd', '#dc3545', '#ffc107', '#6c757d', '#198754'] 
          : ['#e9ecef'], // Estado neutro quando não existem dados para o gráfico.
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
      
      {/* Resumo contextual para o utilizador autenticado. */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">
            <FontAwesomeIcon icon={faChartLine} className="text-primary me-2" /> Dashboard
          </h2>
          <p className="text-muted small mb-0">
            Olá, <strong>{loggedInUser.name || 'Utilizador'}</strong>. 
            {isAdmin ? ' Aqui tens o resumo global da plataforma.' : ' Aqui tens o resumo dos teus serviços.'}
          </p>
        </div>
      </div>

      {/* Cartões KPI calculados no backend. */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <Card.Body className="p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>Abertos</p>
                <h3 className="fw-bold mb-0 text-dark">{kpis.open}</h3>
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
                <h3 className="fw-bold mb-0 text-dark">{kpis.investigating}</h3>
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
                <h3 className="fw-bold mb-0 text-dark">{kpis.resolved}</h3>
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
                <h3 className="fw-bold mb-0 text-primary">{kpis.critical}</h3>
              </div>
              <div className="text-primary">
                <FontAwesomeIcon icon={faShieldAlt} size="2x" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos alimentados pelos agregados de incidentes. */}
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

      {/* Incidentes recentes com navegação para o detalhe. */}
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
              {recentIncidents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted fst-italic">
                    Ainda não existem incidentes registados.
                  </td>
                </tr>
              ) : (
                recentIncidents.map((inc) => (
                  <tr 
                    key={inc.id} 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => navigate(`/portal/incidentes/${inc.id}`)} // Abre o detalhe do incidente selecionado.
                  >
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
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
