import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading, faAlignLeft, faLink, faMousePointer } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h4 className="text-2xl font-bold text-slate-800">Hero Section</h4>
        <p className="text-slate-500">Configura o banner principal da tua página inicial</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <FontAwesomeIcon icon={faHeading} className="text-purple-500" />
            Título Principal
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            defaultValue="Cibersegurança para organizações que não podem parar"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <FontAwesomeIcon icon={faAlignLeft} className="text-purple-500" />
            Subtítulo
          </label>
          <textarea 
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
            defaultValue="Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
              <FontAwesomeIcon icon={faMousePointer} className="text-purple-500" />
              Texto do Botão
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              defaultValue="Fale Connosco"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
              <FontAwesomeIcon icon={faLink} className="text-purple-500" />
              Link do Botão
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              defaultValue="#contact"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;