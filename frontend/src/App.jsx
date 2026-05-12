import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutBackoffice from './pages/LayoutBackoffice';
import LayoutWebsite from './components/LayoutWebsite';
import PaginaLogin from './pages/PaginaLogin';
import AdminForum from './pages/admin/AdminForum';
import AdminLogs from './pages/admin/AdminLogs';
import GestaoConteudos from './pages/admin/GestaoConteudos';

function App() {
  return (
    <Routes>
      {/* 1. Rota do Website: Envolvemos o conteúdo no layout dos teus colegas */}
      <Route path="/" element={
        <LayoutWebsite>
          <div className="container py-5"><h1>Bem-vindo à CiberBoxSecur</h1></div>
        </LayoutWebsite>
      } />

      {/* 2. Rota da Página Intermédia de Login */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* 3. Rotas do Backoffice: Aqui injetamos os teus novos componentes */}
      <Route path="/admin" element={<LayoutBackoffice />}>
        {/* Redireciona /admin para /admin/dashboard automaticamente */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<div>Conteúdo da Dashboard em breve...</div>} />
        
        {/* ESTA É A ROTA QUE TESTA O TEU FÓRUM */}
        <Route path="forum" element={<AdminForum />} />
        
        <Route path="cms" element={<div><GestaoConteudos /></div>} />
        <Route path="users" element={<div>Gestão de Utilizadores em breve...</div>} />
        <Route path="logs" element={<div><AdminLogs /></div>} />
        <Route path="docs" element={<div>Repositório Global em breve...</div>} />
      </Route>

      {/* Rota de "catch-all" para 404 (opcional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;