import React from 'react';
import { Truck, PhoneCall, ShieldCheck, Mail, MapPin, Headphones, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950">
                <Truck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-lg font-extrabold text-white">Trans<span className="text-amber-400">Logix</span></span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Федеральная логистическая компания и цифровая экспедиция. Автомобильные, рефрижераторные и негабаритные перевозки по России, Казахстану, Беларуси и СНГ.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Член Ассоциации АСМАП • Лицензия Минтранса</span>
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Сервисы платформы</h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => setActiveTab('order')} 
                  className="hover:text-amber-400 transition"
                >
                  Калькулятор и прием заказов
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('tracking')} 
                  className="hover:text-amber-400 transition"
                >
                  Онлайн трекинг по ТТН / коду
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('payments')} 
                  className="hover:text-amber-400 transition"
                >
                  Оплата картой, QR и B2B счета
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('callcenter')} 
                  className="hover:text-amber-400 transition"
                >
                  Колл-центр и диспетчерская 24/7
                </button>
              </li>
            </ul>
          </div>

          {/* For Partners & Drivers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Перевозчикам & Клиентам</h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => setActiveTab('portal')} 
                  className="hover:text-amber-400 transition"
                >
                  Регистрация водителя и тягача
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('portal')} 
                  className="hover:text-amber-400 transition"
                >
                  Кабинет корпоративного заказчика
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('callcenter')} 
                  className="hover:text-amber-400 transition text-red-400 flex items-center gap-1"
                >
                  <span>Экстренная служба SOS на трассе</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <span className="text-slate-500">Электронный документооборот (Диадок)</span>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Контакты 24/7</h4>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <a href="tel:+77023203878" className="font-mono font-bold text-white hover:text-amber-400 transition">
                +7 (702) 320-38-78
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>dispatch@translogix.kz</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>Центральный хаб: г. Алматы, пр. Райымбека, 496, терминал «Жетысу»</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 ООО «ТрансЛоджикс Карго Сервис». Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <span>Политика конфиденциальности</span>
            <span>Публичная оферта</span>
            <span>Регламент безопасности перевозок</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
