
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ViewType } from '../App';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType, sectionId?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', view: 'home', section: 'inicio' },
    { name: 'Sobre', view: 'home', section: 'sobre' },
    { name: 'Galeria', view: 'catalog', section: undefined },
    { name: 'Diferenciais', view: 'home', section: 'diferenciais' },
    { name: 'Avaliações', view: 'home', section: 'avaliacoes' },
    { name: 'Contato', view: 'home', section: 'contato' },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    e.preventDefault();
    onNavigate(link.view as ViewType, link.section);
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${isScrolled || currentView === 'catalog' ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <button onClick={() => onNavigate('home', 'inicio')} className="flex items-center group transition-transform hover:scale-105">
          {logoError ? (
            <div className="flex flex-col items-center">
              <span className="font-serif tracking-widest text-xl lg:text-2xl text-brand-gold">ELLEGANCE</span>
              <span className="text-[8px] tracking-[0.3em] text-stone-400 uppercase">Noivas</span>
            </div>
          ) : (
            <img 
              src="logo.png" 
              alt="Ellegance Noivas" 
              className={`transition-all duration-500 ${isScrolled || currentView === 'catalog' ? 'h-14 lg:h-16' : 'h-20 lg:h-24'} w-auto object-contain`}
              onError={() => setLogoError(true)}
            />
          )}
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleLinkClick(e, link)}
              className={`text-[11px] uppercase tracking-[0.25em] font-semibold transition-all hover:text-brand-gold hover:tracking-[0.3em] ${
                (isScrolled || currentView === 'catalog') ? 'text-stone-700' : 'text-stone-800'
              } ${currentView === link.view && !link.section ? 'text-brand-gold border-b border-brand-gold pb-1' : ''}`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-stone-800 p-2 z-[110]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-white z-[105] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-xl font-serif tracking-[0.15em] text-stone-800 uppercase hover:text-brand-gold"
            >
              {link.name}
            </button>
          ))}
          <a
            href="https://wa.me/5513996916451"
            className="mt-8 px-10 py-4 bg-brand-gold text-white text-xs uppercase tracking-widest font-bold rounded-sm shadow-lg"
          >
            Agendar Visita
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
