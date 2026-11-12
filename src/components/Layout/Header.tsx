import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  Truck, 
  Search, 
  CreditCard, 
  Headphones, 
  UserCheck, 
  ShieldAlert, 
  PlusCircle, 
  PhoneCall, 
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { UserRole } from '../../types/logistics';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, setCurrentRole, orders, drivers, startVoipCall } = useLogistics();

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const availableDriversCount = drivers.filter(d => d.status === 'free').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      {/* Top micro announcement bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Единая диспетчерская служба 24/7
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              Рейсов на контроле: <strong className="text-white">{activeOrdersCount}</strong>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Свободно тягачей: <strong className="text-amber-400">{availableDriversCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => startVoipCall('Оперативная консультация', 'support')}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+7 (702) 320-38-78</span>
              <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">24/7</span>
            </button>

            {/* Quick Role Switcher Pill */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700/80">
              <span className="text-[11px] px-2 text-slate-400 flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">Режим:</span>
              </span>
              {(['customer', 'driver', 'dispatcher'] as UserRole[]).map((role) => {
                const labels: Record<UserRole, string> = {
                  customer: 'Заказчик',
                  driver: 'Водитель',
                  dispatcher: 'Диспетчер'
                };
                return (
                  <button
                    key={role}
                    onClick={() => setCurrentRole(role)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                      currentRole === role
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {labels[role]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('order')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Truck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">Trans<span className="text-amber-400">Logix</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">CARGO PRO</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Грузовые перевозки & Экспедиция</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/50 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('order')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'order'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Прием заказа</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'tracking'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Отслеживание груза</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'payments'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Оплата и счета</span>
            </button>

            <button
              onClick={() => setActiveTab('callcenter')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'callcenter'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Колл-центр 24/7</span>
            </button>

            <button
              onClick={() => setActiveTab('portal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'portal'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Кабинет / Регистрация</span>
            </button>
          </nav>

          {/* Quick Action CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('order')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Рассчитать перевозку</span>
              <span className="sm:hidden">Заказ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('order')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activeTab === 'order' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Заказ</span>
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activeTab === 'tracking' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Трекинг</span>
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activeTab === 'payments' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Оплата</span>
        </button>
        <button
          onClick={() => setActiveTab('callcenter')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activeTab === 'callcenter' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Колл-центр</span>
        </button>
        <button
          onClick={() => setActiveTab('portal')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
            activeTab === 'portal' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Кабинет</span>
        </button>
      </div>
    </header>
  );
};
