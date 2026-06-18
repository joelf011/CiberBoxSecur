import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

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
