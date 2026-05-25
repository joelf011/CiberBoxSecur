import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFolder, 
  faFolderOpen, 
  faPlus, 
  faDownload, 
  faChevronDown, 
  faChevronUp, 
  faTimes,
  faFilePdf, 
  faFileWord, 
  faFileExcel, 
  faFileAlt 
} from '@fortawesome/free-solid-svg-icons';
import { companyApi } from '../../api/companyApi'; // Ajusta o caminho se o teu ficheiro estiver noutra pasta

const RepositorioGlobal = () => {
  // Estados dos dados vindo do Servidor
  const [companies, setCompanies] = useState([]);
  const [globalCategories, setGlobalCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Interação da Interface (UI)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState({});

  // Definição da cor dos ícones pedida por ti
  const iconColor = "#0d6efd";

  useEffect(() => {
    const carregarDadosDoBackend = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Procura as tuas empresas reais através da API criada acima
        const dadosEmpresas = await companyApi.getAllCompanies();
        console.log("Empresas reais carregadas da tua BD:", dadosEmpresas);
        setCompanies(dadosEmpresas);

        // 2. Mock de Pastas Globais (Podes ligar a uma rota de documentos globais no futuro)
        setGlobalCategories([
          {
            id: 'cat1',
            title: "Templates NIS2",
            count: "12 ficheiros",
            files: [
              { id: 'f1', name: "Template_Matriz_Ativos.xlsx", type: "Excel", size: "850 KB", date: "10 Mar 2026" },
              { id: 'f2', name: "Template_Analise_Risco.xlsx", type: "Excel", size: "1.2 MB", date: "08 Mar 2026" },
              { id: 'f3', name: "Template_Politica_Seguranca.docx", type: "Word", size: "650 KB", date: "05 Mar 2026" },
              { id: 'f4', name: "Checklist_Conformidade_NIS2.pdf", type: "PDF", size: "420 KB", date: "01 Mar 2026" }
            ]
          },
          { id: 'cat2', title: "Políticas de Segurança", count: "8 ficheiros", files: [] },
          { id: 'cat3', title: "Formulários CNCS", count: "4 ficheiros", files: [] },
          { id: 'cat4', title: "Material Formação", count: "24 ficheiros", files: [] }
        ]);

      } catch (err) {
        console.error("Erro na comunicação com o controlador:", err);
        setError("Não foi possível sincronizar com o servidor. A carregar dados locais.");
        
        // Dados de segurança caso o token expire ou dê erro de permissão (VIEW_COMPANIES)
        setCompanies([
          { id: 'mock1', name: "TechCorp SA (Modo de Segurança)", compliance_status: "Approved", documents: [] },
          { id: 'mock2', name: "Banco Financeiro (Modo de Segurança)", compliance_status: "Awaiting", documents: [] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoBackend();
  }, []);

  const toggleCompany = (id) => {
    setExpandedCompanies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FontAwesomeIcon icon={faFilePdf} style={{ color: iconColor }} className="me-2 fs-5" />;
      case 'word':
      case 'docx': return <FontAwesomeIcon icon={faFileWord} style={{ color: iconColor }} className="me-2 fs-5" />;
      case 'excel':
      case 'xlsx': return <FontAwesomeIcon icon={faFileExcel} style={{ color: iconColor }} className="me-2 fs-5" />;
      default: return <FontAwesomeIcon icon={faFileAlt} style={{ color: iconColor }} className="me-2 fs-5" />;
    }
  };

  return (
    <div className="container-fluid my-4" style={{ fontFamily: 'sans-serif' }}>
      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
        
        {/* Cabeçalho */}
        <div className="mb-4">
          <h4 className="fw-bold text-dark mb-1">Repositório de Documentos Global</h4>
          <p className="text-muted small">Gestão centralizada de templates, normativos e ficheiros partilhados com todos os utilizadores.</p>
        </div>

        {/* Alerta de erro caso aconteça */}
        {error && <div className="alert alert-warning py-2 small text-center">{error}</div>}

        {/* PASTAS GLOBAIS */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-secondary mb-0 small text-uppercase">Pastas Globais</h6>
          <button className="btn btn-sm border fw-bold rounded-3 px-3 py-2 text-primary" style={{ fontSize: '13px' }}>
            <FontAwesomeIcon icon={faPlus} /> Nova Pasta
          </button>
        </div>

        {/* Grid de Cards das Pastas */}
        <div className="row g-3 mb-4">
          {globalCategories.map((cat) => {
            const isSelected = selectedCategory?.id === cat.id;
            return (
              <div className="col-12 col-md-3" key={cat.id}>
                <div 
                  className="card p-3 rounded-3 h-100 d-flex flex-row align-items-center justify-content-between border"
                  style={{ 
                    cursor: 'pointer',
                    borderColor: isSelected ? '#212529' : '#e2e8f0',
                    borderWidth: isSelected ? '1.5px' : '1px'
                  }}
                  onClick={() => setSelectedCategory(isSelected ? null : cat)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FontAwesomeIcon icon={isSelected ? faFolderOpen : faFolder} style={{ fontSize: '24px', color: iconColor }} />
                    <div>
                      <h6 className="fw-bold text-dark mb-0 small">{cat.title}</h6>
                      <span className="text-muted" style={{ fontSize: '12px' }}>{cat.count}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <button className="btn btn-link p-0 text-muted shadow-none border-0" onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); }}>
                      <FontAwesomeIcon icon={faTimes} size="sm" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PASTA GLOBAL EXPANDIDA */}
        {selectedCategory && (
          <div className="card border-0 rounded-4 p-4 mb-5" style={{ backgroundColor: '#f4f6fa' }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2 fw-bold text-dark">
                <FontAwesomeIcon icon={faFolderOpen} style={{ color: iconColor }} />
                <span>{selectedCategory.title}</span>
              </div>
              <button className="btn p-0 text-muted border-0" onClick={() => setSelectedCategory(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {selectedCategory.files && selectedCategory.files.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {selectedCategory.files.map((file) => (
                  <div key={file.id} className="d-flex align-items-center justify-content-between bg-white p-3 rounded-3 border-0">
                    <div className="d-flex align-items-center">
                      {getFileIcon(file.type)}
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{file.name}</span>
                        <span className="text-muted" style={{ fontSize: '11px' }}>{file.type} • {file.size}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                      <span className="text-muted small d-none d-md-inline" style={{ fontSize: '13px' }}>{file.date}</span>
                      <button className="btn btn-link p-1 text-primary shadow-none" style={{ color: iconColor }}>
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-4 small">Nenhum ficheiro guardado nesta pasta global.</div>
            )}
          </div>
        )}

        {/* DOCUMENTOS POR EMPRESA DA TUA BASE DE DADOS */}
        <div className="mt-2 mb-3">
          <h6 className="fw-bold text-secondary mb-0 small text-uppercase">Documentos por Empresa</h6>
        </div>

        {loading ? (
          <div className="text-center text-muted p-4">A sincronizar com a Base de Dados no Render...</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {companies.map((company) => {
              const compId = company.id || company._id;
              const isExpanded = !!expandedCompanies[compId];
              
              // Se a tua BD não tiver a propriedade documents injetada, definimos como vazia para não quebrar o map
              const docsDaEmpresa = company.documents || []; 

              return (
                <div key={compId} className="border rounded-4 overflow-hidden bg-white">
                  
                  {/* Linha da Empresa da BD */}
                  <div 
                    className="p-4 d-flex justify-content-between align-items-center bg-light-subtle"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleCompany(compId)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#0d6efd' }}>
                        {company.name ? company.name.substring(0, 2).toUpperCase() : 'CO'}
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0">{company.name}</h6>
                        <span className="text-muted small" style={{ fontSize: '12px' }}>
                          Estado Compliance: <b className="text-capitalize">{company.compliance_status || 'Awaiting'}</b>
                        </span>
                      </div>
                    </div>
                    <div className="text-muted">
                      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </div>
                  </div>

                  {/* Detalhes de ficheiros internos se expandido */}
                  {isExpanded && (
                    <div className="p-4 bg-white border-top">
                      {docsDaEmpresa.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table align-middle border-0 mb-0">
                            <tbody>
                              {docsDaEmpresa.map((doc) => (
                                <tr key={doc.id || doc._id}>
                                  <td className="border-bottom py-3 fw-medium text-dark d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                                    {getFileIcon(doc.type)}
                                    {doc.name}
                                  </td>
                                  <td className="border-bottom py-3 text-end">
                                    <button className="btn btn-link text-muted p-1"><FontAwesomeIcon icon={faDownload} /></button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center text-muted py-2 small">Nenhum documento anexado de momento a esta organização na Base de Dados.</div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default RepositorioGlobal;