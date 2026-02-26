
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Gallery, { CatalogItem, Gender } from './components/Gallery';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender>('Feminino');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('/api/catalog');
        if (response.ok) {
          const data = await response.json();
          setCatalogItems(data);
        }
      } catch (error) {
        console.error("Erro ao carregar catálogo", error);
      }
    };
    
    fetchCatalog();
    // Refresh catalog every 30 seconds
    const interval = setInterval(fetchCatalog, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply theme class to html element for global styles like scrollbar
    const root = document.documentElement;
    root.classList.remove('theme-feminino', 'theme-masculino');
    root.classList.add(`theme-${selectedGender.toLowerCase()}`);
  }, [selectedGender]);

  const navigateTo = (sectionId: string) => {
    if (sectionId === 'vitrine') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element ? element.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <div className={`min-h-screen font-sans text-stone-800 bg-stone-50 selection:bg-brand-rose selection:text-stone-900 overflow-x-hidden theme-${selectedGender.toLowerCase()}`}>
      <Navbar onNavigate={navigateTo} selectedGender={selectedGender} onGenderChange={setSelectedGender} />
      
      <main className="transition-opacity duration-500 min-h-screen">
        <div className="pt-24 lg:pt-40 pb-20 lg:pb-32 bg-stone-50 animate-fade-in min-h-screen" id="vitrine">
          <Gallery items={catalogItems} selectedGender={selectedGender} />
        </div>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
