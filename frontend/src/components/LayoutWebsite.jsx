import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

/**
 * Layout principal do website público.
 * Envolve todas as páginas com a barra de navegação (NavBar) e o rodapé (Footer).
 * O conteúdo das rotas filhas é injetado via prop `children`.
 */
const LayoutWebsite = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      
      <main className="flex-grow-1">
        {children}
        </main>
        
        <Footer/>
          
    </div>
  );
};

export default LayoutWebsite;
