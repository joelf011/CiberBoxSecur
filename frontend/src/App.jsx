import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutBackoffice from './pages/LayoutBackoffice';
import LayoutWebsite from './components/LayoutWebsite';
import Login from './pages/auth/Login';
import DefinirPassword from './pages/auth/DefinirPassword';
import RecuperarPassword from './pages/auth/RecuperarPassword';
import AdminForum from './pages/admin/AdminForum';
import AdminLogs from './pages/admin/AdminLogs';
import GestaoConteudos from './pages/admin/GestaoConteudos';
import GestaoUtilizadores from './pages/admin/GestaoUtilizadores';
import GestaoCargos from './pages/admin/GestaoCargos';
import GestaoEmpresas from './pages/admin/GestaoEmpresas';
import Perfil from './pages/admin/Perfil';
import NovoIncidente from './pages/incidentes/NovoIncidente';
import ListaIncidentes from './pages/incidentes/ListaIncidentes';
import DetalhesIncidente from './pages/incidentes/DetalhesIncidente';
import Dashboard from './pages/admin/Dashboard';
import Home from './pages/Home'; 
import NewsPage from './pages/NewsPage';
import RepositorioGlobal from './pages/admin/RepositorioGlobal';

function App() {
  return (
    <Routes>
      {/* Rota do Website */}
      <Route
        path="/"
        element={
          <LayoutWebsite>
            <Home />
          </LayoutWebsite>
        }
      />

      <Route path="/noticias" element={<NewsPage />} />

      {/* Rota de Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/ativar-conta" element={<DefinirPassword />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />

      {/* Rotas do Backoffice */}
      <Route path="/portal" element={<LayoutBackoffice />}>
        {/* Redireciona /admin para /admin/dashboard automaticamente */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="forum" element={<AdminForum />} />
        <Route path="cms" element={<GestaoConteudos />} />
        <Route path="users" element={<GestaoUtilizadores />} />
        <Route path="cargos" element={<GestaoCargos />} />
        <Route path="empresas" element={<GestaoEmpresas />} />
        
        <Route path="logs" element={<AdminLogs />} />
        
        <Route path="incidentes/novo" element={<NovoIncidente />} />
        <Route path="incidentes" element={<ListaIncidentes />} />
        <Route path="incidentes/:id" element={<DetalhesIncidente />} />
        
        <Route path="docs" element={<RepositorioGlobal />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      {/* Rota de "catch-all" para 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;