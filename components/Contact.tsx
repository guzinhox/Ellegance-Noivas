
import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-stone-400 text-xs font-bold uppercase tracking-[0.4em] mb-6">Contato</h2>
          <h3 className="text-3xl md:text-5xl font-serif text-stone-900 mb-10">Estamos esperando <br /> por você.</h3>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm text-brand-gold">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-stone-800 font-bold uppercase tracking-widest text-xs mb-1">Endereço</h4>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Av. Pres. Kennedy, 3321 - Aviação<br />
                  Praia Grande - SP, 11703-200
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm text-brand-gold">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-stone-800 font-bold uppercase tracking-widest text-xs mb-1">Telefone / WhatsApp</h4>
                <a href="tel:13996916451" className="text-stone-500 text-sm hover:text-brand-gold transition-colors block">
                  (13) 99691-6451
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-full shadow-sm text-brand-gold">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-stone-800 font-bold uppercase tracking-widest text-xs mb-1">Horário</h4>
                <p className="text-stone-500 text-sm">
                  Segunda à Sábado — 09:00 às 18:00
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://instagram.com/ellegance.noivass"
              target="_blank"
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-stone-200 text-stone-600 rounded-sm hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm"
            >
              <Instagram size={18} />
              <span className="text-xs uppercase tracking-widest font-bold">Instagram</span>
            </a>
            <a
              href="https://facebook.com/ellegancenoivas"
              target="_blank"
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-stone-200 text-stone-600 rounded-sm hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm"
            >
              <Facebook size={18} />
              <span className="text-xs uppercase tracking-widest font-bold">Facebook</span>
            </a>
          </div>
        </div>

        <div className="h-[400px] lg:h-auto min-h-[400px] relative rounded-sm overflow-hidden shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.298282367507!2d-46.4253401!3d-24.0205214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce1f31f9977827%3A0xc3c944122d603a15!2sAv.%20Pres.%20Kennedy%2C%203321%20-%20Vila%20Avia%C3%A7%C3%A3o%2C%20Praia%20Grande%20-%20SP%2C%2011703-200!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            className="absolute inset-0 w-full h-full grayscale border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
          <div className="absolute bottom-6 left-6 right-6">
            <a
              href="https://www.google.com/maps/dir//Av.+Pres.+Kennedy,+3321+-+Aviação,+Praia+Grande+-+SP,+11703-200"
              target="_blank"
              className="w-full inline-flex items-center justify-center space-x-3 bg-stone-900 text-white py-4 px-8 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold transition-colors shadow-2xl rounded-sm"
            >
              <MapPin size={16} />
              <span>Como chegar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
