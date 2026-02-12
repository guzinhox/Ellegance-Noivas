
import React from 'react';
import { Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <div className="relative group">
        <div className="absolute -top-6 -left-6 w-full h-full border-2 border-brand-rose/40 rounded-sm translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
        <img
          src="https://images.unsplash.com/photo-1546193430-c2d207739ed7?q=80&w=1000&auto=format&fit=crop"
          alt="Boutique Ellegance Noivas"
          className="relative z-10 w-full aspect-[4/5] object-cover rounded-sm shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute -bottom-10 -right-6 bg-white p-8 shadow-2xl z-20 hidden md:block rounded-sm border-t-4 border-brand-gold">
          <div className="flex items-center space-x-2 mb-3 text-brand-gold">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} fill={s <= 4 ? "currentColor" : "none"} className={s === 5 ? "opacity-40" : ""} />
            ))}
            <span className="text-stone-800 font-bold text-lg ml-2">4,6</span>
          </div>
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.2em] font-semibold">Excelência comprovada</p>
          <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-1">78 noivas apaixonadas</p>
        </div>
      </div>

      <div className="lg:pl-8">
        <h2 className="text-brand-gold text-xs font-bold uppercase tracking-[0.5em] mb-6">A Ellegance Noivas</h2>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-8 leading-tight">
          A curadoria dos seus <span className="italic text-brand-rose font-light">sonhos.</span>
        </h3>
        <p className="text-stone-600 text-lg leading-relaxed mb-6">
          Localizada no coração da Aviação em Praia Grande, somos uma boutique dedicada exclusivamente a tornar o seu dia inesquecível. Nossa missão é encontrar o traje que não apenas vista o seu corpo, mas que conte a sua história.
        </p>
        <p className="text-stone-600 text-lg leading-relaxed mb-8">
          Além de coleções nupciais deslumbrantes, oferecemos o serviço especializado de <strong className="text-stone-800 font-semibold">aluguel de trajes de festa</strong> para madrinhas, convidados e noivos, garantindo que todo o seu cortejo esteja em perfeita harmonia e sofisticação.
        </p>
        <p className="text-stone-600 text-lg leading-relaxed mb-12">
          Oferecemos uma experiência intimista e luxuosa, onde cada detalhe é planejado para que sua escolha seja leve, emocionante e perfeita.
        </p>
        
        <div className="grid grid-cols-2 gap-12 py-8 border-y border-stone-100">
          <div className="group">
            <span className="block text-4xl font-serif text-brand-gold mb-2 group-hover:translate-x-2 transition-transform duration-300">10+</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold">Anos Criando Memórias</span>
          </div>
          <div className="group">
            <span className="block text-4xl font-serif text-brand-gold mb-2 group-hover:translate-x-2 transition-transform duration-300">2k+</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold">Sorrisos no Altar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
