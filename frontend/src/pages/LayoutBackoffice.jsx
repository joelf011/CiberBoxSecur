import React, { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Container, Nav, Offcanvas } from "react-bootstrap";
import Logo from "../assets/logos/CiberBoxSecur-Minimal-color.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faComments,
  faEdit,
  faUsers,
  faHistory,
  faFolderOpen,
  faSignOutAlt,
  faShieldAlt,
  faIndent,
  faOutdent,
  faBars,
  faTimes,
  faUserShield,
  faBuilding,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { usersApi } from "../api/usersApi";

/**
 * Responsável por:
 * - Definir a shell autenticada do portal e filtrar navegação por permissões.
 * - Carregar o perfil do utilizador para sidebar, mobile menu e logout.
 *
 * Fluxo:
 * Login -> localStorage/JWT -> LayoutBackoffice -> usersApi/profile -> Outlet.
 */
const LayoutBackoffice = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Perfil visível na navegação, recarregado quando a página de perfil emite evento.
  const [userProfile, setUserProfile] = useState({
    name: "A carregar...",
    email: "",
    avatar: null,
  });

  // Permissões guardadas no login controlam apenas a visibilidade do menu.
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userPermissions = loggedInUser.permissions || [];

  const handleLogout = () => {
    // Remove sessão local antes de regressar ao website público.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Carrega perfil real do backend para refletir alterações de nome/avatar.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await usersApi.getMyProfile();
        setUserProfile(data);
      } catch (error) {
        console.error("Erro ao carregar perfil no Sidebar:", error);
      }
    };
    fetchProfile();
    window.addEventListener("perfilAtualizado", fetchProfile);

    return () => {
      window.removeEventListener("perfilAtualizado", fetchProfile);
    };
  }, []);

  const allNavItems = [
    { path: "/portal/dashboard", icon: faChartLine, label: "Dashboard" }, // Disponível para qualquer utilizador autenticado.
    {
      path: "/portal/incidentes",
      icon: faShieldAlt,
      label: "Central de Incidentes",
      permission: "VIEW_INCIDENTS",
    },
    {
      path: "/portal/forum",
      icon: faComments,
      label: "Fórum de Clientes",
      permission: "VIEW_TICKETS",
    },
    {
      path: "/portal/cms",
      icon: faEdit,
      label: "Gestão de Conteúdo",
      permission: "UPDATE_CMS",
    },
    {
      path: "/portal/noticias",
      icon: faNewspaper,
      label: "Notícias e Artigos",
      permission: "MANAGE_ARTICLES",
    },
    {
      path: "/portal/empresas",
      icon: faBuilding,
      label: "Gestão de Empresas",
      permission: "CREATE_COMPANY",
    },
    {
      path: "/portal/users",
      icon: faUsers,
      label: "Gestão de Utilizadores",
      permission: "VIEW_USERS",
    },
    {
      path: "/portal/cargos",
      icon: faUserShield,
      label: "Cargos e Permissões",
      permission: "VIEW_ROLES",
    },
    {
      path: "/portal/docs",
      icon: faFolderOpen,
      label: "Repositório Global",
      permission: "VIEW_TICKETS",
    },
    {
      path: "/portal/logs",
      icon: faHistory,
      label: "Activity Logs",
      permission: "VIEW_AUDIT_LOGS",
    },
  ];

  // Remove entradas sem permissão para evitar navegação para áreas sem acesso.
  const navItems = allNavItems.filter((item) => {
    if (!item.permission) return true;

    // A validação real continua no backend; aqui apenas se esconde a opção.
    return userPermissions.includes(item.permission);
  });

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light font-sans flex-column flex-md-row">
      <style>{`
        .sidebar-box {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background-color: #121212;
          z-index: 1050;
        }
        .nav-label {
          white-space: nowrap;
          transition: opacity 0.2s ease, transform 0.3s ease;
          opacity: ${isCollapsed ? 0 : 1};
          transform: translateX(${isCollapsed ? "-10px" : "0"});
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }
        .side-link {
          display: flex !important;
          align-items: center !important;
          height: 48px;
          min-height: 48px;
          flex-shrink: 0;
          margin: 4px 8px;
          padding: 0 !important;
          color: #b3b3b3 !important;
          text-decoration: none !important;
          border-radius: 6px !important;
          transition: background 0.2s;
          overflow: hidden;
        }
        .side-link.active { background-color: #0d6efd !important; color: white !important; }
        .side-link:hover:not(.active) { background-color: rgba(255,255,255,0.05); color: white !important; }

        .icon-wrapper {
          min-width: 64px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .mobile-bottom-nav {
          height: 70px;
          background: white;
          border-top: 1px solid #dee2e6;
          z-index: 2000; /* Mantém a barra sempre no topo */
        }
        
        /* Previne que o conteúdo do Offcanvas fique debaixo da barra */
        .offcanvas-footer {
          padding-bottom: 85px !important; 
        }

        @media (max-width: 767.98px) {
          .main-view { padding-bottom: 75px !important; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        /* Efeito específico para o botão de sair no desktop */
        .side-link-danger {
        color: #dc3545 !important; /* Cor danger do Bootstrap */
        background-color: rgba(220, 53, 69, 0.1) !important; /* Fundo avermelhado muito subtil */
        transition: all 0.2s ease;
        }

        .side-link-danger:hover {
        background-color: #dc3545 !important; /* Vermelho total no hover */
        color: white !important;
      }
      `}</style>

      {/* Navegação principal em desktop, filtrada por permissões locais. */}
      <aside
        className="sidebar-box text-white d-none d-md-flex flex-column border-end border-secondary shadow overflow-hidden"
        style={{
          width: isCollapsed ? "80px" : "260px",
          minWidth: isCollapsed ? "80px" : "260px",
          flexShrink: 0,
        }}
      >
        <div
          className="d-flex align-items-center justify-content-between px-3 overflow-hidden"
          style={{ height: "70px", flexShrink: 0 }}
        >
          {!isCollapsed && (
            <div className="d-flex align-items-center ps-2 nav-label">
              <Link
                to="/portal/dashboard"
                className="d-flex align-items-center "
              >
                <img
                  src={Logo}
                  alt="CiberBoxSecur Logo"
                  style={{
                    maxHeight: "40px",
                    width: "145px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Link>
            </div>
          )}
          <div
            className={isCollapsed ? "w-100 d-flex justify-content-center" : ""}
          >
            <button
              className="btn text-secondary p-1 border-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <FontAwesomeIcon
                icon={isCollapsed ? faOutdent : faIndent}
                size="lg"
              />
            </button>
          </div>
        </div>

        <Nav
          className="flex-column flex-nowrap flex-grow-1 mt-3 custom-scrollbar overflow-y-auto overflow-x-hidden"
          style={{ minHeight: 0 }}
        >
          {navItems.map((item) => (
            <Nav.Link
              as={NavLink}
              to={item.path}
              key={item.path}
              className="side-link"
            >
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span className="nav-label small fw-medium">{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>

        <div
          className="mt-auto border-top border-secondary border-opacity-25 bg-black bg-opacity-25 py-3 overflow-hidden d-flex flex-column"
          style={{ flexShrink: 0 }}
        >
          {/* Perfil do utilizador sincronizado com a API. */}
          <Link
            to="/portal/perfil"
            className="text-decoration-none d-block mx-2 profile-section-hover"
          >
            <div className="d-flex align-items-center mb-3 mt-2">
              <div className="icon-wrapper">
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt="Avatar"
                    className="rounded-circle object-fit-cover shadow-sm border border-secondary"
                    style={{ width: "38px", height: "38px" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold shadow-sm text-white"
                    style={{ width: "38px", height: "38px", fontSize: "13px" }}
                  >
                    {userProfile.name
                      ? userProfile.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
              <div className="nav-label overflow-hidden text-white">
                <p className="mb-0 fw-bold small text-truncate">
                  {userProfile.name}
                </p>
                <small
                  className="text-white-50 d-block text-truncate"
                  style={{ fontSize: "11px" }}
                >
                  {userProfile.email}
                </small>
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="side-link text-decoration-none py-2 bg-white bg-opacity-10 border-0 side-link-danger text-start"
            style={{ cursor: "pointer" }}
          >
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
            <span className="nav-label small fw-bold">Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Outlet onde as páginas protegidas são renderizadas. */}
      <main className="flex-grow-1 d-flex flex-column bg-body-tertiary main-view overflow-hidden">
        <div className="flex-grow-1 overflow-auto p-3 p-md-4">
          <Container fluid className="py-2">
            <Outlet />
          </Container>
        </div>
      </main>

      {/* Navegação compacta para as primeiras rotas em mobile. */}
      <nav className="mobile-bottom-nav d-flex d-md-none fixed-bottom shadow-lg">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-fill d-flex flex-column align-items-center justify-content-center text-decoration-none ${isActive ? "text-primary fw-bold" : "text-secondary"}`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="mb-1 fs-5" />
            <span style={{ fontSize: "0.65rem" }}>
              {item.label.split(" ")[0]}
            </span>
          </NavLink>
        ))}
        <button
          className={`flex-fill d-flex flex-column align-items-center justify-content-center border-0 bg-transparent ${showMobileMenu ? "text-primary" : "text-secondary"}`}
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon
            icon={showMobileMenu ? faTimes : faBars}
            className="mb-1 fs-5"
          />
          <span style={{ fontSize: "0.65rem" }}>
            {showMobileMenu ? "Fechar" : "Menu"}
          </span>
        </button>
      </nav>

      {/* Menu completo em mobile para manter acesso às restantes áreas. */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="bottom"
        className="h-100 border-0 bg-dark text-white"
      >
        <Offcanvas.Header className="border-bottom border-secondary border-opacity-25 p-4">
          <div className="d-flex align-items-center">
            <img
              src={Logo}
              alt="CiberBoxSecur Logo"
              style={{
                height: "40px",
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <button
            className="btn text-white p-2 border-0 shadow-none"
            onClick={() => setShowMobileMenu(false)}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column overflow-hidden">
          <Nav
            className="flex-column flex-nowrap py-3 overflow-y-auto overflow-x-hidden custom-scrollbar flex-grow-1"
            style={{ minHeight: 0 }}
          >
            {navItems.map((item) => (
              <Nav.Link
                as={NavLink}
                to={item.path}
                key={item.path}
                className="side-link py-4 mx-3"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="icon-wrapper fs-4">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="fs-5 fw-medium">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>

          <div
            className="offcanvas-footer mt-auto border-top border-secondary border-opacity-25 bg-black bg-opacity-25 p-4"
            style={{ flexShrink: 0 }}
          >
            {/* Acesso ao perfil também disponível dentro do menu mobile. */}
            <Link
              to="/portal/perfil"
              className="text-decoration-none d-flex align-items-center mb-4"
              onClick={() => setShowMobileMenu(false)}
            >
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="rounded-circle object-fit-cover me-3 shadow-sm border border-secondary"
                  style={{ width: "45px", height: "45px" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm text-white"
                  style={{ width: "45px", height: "45px" }}
                >
                  {userProfile.name
                    ? userProfile.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
              <div className="text-white">
                <h6 className="mb-0 fw-bold text-white">{userProfile.name}</h6>
                <small className="text-white-50">{userProfile.email}</small>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-danger w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Terminar Sessão
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default LayoutBackoffice;
