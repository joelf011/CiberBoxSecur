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
import Hero from './gestao/Hero';
import About from './gestao/About';


const GestaoConteudos = () => {
  const [activeTab, setActiveTab] = useState('hero');

  // Cores do tema (Roxo do AdminPanel)
  const purpleClass = "text-purple-600";
  const bgPurpleClass = "bg-purple-600";

  const menuItems = [
    { id: 'hero', label: 'Hero', icon: faHome },
    { id: 'sobre', label: 'Sobre', icon: faInfoCircle },
    { id: 'servicos', label: 'Serviços', icon: faConciergeBell },
    { id: 'noticias', label: 'Notícias', icon: faNewspaper },
    { id: 'contactos', label: 'Contactos', icon: faPhone },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Interno */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center ${bgPurpleClass}`}>
              <FontAwesomeIcon icon={faEdit} size="lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Gestão de Conteúdos</h3>
              <p className="text-sm text-slate-500">Editor de conteúdos da página inicial</p>
            </div>
          </div>
          
          <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium transition-transform hover:scale-105 ${bgPurpleClass}`}>
            <FontAwesomeIcon icon={faSave} />
            Guardar Alterações
          </button>
        </div>

        <div className="flex min-h-[600px]">
          {/* Sidebar de Navegação Local */}
          <div className="w-24 border-r border-slate-100 bg-slate-50/50 flex flex-col py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-2 py-4 transition-all relative ${
                  activeTab === item.id ? purpleClass : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {/* Indicador Lateral */}
                {activeTab === item.id && (
                  <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${bgPurpleClass}`} />
                )}
                
                <FontAwesomeIcon icon={item.icon} className="text-xl" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-center px-1">
                  {item.label}
                </span>
                
                {/* Fundo da aba ativa (Bolha) */}
                {activeTab === item.id && (
                   <div className="absolute inset-0 bg-purple-50 -z-10 mx-2 rounded-xl" />
                )}
              </button>
            ))}
          </div>

          {/* Área do Formulário */}
          <div className="flex-1 p-10 bg-white">
            {activeTab === 'hero' && <Hero/>}
            {activeTab === 'sobre' && <About/>}
            {activeTab === 'servicos' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 italic">
                <FontAwesomeIcon icon={faConciergeBell} size="3x" className="opacity-20" />
                <p>Editor de Serviços em breve...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoConteudos;