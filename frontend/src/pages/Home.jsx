import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
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
import {
  faCertificate,
  faUsersGear,
  faLaptopCode,
  faShieldVirus,
  faBug,
  faServer,
  faEnvelopeOpenText,
  faTriangleExclamation,
  faUserShield,
  faCircleCheck,
  faShieldHalved,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";

const darkSection = {
  backgroundColor: "#0f172a",
  color: "white",
};

const dicionarioIcones = {
  faShieldVirus: {
    icone: faShieldVirus,
    corFundo: "bg-danger-subtle",
    corTexto: "text-danger",
  },
  faBug: {
    icone: faBug,
    corFundo: "bg-warning-subtle",
    corTexto: "text-warning-emphasis",
  },
  faServer: {
    icone: faServer,
    corFundo: "bg-secondary-subtle",
    corTexto: "text-secondary-emphasis",
  },
  faEnvelopeOpenText: {
    icone: faEnvelopeOpenText,
    corFundo: "bg-primary-subtle",
    corTexto: "text-primary",
  },
  faTriangleExclamation: {
    icone: faTriangleExclamation,
    corFundo: "bg-danger-subtle",
    corTexto: "text-danger",
  },
  faUserShield: {
    icone: faUserShield,
    corFundo: "bg-warning-subtle",
    corTexto: "text-warning-emphasis",
  },
  faCircleCheck: {
    icone: faCircleCheck,
    corFundo: "bg-primary-subtle",
    corTexto: "text-primary",
  },
  faShieldHalved: {
    icone: faShieldHalved,
    corFundo: "bg-dark-subtle",
    corTexto: "text-dark",
  },
  faUserGraduate: {
    icone: faUserGraduate,
    corFundo: "bg-secondary-subtle",
    corTexto: "text-secondary",
  },
  faCertificate: {
    icone: faCertificate,
    corFundo: "bg-primary-subtle",
    corTexto: "text-primary",
  },
  faUsersGear: {
    icone: faUsersGear,
    corFundo: "bg-warning-subtle",
    corTexto: "text-warning-emphasis",
  },
  faLaptopCode: {
    icone: faLaptopCode,
    corFundo: "bg-info-subtle",
    corTexto: "text-info-emphasis",
  },
};

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

const Home = () => {
  const [dadosDoBackoffice, setDadosDoBackoffice] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resposta = await api.get("/cms/home");
        if (resposta.data) {
          setDadosDoBackoffice(resposta.data);
        }
      } catch (erro) {
        console.log("Falha ao carregar API, a usar textos por defeito.", erro);
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
        titulo={
          dadosDoBackoffice?.hero?.titulo ||
          "Cibersegurança para organizações que não podem parar"
        }
        subtitulo={
          dadosDoBackoffice?.hero?.subtitulo ||
          "Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos."
        }
        textoBotao={dadosDoBackoffice?.hero?.botaoTexto || "Contactos"}
        linkBotao={dadosDoBackoffice?.hero?.botaoLink || "<#contact>"}
        imagemFundo={
          dadosDoBackoffice?.hero?.imagemFundo ||
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
        }
      />
      <ContextoAtual
        titulo={dadosDoBackoffice?.contexto?.titulo || "Cibersegurança"}
        textoInicial={
          dadosDoBackoffice?.contexto?.textoInicial ||
          "A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas."
        }
        textoFinal={
          dadosDoBackoffice?.contexto?.textoFinal ||
          "Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional, existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança."
        }
        itens={[
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico1] ||
              dicionarioIcones["faShieldVirus"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico1] ||
              dicionarioIcones["faShieldVirus"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico1] ||
              dicionarioIcones["faShieldVirus"]
            ).corTexto,
            tituloItem:
              dadosDoBackoffice?.contexto?.topico1 || "Ataques de ransomware",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico2] ||
              dicionarioIcones["faBug"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico2] ||
              dicionarioIcones["faBug"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico2] ||
              dicionarioIcones["faBug"]
            ).corTexto,
            tituloItem:
              dadosDoBackoffice?.contexto?.topico2 ||
              "Exploração de vulnerabilidades",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico3] ||
              dicionarioIcones["faServer"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico3] ||
              dicionarioIcones["faServer"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico3] ||
              dicionarioIcones["faServer"]
            ).corTexto,
            tituloItem:
              dadosDoBackoffice?.contexto?.topico4 ||
              "Ataques a infraestruturas críticas",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico4] ||
              dicionarioIcones["faEnvelopeOpenText"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico4] ||
              dicionarioIcones["faEnvelopeOpenText"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.contexto?.iconeTopico4] ||
              dicionarioIcones["faEnvelopeOpenText"]
            ).corTexto,
            tituloItem:
              dadosDoBackoffice?.contexto?.topico4 ||
              "Campanhas de phishing direcionado",
          },
        ]}
      />
      <Regulamentacao
        titulo={
          dadosDoBackoffice?.regulamentacao?.titulo || "Regulamentação Europeia"
        }
        textoInicio={
          dadosDoBackoffice?.regulamentacao?.textoInicio ||
          "A União Europeia reforçou os requisitos de segurança através da diretiva"
        }
        nomeDiretiva={
          dadosDoBackoffice?.regulamentacao?.nomeDiretiva ||
          "NIS2 – Network and Information Security Directive"
        }
        linkDiretiva={
          dadosDoBackoffice?.regulamentacao?.linkDiretiva || "/nis2"
        }
        textoFim={
          dadosDoBackoffice?.regulamentacao?.textoFim ||
          ". Esta diretiva impõe requisitos de gestão de risco, implementação de medidas técnicas e organizacionais e comunicação de incidentes."
        }
        cards={[
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard1] ||
              dicionarioIcones["faTriangleExclamation"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard1] ||
              dicionarioIcones["faTriangleExclamation"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard1] ||
              dicionarioIcones["faTriangleExclamation"]
            ).corTexto,
            tituloCard:
              dadosDoBackoffice?.regulamentacao?.card1 ||
              "Sanções financeiras significativas",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard2] ||
              dicionarioIcones["faUserShield"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard2] ||
              dicionarioIcones["faUserShield"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard2] ||
              dicionarioIcones["faUserShield"]
            ).corTexto,
            tituloCard:
              dadosDoBackoffice?.regulamentacao?.card2 ||
              "Responsabilidade da gestão",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard3] ||
              dicionarioIcones["faServer"]
            ).icone,
            corFundo: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard3] ||
              dicionarioIcones["faServer"]
            ).corFundo,
            corTexto: (
              dicionarioIcones[dadosDoBackoffice?.regulamentacao?.iconeCard3] ||
              dicionarioIcones["faServer"]
            ).corTexto,
            tituloCard:
              dadosDoBackoffice?.regulamentacao?.card3 ||
              "Impacto reputacional",
          },
        ]}
      />
      <Servicos
        titulo={dadosDoBackoffice?.servicos?.titulo || "Como Ajudamos"}
        subtitulo={
          dadosDoBackoffice?.servicos?.subtitulo ||
          "Soluções especializadas para reforçar a sua postura de cibersegurança."
        }
        servicos={[
          {
            titulo:
              dadosDoBackoffice?.servicos?.servico1Titulo ||
              "Avaliação de maturidade de cibersegurança",
            descricao:
              dadosDoBackoffice?.servicos?.servico1Descricao ||
              "Analisamos o estado atual da sua organização e identificamos áreas de melhoria prioritárias.",
            icone: (
              dicionarioIcones[dadosDoBackoffice?.servicos?.iconeServico1] ||
              dicionarioIcones["faCircleCheck"]
            ).icone,
            corTema: "primary",
          },
          {
            titulo:
              dadosDoBackoffice?.servicos?.servico2Titulo ||
              "Implementação de requisitos da diretiva NIS2",
            descricao:
              dadosDoBackoffice?.servicos?.servico2Descricao ||
              "Apoiamos a sua organização no cumprimento integral dos requisitos regulamentares.",
            icone: (
              dicionarioIcones[dadosDoBackoffice?.servicos?.iconeServico2] ||
              dicionarioIcones["faShieldHalved"]
            ).icone,
            corTema: "dark",
          },
          {
            titulo:
              dadosDoBackoffice?.servicos?.servico3Titulo ||
              "Auditorias de segurança e testes técnicos",
            descricao:
              dadosDoBackoffice?.servicos?.servico3Descricao ||
              "Identificamos vulnerabilidades através de testes de penetração e auditorias especializadas.",
            icone: (
              dicionarioIcones[dadosDoBackoffice?.servicos?.iconeServico3] ||
              dicionarioIcones["faBug"]
            ).icone,
            corTema: "info",
          },
          {
            titulo:
              dadosDoBackoffice?.servicos?.servico4Titulo ||
              "Programas de formação e security awareness",
            descricao:
              dadosDoBackoffice?.servicos?.servico4Descricao ||
              "Capacitamos as suas equipas com conhecimento e boas práticas de segurança.",
            icone: (
              dicionarioIcones[dadosDoBackoffice?.servicos?.iconeServico4] ||
              dicionarioIcones["faUserGraduate"]
            ).icone,
            corTema: "secondary",
          },
        ]}
      />
      <PorqueEscolher
        titulo={
          dadosDoBackoffice?.diferenciais?.titulo ||
          "Porquê Escolher a CyberBoxSecur?"
        }
        subtitulo={
          dadosDoBackoffice?.diferenciais?.subtitulo ||
          "Os nossos diferenciais para proteger o seu negócio."
        }
        motivos={[
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo1] ||
              dicionarioIcones["faCertificate"]
            ).icone,
            corFundoIcone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo1] ||
              dicionarioIcones["faCertificate"]
            ).corFundo,
            corTextoIcone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo1] ||
              dicionarioIcones["faCertificate"]
            ).corTexto,
            tituloCard:
              dadosDoBackoffice?.diferenciais?.motivo1Titulo ||
              "Especialização Comprovada",
            descricao:
              dadosDoBackoffice?.diferenciais?.motivo1Descricao ||
              "Equipa de especialistas certificados (CISSP, CISM, ISO 27001).",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo2] ||
              dicionarioIcones["faUsersGear"]
            ).icone,
            corFundoIcone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo2] ||
              dicionarioIcones["faUsersGear"]
            ).corFundo,
            corTextoIcone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo2] ||
              dicionarioIcones["faUsersGear"]
            ).corTexto,
            tituloCard:
              dadosDoBackoffice?.diferenciais?.motivo2Titulo ||
              "Abordagem Personalizada",
            descricao:
              dadosDoBackoffice?.diferenciais?.motivo2Descricao ||
              "Gestores dedicados que conhecem a realidade e os desafios específicos da sua organização.",
          },
          {
            icone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo3] ||
              dicionarioIcones["faLaptopCode"]
            ).icone,
            corFundoIcone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo3] ||
              dicionarioIcones["faLaptopCode"]
            ).corFundo,
            corTextoIcone: (
              dicionarioIcones[dadosDoBackoffice?.diferenciais?.iconeMotivo3] ||
              dicionarioIcones["faLaptopCode"]
            ).corTexto,
            tituloCard:
              dadosDoBackoffice?.diferenciais?.motivo3Titulo ||
              "Tecnologia de Ponta",
            descricao:
              dadosDoBackoffice?.diferenciais?.motivo3Descricao ||
              "Plataforma intuitiva desenvolvida com os mais altos padrões de segurança e usabilidade.",
          },
        ]}
      />

      <section style={darkSection} id="contact" className="py-5 text-white">
        <div className="container px-4 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-4">
                  {dadosDoBackoffice?.contactos?.titulo || "Contacte-nos"}
                </h2>
                <p className="fs-5 text-white-50 mb-5">
                  {dadosDoBackoffice?.contactos?.subtitulo ||
                    "Entre em contacto connosco para saber mais sobre as nossas soluções de cibersegurança."}
                </p>
              </div>
              <div className="row g-5">
                <div className="col-md-6">
                  <ContactInfo
                    email={
                      dadosDoBackoffice?.contactos?.email ||
                      "contacto@cyberboxsecur.pt"
                    }
                    telefone={
                      dadosDoBackoffice?.contactos?.telefone ||
                      "+351 210 000 000"
                    }
                    morada={
                      dadosDoBackoffice?.contactos?.morada ||
                      "Rua Luís A Duarte Santos, Nº 20 3030-403 Coimbra"
                    }
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
