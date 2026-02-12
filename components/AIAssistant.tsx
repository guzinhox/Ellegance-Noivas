
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, User, Bot, Paperclip, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { CatalogItem } from './Gallery';

interface AIAssistantProps {
  // Fixed: Update onAddItem to match the updated App/Gallery signature excluding system-managed properties
  onAddItem: (item: Omit<CatalogItem, 'id' | 'isVisible' | 'isAvailable'>) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onAddItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; image?: string }[]>([
    { role: 'assistant', text: 'Olá! Sou a Estilista Virtual da Ellegance. Se tiver inspirações, anexe aqui no clipe e eu adiciono na hora à nossa galeria.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setMessages(prev => [...prev, { 
        role: 'user', 
        text: 'Analise este modelo para a nossa vitrine digital.', 
        image: base64Data 
      }]);
      setIsLoading(true);

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Content = base64Data.split(',')[1];

        // Fixed: Added 'size' to prompt and schema to match CatalogItem requirements
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              parts: [
                { inlineData: { mimeType: file.type, data: base64Content } },
                { text: "Você é um especialista em moda nupcial e de gala. Analise a imagem e identifique: 1. Gênero (Feminino/Masculino). 2. Categoria (Vestido de Noiva, Vestido de Festa, Traje do Noivo ou Terno Social). 3. Cor predominante. 4. Tamanho provável ou 'Sob consulta'. 5. Crie um nome elegante para o modelo. Retorne um JSON com: name, gender, category, color, size." }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                gender: { type: Type.STRING },
                category: { type: Type.STRING },
                color: { type: Type.STRING },
                size: { type: Type.STRING },
              },
              required: ["name", "gender", "category", "color", "size"]
            }
          }
        });

        const result = JSON.parse(response.text || '{}');
        
        if (result.name) {
          // Fixed: Included missing 'size' property in the onAddItem payload
          onAddItem({
            name: result.name,
            gender: result.gender as any,
            category: result.category as any,
            color: result.color,
            size: result.size || 'Sob consulta',
            image: base64Data
          });

          setMessages(prev => [...prev, { 
            role: 'assistant', 
            text: `Uau! Esse "${result.name}" na cor ${result.color} é simplesmente divino. Já incluí ele na categoria ${result.category} do nosso catálogo. Ficou perfeito! 💍` 
          }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', text: "O modelo é belíssimo! Tive um pequeno erro ao catalogar automaticamente, mas você já pode vê-lo como inspiração aqui no chat." }]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chatContents = messages.map(m => {
        const parts: any[] = [{ text: m.text }];
        if (m.image) {
          const [header, data] = m.image.split(';base64,');
          const mimeType = header.split(':')[1];
          parts.push({ inlineData: { mimeType, data } });
        }
        return {
          role: m.role === 'user' ? 'user' : 'model',
          parts
        };
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...chatContents, { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: 'Você é a Estilista Virtual da Ellegance Noivas. Seja sempre romântica e profissional.',
          temperature: 0.7,
        },
      });
      setMessages(prev => [...prev, { role: 'assistant', text: response.text || "Estou à disposição para ajudar com seu sonho!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Tive um probleminha técnico, mas vamos continuar conversando? 💍" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 p-4 bg-brand-gold text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <Sparkles size={24} />
      </button>

      <div className={`fixed bottom-6 right-6 z-[60] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-brand-offwhite border-b border-brand-rose/30 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-rose/20 rounded-full">
              <Sparkles size={20} className="text-brand-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-stone-800">Estilista Virtual</h3>
              <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Ellegance Noivas</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-stone-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] space-y-2`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-brand-gold text-white rounded-tr-none' : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none'}`}>
                  {msg.text}
                </div>
                {msg.image && (
                  <div className="rounded-xl overflow-hidden border-2 border-brand-rose shadow-md max-w-[200px] ml-auto">
                    <img src={msg.image} alt="Modelo Enviado" className="w-full h-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 text-brand-gold text-xs animate-pulse font-medium">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"></div>
              <span>Processando sua escolha...</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-stone-100">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-stone-400 hover:text-brand-gold hover:bg-stone-50 rounded-full transition-all"
            >
              <Paperclip size={20} />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Diga algo ou anexe fotos..."
                className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-100 rounded-full text-sm focus:outline-none focus:border-brand-gold transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-stone-900 text-white rounded-full disabled:opacity-50 hover:bg-brand-gold transition-colors shadow-md"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
