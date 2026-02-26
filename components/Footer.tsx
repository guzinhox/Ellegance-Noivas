
import React, { useState } from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-white py-20 px-6 border-t border-stone-200">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <button onClick={() => onNavigate('vitrine')} className="mb-12 group transition-transform hover:scale-105">
          {logoError ? (
            <div className="flex flex-col items-center">
              <span className="font-serif tracking-widest text-3xl text-brand-gold">ELLEGANCE</span>
              <span className="text-[10px] tracking-[0.4em] text-stone-900 uppercase">Noivas</span>
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
        
        <div className="w-20 h-[1px] bg-stone-300 mb-10"></div>

        <div className="text-[10px] text-stone-900 uppercase tracking-[0.25em] leading-loose flex flex-col items-center space-y-2">
          <p>Endereço: Av. Pres. Kennedy, 3321</p>
          <p>Bairro: Aviação, Praia Grande//SP</p>
          <p>Whatsapp: (13) 99691-6451</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
