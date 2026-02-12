
import React, { useState } from 'react';
import { ViewType } from '../App';

interface FooterProps {
  onNavigate: (view: ViewType, sectionId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [logoError, setLogoError] = useState(false);

  const footerLinks = [
    { name: 'Início', view: 'home', section: 'inicio' },
    { name: 'Sobre', view: 'home', section: 'sobre' },
    { name: 'Galeria', view: 'catalog', section: undefined },
    { name: 'Avaliações', view: 'home', section: 'avaliacoes' },
    { name: 'Contato', view: 'home', section: 'contato' },
  ];

  return (
    <footer className="bg-white py-20 px-6 border-t border-stone-100">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <button onClick={() => onNavigate('home', 'inicio')} className="mb-12 group transition-transform hover:scale-105">
          {logoError ? (
            <div className="flex flex-col items-center">
              <span className="font-serif tracking-widest text-3xl text-brand-gold">ELLEGANCE</span>
              <span className="text-[10px] tracking-[0.4em] text-stone-400 uppercase">Noivas</span>
            </div>
          ) : (
            <img 
              src="logo.png" 
              alt="Ellegance Noivas Logo" 
              className="h-24 lg:h-32 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </button>
        
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12">
          {footerLinks.map((item) => (
            <button 
              key={item.name}
              onClick={() => onNavigate(item.view as ViewType, item.section)}
              className="text-[11px] uppercase tracking-[0.3em] font-medium text-stone-400 hover:text-brand-gold transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="w-20 h-[1px] bg-stone-200 mb-10"></div>

        <p className="text-[10px] text-stone-400 uppercase tracking-[0.25em] leading-loose">
          &copy; {new Date().getFullYear()} Ellegance Noivas. <br className="md:hidden" /> Todos os direitos reservados.
        </p>
        <p className="text-[9px] text-stone-300 uppercase tracking-[0.2em] mt-3">
          A melhor boutique de vestidos de noiva de Praia Grande - SP.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
