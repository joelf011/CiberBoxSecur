import React from 'react';
import { Link } from 'react-router-dom';
import HelpCard from '../components/HelpCard';

const Home = () => {
  const heroStyle = {
    position: 'relative',
    backgroundColor: '#0f172a',
    backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 0'
  };

  const darkSection = {
    backgroundColor: '#0f172a',
    color: 'white'
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section style={heroStyle} className="text-white">
        <div className="container px-4">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-3 fw-extrabold mb-4 tracking-tight">
                Cibersegurança para organizações que não podem parar
              </h1>
              <p className="lead fs-4 text-secondary mb-5">
                Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos.
              </p>
            <button className="btn btn-primary fw-semibold d-inline-flex align-items-center gap-2 rounded-pill px-4">
              Começar agora
            </button>
            </div>
          </div>
        </div>
      </section>
      <section id="context" className="py-5 bg-white">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              <h2 className="display-6 fw-bold text-dark mb-5 text-center">Cibersegurança</h2>
              
              <div className="bg-light rounded-4 p-4 p-md-5 border">
                
                <p className="fs-6 lh-lg mb-5">
                  A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas.
                </p>
                
                <div className="row g-4 mb-5">
                  
                  {/* Item 1 - Ransomware */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-danger-subtle text-danger rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-shield-virus fs-4"></i>
                      </div>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">Ataques de ransomware</h3>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 - Vulnerabilidades */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-bug fs-4"></i>
                      </div>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">Exploração de vulnerabilidades</h3>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 - Infraestruturas */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-secondary-subtle text-secondary-emphasis rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-server fs-4"></i>
                      </div>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">Ataques a infraestruturas críticas</h3>
                      </div>
                    </div>
                  </div>

                  {/* Item 4 - Phishing */}
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-primary-subtle text-primary rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-envelope-open-text fs-4"></i>
                      </div>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">Campanhas de phishing direcionado</h3>
                      </div>
                    </div>
                  </div>

                </div>

                <p className="fs-6 lh-lg mb-0">
                  Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional, existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={darkSection} className="py-5 text-white">
        <div className="container px-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              <h2 className="display-6 fw-bold mb-5 text-center">
                Regulamentação Europeia
              </h2>
              
              {/* Caixa Principal Escura com bordas */}
              <div className="bg-secondary bg-opacity-10 rounded-4 p-4 p-md-5 border border-secondary border-opacity-50 shadow-sm">
                
                <p className="fs-6 text-white-50 lh-lg mb-5">
                  A União Europeia reforçou os requisitos de segurança através da diretiva <Link to="/nis2" className="fw-bold text-info text-decoration-none">NIS2 – Network and Information Security Directive</Link>. Esta diretiva impõe requisitos de gestão de risco, implementação de medidas técnicas e organizacionais e comunicação de incidentes.
                </p>
                
                <div className="row g-4">
                  
                  {/* Card 1 - Sanções (Vermelho) */}
                  <div className="col-md-4">
                    <div  style={darkSection} className="p-4 rounded-4 border border-secondary border-opacity-25 bg-opacity-50 h-100">
                      {/* A classe d-inline-flex garante que a caixa do ícone fica pequena e não ocupa a largura toda */}
                      <div className="d-inline-flex p-3 bg-danger bg-opacity-10 text-danger rounded-3 mb-3">
                        <i className="fa-solid fa-triangle-exclamation fs-4"></i>
                      </div>
                      <h3 className="h6 fw-bold text-white mb-0">Sanções financeiras significativas</h3>
                    </div>
                  </div>

                  {/* Card 2 - Responsabilidade (Laranja/Amarelo) */}
                  <div className="col-md-4">
                    <div style={darkSection} className="p-4 rounded-4 border border-secondary border-opacity-25 bg-opacity-50 h-100">
                      <div className="d-inline-flex p-3 bg-warning bg-opacity-10 text-warning rounded-3 mb-3">
                        {/* Troquei o ícone de editar por um escudo de utilizador, faz mais sentido para "Gestão" */}
                        <i className="fa-solid fa-user-shield fs-4"></i>
                      </div>
                      <h3 className="h6 fw-bold text-white mb-0">Responsabilidade da gestão</h3>
                    </div>
                  </div>

                  {/* Card 3 - Impacto (Azul/Ciano) */}
                  <div className="col-md-4">
                    <div style={darkSection} className="p-4 rounded-4 border border-secondary border-opacity-25 bg-opacity-50 h-100">
                      {/* Como o Bootstrap não tem cor roxa nativa, usei o "info" que fica lindíssimo em fundos escuros */}
                      <div className="d-inline-flex p-3 bg-info bg-opacity-10 text-info rounded-3 mb-3">
                        <i className="fa-solid fa-server fs-4"></i>
                      </div>
                      <h3 className="h6 fw-bold text-white mb-0">Impacto reputacional</h3>
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-5 bg-light">
        <div className="container px-4">
          
          {/* Cabeçalho da Secção */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-6 fw-bold text-dark mb-3">Como Ajudamos</h2>
              <p className="fs-5 text-secondary">
                Soluções especializadas para reforçar a sua postura de cibersegurança.
              </p>
            </div>
          </div>

          {/* Grelha dos Cards */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row g-4">
                
                {/* Card 1 */}
                <div className="col-md-6">
                  <HelpCard 
                    titulo="Avaliação de maturidade de cibersegurança"
                    descricao="Analisamos o estado atual da sua organização e identificamos áreas de melhoria prioritárias."
                    icone="fa-solid fa-circle-check"
                    corTema="primary"
                  />
                </div>

                {/* Card 2 */}
                <div className="col-md-6">
                  <HelpCard 
                    titulo="Implementação de requisitos da diretiva NIS2"
                    descricao="Apoiamos a sua organização no cumprimento integral dos requisitos regulamentares."
                    icone="fa-solid fa-shield-halved"
                    corTema="dark"
                  />
                </div>

                {/* Card 3 */}
                <div className="col-md-6">
                  <HelpCard 
                    titulo="Auditorias de segurança e testes técnicos"
                    descricao="Identificamos vulnerabilidades através de testes de penetração e auditorias especializadas."
                    icone="fa-solid fa-bug"
                    corTema="info"
                  />
                </div>

                {/* Card 4 */}
                <div className="col-md-6">
                  <HelpCard 
                    titulo="Programas de formação e security awareness"
                    descricao="Capacitamos as suas equipas com conhecimento e boas práticas de segurança."
                    icone="fa-solid fa-user-graduate"
                    corTema="secondary"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;