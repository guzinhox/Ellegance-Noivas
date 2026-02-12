
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery, { CatalogItem } from './components/Gallery';
import Differentiators from './components/Differentiators';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export type ViewType = 'home' | 'catalog';

const STORAGE_KEY = 'ellegance_catalog_data_v2';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  
  // Inicializa o estado buscando no localStorage
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar dados", e);
        return [];
      }
    }
    return [];
  });

  // Persistência com verificação de cota
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogItems));
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("Atenção: O limite de memória do navegador foi atingido. Tente usar imagens menores (recomenda-se menos de 1MB por foto) para garantir que seus vestidos fiquem salvos permanentemente.");
      }
    }
  }, [catalogItems]);

  const navigateTo = (view: ViewType, sectionId?: string) => {
    if (view !== currentView) setCurrentView(view);
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element ? element.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fixed: Update signature to match common cataloging needs where visibility/availability are defaulted by the system
  const handleAddItem = (newItem: Omit<CatalogItem, 'id' | 'isVisible' | 'isAvailable'>) => {
    const itemWithId: CatalogItem = {
      ...newItem,
      id: Date.now(),
      isVisible: true,
      isAvailable: true
    };
    setCatalogItems(prev => [itemWithId, ...prev]);
  };

  const handleUpdateItems = (updatedItems: CatalogItem[]) => {
    setCatalogItems(updatedItems);
  };

  const handleToggleVisibility = (id: number) => {
    setCatalogItems(prev => prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  };

  const handleToggleAvailability = (id: number) => {
    setCatalogItems(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("Deseja excluir este modelo permanentemente do seu banco de dados local?")) {
      setCatalogItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen font-sans text-stone-800 bg-white selection:bg-brand-rose selection:text-stone-900 overflow-x-hidden">
      <Navbar currentView={currentView} onNavigate={navigateTo} />
      
      <main className="transition-opacity duration-500 min-h-screen">
        {currentView === 'home' ? (
          <div className="animate-fade-in">
            <section id="inicio"><Hero onNavigate={navigateTo} /></section>
            <section id="sobre" className="py-20 lg:py-32 bg-brand-offwhite overflow-hidden"><About /></section>
            <section id="diferenciais" className="py-20 lg:py-32 bg-brand-offwhite"><Differentiators /></section>
            <section id="avaliacoes" className="py-20 lg:py-32"><Testimonials /></section>
            <section id="contato" className="py-20 lg:py-32 bg-stone-50"><Contact /></section>
          </div>
        ) : (
          <div className="pt-24 lg:pt-40 pb-20 lg:pb-32 bg-white animate-fade-in min-h-screen">
            <Gallery 
              items={catalogItems} 
              onBack={() => navigateTo('home')} 
              onAddItem={handleAddItem}
              onUpdateItems={handleUpdateItems}
              onToggleVisibility={handleToggleVisibility}
              onToggleAvailability={handleToggleAvailability}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        )}
      </main>

      <Footer onNavigate={navigateTo} />
      <WhatsAppButton />
    </div>
  );
};

export default App;
