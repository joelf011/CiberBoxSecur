import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import HelpCard from "../components/home/HelpCard";
import ContactInfo from "../components/home/ContactInfo";
import ContactForm from "../components/home/ContactForm";
import Hero from "../components/home/Hero";
import ContextoAtual from "../components/home/ContextoAtual";
import Regulamentacao from "../components/home/Regulamentacao";
import Servicos from "../components/home/Servicos";
import PorqueEscolher from "../components/home/PorqueEscolher";

const darkSection = {
  backgroundColor: "#0f172a",
  color: "white",
};

const listaMotivos = [
  {
    icone: faCertificate,
    corFundoIcone: "bg-primary-subtle",
    corTextoIcone: "text-primary",
    tituloCard: "Especialização Comprovada",
    descricao: "Equipa de especialistas certificados (CISSP, CISM, ISO 27001).",
  },
  {
    icone: faUsersGear,
    corFundoIcone: "bg-warning-subtle",
    corTextoIcone: "text-warning-emphasis",
    tituloCard: "Abordagem Personalizada",
    descricao:
      "Gestores dedicados que conhecem a realidade e os desafios específicos da sua organização.",
  },
  {
    icone: faLaptopCode, // --- ÍCONE CORRIGIDO AQUI ---
    corFundoIcone: "bg-info-subtle",
    corTextoIcone: "text-info-emphasis",
    tituloCard: "Tecnologia de Ponta",
    descricao:
      "Plataforma intuitiva desenvolvida com os mais altos padrões de segurança e usabilidade.",
  },
];

const topicosContexto = [
  {
    icone: faShieldVirus,
    corFundo: "bg-danger-subtle",
    corTexto: "text-danger",
    tituloItem: "Ataques de ransomware",
  },
  {
    icone: faBug,
    corFundo: "bg-warning-subtle",
    corTexto: "text-warning-emphasis",
    tituloItem: "Exploração de vulnerabilidades",
  },
  {
    icone: faServer,
    corFundo: "bg-secondary-subtle",
    corTexto: "text-secondary-emphasis",
    tituloItem: "Ataques a infraestruturas críticas",
  },
  {
    icone: faEnvelopeOpenText,
    corFundo: "bg-primary-subtle",
    corTexto: "text-primary",
    tituloItem: "Campanhas de phishing direcionado",
  },
];

const cardsRegulamentacao = [
  {
    icone: faTriangleExclamation,
    corFundo: "bg-danger bg-opacity-10",
    corTexto: "text-danger",
    tituloCard: "Sanções financeiras significativas",
  },
  {
    icone: faUserShield,
    corFundo: "bg-warning bg-opacity-10",
    corTexto: "text-warning",
    tituloCard: "Responsabilidade da gestão",
  },
  {
    icone: faServer,
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
    icone: faCircleCheck,
    corTema: "primary",
  },
  {
    titulo: "Implementação de requisitos da diretiva NIS2",
    descricao:
      "Apoiamos a sua organização no cumprimento integral dos requisitos regulamentares.",
    icone: faShieldHalved,
    corTema: "dark",
  },
  {
    titulo: "Auditorias de segurança e testes técnicos",
    descricao:
      "Identificamos vulnerabilidades através de testes de penetração e auditorias especializadas.",
    icone: faBug,
    corTema: "info",
  },
  {
    titulo: "Programas de formação e security awareness",
    descricao:
      "Capacitamos as suas equipas com conhecimento e boas práticas de segurança.",
    icone: faUserGraduate,
    corTema: "secondary",
  },
];

const Home = () => {
  const [dadosDoBackoffice, setDadosDoBackoffice] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await getConteudoHome();
        setDadosDoBackoffice(dados);
      } catch (erro) {
        console.log("Falha ao carregar API, a usar textos por defeito.");
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="overflow-hidden">
      <Hero
        titulo="Cibersegurança para organizações que não podem parar"
        subtitulo="Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos."
        textoBotao="Começar agora"
        linkBotao="#contact"
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
