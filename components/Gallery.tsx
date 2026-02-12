
import React, { useState, useMemo, useEffect } from 'react';
import { 
  MessageCircle, 
  ArrowLeft, 
  User, 
  Users, 
  Sparkles, 
  Settings, 
  Eye, 
  EyeOff, 
  Slash, 
  CheckCircle, 
  X, 
  Lock,
  Trash2,
  Pencil,
  Palette,
  Maximize,
  Plus,
  Search
} from 'lucide-react';
import AdminPanel from './AdminPanel';

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
  onBack?: () => void;
  onAddItem: (item: Omit<CatalogItem, 'id' | 'isVisible' | 'isAvailable'>) => void;
  onUpdateItems: (items: CatalogItem[]) => void;
  onToggleVisibility: (id: number) => void;
  onToggleAvailability: (id: number) => void;
  onDeleteItem: (id: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({ 
  items, 
  onBack, 
  onAddItem, 
  onUpdateItems,
  onToggleVisibility, 
  onToggleAvailability,
  onDeleteItem
}) => {
  const [selectedGender, setSelectedGender] = useState<Gender>('Feminino');
  const [selectedCategory, setSelectedCategory] = useState<string | 'Todas'>('Todas');
  const [selectedColor, setSelectedColor] = useState<string | 'Todas'>('Todas');
  const [selectedSize, setSelectedSize] = useState<string | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [managementMode, setManagementMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<{ type: 'add' | 'manage' } | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
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
      const visibilityMatch = managementMode ? true : item.isVisible;
      return genderMatch && categoryMatch && colorMatch && sizeMatch && searchMatch && visibilityMatch;
    });
  }, [items, selectedGender, selectedCategory, selectedColor, selectedSize, searchQuery, managementMode]);

  const handleAdminAction = (type: 'add' | 'manage') => {
    if (isAdminAuthenticated) {
      if (type === 'add') {
        setEditingItem(null);
        setShowAdmin(true);
      }
      if (type === 'manage') setManagementMode(!managementMode);
    } else {
      setShowPasswordPrompt({ type });
    }
  };

  const handleEditItem = (item: CatalogItem) => {
    setEditingItem(item);
    setShowAdmin(true);
  };

  const handleUpdateItemData = (updatedData: Omit<CatalogItem, 'id' | 'isVisible' | 'isAvailable'>) => {
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? { ...item, ...updatedData } : item
      );
      onUpdateItems(updatedItems);
    } else {
      onAddItem(updatedData);
    }
    setShowAdmin(false);
    setEditingItem(null);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2312') {
      setIsAdminAuthenticated(true);
      const type = showPasswordPrompt?.type;
      setShowPasswordPrompt(null);
      setPasswordInput('');
      if (type === 'add') setShowAdmin(true);
      if (type === 'manage') setManagementMode(true);
    } else {
      alert("Senha incorreta.");
      setPasswordInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 animate-fade-in relative">
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-stone-900/95 flex items-center justify-center p-4 md:p-12 animate-fade-in cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-brand-gold"><X size={32} /></button>
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" />
        </div>
      )}

      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-sm shadow-2xl w-full max-w-sm border-t-4 border-brand-gold animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Lock size={18} className="text-brand-gold" />
                <h3 className="font-serif text-xl text-stone-900">Acesso Restrito</h3>
              </div>
              <button onClick={() => setShowPasswordPrompt(null)} className="text-stone-300 hover:text-stone-600"><X size={20}/></button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input 
                type="password" 
                autoFocus 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                placeholder="Digite a senha de acesso" 
                className="w-full p-4 bg-stone-50 border border-stone-100 focus:border-brand-gold outline-none text-center text-lg tracking-[0.5em] font-bold" 
              />
              <button className="w-full py-4 bg-stone-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">Confirmar</button>
            </form>
          </div>
        </div>
      )}

      {showAdmin && (
        <AdminPanel 
          onClose={() => { setShowAdmin(false); setEditingItem(null); }} 
          onAddItem={handleUpdateItemData} 
          currentItems={items} 
          onImport={onUpdateItems} 
          itemToEdit={editingItem || undefined}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
        {onBack && (
          <button onClick={onBack} className="group flex items-center space-x-2 text-stone-400 hover:text-brand-gold transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Início</span>
          </button>
        )}

        <div className="flex items-center space-x-4">
          <button onClick={() => handleAdminAction('add')} className="flex items-center space-x-3 px-6 py-3 bg-white border border-stone-200 text-stone-600 hover:border-stone-400 transition-all rounded-sm text-[11px] uppercase tracking-widest font-bold">
            <Plus size={16} /><span>ADICIONAR</span>
          </button>
          <button onClick={() => handleAdminAction('manage')} className={`flex items-center space-x-3 px-6 py-3 bg-white border-2 transition-all rounded-md text-[11px] uppercase tracking-widest font-bold ${managementMode ? 'border-brand-gold text-brand-gold shadow-md' : 'border-stone-900 text-stone-900'}`}>
            <Settings size={18} className={managementMode ? 'animate-spin-slow' : ''} /><span>{managementMode ? 'SAIR EDIÇÃO' : 'GERENCIAR'}</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-16 px-4">
        <h2 className="text-brand-gold text-xs font-bold uppercase tracking-[0.6em] mb-6">Coleções Ellegance</h2>
        <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">Sua <span className="italic text-brand-rose">Vitrine Exclusiva.</span></h3>
        
        {/* Barra de Pesquisa */}
        <div className="max-w-md mx-auto relative group mt-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-stone-300 group-focus-within:text-brand-gold transition-colors" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar modelo..."
            className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-sm text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all placeholder:text-stone-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-300 hover:text-stone-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mb-16 space-y-10">
        <div className="bg-stone-50 p-1 rounded-sm flex border border-stone-100 shadow-sm overflow-hidden w-full max-w-sm md:max-w-md mx-auto">
          <button onClick={() => setSelectedGender('Feminino')} className={`flex-1 flex items-center justify-center space-x-3 px-4 py-3 rounded-sm text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${selectedGender === 'Feminino' ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-brand-gold'}`}>
            <Users size={16} /><span>Feminino</span>
          </button>
          <button onClick={() => setSelectedGender('Masculino')} className={`flex-1 flex items-center justify-center space-x-3 px-4 py-3 rounded-sm text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${selectedGender === 'Masculino' ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-brand-gold'}`}>
            <User size={16} /><span>Masculino</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 px-4 w-full">
          <button onClick={() => setSelectedCategory('Todas')} className={`px-5 py-2 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold rounded-sm border transition-all ${selectedCategory === 'Todas' ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-gold hover:text-brand-gold'}`}>
            Todas Categorias
          </button>
          {dynamicCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold rounded-sm border transition-all ${selectedCategory === cat ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-gold hover:text-brand-gold'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-100 pt-10 px-6">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2 text-stone-400">
              <Palette size={14} className="text-brand-gold" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Cores</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <button onClick={() => setSelectedColor('Todas')} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedColor === 'Todas' ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-gold'}`}>
                Todas
              </button>
              {availableColors.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedColor === color ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-gold'}`}>
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2 text-stone-400">
              <Maximize size={14} className="text-brand-gold" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Tamanhos</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <button onClick={() => setSelectedSize('Todos')} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedSize === 'Todos' ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-gold'}`}>
                Todos
              </button>
              {availableSizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.15em] font-bold rounded-full border transition-all ${selectedSize === size ? 'bg-brand-gold border-brand-gold text-white shadow-sm' : 'bg-white border-stone-100 text-stone-400 hover:border-brand-gold'}`}>
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
                  
                  {managementMode && (
                    <div className="absolute top-4 right-4 z-30 flex flex-col space-y-2">
                       <button onClick={() => handleEditItem(item)} className="p-3 bg-white text-brand-gold rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-all"><Pencil size={18} /></button>
                       <button onClick={() => onToggleVisibility(item.id)} className={`p-3 rounded-full shadow-lg transition-all ${item.isVisible ? 'bg-white text-stone-800' : 'bg-stone-900 text-brand-gold'}`}>{item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                       <button onClick={() => onToggleAvailability(item.id)} className={`p-3 rounded-full shadow-lg transition-all ${item.isAvailable ? 'bg-white text-stone-800' : 'bg-red-500 text-white'}`}>{item.isAvailable ? <Slash size={18} /> : <CheckCircle size={18} />}</button>
                       <button onClick={() => onDeleteItem(item.id)} className="p-3 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                  )}

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
                  <h4 className="font-serif text-2xl text-stone-900 mb-2 truncate">{item.name}</h4>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-6 text-[9px] uppercase tracking-[0.3em] font-bold">
                    <span className="text-brand-gold whitespace-nowrap">{item.category}</span>
                    <div className="w-1 h-1 bg-stone-200 rounded-full flex-shrink-0"></div>
                    <span className="text-stone-400 whitespace-nowrap">{item.color}</span>
                    <div className="w-1 h-1 bg-stone-200 rounded-full flex-shrink-0"></div>
                    <span className="text-stone-400 whitespace-nowrap">T: {item.size}</span>
                  </div>
                  <a 
                    href={`https://wa.me/5513996916451?text=Olá! Vi o modelo ${item.name} (${item.color}, Tamanho ${item.size}) no catálogo digital e gostaria de mais informações sobre o aluguel.`} 
                    target="_blank" 
                    className={`inline-flex items-center justify-center space-x-3 w-full border border-stone-100 bg-stone-50 py-4 group/btn transition-all duration-500 rounded-sm ${!item.isAvailable ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'hover:bg-stone-900 hover:text-white shadow-md'}`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">{item.isAvailable ? 'Consultar Aluguel' : 'Indisponível'}</span>
                    <MessageCircle size={18} className="text-brand-gold group-hover/btn:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-stone-50 rounded-sm border border-stone-100 flex flex-col items-center w-full px-12 mx-4">
            <Sparkles size={32} className="text-stone-200 mb-8" />
            <h4 className="font-serif text-3xl text-stone-400 mb-4 italic">Nenhum modelo encontrado</h4>
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
