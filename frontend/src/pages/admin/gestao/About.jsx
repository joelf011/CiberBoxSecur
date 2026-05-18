 import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faQuoteLeft, faImage } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h4 className="text-2xl font-bold text-slate-800">Sobre Nós</h4>
        <p className="text-slate-500">Gere a apresentação e história da tua organização</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <FontAwesomeIcon icon={faAddressCard} className="text-purple-500" />
            Título da Secção
          </label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            defaultValue="Especialistas em Defesa Digital"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <FontAwesomeIcon icon={faQuoteLeft} className="text-purple-500" />
            História / Missão
          </label>
          <textarea 
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
            defaultValue="Fundada com o objetivo de tornar o ciberespaço um lugar mais seguro, a nossa equipa foca-se em fornecer soluções robustas para empresas..."
          />
        </div>

        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
          <FontAwesomeIcon icon={faImage} className="text-slate-300 text-4xl mb-3" />
          <p className="text-sm font-medium text-slate-600">Clica para alterar a imagem de destaque</p>
          <p className="text-xs text-slate-400 mt-1">Recomendado: 800x600px (PNG/JPG)</p>
        </div>
      </div>
    </div>
  );
};

export default About;