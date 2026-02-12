
import React, { useState } from 'react';
import { ViewType } from '../App';

interface HeroProps {
  onNavigate: (view: ViewType, sectionId?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative h-screen min-h-[650px] w-full overflow-hidden flex items-center justify-center bg-stone-900">
      {/* Background Image - Representando fielmente a boutique enviada */}
      <div className={`absolute inset-0 z-0 scale-105 transition-opacity duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'} animate-[slow-zoom_30s_infinite_alternate]`}>
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2500&auto=format&fit=crop"
          alt="Boutique Ellegance Noivas - Exclusividade em cada detalhe"
          className="w-full h-full object-cover brightness-[0.45] object-center scale-110"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2500&auto=format&fit=crop";
          }}
        />
        {/* Overlay de Sofisticação */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/60"></div>
        <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay"></div>
      </div>

      {!imgLoaded && (
        <div className="absolute inset-0 z-0 bg-stone-900 flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin"></div>
        </div>
      )}

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif text-white mb-10 leading-[1.1] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-[fade-in-up_1.2s_ease-out_0.2s_both]">
          Onde seu sonho <br className="hidden md:block" /> encontra a <span className="italic font-light text-brand-rose">perfeição.</span>
        </h1>
        
        <p className="text-white/90 text-lg md:text-2xl font-light tracking-wide mb-12 max-w-4xl mx-auto drop-shadow-md animate-[fade-in-up_1.2s_ease-out_0.4s_both] leading-relaxed">
          Locação de vestidos e trajes de festa para casamentos, com elegância, exclusividade e o cuidado que você merece.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-[fade-in-up_1.2s_ease-out_0.6s_both]">
          <a
            href="https://wa.me/5513996916451?text=Olá! Gostaria de agendar uma visita na Ellegance Noivas para conhecer os vestidos e trajes de festa."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-14 py-5 bg-brand-gold text-white uppercase tracking-[0.25em] text-[11px] font-bold hover:bg-brand-goldSoft hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-sm text-center"
          >
            Agendar minha Visita 💍
          </a>
          <button
            onClick={() => onNavigate('catalog')}
            className="w-full sm:w-auto px-14 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white uppercase tracking-[0.25em] text-[11px] font-bold hover:bg-white hover:text-stone-900 transition-all duration-300 rounded-sm"
          >
            Ver Coleções
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.2); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Hero;
