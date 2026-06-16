import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, faBuildingShield, faScaleUnbalanced, faTriangleExclamation,
  faCircleCheck, faArrowRight, faHandshakeAngle, faFileShield, faUserLock
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import LayoutWebsite from '../components/LayoutWebsite';

// O mesmo estilo escuro usado na tua Home.jsx
const darkSection = {
  backgroundColor: "#0f172a",
  color: "white",
};

const Nis2Page = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LayoutWebsite>
      <div className="overflow-hidden bg-light">
        
        {/* ========================================== */}
        {/* HERO SECTION (Alinhado com a Home)         */}
        {/* ========================================== */}
        <section style={darkSection} className="position-relative py-5">
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <Container className="px-4 py-5 position-relative z-1">
            <Row className="align-items-center py-5">
              <Col lg={9}>
                <h1 className="display-5 fw-bold mb-4 text-white lh-sm">
                  A sua organização está preparada para a Diretiva NIS2?
                </h1>
                <p className="fs-5 text-white-50 mb-5" style={{ maxWidth: '800px' }}>
                  A nova legislação de cibersegurança da União Europeia já está em vigor. O não cumprimento estabelece sanções severas e responsabilidade direta para a administração.
                </p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                  onClick={() => navigate('/#contact')}
                >
                  Avaliar Impacto na Minha Empresa <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================== */}
        {/* O QUE É A NIS2                             */}
        {/* ========================================== */}
        <section className="py-5 bg-white">
          <Container className="px-4 py-5">
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <h2 className="display-6 fw-bold mb-4 text-dark">O que é a Diretiva NIS2?</h2>
                <p className="fs-5 text-secondary mb-4">
                  A <strong>NIS2 (Network and Information Security Directive)</strong> é o novo padrão europeu para a resiliência cibernética. Veio substituir a antiga diretiva de 2016, expandindo o número de setores obrigados a adotar medidas rigorosas de gestão de risco.
                </p>
                <p className="fs-5 text-secondary mb-0">
                  O objetivo é criar um nível comum e robusto de cibersegurança na Europa, protegendo as infraestruturas que suportam a economia e a sociedade.
                </p>
              </Col>
              <Col lg={6}>
                <Card className="border-0 shadow-sm rounded-4 bg-primary-subtle p-4">
                  <Card.Body>
                    <h4 className="fw-bold text-primary-emphasis mb-3 d-flex align-items-center">
                      <FontAwesomeIcon icon={faShieldHalved} className="me-2" /> Foco no Gestor
                    </h4>
                    <p className="text-dark mb-0 fs-5">
                      Ao contrário de legislações anteriores, a NIS2 foca-se na governança. <strong>Os órgãos de administração podem ser responsabilizados diretamente</strong> pela aprovação e supervisão das medidas de segurança da empresa.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================== */}
        {/* QUEM ESTÁ ABRANGIDO?                       */}
        {/* ========================================== */}
        <section className="py-5 bg-light border-top border-bottom">
          <Container className="px-4 py-5">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-4 text-dark">A sua Empresa está Abrangida?</h2>
              <p className="fs-5 text-secondary mx-auto" style={{ maxWidth: '800px' }}>
                A diretiva aplica-se a médias e grandes organizações (mais de 50 colaboradores ou faturação superior a 10M€) que operem em setores críticos.
              </p>
            </div>

            <Row className="g-4 justify-content-center">
              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary-subtle text-primary p-3 rounded-3 me-3">
                        <FontAwesomeIcon icon={faBuildingShield} size="lg" />
                      </div>
                      <h4 className="fw-bold mb-0 text-dark">Sectores Altamente Críticos</h4>
                    </div>
                    <ListGroup variant="flush" className="fs-6 text-secondary">
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">⚡ Energia (Eletricidade, Petróleo, Gás)</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">🚂 Transportes (Aéreo, Ferroviário, Marítimo)</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">🏥 Saúde (Hospitais, Laboratórios)</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">💧 Água (Abastecimento e Residuais)</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-0">🌐 Infraestrutura Digital (Cloud, Telecom)</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-info-subtle text-info-emphasis p-3 rounded-3 me-3">
                        <FontAwesomeIcon icon={faScaleUnbalanced} size="lg" />
                      </div>
                      <h4 className="fw-bold mb-0 text-dark">Outros Sectores Críticos</h4>
                    </div>
                    <ListGroup variant="flush" className="fs-6 text-secondary">
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">📮 Serviços Postais e de Estafetas</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">♻️ Gestão de Resíduos e Reciclagem</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">🧪 Produtos Químicos</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-bottom">🚜 Produção e Distribuição Alimentar</ListGroup.Item>
                      <ListGroup.Item className="px-0 py-3 bg-transparent border-0">🏭 Fabricação (Eletrónica, Maquinaria)</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================== */}
        {/* REQUISITOS ESSENCIAIS                      */}
        {/* ========================================== */}
        <section className="py-5 bg-white">
          <Container className="px-4 py-5">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-4 text-dark">Os Pilares de Cumprimento</h2>
              <p className="fs-5 text-secondary">A organização terá de comprovar a implementação de políticas estritas.</p>
            </div>

            <Row className="g-5">
              <Col md={4} className="text-center">
                <div className="bg-primary-subtle text-primary d-inline-flex p-4 rounded-circle mb-4">
                  <FontAwesomeIcon icon={faFileShield} size="2x" />
                </div>
                <h5 className="fw-bold text-dark mb-3">Políticas de Segurança</h5>
                <p className="text-secondary">Desenho de políticas formais de análise de risco e segurança de sistemas de informação.</p>
              </Col>

              <Col md={4} className="text-center">
                <div className="bg-warning-subtle text-warning-emphasis d-inline-flex p-4 rounded-circle mb-4">
                  <FontAwesomeIcon icon={faTriangleExclamation} size="2x" />
                </div>
                <h5 className="fw-bold text-dark mb-3">Gestão de Incidentes</h5>
                <p className="text-secondary">Procedimentos para prevenir, detetar e reportar incidentes às autoridades em menos de 24 horas.</p>
              </Col>

              <Col md={4} className="text-center">
                <div className="bg-secondary-subtle text-secondary-emphasis d-inline-flex p-4 rounded-circle mb-4">
                  <FontAwesomeIcon icon={faUserLock} size="2x" />
                </div>
                <h5 className="fw-bold text-dark mb-3">Cadeia de Abastecimento</h5>
                <p className="text-secondary">Avaliação do nível de segurança de todos os fornecedores e prestadores de serviços de IT externos.</p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================== */}
        {/* AS SANÇÕES (O RISCO)                       */}
        {/* ========================================== */}
        <section className="py-5 bg-danger-subtle text-danger-emphasis border-top border-bottom border-danger border-opacity-25">
          <Container className="px-4 py-5 text-center">
            <FontAwesomeIcon icon={faTriangleExclamation} size="3x" className="mb-4 text-danger" />
            <h2 className="display-6 fw-bold mb-4">O Risco Financeiro</h2>
            <p className="fs-5 mx-auto mb-5 text-danger-emphasis" style={{ maxWidth: '800px' }}>
              As coimas previstas pela Diretiva NIS2 são equiparáveis às do RGPD, desenhadas para punir severamente a negligência organizacional:
            </p>
            <Row className="justify-content-center g-4">
              <Col md={5}>
                <Card className="border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                  <Card.Body>
                    <h3 className="display-6 fw-bold text-danger mb-3">Até 10M€</h3>
                    <p className="fs-5 text-secondary mb-0">ou <strong>2% da faturação mundial</strong> anual (o que for maior) para Entidades Essenciais.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={5}>
                <Card className="border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                  <Card.Body>
                    <h3 className="display-6 fw-bold text-danger mb-3">Até 7M€</h3>
                    <p className="fs-5 text-secondary mb-0">ou <strong>1.4% da faturação mundial</strong> anual (o que for maior) para Entidades Importantes.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================== */}
        {/* CTA FINAL (Escuro, a combinar com os contactos) */}
        {/* ========================================== */}
        <section style={darkSection} className="py-5 text-center">
          <Container className="px-4 py-5">
            <div className="mb-4">
              <FontAwesomeIcon icon={faHandshakeAngle} size="3x" className="text-primary mb-4" />
              <h2 className="display-6 fw-bold mb-4 text-white">Evite coimas e proteja a sua governança</h2>
              <p className="fs-5 text-white-50 mx-auto mb-5" style={{ maxWidth: '700px' }}>
                Fale com um dos nossos especialistas e garanta a continuidade do seu negócio de forma segura.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-pill fw-bold px-5 py-3 shadow-sm"
                onClick={() => navigate('/#contact')}
              >
                Agendar Reunião de Diagnóstico
              </Button>
            </div>
          </Container>
        </section>

      </div>
    </LayoutWebsite>
  );
};

export default Nis2Page;