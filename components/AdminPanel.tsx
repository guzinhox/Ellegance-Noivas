
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { X, Upload, Plus, Check, Database, Copy, Save } from 'lucide-react';
import { CatalogItem, Gender } from './Gallery';

interface AdminPanelProps {
  onAddItem: (item: Omit<CatalogItem, 'id' | 'isVisible' | 'isAvailable'>) => void;
  onClose: () => void;
  currentItems: CatalogItem[];
  onImport: (items: CatalogItem[]) => void;
  itemToEdit?: CatalogItem;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddItem, onClose, currentItems, onImport, itemToEdit }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [gender, setGender] = useState<Gender>('Feminino');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [importText, setImportText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preencher campos se estiver editando
  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setColor(itemToEdit.color);
      setSize(itemToEdit.size);
      setGender(itemToEdit.gender);
      setCategory(itemToEdit.category);
      setImage(itemToEdit.image);
    }
  }, [itemToEdit]);

  // Categorias sugeridas baseadas no que já existe
  const categorySuggestions = useMemo(() => {
    const cats = new Set(['Vestido de Noiva', 'Vestido de Festa', 'Traje do Noivo', 'Terno Social']);
    currentItems.forEach(item => cats.add(item.category));
    return Array.from(cats).sort();
  }, [currentItems]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Esta imagem é pesada. Recomenda-se usar fotos menores para garantir que seus vestidos fiquem salvos permanentemente no seu navegador.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !color || !image || !category || !size) {
      alert("Por favor, preencha todos os campos, incluindo categoria e tamanho.");
      return;
    }
    onAddItem({ 
      name, 
      color, 
      size,
      gender, 
      category, 
      image
    });
    setIsSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  const handleCopyBackup = () => {
    const data = JSON.stringify(currentItems);
    navigator.clipboard.writeText(data);
    alert("Código do Catálogo copiado! Guarde este texto em um lugar seguro.");
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (Array.isArray(data)) {
        onImport(data);
        alert("Catálogo restaurado com sucesso!");
        onClose();
      }
    } catch (e) {
      alert("Código inválido.");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Lado Esquerdo: Imagem */}
        <div className="w-full md:w-2/5 bg-brand-offwhite border-b md:border-b-0 md:border-r border-stone-100 flex flex-col items-center justify-center p-8">
          {image ? (
            <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-lg border-2 border-brand-rose">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-stone-800"><X size={16} /></button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-[3/4] border-2 border-dashed border-stone-200 rounded-sm flex flex-col items-center justify-center space-y-4 hover:border-brand-gold hover:bg-white transition-all group">
              <div className="p-4 bg-white rounded-full text-stone-300 group-hover:text-brand-gold shadow-sm"><Upload size={32} /></div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Carregar Foto</p>
            </button>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          
          {!itemToEdit && (
            <button onClick={() => setShowBackup(!showBackup)} className="mt-8 text-[9px] uppercase tracking-widest text-stone-400 hover:text-brand-gold flex items-center space-x-2">
              <Database size={12} /><span>{showBackup ? 'Voltar para Cadastro' : 'Backup e Restauração'}</span>
            </button>
          )}
        </div>

        {/* Lado Direito: Formulário */}
        <div className="w-full md:w-3/5 p-8 flex flex-col relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-300 hover:text-stone-800 transition-colors"><X size={24} /></button>

          {!showBackup ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-serif text-3xl text-stone-900 mb-1">{itemToEdit ? 'Editar Modelo' : 'Novo Modelo'}</h3>
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-6">{itemToEdit ? 'Atualize as informações' : 'Cadastro de Peça Exclusiva'}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1.5">Nome da Peça</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Vestido Sereia com Renda" className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-brand-gold outline-none text-sm transition-colors" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1.5">Linha</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-brand-gold outline-none text-sm transition-colors cursor-pointer">
                      <option value="Feminino">Feminina</option>
                      <option value="Masculino">Masculina</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1.5">Categoria</label>
                    <input 
                      list="category-suggestions" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                      placeholder="Selecione ou crie..."
                      className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-brand-gold outline-none text-sm transition-colors"
                      required
                    />
                    <datalist id="category-suggestions">
                      {categorySuggestions.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1.5">Cor Principal</label>
                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Ex: Off-White" className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-brand-gold outline-none text-sm transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1.5">Tamanho(s)</label>
                    <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Ex: 38, 40 ou P, M" className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-brand-gold outline-none text-sm transition-colors" required />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSuccess || !image} className={`w-full py-4 flex items-center justify-center space-x-3 text-[10px] uppercase tracking-widest font-bold transition-all shadow-lg ${isSuccess ? 'bg-green-500 text-white' : 'bg-stone-900 text-white hover:bg-brand-gold'}`}>
                  {isSuccess ? <><Check size={18} /><span>{itemToEdit ? 'Atualizado' : 'Cadastrado'} com Sucesso</span></> : <><Save size={18} /><span>{itemToEdit ? 'Salvar Alterações' : 'Adicionar ao Catálogo'}</span></>}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h3 className="font-serif text-3xl text-stone-900 mb-1">Segurança de Dados</h3>
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-8">Backup e Restauração</p>
              
              <div className="p-5 bg-stone-50 border border-stone-100 rounded-sm">
                <p className="text-[11px] text-stone-500 mb-4 leading-relaxed">
                  Para transferir seu catálogo para outro computador ou fazer uma cópia de segurança, copie o código abaixo.
                </p>
                <button onClick={handleCopyBackup} className="w-full py-3 bg-white border border-stone-200 text-stone-600 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center space-x-2 hover:border-brand-gold transition-all shadow-sm">
                  <Copy size={16} /><span>Copiar Banco de Dados</span>
                </button>
              </div>

              <div className="pt-6 border-t border-stone-100">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-3">Restaurar Catálogo Digital</label>
                <textarea 
                  value={importText} 
                  onChange={(e) => setImportText(e.target.value)} 
                  placeholder="Cole o código do banco de dados aqui..." 
                  className="w-full h-32 p-4 bg-stone-50 border border-stone-200 focus:border-brand-gold outline-none text-[9px] font-mono mb-4 leading-normal" 
                />
                <button onClick={handleImport} disabled={!importText} className="w-full py-4 bg-stone-900 text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center space-x-2 hover:bg-brand-gold transition-all disabled:opacity-30">
                  <Save size={18} /><span>Restaurar Informações</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
