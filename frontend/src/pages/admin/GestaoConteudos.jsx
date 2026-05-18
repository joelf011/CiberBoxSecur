import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faEdit, 
  faHome, 
  faInfoCircle, 
  faConciergeBell, 
  faNewspaper, 
  faPhone 
} from '@fortawesome/free-solid-svg-icons';
import Hero from './gestao/Hero.jsx';
import About from './gestao/About.jsx';
import Services from './gestao/Services.jsx';
import News from './gestao/News.jsx';
import Contacts from './gestao/Contacts.jsx';

const GestaoConteudos = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const menuItems = [
    { id: 'hero', label: 'Hero', icon: faHome },
    { id: 'sobre', label: 'Sobre', icon: faInfoCircle },
    { id: 'servicos', label: 'Serviços', icon: faConciergeBell },
    { id: 'noticias', label: 'Notícias', icon: faNewspaper },
    { id: 'contactos', label: 'Contactos', icon: faPhone },
  ];

  return (
    <div className="container-fluid my-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        
        {/* Header Interno */}
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgb(139, 92, 246)' }}>
              <FontAwesomeIcon icon={faEdit} size="lg" />
            </div>
            <div>
              <h3 className="h5 fw-bold text-dark mb-1">Gestão de Conteúdos</h3>
              <p className="text-muted small mb-0">Editor de conteúdos da página inicial</p>
            </div>
          </div>
          
          <button className="btn text-white px-4 py-2 rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgb(139, 92, 246)' }}>
            <FontAwesomeIcon icon={faSave} />
            Guardar Alterações
          </button>
        </div>

        {/* Corpo Principal: Sidebar + Conteúdo */}
        <div className="d-flex" style={{ minHeight: '600px' }}>
          
          {/* Sidebar Lateral Esquerda */}
          <div className="bg-light border-end d-flex flex-column pt-3" style={{ width: '100px' }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`btn border-0 rounded-0 py-3 d-flex flex-column align-items-center gap-2 text-uppercase fw-bold style-none shadow-none`}
                  style={{
                    fontSize: '10px',
                    color: isActive ? '#ffffff' : '#0d6efd',
                    backgroundColor: isActive ? '#0d6efd' : 'transparent',
                    borderLeft: isActive ? '4px solid #0d6efd' : 'none'
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ fontSize: '18px' }} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Área Direita do Conteúdo */}
          <div className="flex-grow-1 p-4 bg-white">
            {activeTab === 'hero' && <Hero />}
            {activeTab === 'sobre' && <About />}
            {activeTab === 'servicos' && <Services />}
            {activeTab === 'noticias' && <News />}
            {activeTab === 'contactos' && <Contacts />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GestaoConteudos;