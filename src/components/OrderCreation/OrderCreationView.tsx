import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { VEHICLE_DETAILS, POPULAR_CITIES } from '../../data/mockData';
import { CargoCategory, VehicleCategory } from '../../types/logistics';
import { 
  MapPin, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Calculator, 
  CheckCircle2, 
  FileText, 
  Thermometer, 
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderCreationViewProps {
  onOrderCreated: (orderId: string) => void;
  onGoToPayment: (orderId: string) => void;
}

// Distance approximation between common hubs in km
const CITY_DISTANCES: Record<string, Record<string, number>> = {
  'Алматы': { 'Астана': 1220, 'Шымкент': 690, 'Караганда': 1010, 'Актобе': 2190, 'Москва': 3950, 'Санкт-Петербург': 4600, 'Ташкент': 810, 'Бишкек': 240, 'Екатеринбург': 2380 },
  'Астана': { 'Алматы': 1220, 'Караганда': 215, 'Шымкент': 1480, 'Актобе': 1450, 'Москва': 2750, 'Санкт-Петербург': 3450, 'Екатеринбург': 1180, 'Минск': 3450 },
  'Шымкент': { 'Алматы': 690, 'Астана': 1480, 'Ташкент': 125, 'Бишкек': 540, 'Актобе': 1520, 'Москва': 3350 },
  'Москва': { 'Алматы': 3950, 'Астана': 2750, 'Санкт-Петербург': 710, 'Екатеринбург': 1780, 'Казань': 820, 'Минск': 720 },
  'Санкт-Петербург': { 'Алматы': 4600, 'Астана': 3450, 'Москва': 710, 'Екатеринбург': 2260, 'Казань': 1520 }
};

export const EURO_TRUCK_SUBTYPES = {
  tent: {
    id: 'tent',
    title: 'Еврофура Тент / Штора 92 м³',
    badge: 'Стандарт магистралей',
    capacity: 'до 22.0 т',
    volume: '92 м³',
    pallets: '33 европаллеты',
    ratePerKm: 460,
    baseBooking: 95000,
    loadingTypes: 'Боковая, задняя, верхняя (сдвижная штора)',
    description: 'Магистральный тягач со шторным полуприцепом. П-образная растентовка, пломбировочный трос TIR, крепежные ремни.'
  },
  mega: {
    id: 'mega',
    title: 'Еврофура Mega / Мега 100 м³',
    badge: 'Увеличенный объем (h=3.0м)',
    capacity: 'до 20.0 т',
    volume: '100 - 105 м³',
    pallets: 'до 34 европаллет',
    ratePerKm: 480,
    baseBooking: 105000,
    loadingTypes: 'Штора, внутренняя высота 3.00 м',
    description: 'Специализированная еврофура с заниженной платформой. Для объемных, тарных и легковесных промышленных грузов.'
  },
  isotherm: {
    id: 'isotherm',
    title: 'Еврофура Изотерм / Фургон 86 м³',
    badge: 'Герметичный термос',
    capacity: 'до 20.0 т',
    volume: '86 м³',
    pallets: '33 европаллеты',
    ratePerKm: 490,
    baseBooking: 110000,
    loadingTypes: 'Задние распашные ворота с пломбировкой',
    description: 'Цельнометаллический жесткий кузов с теплоизоляцией стенок. Защита от перепадов температур, пыли и осадков.'
  },
  open: {
    id: 'open',
    title: 'Еврофура Бортовая 20т (Шаланда)',
    badge: 'Погрузка автокраном',
    capacity: 'до 22.0 т',
    volume: 'Открытый борт 13.6м',
    pallets: 'Трубы / Металл / ЖБИ',
    ratePerKm: 470,
    baseBooking: 100000,
    loadingTypes: 'Верхняя и боковая краном, съемные стойки-коники',
    description: 'Открытая европлатформа 13.6м с откидными алюминиевыми бортами и кониками для крепления негабарита и проката.'
  }
};

export type EuroTruckSubtypeKey = keyof typeof EURO_TRUCK_SUBTYPES;

export const OrderCreationView: React.FC<OrderCreationViewProps> = ({ onOrderCreated, onGoToPayment }) => {
  const { createOrder, currentCustomer } = useLogistics();

  // Form states
  const [senderCity, setSenderCity] = useState('Алматы');
  const [senderAddress, setSenderAddress] = useState('Логистический хаб «Жетысу», пр. Райымбека, 496');
  const [receiverCity, setReceiverCity] = useState('Астана');
  const [receiverAddress, setReceiverAddress] = useState('Индустриальный парк №1, ул. А184, терминал СВХ');

  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('pallet');
  const [cargoDescription, setCargoDescription] = useState('Паллетированная электроника и телеком-оборудование');
  const [weightKg, setWeightKg] = useState<number>(18500);
  const [volumeM3, setVolumeM3] = useState<number>(78);
  const [packagesCount, setPackagesCount] = useState<number>(32);
  const [declaredValueKzt, setDeclaredValueKzt] = useState<number>(25000000);

  // Dedicated Vehicle: Euro truck (Еврофура 20т)
  const [euroTruckSubtype, setEuroTruckSubtype] = useState<EuroTruckSubtypeKey>('tent');
  const vehicleCategory: VehicleCategory = 'euro_truck';

  // Options
  const [insuranceIncluded, setInsuranceIncluded] = useState(true);
  const [loadersNeeded, setLoadersNeeded] = useState(true);
  const [temperatureLogger, setTemperatureLogger] = useState(false);
  const [docReturnNeeded, setDocReturnNeeded] = useState(true);
  const [strictTimeWindow, setStrictTimeWindow] = useState(false);

  // Sender & Receiver Contacts
  const [senderContact, setSenderContact] = useState(currentCustomer.companyName);
  const [senderPhone, setSenderPhone] = useState(currentCustomer.phone);
  const [receiverContact, setReceiverContact] = useState('ТОО «Астана Логистик Центр» (Ерлан К.)');
  const [receiverPhone, setReceiverPhone] = useState('+7 (7172) 44-55-66');

  // Created state
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Calculate distance
  const getDistance = (): number => {
    if (CITY_DISTANCES[senderCity] && CITY_DISTANCES[senderCity][receiverCity]) {
      return CITY_DISTANCES[senderCity][receiverCity];
    }
    if (CITY_DISTANCES[receiverCity] && CITY_DISTANCES[receiverCity][senderCity]) {
      return CITY_DISTANCES[receiverCity][senderCity];
    }
    return 1220; // Fallback distance
  };

  const distanceKm = getDistance();
  const vehicleInfo = EURO_TRUCK_SUBTYPES[euroTruckSubtype];

  // Price calculation in Tenge (KZT) for Euro truck
  const baseRate = Math.round(vehicleInfo.baseBooking + distanceKm * vehicleInfo.ratePerKm);
  const insuranceRate = insuranceIncluded ? Math.round(declaredValueKzt * 0.0015) : 0;
  
  let servicesRate = 0;
  if (loadersNeeded) servicesRate += 35000;
  if (temperatureLogger) servicesRate += 25000;
  if (docReturnNeeded) servicesRate += 9500;
  if (strictTimeWindow) servicesRate += 28000;

  const subtotal = baseRate + insuranceRate + servicesRate;
  const vatRate = Math.round(subtotal * 0.12); // Standard Kazakhstan VAT 12%
  const totalCost = subtotal + vatRate;

  // Approximate transit days for 20t Euro truck (average highway speed 60 km/h with tachograph rest)
  const avgSpeed = 60;
  const transitHours = Math.round(distanceKm / avgSpeed) + (distanceKm > 1000 ? 8 : 2);
  const transitDays = Math.ceil(transitHours / 24);

  const swapCities = () => {
    const tempCity = senderCity;
    const tempAddr = senderAddress;
    setSenderCity(receiverCity);
    setSenderAddress(receiverAddress);
    setReceiverCity(tempCity);
    setReceiverAddress(tempAddr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const order = createOrder({
      senderCity,
      senderAddress,
      senderContact,
      senderPhone,
      receiverCity,
      receiverAddress,
      receiverContact,
      receiverPhone,
      distanceKm,
      estimatedDeliveryDate: `${transitDays} дн. (${transitHours} ч.)`,
      cargoCategory,
      cargoDescription,
      weightKg,
      volumeM3,
      packagesCount,
      declaredValueKzt,
      vehicleCategory,
      baseRateKzt: baseRate,
      insuranceKzt: insuranceRate,
      servicesKzt: servicesRate,
      vatKzt: vatRate,
      totalCostKzt: totalCost,
      insuranceIncluded,
      loadersNeeded,
      temperatureLogger,
      docReturnNeeded,
      strictTimeWindow,
    });

    setCreatedOrderId(order.id);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  if (createdOrderId) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            Заказ успешно зарегистрирован в реестре
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Заявка № <span className="text-amber-400 font-mono">{createdOrderId}</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Рейс принят диспетчером. Электронная накладная ТТН сформирована. Тягач с водителем зарезервирован.
          </p>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 mb-8 text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Маршрут:</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                {senderCity} <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> {receiverCity}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">{distanceKm} км / ~{transitDays} дн.</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Транспорт & Груз:</span>
              <span className="text-sm font-bold text-white block mt-0.5">{vehicleInfo.title}</span>
              <span className="text-xs text-slate-400 block mt-0.5">{weightKg.toLocaleString('ru-RU')} кг / {volumeM3} м³</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block">Итоговая стоимость:</span>
              <span className="text-lg font-mono font-bold text-amber-400 block mt-0.5">
                {totalCost.toLocaleString('ru-RU')} ₸
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">в т.ч. НДС 12%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOrderCreated(createdOrderId)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Перейти к онлайн-отслеживанию</span>
            </button>

            <button
              onClick={() => onGoToPayment(createdOrderId)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Оплатить / Скачать счет в тенге (₸)</span>
            </button>

            <button
              onClick={() => setCreatedOrderId(null)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Оформить еще перевозку
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Banner with value props */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Онлайн калькулятор & Мгновенное бронирование в тенге (₸)
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Расчет и прием заказа на грузоперевозку
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Точный расчет по километражу в тенге, магистральные грузоперевозки еврофурами 20 тонн, страхование и генерация электронной накладной ТТН.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                24/7
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Подача за 2 часа</div>
                <div className="text-slate-400">Собственный автопарк</div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                100%
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Страхование груза</div>
                <div className="text-slate-400">Kaspi / Nomad Insurance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Order Form & Real-time Live Price Sidebar */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Маршрут перевозки */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">Маршрут следования</h2>
              </div>

              <button
                type="button"
                onClick={swapCities}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 transition"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Поменять местами</span>
              </button>
            </div>

            {/* Quick city presets */}
            <div className="mb-4">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                Популярные грузовые хабы:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CITIES.slice(0, 8).map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      if (senderCity === city) return;
                      if (!senderCity) setSenderCity(city);
                      else setReceiverCity(city);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      senderCity === city || receiverCity === city
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <MapPin className="w-4 h-4" />
                  <span>Откуда (Пункт А):</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Город отправления</label>
                  <input
                    type="text"
                    required
                    value={senderCity}
                    onChange={(e) => setSenderCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-amber-500"
                    placeholder="Город..."
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Точный адрес склада / завода</label>
                  <input
                    type="text"
                    required
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="Улица, дом, ворота"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <MapPin className="w-4 h-4" />
                  <span>Куда (Пункт Б):</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Город назначения</label>
                  <input
                    type="text"
                    required
                    value={receiverCity}
                    onChange={(e) => setReceiverCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-amber-500"
                    placeholder="Город назначения..."
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Адрес разгрузки / терминал</label>
                  <input
                    type="text"
                    required
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    placeholder="Улица, дом, пандус"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                Расстояние по трассе: <strong className="text-white font-mono">{distanceKm} км</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Расчетный срок в пути: <strong className="text-emerald-300 font-mono">~{transitDays} дн.</strong>
              </span>
            </div>
          </div>

          {/* 2. Характеристики груза */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">Параметры груза</h2>
            </div>

            {/* Cargo Category Pills */}
            <div className="mb-5">
              <label className="text-xs text-slate-400 block mb-2 font-medium">Категория груза:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pallet', label: 'Паллетный груз', icon: '📦' },
                  { id: 'general', label: 'Сборный груз', icon: '🛍️' },
                  { id: 'refrigerated', label: 'Рефрижератор / Холод', icon: '❄️' },
                  { id: 'oversized', label: 'Негабарит / Трал', icon: '🏗️' },
                  { id: 'hazardous', label: 'Опасный ADR', icon: '⚠️' },
                  { id: 'fragile', label: 'Хрупкий / Высокая цена', icon: '💎' },
                  { id: 'bulk', label: 'Навалом / Биг-бэги', icon: '🌾' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCargoCategory(item.id as CargoCategory);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                      cargoCategory === item.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-xs text-slate-400 block mb-1">Наименование груза (для ТТН):</label>
              <input
                type="text"
                required
                value={cargoDescription}
                onChange={(e) => setCargoDescription(e.target.value)}
                placeholder="Например: Промышленное оборудование, запчасти, медикаменты"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Weight, Volume, Places, Declared Value */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Вес груза (кг):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="60000"
                    step="100"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">{(weightKg / 1000).toFixed(1)} т</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Объем (м³):</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={volumeM3}
                  onChange={(e) => setVolumeM3(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Количество мест / паллет:</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={packagesCount}
                  onChange={(e) => setPackagesCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Оценочная стоимость (₸):</label>
                <input
                  type="number"
                  min="50000"
                  step="100000"
                  value={declaredValueKzt}
                  onChange={(e) => setDeclaredValueKzt(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Автотранспорт: Еврофура 20 тонн */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">Выбор автотранспорта — Еврофура 20 тонн</h2>
              </div>
              <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Единый стандарт автопарка: Еврофура 20т
              </span>
            </div>

            {/* Euro Truck Highlight Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                  <Truck className="w-7 h-7 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Магистральный автопоезд Еврофура 20 тонн</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Вместимость 33-34 европаллеты
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Полуприцепы длиной 13.6 м • Высота 2.70 – 3.00 м • Пневмоподвеска • Регулярные рейсы по РК и СНГ
                  </div>
                </div>
              </div>

              <div className="text-right text-xs shrink-0 font-mono">
                <span className="text-slate-400 block text-[11px]">Тариф еврофуры:</span>
                <span className="text-lg font-bold text-amber-400">{vehicleInfo.ratePerKm} ₸/км</span>
              </div>
            </div>

            {/* Subtypes of Euro Truck Semitrailers */}
            <div>
              <label className="text-xs text-slate-400 block mb-2.5 font-medium">
                Выберите модификацию полуприцепа еврофуры:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(EURO_TRUCK_SUBTYPES) as EuroTruckSubtypeKey[]).map((stKey) => {
                  const item = EURO_TRUCK_SUBTYPES[stKey];
                  const isSelected = euroTruckSubtype === stKey;

                  return (
                    <div
                      key={stKey}
                      onClick={() => setEuroTruckSubtype(stKey)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/90 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {item.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-0.5 my-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Грузоподъемность:</span>
                          <strong className="text-slate-200">{item.capacity}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Объем / Паллеты:</span>
                          <strong className="text-slate-200">{item.volume} ({item.pallets})</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Погрузка:</span>
                          <span className="text-amber-300/90 font-medium truncate max-w-[200px]">{item.loadingTypes}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4. Дополнительные опции & экспедирование */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">Допуслуги и гарантии</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={insuranceIncluded}
                  onChange={(e) => setInsuranceIncluded(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Страхование всех рисков 0.15%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Покрытие до {(declaredValueKzt).toLocaleString('ru-RU')} ₸ (Kaspi / Nomad Insurance)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={loadersNeeded}
                  onChange={(e) => setLoadersNeeded(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="text-xs font-bold text-white">
                    Погрузочно-разгрузочные работы (+35 000 ₸)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Бригада грузчиков и рохля на складе отправителя/получателя
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={temperatureLogger}
                  onChange={(e) => setTemperatureLogger(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Онлайн температурный логгер (+25 000 ₸)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Ежеминутная передача данных температуры фургона в личный кабинет
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={docReturnNeeded}
                  onChange={(e) => setDocReturnNeeded(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Возврат оригиналов ТТН курьером (+9 500 ₸)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Оригиналы с синей печатью грузополучателя в ваш офис
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 5. Контакты сторон */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                5
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">Контакты сторон перевозки</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <span className="text-xs font-bold text-amber-400">Грузоотправитель:</span>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Компания / ФИО</label>
                  <input
                    type="text"
                    required
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Телефон для связи</label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400">Грузополучатель:</span>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Компания / ФИО на выгрузке</label>
                  <input
                    type="text"
                    required
                    value={receiverContact}
                    onChange={(e) => setReceiverContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Телефон получателя</label>
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Cost Summary & Submit (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Расчет стоимости (₸)</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                В тенге
              </span>
            </div>

            {/* Route mini summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Плечо маршрута:</span>
                <span className="text-white font-semibold">{senderCity} → {receiverCity}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Дистанция:</span>
                <span className="text-white font-mono">{distanceKm} км</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Тип ТС:</span>
                <span className="text-amber-300 font-semibold">{vehicleInfo.title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Срок доставки:</span>
                <span className="text-emerald-400 font-bold">{transitDays} дн. ({transitHours} ч.)</span>
              </div>
            </div>

            {/* Detailed Financial Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Базовый фрахт перевозки:</span>
                <span className="text-white font-mono">{baseRate.toLocaleString('ru-RU')} ₸</span>
              </div>

              {insuranceIncluded && (
                <div className="flex justify-between text-slate-400">
                  <span>Страхование (0.15%):</span>
                  <span className="text-white font-mono">{insuranceRate.toLocaleString('ru-RU')} ₸</span>
                </div>
              )}

              {servicesRate > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Дополнительные услуги:</span>
                  <span className="text-white font-mono">{servicesRate.toLocaleString('ru-RU')} ₸</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>НДС 12% (РК):</span>
                <span className="text-white font-mono">{vatRate.toLocaleString('ru-RU')} ₸</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Итого к оплате:</span>
                  <span className="text-[10px] text-slate-500">с учетом всех сборов и НДС</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {totalCost.toLocaleString('ru-RU')} ₸
                </div>
              </div>
            </div>

            {/* Guarantee badges */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Фиксированная цена в тенге без курсовых рисков</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Официальный электронный договор и ТТН</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>GPS мониторинг и поддержка диспетчера 24/7</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>Оформить заказ и получить трек</span>
              <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
            </button>

            <p className="text-[10px] text-slate-500 text-center leading-normal">
              Нажимая кнопку, вы соглашаетесь с условиями публичной оферты и регламентом экспедиторских услуг TransLogix.
            </p>

          </div>
        </div>

      </form>
    </div>
  );
};
