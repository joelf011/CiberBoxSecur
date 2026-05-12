import React from "react";
import { Link } from "react-router-dom";
import HelpCard from "../components/HelpCard";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";
import ContextoAtual from "../components/ContextoAtual";
import Regulamentacao from "../components/Regulamentacao";
import Servicos from "../components/Servicos";
import PorqueEscolher from "../components/PorqueEscolher";

const darkSection = {
  backgroundColor: "#0f172a",
  color: "white",
};

const listaMotivos = [
  {
    icone: "fa-solid fa-certificate",
    corFundoIcone: "bg-primary-subtle",
    corTextoIcone: "text-primary",
    tituloCard: "Especialização Comprovada",
    descricao: "Equipa de especialistas certificados (CISSP, CISM, ISO 27001).",
  },
  {
    icone: "fa-solid fa-users-gear",
    corFundoIcone: "bg-warning-subtle",
    corTextoIcone: "text-warning-emphasis",
    tituloCard: "Abordagem Personalizada",
    descricao:
      "Gestores dedicados que conhecem a realidade e os desafios específicos da sua organização.",
  },
  {
    icone: "fa-solid fa-laptop-shield",
    corFundoIcone: "bg-info-subtle",
    corTextoIcone: "text-info-emphasis",
    tituloCard: "Tecnologia de Ponta",
    descricao:
      "Plataforma intuitiva desenvolvida com os mais altos padrões de segurança e usabilidade.",
  },
];

const topicosContexto = [
  {
    icone: "fa-solid fa-shield-virus",
    corFundo: "bg-danger-subtle",
    corTexto: "text-danger",
    tituloItem: "Ataques de ransomware",
  },
  {
    icone: "fa-solid fa-bug",
    corFundo: "bg-warning-subtle",
    corTexto: "text-warning-emphasis",
    tituloItem: "Exploração de vulnerabilidades",
  },
  {
    icone: "fa-solid fa-server",
    corFundo: "bg-secondary-subtle",
    corTexto: "text-secondary-emphasis",
    tituloItem: "Ataques a infraestruturas críticas",
  },
  {
    icone: "fa-solid fa-envelope-open-text",
    corFundo: "bg-primary-subtle",
    corTexto: "text-primary",
    tituloItem: "Campanhas de phishing direcionado",
  },
];

const cardsRegulamentacao = [
  {
    icone: "fa-solid fa-triangle-exclamation",
    corFundo: "bg-danger bg-opacity-10",
    corTexto: "text-danger",
    tituloCard: "Sanções financeiras significativas",
  },
  {
    icone: "fa-solid fa-user-shield",
    corFundo: "bg-warning bg-opacity-10",
    corTexto: "text-warning",
    tituloCard: "Responsabilidade da gestão",
  },
  {
    icone: "fa-solid fa-server",
    corFundo: "bg-info bg-opacity-10",
    corTexto: "text-info",
    tituloCard: "Impacto reputacional",
  },
];

const listaServicos = [
  {
    titulo: "Avaliação de maturidade de cibersegurança",
    descricao:
      "Analisamos o estado atual da sua organização e identificamos áreas de melhoria prioritárias.",
    icone: "fa-solid fa-circle-check",
    corTema: "primary",
  },
  {
    titulo: "Implementação de requisitos da diretiva NIS2",
    descricao:
      "Apoiamos a sua organização no cumprimento integral dos requisitos regulamentares.",
    icone: "fa-solid fa-shield-halved",
    corTema: "dark",
  },
  {
    titulo: "Auditorias de segurança e testes técnicos",
    descricao:
      "Identificamos vulnerabilidades através de testes de penetração e auditorias especializadas.",
    icone: "fa-solid fa-bug",
    corTema: "info",
  },
  {
    titulo: "Programas de formação e security awareness",
    descricao:
      "Capacitamos as suas equipas com conhecimento e boas práticas de segurança.",
    icone: "fa-solid fa-user-graduate",
    corTema: "secondary",
  },
];

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero
        titulo="Cibersegurança para organizações que não podem parar"
        subtitulo="Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos."
        textoBotao="Começar agora"
        imagemFundo="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
      />
      <ContextoAtual
        titulo="Cibersegurança"
        textoInicial="A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas."
        itens={topicosContexto}
        textoFinal="Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional, existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança."
      />
      <Regulamentacao
        titulo="Regulamentação Europeia"
        textoInicio="A União Europeia reforçou os requisitos de segurança através da diretiva"
        nomeDiretiva="NIS2 – Network and Information Security Directive"
        linkDiretiva="/nis2"
        textoFim=". Esta diretiva impõe requisitos de gestão de risco, implementação de medidas técnicas e organizacionais e comunicação de incidentes."
        cards={cardsRegulamentacao}
      />
      <Servicos
        titulo="Como Ajudamos"
        subtitulo="Soluções especializadas para reforçar a sua postura de cibersegurança."
        servicos={listaServicos}
      />
      <PorqueEscolher
        titulo="Porquê Escolher a CyberBoxSecur?"
        subtitulo="Os nossos diferenciais para proteger o seu negócio."
        motivos={listaMotivos}
      />

      <section style={darkSection} id="contact" className="py-5 text-white">
        <div className="container px-4 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-4">Contacte-nos</h2>
                <p className="fs-5 text-white-50 mb-5">
                  Entre em contacto connosco para saber mais sobre as nossas
                  soluções de cibersegurança.
                </p>
              </div>
              <div className="row g-5">
                <div className="col-md-6">
                  <ContactInfo
                    email="contacto@cyberboxsecur.pt"
                    telefone="+351 210 000 000"
                    morada="Rossio, Edifício Cyber, Viseu, Portugal"
                  />
                </div>
                <div className="col-md-6">
                  <ContactForm />
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
