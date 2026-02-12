
import React from 'react';
import { Quote } from 'lucide-react';

const reviews = [
  {
    name: "Juliana Silva",
    text: "Encontrei meu vestido dos sonhos na primeira visita! O atendimento é impecável e o ambiente faz a gente se sentir uma princesa.",
    role: "Noiva 2024"
  },
  {
    name: "Beatriz Oliveira",
    text: "Equipe maravilhosa e vestidos de tirar o fôlego. Os ajustes ficaram perfeitos e o carinho que elas tratam a gente é surreal.",
    role: "Noiva 2023"
  },
  {
    name: "Camila Santos",
    text: "A Ellegance Noivas tem os vestidos mais lindos da região. Recomendo para todas as minhas amigas que vão casar!",
    role: "Noiva 2024"
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
      <Quote className="mx-auto text-brand-rose mb-8" size={48} />
      <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-16 italic">Relatos de Nossas Noivas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {reviews.map((r, i) => (
          <div key={i} className="flex flex-col items-center">
            <p className="text-stone-600 italic mb-8 leading-relaxed">
              "{r.text}"
            </p>
            <div className="w-8 h-[1px] bg-brand-gold mb-4"></div>
            <h4 className="text-stone-800 font-bold uppercase tracking-widest text-xs">{r.name}</h4>
            <p className="text-stone-400 text-[10px] uppercase tracking-widest mt-1">{r.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
