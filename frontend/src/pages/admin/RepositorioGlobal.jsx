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
import { companyApi } from '../../api/companyApi'; 
import { documentApi } from '../../api/documentApi'; 

const RepositorioGlobal = () => {
  // Estados vindos do Servidor (BD Real)
  const [companies, setCompanies] = useState([]);
  const [globalCategories, setGlobalCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Interação da Interface (UI)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  
  // Estados para a Criação de Nova Pasta (Modal)
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [submittingFolder, setSubmittingFolder] = useState(false);

  // Cor padrão dos ícones
  const iconColor = "#0d6efd";

  // Função independente para carregar os dados sem que um quebre o outro
  const carregarDadosDoBackend = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Tenta carregar as Empresas Reais da tua BD
      try {
        const dadosEmpresas = await companyApi.getAllCompanies();
        console.log("Empresas reais carregadas da tua BD:", dadosEmpresas);
        setCompanies(dadosEmpresas || []);
      } catch (empresaErr) {
        console.error("Erro específico ao buscar empresas:", empresaErr);
        setError("Erro ao carregar empresas do servidor.");
      }

      // 2. Tenta carregar as Pastas Globais da tua BD
      try {
        const dadosPastas = await documentApi.getAllDocuments();
        setGlobalCategories(dadosPastas || []);
      } catch (pastaErr) {
        // Se der erro aqui (porque a rota não existe no backend), não parte as empresas!
        console.log("Rota de pastas globais ainda não encontrada ou sem dados. Fica vazia.");
        setGlobalCategories([]); 
      }

    } catch (err) {
      console.error("Erro geral na sincronização:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDoBackend();
  }, []);

  // Submeter a nova pasta para o Backend
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      setSubmittingFolder(true);
      
      // MUDANÇA AQUI: Usamos 'documentApi' e passamos apenas o texto limpo 'newFolderName'
      await documentApi.createFolder(newFolderName); 
      
      setNewFolderName('');
      setShowModal(false);
      await carregarDadosDoBackend();

    } catch (err) {
      console.error("Erro ao criar pasta no backend:", err);
      // Mostra o erro real que vem da API se algo falhar no banco de dados
      alert(err.response?.data?.error || "Erro ao criar a pasta no servidor.");
    } finally {
      setSubmittingFolder(false);
    }
  };

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

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        {/* PASTAS GLOBAIS */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-secondary mb-0 small text-uppercase">Pastas Globais</h6>
          <button 
            className="btn btn-sm border fw-bold rounded-3 px-3 py-2 text-primary" 
            style={{ fontSize: '13px' }}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Nova Pasta
          </button>
        </div>

        {/* Grid de Cards das Pastas */}
        {globalCategories.length > 0 ? (
          <div className="row g-3 mb-4">
            {globalCategories.map((cat) => {
              const catId = cat.id || cat._id;
              const isSelected = selectedCategory?.id === catId || selectedCategory?._id === catId;
              const totalFicheiros = cat.files?.length || cat.count || 0;

              return (
                <div className="col-12 col-md-3" key={catId}>
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
                        <span className="text-muted" style={{ fontSize: '12px' }}>
                          {totalFicheiros} {totalFicheiros === 1 ? 'ficheiro' : 'ficheiros'}
                        </span>
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
        ) : (
          <div className="text-center text-muted border border-dashed rounded-3 py-4 mb-4 small">
            Nenhuma pasta global criada.
          </div>
        )}

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
                  <div key={file.id || file._id} className="d-flex align-items-center justify-content-between bg-white p-3 rounded-3 border-0">
                    <div className="d-flex align-items-center">
                      {getFileIcon(file.type)}
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{file.name}</span>
                        <span className="text-muted" style={{ fontSize: '11px' }}>{file.type} • {file.size}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                      <span className="text-muted small d-none d-md-inline" style={{ fontSize: '13px' }}>{file.date || file.createdAt}</span>
                      <button className="btn btn-link p-1 text-primary shadow-none" style={{ color: iconColor }}>
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-4 small">Esta pasta ainda não contém ficheiros.</div>
            )}
          </div>
        )}

        {/* DOCUMENTOS POR EMPRESA DA TUA BASE DE DADOS */}
        <div className="mt-2 mb-3">
          <h6 className="fw-bold text-secondary mb-0 small text-uppercase">Documentos por Empresa</h6>
        </div>

        {loading ? (
          <div className="text-center text-muted p-4">A carregar dados do ecossistema...</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {companies.length > 0 ? (
              companies.map((company) => {
                const compId = company.id || company._id;
                const isExpanded = !!expandedCompanies[compId];
                const docsDaEmpresa = company.documents || []; 

                return (
                  <div key={compId} className="border rounded-4 overflow-hidden bg-white">
                    
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
                          <div className="text-center text-muted py-2 small">Nenhum documento anexado de momento a esta organização.</div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted border rounded-3 py-4 small">No momento não existem empresas registadas.</div>
            )}
          </div>
        )}

      </div>

      {/* MODAL BOOTSTRAP PARA CRIAÇÃO DE NOVA PASTA */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold text-dark">Criar Nova Pasta Global</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateFolder}>
                <div className="modal-body px-4 py-3">
                  <div className="form-group">
                    <label className="form-label text-secondary small fw-bold mb-2">Nome da Pasta</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3 p-3 shadow-none" 
                      placeholder="Ex: Políticas NIS2, Manuais..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pb-4 px-4 gap-2">
                  <button type="button" className="btn btn-light rounded-3 px-4 py-2 fw-semibold text-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-3 px-4 py-2 fw-semibold"
                    style={{ backgroundColor: iconColor, borderColor: iconColor }}
                    disabled={submittingFolder}
                  >
                    {submittingFolder ? 'A criar...' : 'Criar Pasta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RepositorioGlobal;