import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEdit,
  faImage,
  faChartLine,
  faScaleBalanced,
  faConciergeBell,
  faStar,
  faPhone,
  faShieldVirus,
  faBug,
  faServer,
  faEnvelopeOpenText,
  faTriangleExclamation,
  faUserShield,
  faCircleCheck,
  faShieldHalved,
  faUserGraduate,
  faCertificate,
  faUsersGear,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { cmsApi } from "../../api/cmsApi";

const iconesDisponiveis = {
  faShieldVirus: {
    icon: faShieldVirus,
    label: "Escudo/Vírus",
    colorClass: "bg-danger-subtle text-danger",
  },
  faBug: {
    icon: faBug,
    label: "Inseto/Bug",
    colorClass: "bg-warning-subtle text-warning-emphasis",
  },
  faServer: {
    icon: faServer,
    label: "Servidor",
    colorClass: "bg-secondary-subtle text-secondary-emphasis",
  },
  faEnvelopeOpenText: {
    icon: faEnvelopeOpenText,
    label: "Email",
    colorClass: "bg-primary-subtle text-primary",
  },
  faScaleBalanced: {
    icon: faScaleBalanced,
    label: "Balança/Lei",
    colorClass: "bg-info-subtle text-info-emphasis",
  },
  faStar: {
    icon: faStar,
    label: "Estrela",
    colorClass: "bg-success-subtle text-success",
  },
  faChartLine: {
    icon: faChartLine,
    label: "Gráfico/Estatística",
    colorClass: "bg-dark-subtle text-dark",
  },
  faTriangleExclamation: {
    icon: faTriangleExclamation,
    label: "Alerta",
    colorClass: "bg-danger-subtle text-danger",
  },
  faUserShield: {
    icon: faUserShield,
    label: "Responsabilidade",
    colorClass: "bg-warning-subtle text-warning-emphasis",
  },
  faCircleCheck: {
    icon: faCircleCheck,
    label: "Check/Certo",
    colorClass: "bg-primary-subtle text-primary",
  },
  faShieldHalved: {
    icon: faShieldHalved,
    label: "Escudo Bicolor",
    colorClass: "bg-dark-subtle text-dark",
  },
  faUserGraduate: {
    icon: faUserGraduate,
    label: "Formação",
    colorClass: "bg-secondary-subtle text-secondary",
  },
  faCertificate: {
    icon: faCertificate,
    label: "Certificado",
    colorClass: "bg-primary-subtle text-primary",
  },
  faUsersGear: {
    icon: faUsersGear,
    label: "Equipa/Gestão",
    colorClass: "bg-warning-subtle text-warning-emphasis",
  },
  faLaptopCode: {
    icon: faLaptopCode,
    label: "Tecnologia",
    colorClass: "bg-info-subtle text-info-emphasis",
  },
};

