
import React from 'react';
import { Heart, Sparkles, Coffee, ShieldCheck } from 'lucide-react';

const diffs = [
  {
    icon: <Sparkles className="text-brand-gold" size={32} />,
    title: 'Vestidos Exclusivos',
    desc: 'Modelos selecionados das melhores coleções nacionais e internacionais para garantir que seu vestido seja único.'
  },
  {
    icon: <Heart className="text-brand-gold" size={32} />,
    title: 'Atendimento Personalizado',
    desc: 'Consultoras especialistas dedicadas a entender seu estilo, silhueta e desejos para a escolha perfeita.'
  },
  {
    icon: <Coffee className="text-brand-gold" size={32} />,
    title: 'Experiência Intimista',
    desc: 'Um momento de tranquilidade para você e suas acompanhantes em um ambiente reservado e sofisticado.'
  },
  {
    icon: <ShieldCheck className="text-brand-gold" size={32} />,
    title: 'Consultoria Especializada',
    desc: 'Suporte completo desde a primeira prova até o ajuste final, com costura de alto padrão.'
  }
];

const Differentiators: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
      <h2 className="text-stone-400 text-xs font-bold uppercase tracking-[0.4em] mb-4">Diferenciais</h2>
      <h3 className="text-3xl md:text-5xl font-serif text-stone-900 mb-16">Por que escolher a Ellegance?</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {diffs.map((d, i) => (
          <div key={i} className="flex flex-col items-center group">
            <div className="mb-6 p-6 rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
              {d.icon}
            </div>
            <h4 className="text-lg font-serif text-stone-800 mb-4">{d.title}</h4>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
              {d.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Differentiators;
