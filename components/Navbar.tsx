
import React, { useState, useEffect } from 'react';
import { Mars, Venus } from 'lucide-react';
import { Gender } from './Gallery';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  selectedGender: Gender;
  onGenderChange: (gender: Gender) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, selectedGender, onGenderChange }) => {
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

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm py-2`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => onNavigate('vitrine')} className="flex items-center group transition-transform hover:scale-105">
            {logoError ? (
              <div className="flex flex-col items-center">
                <span className="font-serif tracking-widest text-xl lg:text-2xl text-brand-gold">ELLEGANCE</span>
                <span className="text-[8px] tracking-[0.3em] text-stone-900 uppercase">Noivas</span>
              </div>
            ) : (
              <img 
                src="logo.png" 
                alt="Ellegance Noivas" 
                className={`transition-all duration-500 h-14 lg:h-16 w-auto object-contain`}
                onError={() => setLogoError(true)}
              />
            )}
          </button>
        </div>

        {/* Gender Filter Icons */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-sm border border-stone-200 shadow-sm">
          <button 
            onClick={() => onGenderChange('Feminino')} 
            className={`p-2 rounded-sm transition-all ${selectedGender === 'Feminino' ? 'bg-pink-100 text-pink-500 shadow-md' : 'text-stone-900 hover:text-pink-500 hover:bg-pink-50'}`}
            title="Feminino"
          >
            <Venus size={22} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => onGenderChange('Masculino')} 
            className={`p-2 rounded-sm transition-all ${selectedGender === 'Masculino' ? 'bg-blue-100 text-blue-500 shadow-md' : 'text-stone-900 hover:text-blue-500 hover:bg-blue-50'}`}
            title="Masculino"
          >
            <Mars size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
