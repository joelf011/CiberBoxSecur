import React, { useState } from 'react';
import { Save, Edit3, Home, Info, Bell, Newspaper, Phone } from 'lucide-react';
import { HeroEditor } from './gestao/Hero'; // Vamos criar estas a seguir
import { AboutEditor } from './gestao/About';

const GestaoConteudos = () => {
  const [activeTab, setActiveTab] = useState('hero');

  // Cores do tema (roxo do AdminPanel)
  const purpleClass = "text-purple-600";
  const bgPurpleClass = "bg-purple-600";

  const menuItems = [
    { id: 'hero', label: 'Hero', icon: Home },
    { id: 'sobre', label: 'Sobre', icon: Info },
    { id: 'servicos', label: 'Serviços', icon: Bell },
    { id: 'noticias', label: 'Notícias', icon: Newspaper },
    { id: 'contactos', label: 'Contactos', icon: Phone },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Interno */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl text-white ${bgPurpleClass}`}>
              <Edit3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Gestão de Conteúdos</h3>
              <p className="text-sm text-slate-500">Editor de conteúdos da página inicial</p>
            </div>
          </div>
          
          <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium transition-transform hover:scale-105 ${bgPurpleClass}`}>
            <Save size={18} />
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
                className={`flex flex-col items-center gap-1 py-4 transition-all relative ${
                  activeTab === item.id ? purpleClass : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {activeTab === item.id && (
                  <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${bgPurpleClass}`} />
                )}
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                
                {/* Estilo de "bolha" ativa se quiseres igual à imagem */}
                {activeTab === item.id && (
                   <div className="absolute inset-0 bg-purple-50 -z-10 mx-2 rounded-xl" />
                )}
              </button>
            ))}
          </div>

          {/* Área do Formulário */}
          <div className="flex-1 p-10 bg-white">
            {activeTab === 'hero' && <HeroEditor />}
            {activeTab === 'sobre' && <AboutEditor />}
            {activeTab === 'servicos' && <div className="text-slate-400 italic">Editor de Serviços em breve...</div>}
            {/* Adicionar as outras conforme necessário */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoConteudos;