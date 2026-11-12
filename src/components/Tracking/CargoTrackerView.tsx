import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { OrderStatus, Order } from '../../types/logistics';
import { WaybillModal } from './WaybillModal';
import { 
  Search, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileText, 
  PhoneCall, 
  ChevronRight, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer, 
  Navigation, 
  Compass, 
  Maximize2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface CargoTrackerViewProps {
  onGoToPayment: (orderId: string) => void;
}

export const CargoTrackerView: React.FC<CargoTrackerViewProps> = ({ onGoToPayment }) => {
  const { 
    orders, 
    activeTrackingCode, 
    setActiveTrackingCode, 
    updateOrderStatus, 
    startVoipCall,
    currentRole 
  } = useLogistics();

  const [searchInput, setSearchInput] = useState(activeTrackingCode);
  const [showWaybill, setShowWaybill] = useState(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Find active order
  const currentOrder = orders.find(o => o.id.toLowerCase() === activeTrackingCode.toLowerCase()) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = orders.find(o => o.id.toLowerCase().includes(searchInput.trim().toLowerCase()));
    if (found) {
      setActiveTrackingCode(found.id);
    } else {
      // If code not in list, set anyway
      setActiveTrackingCode(searchInput.trim().toUpperCase());
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'in_transit':
        return { label: 'В пути (Магистральный рейс)', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'driver_assigned':
        return { label: 'Назначен водитель / Подача', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'loading':
        return { label: 'На погрузке у отправителя', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'customs_hub':
        return { label: 'Таможня / Промежуточный хаб', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'out_for_delivery':
        return { label: 'На доставке по городу', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'delivered':
        return { label: 'Успешно доставлен', bg: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/60' };
      default:
        return { label: 'Обработка заявки', bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const handleQuickAdvance = (nextStatus: OrderStatus, progress: number, note: string) => {
    if (!currentOrder) return;
    updateOrderStatus(currentOrder.id, nextStatus, progress, note);
    setIsUpdatingStatus(false);
  };

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Груз с таким трек-кодом не найден</h3>
        <p className="text-sm text-slate-400 mb-6">Проверьте правильность введенного номера или выберите из существующих рейсов:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => {
                setActiveTrackingCode(o.id);
                setSearchInput(o.id);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono text-sm border border-slate-700"
            >
              {o.id} ({o.senderCity} → {o.receiverCity})
            </button>
          ))}
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(currentOrder.status);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Search Bar & Quick Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Введите трек-номер (например, TLX-8492-KZ)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Найти
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-500 whitespace-nowrap">Быстрый переход:</span>
            {orders.slice(0, 4).map(o => (
              <button
                key={o.id}
                onClick={() => {
                  setActiveTrackingCode(o.id);
                  setSearchInput(o.id);
                }}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-mono whitespace-nowrap transition border ${
                  currentOrder.id === o.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {o.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Order Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {currentOrder.id}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusBadge.bg}`}>
                {statusBadge.label}
              </span>
              {currentOrder.sealNumber && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-amber-400" />
                  {currentOrder.sealNumber}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Груз: <strong className="text-slate-200">{currentOrder.cargoDescription}</strong> • Масса:{' '}
              <strong className="text-slate-200">{(currentOrder.weightKg / 1000).toFixed(1)} т</strong> ({currentOrder.volumeM3} м³) • Мест: {currentOrder.packagesCount}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowWaybill(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Электронная ТТН / CMR</span>
            </button>

            {currentOrder.paymentStatus !== 'paid_full' && (
              <button
                onClick={() => onGoToPayment(currentOrder.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition"
              >
                <span>Оплатить фрахт ({currentOrder.totalCostKzt.toLocaleString('ru-RU')} ₸)</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Route Progress Bar */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>{currentOrder.senderCity}</span>
            </div>
            <div className="text-xs text-amber-400 font-mono font-semibold">
              Текущее положение: {currentOrder.currentCity} ({currentOrder.currentProgressPercent}%)
            </div>
            <div className="flex items-center gap-2 font-bold text-white">
              <span>{currentOrder.receiverCity}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            </div>
          </div>

          {/* Animated Track Line */}
          <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400 rounded-full transition-all duration-700 relative"
              style={{ width: `${currentOrder.currentProgressPercent}%` }}
            >
              <span className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-ping opacity-75"></span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Отправление: {currentOrder.createdAt}</span>
            <span>Дистанция: {currentOrder.distanceKm} км</span>
            <span>Расчетное прибытие: <strong className="text-emerald-400">{currentOrder.estimatedDeliveryDate}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid: Interactive Route Visualizer Map + Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              <h3 className="text-base font-bold text-white">Интерактивный GPS трекер на трассе</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ГЛОНАСС / GPS онлайн
            </span>
          </div>

          {/* Simulated Highway Vector Canvas */}
          <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-900 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
            
            {/* Grid Map Background Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Simulated Road Curve Vector */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800" fill="none">
              <path
                d="M 50 220 Q 200 80, 400 160 T 700 80"
                strokeWidth="8"
                strokeLinecap="round"
                className="opacity-40"
              />
              <path
                d="M 50 220 Q 200 80, 400 160 T 700 80"
                strokeWidth="2"
                strokeDasharray="8 8"
                className="stroke-amber-400/70"
              />
            </svg>

            {/* City A Marker */}
            <div className="absolute left-8 bottom-12 z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-lg">
                А
              </div>
              <span className="text-[11px] font-bold text-white mt-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                {currentOrder.senderCity}
              </span>
            </div>

            {/* City B Destination Marker */}
            <div className="absolute right-8 top-10 z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center font-bold text-xs shadow-lg">
                Б
              </div>
              <span className="text-[11px] font-bold text-white mt-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                {currentOrder.receiverCity}
              </span>
            </div>

            {/* Active Moving Truck Marker */}
            <div 
              className="absolute z-20 transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${Math.min(Math.max(currentOrder.currentProgressPercent, 20), 80)}%`,
                top: `${50 + Math.sin(currentOrder.currentProgressPercent / 15) * 20}%`
              }}
            >
              <div className="relative group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 ring-4 ring-amber-500/30">
                  <Truck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400 absolute inset-0 animate-ping opacity-25 pointer-events-none"></div>

                {/* Truck Info Tooltip */}
                <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-48 bg-slate-900/95 border border-amber-500/60 rounded-xl p-2.5 text-xs text-white shadow-2xl backdrop-blur-md pointer-events-none">
                  <div className="font-bold text-amber-300 flex items-center justify-between">
                    <span>Борт в эфире</span>
                    <span className="font-mono text-[10px]">76 км/ч</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5 truncate">{currentOrder.currentCity}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {currentOrder.lastGpsCoordinates.lat.toFixed(4)}° N, {currentOrder.lastGpsCoordinates.lng.toFixed(4)}° E
                  </div>
                </div>
              </div>
            </div>

            {/* Map Telemetry Floating Card */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Скорость движения:</span>
                <span className="font-mono font-bold text-emerald-400">76 км/ч</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Погода на трассе:</span>
                <span className="font-bold text-slate-200">Ясно, +5°C</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Тахограф (до отдыха):</span>
                <span className="font-mono font-bold text-amber-400">3 ч. 15 мин.</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Остаток бака:</span>
                <span className="font-mono font-bold text-white">480 л (82%)</span>
              </div>
            </div>
          </div>

          {/* Temperature Telemetry (for pharma / refrigerated) */}
          {currentOrder.cargoCategory === 'refrigerated' && (
            <div className="mt-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Thermometer className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Телеметрия термофургона (Рефрижератор)</div>
                  <div className="text-[11px] text-cyan-300">Датчик Carrier DataCold: +4.2°C (Заданный диапазон +2...+8°C)</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                РЕЖИМ СОБЛЮДЕН
              </span>
            </div>
          )}

          {/* Driver Quick Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentOrder.driver?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80'}
                alt="Водитель"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/60"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentOrder.driver?.name || 'Медведев Алексей'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    ★ {currentOrder.driver?.rating || 4.9}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentOrder.driver?.truckModel} • Госномер: <strong className="text-slate-200 font-mono">{currentOrder.driver?.licensePlate}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => startVoipCall(`Связь с водителем ${currentOrder.driver?.name} по рейсу ${currentOrder.id}`, 'support')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Связаться</span>
            </button>
          </div>

        </div>

        {/* Checkpoint Timeline (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Журнал контрольных точек</h3>
              </div>
              <span className="text-xs text-slate-400">
                {currentOrder.checkpoints.filter(c => c.completed).length} из {currentOrder.checkpoints.length}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {currentOrder.checkpoints.map((cp, idx) => {
                return (
                  <div key={cp.id || idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition ${
                        cp.completed
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                          : cp.current
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 animate-pulse'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
                      }`}
                    >
                      {cp.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-2xl group-hover:border-slate-700 transition">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-bold ${cp.completed ? 'text-white' : 'text-slate-300'}`}>
                          {cp.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                          {cp.timestamp}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{cp.location}</span>
                      </div>

                      {cp.notes && (
                        <div className="mt-2 text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
                          {cp.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forwarder / Driver Action Box to Update Status */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Управление статусом (Водитель/Диспетчер):</span>
              <button
                onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                {isUpdatingStatus ? 'Скрыть панель' : 'Изменить статус'}
              </button>
            </div>

            {isUpdatingStatus ? (
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block">Быстрый переход к следующему этапу:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleQuickAdvance('in_transit', 60, 'Транзитный проезд Казань, отдых 45м завершен')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 text-left"
                  >
                    🚛 Выехал на трассу (В пути)
                  </button>
                  <button
                    onClick={() => handleQuickAdvance('customs_hub', 75, 'Прибыл на СВХ / таможенный терминал')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 text-left"
                  >
                    🏛️ Таможенный хаб
                  </button>
                  <button
                    onClick={() => handleQuickAdvance('out_for_delivery', 90, 'Прибыл в город назначения, встал на разгрузку')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 text-left"
                  >
                    📦 На доставке / Склад
                  </button>
                  <button
                    onClick={() => handleQuickAdvance('delivered', 100, 'Груз успешно принят, накладные подписаны')}
                    className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-[11px] font-bold text-emerald-300 border border-emerald-500/50 text-left"
                  >
                    ✅ Успешно доставлен
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Текущий этап зафиксирован в едином реестре</span>
                <span className="text-amber-400 font-semibold cursor-pointer" onClick={() => setIsUpdatingStatus(true)}>
                  Обновить шаг →
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Electronic Waybill Modal */}
      {showWaybill && (
        <WaybillModal
          order={currentOrder}
          onClose={() => setShowWaybill(false)}
        />
      )}

    </div>
  );
};