const GestaoConteudos = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [dadosSite, setDadosSite] = useState({
    hero: {
      titulo: "",
      subtitulo: "",
      botaoTexto: "",
      botaoLink: "",
      imagemFundo: "",
    },
    contexto: {
      titulo: "",
      textoInicial: "",
      textoFinal: "",
      topico1: "",
      iconeTopico1: "",
      topico2: "",
      iconeTopico2: "",
      topico3: "",
      iconeTopico3: "",
      topico4: "",
      iconeTopico4: "",
    },
    regulamentacao: {
      titulo: "",
      textoInicio: "",
      nomeDiretiva: "",
      linkDiretiva: "",
      textoFim: "",
      card1: "",
      iconeCard1: "",
      card2: "",
      iconeCard2: "",
      card3: "",
      iconeCard3: "",
    },
    servicos: {
      titulo: "",
      subtitulo: "",
      servico1Titulo: "",
      servico1Descricao: "",
      iconeServico1: "",
      servico2Titulo: "",
      servico2Descricao: "",
      iconeServico2: "",
      servico3Titulo: "",
      servico3Descricao: "",
      iconeServico3: "",
      servico4Titulo: "",
      servico4Descricao: "",
      iconeServico4: "",
    },
    diferenciais: {
      titulo: "",
      subtitulo: "",
      motivo1Titulo: "",
      motivo1Descricao: "",
      iconeMotivo1: "",
      motivo2Titulo: "",
      motivo2Descricao: "",
      iconeMotivo2: "",
      motivo3Titulo: "",
      motivo3Descricao: "",
      iconeMotivo3: "",
    },
    contactos: {
      titulo: "",
      subtitulo: "",
      email: "",
      telefone: "",
      morada: "",
    },
  });

  // 2. Carregar os dados quando a página abre (GET)
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await cmsApi.getHomeData();

        if (dados) {
          setDadosSite(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar dados da Home:", erro);
      }
    };

    carregarDados();
  }, []);

  // 3. Função para guardar quando o Admin clica no botão (PUT)
  const guardarAlteracoes = async () => {
    try {
      setIsSaving(true);

      await cmsApi.updateHomeData(dadosSite);

      Swal.fire({
        title: "Sucesso!",
        text: "Alterações guardadas com sucesso na Base de Dados!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (erro) {
      console.error("Erro ao guardar:", erro);
      Swal.fire(
        "Erro!",
        "Erro ao guardar as alterações. Verifica a consola.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState("hero");

  const [iconesContexto, setIconesContexto] = useState({
    topico1: "faShieldVirus",
    topico2: "faBug",
    topico3: "faServer",
    topico4: "faEnvelopeOpenText",
  });

  const [iconesRegulamentacao, setIconesRegulamentacao] = useState({
    card1: "faTriangleExclamation",
    card2: "faUserShield",
    card3: "faServer",
  });

  const [iconesServicos, setIconesServicos] = useState({
    servico1: "faCircleCheck",
    servico2: "faShieldHalved",
    servico3: "faBug",
    servico4: "faUserGraduate",
  });

  const [iconesDiferenciais, setIconesDiferenciais] = useState({
    card1: "faCertificate",
    card2: "faUsersGear",
    card3: "faLaptopCode",
  });

  const menuItems = [
    { id: "hero", label: "Hero", icon: faImage },
    { id: "contexto", label: "Contexto", icon: faChartLine },
    { id: "regulamentacao", label: "Regulamentação", icon: faScaleBalanced },
    { id: "servicos", label: "Serviços", icon: faConciergeBell },
    { id: "porque-escolher", label: "Diferenciais", icon: faStar },
    { id: "contactos", label: "Contactos", icon: faPhone },
  ];

  const renderConteudo = () => {
    switch (activeTab) {
      case "hero":
        return (
          <div className="animate__animated animate__fadeIn">
            <h4 className="mb-1 text-dark fw-bold">Hero</h4>
            <p className="text-muted small mb-1">
              Configura o banner principal da tua página inicial.
            </p>
            <p className="text-secondary small fst-italic mb-4">
              Dica: Se deixares os campos em branco, o site utilizará
              automaticamente o texto padrão da plataforma.
            </p>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Título Principal
              </label>
              <input
                type="text"
                className="form-control p-3 bg-light"
                placeholder="Cibersegurança para organizações que não podem parar"
                value={dadosSite.hero.titulo}
                onChange={(e) =>
                  setDadosSite({
                    ...dadosSite,
                    hero: { ...dadosSite.hero, titulo: e.target.value },
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Subtítulo
              </label>
              <textarea
                className="form-control p-3 bg-light"
                rows="3"
                placeholder="Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos."
                value={dadosSite.hero.subtitulo}
                onChange={(e) =>
                  setDadosSite({
                    ...dadosSite,
                    hero: { ...dadosSite.hero, subtitulo: e.target.value },
                  })
                }
              ></textarea>
            </div>

            <div className="row">
              <div className="col-md-4 mb-4">
                <label className="form-label fw-semibold text-secondary">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Começar agora"
                  value={dadosSite.hero.botaoTexto}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      hero: { ...dadosSite.hero, botaoTexto: e.target.value },
                    })
                  }
                />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label fw-semibold text-secondary">
                  Link do Botão
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="<#contact>"
                  value={dadosSite.hero.botaoLink}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      hero: { ...dadosSite.hero, botaoLink: e.target.value },
                    })
                  }
                />
              </div>
              <div className="col-md-4 mb-4">
                <label className="form-label fw-semibold text-secondary">
                  Imagem de Fundo (URL)
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                  value={dadosSite.hero.imagemFundo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      hero: { ...dadosSite.hero, imagemFundo: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        );

      case "contexto":
        return (
          <div className="animate__animated animate__fadeIn">
            <h4 className="mb-1 text-dark fw-bold">Contexto Atual</h4>
            <p className="text-muted small mb-1">
              Edita os textos introdutórios e a grelha de tópicos de ameaças.
            </p>
            <p className="text-secondary small fst-italic mb-4">
              Dica: Se deixares os campos em branco, o site utilizará
              automaticamente o texto padrão da plataforma.
            </p>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Título da Secção
              </label>
              <input
                type="text"
                className="form-control p-3 bg-light"
                placeholder="Cibersegurança"
                value={dadosSite.contexto.titulo}
                onChange={(e) =>
                  setDadosSite({
                    ...dadosSite,
                    contexto: { ...dadosSite.contexto, titulo: e.target.value },
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Texto Inicial
              </label>
              <textarea
                className="form-control p-3 bg-light"
                rows="2"
                placeholder="A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas."
                value={dadosSite.contexto.textoInicial}
                onChange={(e) =>
                  setDadosSite({
                    ...dadosSite,
                    contexto: {
                      ...dadosSite.contexto,
                      textoInicial: e.target.value,
                    },
                  })
                }
              ></textarea>
            </div>

            <div className="card bg-secondary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <h5 className="h6 fw-bold mb-4 text-dark">
                Tópicos (Grelha de Ícones)
              </h5>
              <div className="row g-4">
                {/* TÓPICO 1 */}
                <div className="col-md-12 col-xl-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Tópico 1
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesContexto.topico1].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={iconesDisponiveis[iconesContexto.topico1].icon}
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesContexto({
                                  ...iconesContexto,
                                  topico1: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  contexto: {
                                    ...dadosSite.contexto,
                                    iconeTopico1: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Ataques de ransomware"
                      value={dadosSite.contexto.topico1}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          contexto: {
                            ...dadosSite.contexto,
                            topico1: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {/* TÓPICO 2 */}
                <div className="col-md-12 col-xl-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Tópico 2
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesContexto.topico2].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={iconesDisponiveis[iconesContexto.topico2].icon}
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesContexto({
                                  ...iconesContexto,
                                  topico2: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  contexto: {
                                    ...dadosSite.contexto,
                                    iconeTopico2: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Exploração de vulnerabilidades"
                      value={dadosSite.contexto.topico2}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          contexto: {
                            ...dadosSite.contexto,
                            topico2: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {/* TÓPICO 3 */}
                <div className="col-md-12 col-xl-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Tópico 3
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesContexto.topico3].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={iconesDisponiveis[iconesContexto.topico3].icon}
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesContexto({
                                  ...iconesContexto,
                                  topico3: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  contexto: {
                                    ...dadosSite.contexto,
                                    iconeTopico3: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Ataques a infraestruturas críticas"
                      value={dadosSite.contexto.topico3}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          contexto: {
                            ...dadosSite.contexto,
                            topico3: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {/* TÓPICO 4 */}
                <div className="col-md-12 col-xl-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Tópico 4
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesContexto.topico4].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={iconesDisponiveis[iconesContexto.topico4].icon}
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesContexto({
                                  ...iconesContexto,
                                  topico3: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  contexto: {
                                    ...dadosSite.contexto,
                                    iconeTopico3: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Campanhas de phishing direcionado"
                      value={dadosSite.contexto.topico4}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          contexto: {
                            ...dadosSite.contexto,
                            topico4: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Texto Final
              </label>
              <textarea
                className="form-control p-3 bg-light"
                rows="3"
                placeholder="Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional, existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança."
                value={dadosSite.contexto.textoFinal}
                onChange={(e) =>
                  setDadosSite({
                    ...dadosSite,
                    contexto: {
                      ...dadosSite.contexto,
                      textoFinal: e.target.value,
                    },
                  })
                }
              ></textarea>
            </div>
          </div>
        );

      case "regulamentacao":
        return (
          <div className="animate__animated animate__fadeIn">
            <h4 className="mb-1 text-dark fw-bold">Regulamentação (NIS2)</h4>
            <p className="text-muted small mb-1">
              Configuração do bloco sobre a diretiva europeia e os seus
              impactos.
            </p>
            <p className="text-secondary small fst-italic mb-4">
              Dica: Se deixares os campos em branco, o site utilizará
              automaticamente o texto padrão da plataforma.
            </p>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">
                Título da Secção
              </label>
              <input
                type="text"
                className="form-control p-3 bg-light"
                placeholder="Regulamentação Europeia"
                value={dadosSite.regulamentacao.titulo}
                onChange={(e) =>
                  setDadosSite({
                    ...dadosSite,
                    regulamentacao: {
                      ...dadosSite.regulamentacao,
                      titulo: e.target.value,
                    },
                  })
                }
              />
            </div>

            {/* TEXTOS E LINK */}
            <div className="card bg-secondary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <h5 className="h6 fw-bold mb-3 text-dark">Texto Descritivo</h5>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Texto Inicial (Antes do link)
                  </label>
                  <input
                    type="text"
                    className="form-control p-3 bg-light border-0"
                    placeholder="A União Europeia reforçou os requisitos de segurança através da diretiva"
                    value={dadosSite.regulamentacao.textoInicio}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        regulamentacao: {
                          ...dadosSite.regulamentacao,
                          textoInicio: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Nome do Link (Em destaque)
                  </label>
                  <input
                    type="text"
                    className="form-control p-3 bg-light border-0 text-info"
                    placeholder="NIS2 – Network and Information Security Directive"
                    value={dadosSite.regulamentacao.nomeDiretiva}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        regulamentacao: {
                          ...dadosSite.regulamentacao,
                          nomeDiretiva: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    URL do Link
                  </label>
                  <input
                    type="text"
                    className="form-control p-3 bg-light border-0"
                    placeholder="/nis2"
                    value={dadosSite.regulamentacao.linkDiretiva}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        regulamentacao: {
                          ...dadosSite.regulamentacao,
                          linkDiretiva: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Texto Final (Depois do link)
                  </label>
                  <textarea
                    className="form-control p-3 bg-light border-0"
                    rows="2"
                    placeholder=". Esta diretiva impõe requisitos de gestão de risco, implementação de medidas técnicas e organizacionais e comunicação de incidentes."
                    value={dadosSite.regulamentacao.textoFim}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        regulamentacao: {
                          ...dadosSite.regulamentacao,
                          textoFim: e.target.value,
                        },
                      })
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            {/* OS 3 CARTÕES COM ÍCONES */}
            <div className="card bg-secondary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <h5 className="h6 fw-bold mb-4 text-dark">Cartões de Impacto</h5>
              <div className="row g-4">
                {/* CARTÃO 1 */}
                <div className="col-md-12 col-xl-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Cartão 1
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesRegulamentacao.card1].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={
                          iconesDisponiveis[iconesRegulamentacao.card1].icon
                        }
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesRegulamentacao({
                                  ...iconesRegulamentacao,
                                  card1: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  regulamentacao: {
                                    ...dadosSite.regulamentacao,
                                    iconeCard1: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Sanções financeiras significativas"
                      value={dadosSite.regulamentacao.card1}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          regulamentacao: {
                            ...dadosSite.regulamentacao,
                            card1: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {/* CARTÃO 2 */}
                <div className="col-md-12 col-xl-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Cartão 2
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesRegulamentacao.card2].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={
                          iconesDisponiveis[iconesRegulamentacao.card2].icon
                        }
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesRegulamentacao({
                                  ...iconesRegulamentacao,
                                  card2: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  regulamentacao: {
                                    ...dadosSite.regulamentacao,
                                    iconeCard2: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Responsabilidade da gestão"
                      value={dadosSite.regulamentacao.card2}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          regulamentacao: {
                            ...dadosSite.regulamentacao,
                            card2: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {/* CARTÃO 3 */}
                <div className="col-md-12 col-xl-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Cartão 3
                  </label>
                  <div className="input-group shadow-sm dropdown">
                    <button
                      className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesRegulamentacao.card3].colorClass}`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon
                        icon={
                          iconesDisponiveis[iconesRegulamentacao.card3].icon
                        }
                      />
                    </button>

                    <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                      <div
                        className="d-flex flex-wrap gap-1"
                        style={{ width: "130px" }}
                      >
                        {Object.entries(iconesDisponiveis).map(
                          ([key, data]) => (
                            <button
                              key={key}
                              type="button"
                              className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                              style={{ width: "32px", height: "32px" }}
                              title={data.label}
                              onClick={() => {
                                setIconesRegulamentacao({
                                  ...iconesRegulamentacao,
                                  card3: key,
                                });
                                setDadosSite({
                                  ...dadosSite,
                                  regulamentacao: {
                                    ...dadosSite.regulamentacao,
                                    iconeCard3: key,
                                  },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={data.icon} />
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control border-0 p-2"
                      placeholder="Impacto reputacional"
                      value={dadosSite.regulamentacao.card3}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          regulamentacao: {
                            ...dadosSite.regulamentacao,
                            card3: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "servicos":
        return (
          <div className="animate__animated animate__fadeIn">
            <h4 className="mb-1 text-dark fw-bold">Serviços</h4>
            <p className="text-muted small mb-1">
              Edita os títulos principais e os cartões dos serviços prestados.
            </p>
            <p className="text-secondary small fst-italic mb-4">
              Dica: Se deixares os campos em branco, o site utilizará
              automaticamente o texto padrão da plataforma.
            </p>

            {/* TÍTULO E SUBTÍTULO GERAIS */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-semibold text-secondary">
                  Título da Secção
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Como Ajudamos"
                  value={dadosSite.servicos.titulo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      servicos: {
                        ...dadosSite.servicos,
                        titulo: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary">
                  Subtítulo
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Soluções especializadas para reforçar a sua postura de cibersegurança."
                  value={dadosSite.servicos.subtitulo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      servicos: {
                        ...dadosSite.servicos,
                        subtitulo: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* GRELHA DOS 4 CARTÕES DE SERVIÇOS */}
            <div className="card bg-secondary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <h5 className="h6 fw-bold mb-4 text-dark">Grelha de Serviços</h5>
              <div className="row g-4">
                {/* SERVIÇO 1 */}
                <div className="col-md-12 col-xl-6">
                  <div className="p-3 border rounded-3 bg-white shadow-sm">
                    <label className="form-label small fw-semibold text-secondary">
                      Serviço 1
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesServicos.servico1].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={iconesDisponiveis[iconesServicos.servico1].icon}
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesServicos({
                                    ...iconesServicos,
                                    servico1: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    servicos: {
                                      ...dadosSite.servicos,
                                      iconeServico1: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Avaliação de maturidade de cibersegurança"
                        value={dadosSite.servicos.servico1Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            servicos: {
                              ...dadosSite.servicos,
                              servico1Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="2"
                      placeholder="Analisamos o estado atual da sua organização e identificamos áreas de melhoria prioritárias."
                      value={dadosSite.servicos.servico1Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          servicos: {
                            ...dadosSite.servicos,
                            servico1Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>

                {/* SERVIÇO 2 */}
                <div className="col-md-12 col-xl-6">
                  <div className="p-3 border rounded-3 bg-white shadow-sm">
                    <label className="form-label small fw-semibold text-secondary">
                      Serviço 2
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesServicos.servico2].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={iconesDisponiveis[iconesServicos.servico2].icon}
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesServicos({
                                    ...iconesServicos,
                                    servico2: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    servicos: {
                                      ...dadosSite.servicos,
                                      iconeServico2: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Implementação de requisitos da diretiva NIS2"
                        value={dadosSite.servicos.servico2Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            servicos: {
                              ...dadosSite.servicos,
                              servico2Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="2"
                      placeholder="Apoiamos a sua organização no cumprimento integral dos requisitos regulamentares."
                      value={dadosSite.servicos.servico2Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          servicos: {
                            ...dadosSite.servicos,
                            servico2Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>

                {/* SERVIÇO 3 */}
                <div className="col-md-12 col-xl-6">
                  <div className="p-3 border rounded-3 bg-white shadow-sm">
                    <label className="form-label small fw-semibold text-secondary">
                      Serviço 3
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesServicos.servico3].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={iconesDisponiveis[iconesServicos.servico3].icon}
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesServicos({
                                    ...iconesServicos,
                                    servico3: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    servicos: {
                                      ...dadosSite.servicos,
                                      iconeServico3: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Auditorias de segurança e testes técnicos"
                        value={dadosSite.servicos.servico3Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            servicos: {
                              ...dadosSite.servicos,
                              servico3Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="2"
                      placeholder="Identificamos vulnerabilidades através de testes de penetração e auditorias especializadas."
                      value={dadosSite.servicos.servico3Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          servicos: {
                            ...dadosSite.servicos,
                            servico3Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>

                {/* SERVIÇO 4 */}
                <div className="col-md-12 col-xl-6">
                  <div className="p-3 border rounded-3 bg-white shadow-sm">
                    <label className="form-label small fw-semibold text-secondary">
                      Serviço 4
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesServicos.servico4].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={iconesDisponiveis[iconesServicos.servico4].icon}
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesServicos({
                                    ...iconesServicos,
                                    servico4: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    servicos: {
                                      ...dadosSite.servicos,
                                      iconeServico4: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Programas de formação e security awareness"
                        value={dadosSite.servicos.servico4Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            servicos: {
                              ...dadosSite.servicos,
                              servico4Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="2"
                      placeholder="Capacitamos as suas equipas com conhecimento e boas práticas de segurança."
                      value={dadosSite.servicos.servico4Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          servicos: {
                            ...dadosSite.servicos,
                            servico4Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "porque-escolher":
        return (
          <div className="animate__animated animate__fadeIn">
            <h4 className="mb-1 text-dark fw-bold">Diferenciais</h4>
            <p className="text-muted small mb-1">
              Edita os motivos para escolher a CyberBoxSecur.
            </p>
            <p className="text-secondary small fst-italic mb-4">
              Dica: Se deixares os campos em branco, o site utilizará
              automaticamente o texto padrão da plataforma.
            </p>

            {/* TÍTULO E SUBTÍTULO GERAIS */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-semibold text-secondary">
                  Título da Secção
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Porquê Escolher a CyberBoxSecur?"
                  value={dadosSite.diferenciais.titulo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      diferenciais: {
                        ...dadosSite.diferenciais,
                        titulo: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary">
                  Subtítulo
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Os nossos diferenciais para proteger o seu negócio."
                  value={dadosSite.diferenciais.subtitulo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      diferenciais: {
                        ...dadosSite.diferenciais,
                        subtitulo: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* GRELHA DOS 3 CARTÕES DE DIFERENCIAIS */}
            <div className="card bg-secondary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <h5 className="h6 fw-bold mb-4 text-dark">
                Cartões de Diferenciais
              </h5>
              <div className="row g-4">
                {/* CARTÃO 1: Especialização */}
                <div className="col-md-12 col-xl-4">
                  <div className="p-3 border rounded-3 bg-white shadow-sm h-100">
                    <label className="form-label small fw-semibold text-secondary">
                      Diferencial 1
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesDiferenciais.card1].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={
                            iconesDisponiveis[iconesDiferenciais.card1].icon
                          }
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesDiferenciais({
                                    ...iconesDiferenciais,
                                    card1: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    diferenciais: {
                                      ...dadosSite.diferenciais,
                                      iconeMotivo1: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Especialização Comprovada"
                        value={dadosSite.diferenciais.motivo1Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            diferenciais: {
                              ...dadosSite.diferenciais,
                              motivo1Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="3"
                      placeholder="Equipa de especialistas certificados (CISSP, CISM, ISO 27001)."
                      value={dadosSite.diferenciais.motivo1Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          diferenciais: {
                            ...dadosSite.diferenciais,
                            motivo1Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>

                {/* CARTÃO 2: Abordagem */}
                <div className="col-md-12 col-xl-4">
                  <div className="p-3 border rounded-3 bg-white shadow-sm h-100">
                    <label className="form-label small fw-semibold text-secondary">
                      Diferencial 2
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesDiferenciais.card2].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={
                            iconesDisponiveis[iconesDiferenciais.card2].icon
                          }
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesDiferenciais({
                                    ...iconesDiferenciais,
                                    card2: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    diferenciais: {
                                      ...dadosSite.diferenciais,
                                      iconeMotivo2: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Abordagem Personalizada"
                        value={dadosSite.diferenciais.motivo2Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            diferenciais: {
                              ...dadosSite.diferenciais,
                              motivo2Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="3"
                      placeholder="Gestores dedicados que conhecem a realidade e os desafios específicos da sua organização."
                      value={dadosSite.diferenciais.motivo2Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          diferenciais: {
                            ...dadosSite.diferenciais,
                            motivo2Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>

                {/* CARTÃO 3: Tecnologia */}
                <div className="col-md-12 col-xl-4">
                  <div className="p-3 border rounded-3 bg-white shadow-sm h-100">
                    <label className="form-label small fw-semibold text-secondary">
                      Diferencial 3
                    </label>
                    <div className="input-group mb-2 dropdown border rounded-2">
                      <button
                        className={`btn dropdown-toggle border-0 px-3 d-flex align-items-center gap-2 ${iconesDisponiveis[iconesDiferenciais.card3].colorClass}`}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          icon={
                            iconesDisponiveis[iconesDiferenciais.card3].icon
                          }
                        />
                      </button>
                      <div className="dropdown-menu shadow p-2 border-0 rounded-3">
                        <div
                          className="d-flex flex-wrap gap-1"
                          style={{ width: "130px" }}
                        >
                          {Object.entries(iconesDisponiveis).map(
                            ([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                className={`btn btn-sm border-0 d-flex align-items-center justify-content-center ${data.colorClass}`}
                                style={{ width: "32px", height: "32px" }}
                                title={data.label}
                                onClick={() => {
                                  setIconesDiferenciais({
                                    ...iconesDiferenciais,
                                    card3: key,
                                  });
                                  setDadosSite({
                                    ...dadosSite,
                                    diferenciais: {
                                      ...dadosSite.diferenciais,
                                      iconeMotivo3: key,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={data.icon} />
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control border-0 p-2 fw-bold"
                        placeholder="Tecnologia de Ponta"
                        value={dadosSite.diferenciais.motivo3Titulo}
                        onChange={(e) =>
                          setDadosSite({
                            ...dadosSite,
                            diferenciais: {
                              ...dadosSite.diferenciais,
                              motivo3Titulo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <textarea
                      className="form-control bg-light border-0"
                      rows="3"
                      placeholder="Plataforma intuitiva desenvolvida com os mais altos padrões de segurança e usabilidade."
                      value={dadosSite.diferenciais.motivo3Descricao}
                      onChange={(e) =>
                        setDadosSite({
                          ...dadosSite,
                          diferenciais: {
                            ...dadosSite.diferenciais,
                            motivo3Descricao: e.target.value,
                          },
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "contactos":
        return (
          <div className="animate__animated animate__fadeIn">
            <h4 className="mb-1 text-dark fw-bold">Contactos</h4>
            <p className="text-muted small mb-1">
              Edita as informações de contacto (o formulário à direita é fixo e
              gerado automaticamente).
            </p>
            <p className="text-secondary small fst-italic mb-4">
              Dica: Se deixares os campos em branco, o site utilizará
              automaticamente o texto padrão da plataforma.
            </p>

            {/* TÍTULO E SUBTÍTULO GERAIS */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-semibold text-secondary">
                  Título da Secção
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Contacte-nos"
                  value={dadosSite.contactos.titulo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      contactos: {
                        ...dadosSite.contactos,
                        titulo: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary">
                  Subtítulo
                </label>
                <input
                  type="text"
                  className="form-control p-3 bg-light"
                  placeholder="Entre em contacto connosco para saber mais sobre as nossas soluções de cibersegurança."
                  value={dadosSite.contactos.subtitulo}
                  onChange={(e) =>
                    setDadosSite({
                      ...dadosSite,
                      contactos: {
                        ...dadosSite.contactos,
                        subtitulo: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* INFORMAÇÕES DE CONTACTO (Lado Esquerdo) */}
            <div className="card bg-secondary bg-opacity-10 border-0 p-4 mb-4 rounded-4">
              <h5 className="h6 fw-bold mb-4 text-dark">
                Informações de Contacto (Lado Esquerdo)
              </h5>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 p-3 shadow-sm"
                    placeholder="contacto@cyberboxsecur.pt"
                    value={dadosSite.contactos.email}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        contactos: {
                          ...dadosSite.contactos,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Telefone
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 p-3 shadow-sm"
                    placeholder="+351 210 000 000"
                    value={dadosSite.contactos.telefone}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        contactos: {
                          ...dadosSite.contactos,
                          telefone: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Morada
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 p-3 shadow-sm"
                    placeholder="Rossio, Edifício Cyber, Viseu, Portugal"
                    value={dadosSite.contactos.morada}
                    onChange={(e) =>
                      setDadosSite({
                        ...dadosSite,
                        contactos: {
                          ...dadosSite.contactos,
                          morada: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="text-primary d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={faEdit} size="2x" />
            </div>
            <div>
              <h3 className="h5 fw-bold text-dark mb-1">Gestão de Conteúdos</h3>
              <p className="text-muted small mb-0">
                Editor de conteúdos da página inicial
              </p>
            </div>
          </div>

          <button
            onClick={guardarAlteracoes}
            className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                A guardar...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                Guardar Alterações
              </>
            )}
          </button>
        </div>

        <div className="d-flex" style={{ minHeight: "600px" }}>
          <div
            className="bg-light border-end d-flex flex-column pt-4"
            style={{ width: "120px" }}
          >
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`btn border-0 rounded-3 py-3 mx-2 mb-2 d-flex flex-column align-items-center gap-2 text-uppercase fw-bold style-none shadow-none`}
                  style={{
                    fontSize: "10px",
                    color: isActive ? "#ffffff" : "#0d6efd",
                    backgroundColor: isActive ? "#0d6efd" : "transparent",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{ fontSize: "18px" }}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex-grow-1 p-4 p-md-5 bg-white">
            {renderConteudo()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoConteudos;
