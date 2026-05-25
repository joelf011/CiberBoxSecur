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

function App() {
  return (
    <Routes>
      {/* Rota do Website */}
      <Route path="/" element={
        <LayoutWebsite>
          <div className="container py-5"><h1>Bem-vindo à CiberBoxSecur</h1></div>
        </LayoutWebsite>
      } />

      {/* Rota de Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/ativar-conta" element={<DefinirPassword />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />

      {/* Rotas do Backoffice */}
      <Route path="/admin" element={<LayoutBackoffice />}>
        {/* Redireciona /admin para /admin/dashboard automaticamente */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<div>Conteúdo da Dashboard em breve...</div>} />
        
        <Route path="forum" element={<AdminForum />} />
        <Route path="cms" element={<GestaoConteudos />} />
        <Route path="logs" element={<AdminLogs />} />
        
        <Route path="cms" element={<GestaoConteudos />} />
        <Route path="users" element={<GestaoUtilizadores />} />
        <Route path="cargos" element={<GestaoCargos />} />
        <Route path="logs" element={<div><AdminLogs /></div>} />
        <Route path="docs" element={<div>Repositório Global em breve...</div>} />
      </Route>

      {/* Rota de "catch-all" para 404 (opcional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;