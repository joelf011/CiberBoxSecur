import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutBackoffice from './pages/LayoutBackoffice';
import LayoutWebsite from './components/LayoutWebsite';
import PaginaLogin from './pages/PaginaLogin';

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

      {/* 3. Rotas do Backoffice: Usam o teu Layout com Sidebar */}
      <Route path="/admin" element={<LayoutBackoffice />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<div>Conteúdo da Dashboard</div>} />
        <Route path="users" element={<div>Gestão de Utilizadores</div>} />
      </Route>
    </Routes>
  );
}

export default App;