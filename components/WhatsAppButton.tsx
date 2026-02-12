
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/5513996916451?text=Olá! Gostaria de agendar uma visita na Ellegance Noivas."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-[#25D366] text-white p-1 pr-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
    >
      <div className="bg-white p-2 rounded-full text-[#25D366]">
        <MessageCircle size={24} fill="currentColor" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">
        Fale conosco e agende sua visita 💍
      </span>
      <span className="text-xs font-bold uppercase tracking-widest md:hidden">
        Agendar Visita
      </span>
    </a>
  );
};

export default WhatsAppButton;
