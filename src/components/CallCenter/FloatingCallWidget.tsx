import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { PhoneCall, ShieldAlert, Headphones, X, ChevronRight } from 'lucide-react';

export const FloatingCallWidget: React.FC = () => {
  const { startVoipCall, triggerSosAlert, activeTrackingCode } = useLogistics();
  const [isOpen, setIsOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosLocation, setSosLocation] = useState('');
  const [sosReason, setSosReason] = useState('Поломка колеса / подвески');

  const handleTriggerSos = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSosAlert(sosLocation || 'Трасса M-7, км 842', sosReason, activeTrackingCode);
    setSosModalOpen(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute inset-0 animate-ping opacity-75"></span>
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Колл-центр 24/7</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 mb-4 leading-relaxed">
              Круглосуточная поддержка водителей-экспедиторов и грузовладельцев. Бесплатный звонок по РФ и СНГ.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  startVoipCall('Консультация по рейсу / статус доставки', 'support');
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-left group transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition">
                      Связь с диспетчером
                    </div>
                    <div className="text-[11px] text-slate-400">Время ответа &lt; 15 сек</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setSosModalOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 text-left group transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-300 group-hover:text-red-200 transition">
                      Кнопка SOS (Водителю)
                    </div>
                    <div className="text-[11px] text-red-400/80">Поломка, ДТП, ЧП на трассе</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-center">
              <span className="text-[11px] text-slate-400">Прямой номер горячей линии:</span>
              <a 
                href="tel:+77023203878"
                className="block font-mono text-sm font-bold text-amber-400 hover:text-amber-300 mt-0.5"
              >
                +7 (702) 320-38-78
              </a>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95"
          aria-label="Колл-центр диспетчеризации"
        >
          <PhoneCall className="w-5 h-5 text-slate-950 animate-bounce" />
          <span className="text-sm font-bold tracking-tight">Колл-центр 24/7</span>
          <span className="w-2 h-2 rounded-full bg-slate-950"></span>
        </button>
      </div>

      {/* SOS Emergency Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border-2 border-red-600/80 rounded-3xl p-6 shadow-2xl shadow-red-950/60 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-red-900/50">
              <div className="flex items-center gap-2 text-red-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <h3 className="text-lg font-bold text-white">Экстренный вызов SOS</h3>
              </div>
              <button
                onClick={() => setSosModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-red-200/90 mt-3 mb-4 leading-relaxed bg-red-950/40 p-3 rounded-xl border border-red-900/60">
              Сигнал мгновенно поступит на пульт начальника смены безопасности TransLogix. Эвакуатор и техпомощь координируются по GPS координатам.
            </p>

            <form onSubmit={handleTriggerSos} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Причина экстренной остановки:
                </label>
                <select
                  value={sosReason}
                  onChange={(e) => setSosReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Поломка колеса / прокол спарки">Поломка колеса / прокол спарки</option>
                  <option value="Отказ тормозной системы / пневматики">Отказ тормозной системы / пневматики</option>
                  <option value="Перегрев / отказ двигателя">Перегрев / отказ двигателя</option>
                  <option value="Срыв пломбы / попытка хищения">Срыв пломбы / попытка хищения</option>
                  <option value="ДТП на трассе">ДТП на трассе (нужна помощь)</option>
                  <option value="Сбой рефрижераторной установки">Сбой рефрижератора (риск порчи груза)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Местоположение / трасса и ориентир:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: М-7 Волга, 612 км, АЗС Лукойл"
                  value={sosLocation}
                  onChange={(e) => setSosLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSosModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/40 transition"
                >
                  Отправить SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
