
import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageCircle, 
  User, 
  Users, 
  Sparkles, 
  X, 
  Maximize,
  Search
} from 'lucide-react';

export type Gender = 'Feminino' | 'Masculino';

export interface CatalogItem {
  id: number;
  name: string;
  gender: Gender;
  category: string;
  color: string;
  size: string;
  image: string;
  isVisible: boolean;
  isAvailable: boolean;
  tag?: string;
}

interface GalleryProps {
  items: CatalogItem[];
  selectedGender: Gender;
}

const Gallery: React.FC<GalleryProps> = ({ items, selectedGender }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'Todas'>('Todas');
  const [selectedColor, setSelectedColor] = useState<string | 'Todas'>('Todas');
  const [selectedSize, setSelectedSize] = useState<string | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCategory('Todas');
    setSelectedColor('Todas');
    setSelectedSize('Todos');
  }, [selectedGender]);

  // Coletar categorias únicas baseadas no gênero
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach(item => {
      if (item.gender === selectedGender) {
        cats.add(item.category);
      }
    });
    return Array.from(cats).sort();
  }, [items, selectedGender]);

  // Coletar cores únicas baseadas nos filtros atuais
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    items.forEach(item => {
      if (item.gender === selectedGender && (selectedCategory === 'Todas' || item.category === selectedCategory)) {
        colors.add(item.color);
      }
    });
    return Array.from(colors).sort();
  }, [items, selectedGender, selectedCategory]);

  // Coletar tamanhos únicos baseados nos filtros atuais
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    items.forEach(item => {
      if (item.gender === selectedGender && 
         (selectedCategory === 'Todas' || item.category === selectedCategory) &&
         (selectedColor === 'Todas' || item.color === selectedColor)) {
        item.size.split(',').forEach(s => sizes.add(s.trim()));
      }
    });
    return Array.from(sizes).sort();
  }, [items, selectedGender, selectedCategory, selectedColor]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const genderMatch = item.gender === selectedGender;
      const categoryMatch = selectedCategory === 'Todas' || item.category === selectedCategory;
      const colorMatch = selectedColor === 'Todas' || item.color.toLowerCase() === selectedColor.toLowerCase();
      const sizeMatch = selectedSize === 'Todos' || item.size.split(',').map(s => s.trim()).includes(selectedSize);
      const searchMatch = searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const visibilityMatch = item.isVisible;
      return genderMatch && categoryMatch && colorMatch && sizeMatch && searchMatch && visibilityMatch;
    });
  }, [items, selectedGender, selectedCategory, selectedColor, selectedSize, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 animate-fade-in relative">
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-stone-900/95 flex items-center justify-center p-4 md:p-12 animate-fade-in cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-brand-gold"><X size={32} /></button>
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" />
        </div>
      )}

      <div className="text-center mb-16 px-4">
        <h2 className="text-brand-gold text-xs font-bold uppercase tracking-[0.6em] mb-6">Aluguel de Roupas</h2>
        <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">Sua <span className="italic text-brand-rose">Vitrine Exclusiva.</span></h3>
      </div>

      <div className="flex flex-col items-center mb-16 space-y-10">
        <div className="flex flex-wrap justify-center gap-3 px-4 w-full">
          <button onClick={() => setSelectedCategory('Todas')} className={`px-5 py-2 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold rounded-sm border transition-all ${selectedCategory === 'Todas' ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-200 text-stone-900 hover:border-brand-gold hover:text-brand-gold'}`}>
            Todas Categorias
          </button>
          {dynamicCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold rounded-sm border transition-all ${selectedCategory === cat ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-200 text-stone-900 hover:border-brand-gold hover:text-brand-gold'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-200 pt-10 px-6">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2 text-stone-900">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Cores</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <button onClick={() => setSelectedColor('Todas')} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedColor === 'Todas' ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-200 text-stone-900 hover:border-brand-gold'}`}>
                Todas
              </button>
              {availableColors.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedColor === color ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-200 text-stone-900 hover:border-brand-gold'}`}>
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2 text-stone-900">
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Tamanhos</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <button onClick={() => setSelectedSize('Todos')} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedSize === 'Todos' ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-200 text-stone-900 hover:border-brand-gold'}`}>
                Todos
              </button>
              {availableSizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedSize === size ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-200 text-stone-900 hover:border-brand-gold'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center min-h-[400px] mb-20 px-4 md:px-0">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12 lg:gap-y-20 w-full">
            {filteredItems.map((item) => (
              <div key={item.id} className={`group flex flex-col animate-fade-in mx-auto w-full max-w-sm transition-all duration-500 ${!item.isVisible ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-6 rounded-sm shadow-sm group/card">
                  <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110 ${!item.isAvailable ? 'brightness-50' : ''}`} />
                  
                  {!item.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20 backdrop-blur-[1px]">
                      <span className="bg-stone-900/90 text-white px-8 py-3 text-[10px] uppercase tracking-[0.4em] font-bold border border-white/20">Indisponível</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer" onClick={() => setSelectedImage(item.image)}>
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
                      <Maximize size={24} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col text-center md:text-left px-2">
                  <h4 className="font-serif text-2xl text-stone-900 mb-2 truncate">COD: {item.id} - {item.name}</h4>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-6 text-[9px] uppercase tracking-[0.3em] font-bold">
                    <span className="text-brand-gold whitespace-nowrap">{item.category}</span>
                    <div className="w-1 h-1 bg-stone-200 rounded-full flex-shrink-0"></div>
                    <span className="text-stone-900 whitespace-nowrap">{item.color}</span>
                    <div className="w-1 h-1 bg-stone-200 rounded-full flex-shrink-0"></div>
                    <span className="text-stone-900 whitespace-nowrap">T: {item.size}</span>
                  </div>
                  <a 
                    href={`https://wa.me/5513996916451?text=Olá! Vi o modelo ${item.name} (COD: ${item.id}, ${item.color}, Tamanho ${item.size}) no catálogo digital e gostaria de mais informações sobre o aluguel.`} 
                    target="_blank" 
                    className={`inline-flex items-center justify-center space-x-3 w-full border border-stone-200 bg-white py-4 group/btn transition-all duration-500 rounded-sm ${!item.isAvailable ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'hover:bg-stone-900 hover:text-white shadow-md'}`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-900 group-hover/btn:text-white">{item.isAvailable ? 'Consultar Aluguel' : 'Indisponível'}</span>
                    <MessageCircle size={18} className="text-brand-gold group-hover/btn:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-sm border border-stone-200 flex flex-col items-center w-full px-12 mx-4 shadow-sm">
            <Sparkles size={32} className="text-stone-400 mb-8" />
            <h4 className="font-serif text-3xl text-stone-900 mb-4 italic">Nenhum modelo encontrado</h4>
            <button 
              onClick={() => { setSelectedCategory('Todas'); setSelectedColor('Todas'); setSelectedSize('Todos'); setSearchQuery(''); }} 
              className="mt-6 px-12 py-4 bg-stone-900 text-white text-[11px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
