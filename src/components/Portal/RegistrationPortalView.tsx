import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  UserCheck, 
  Truck, 
  Building, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  PhoneCall, 
  Wallet, 
  Award, 
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationPortalViewProps {
  onGoToOrder: () => void;
  onGoToTracking: (orderId: string) => void;
}

export const RegistrationPortalView: React.FC<RegistrationPortalViewProps> = ({
  onGoToOrder,
  onGoToTracking
}) => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentCustomer, 
    currentDriver, 
    registerDriver, 
    registerCustomer,
    orders 
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'profile' | 'register_driver' | 'register_customer'>('profile');

  // Driver form states
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverTruck, setDriverTruck] = useState('Scania R500 Topline (Тент 92м³)');
  const [driverPlate, setDriverPlate] = useState('');
  const [driverTrailerPlate, setDriverTrailerPlate] = useState('');
  const [driverCity, setDriverCity] = useState('Алматы');
  const [driverExperience, setDriverExperience] = useState('8 лет');
  const [hasAdr, setHasAdr] = useState(false);
  const [hasSan, setHasSan] = useState(true);
  const [hasAsmap, setHasAsmap] = useState(true);

  // Customer form states
  const [customerType, setCustomerType] = useState<'legal_entity' | 'individual'>('legal_entity');
  const [companyName, setCompanyName] = useState('');
  const [inn, setInn] = useState('');
  const [kpp, setKpp] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  const handleRegisterDriver = (e: React.FormEvent) => {
    e.preventDefault();
    registerDriver({
      name: driverName || 'Бауржан Жумабаев',
      phone: driverPhone || '+7 (701) 942-55-30',
      truckModel: driverTruck,
      licensePlate: driverPlate || '512 AKZ 02',
      trailerPlate: driverTrailerPlate || '884 BC 02',
      currentLocationCity: driverCity,
      status: 'free'
    });

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}

    setActiveTab('profile');
  };

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    registerCustomer({
      type: customerType,
      companyName: companyName || 'ТОО «АзияИмпорт Трейд»',
      inn: inn || '210940019284',
      kpp: kpp || 'KZ-ALA',
      contactPerson: contactPerson || 'Арман Касымов',
      phone: customerPhone || '+7 (727) 300-44-55',
      email: customerEmail || 'cargo@asiaimport.kz',
      address: companyAddress || 'г. Алматы, пр. Аль-Фараби, 77'
    });

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}

    setActiveTab('profile');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner & Tab Controls */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
            <UserCheck className="w-4 h-4" />
            Экосистема TransLogix: Заказчик & Водитель (Тенге ₸)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Личный кабинет и регистрация
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Подключение тягачей и водителей-экспедиторов к диспетчерской системе, или регистрация ТОО / ИП для регулярных грузоперевозок.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Мой кабинет ({currentRole === 'driver' ? 'Водитель' : 'Заказчик'})
          </button>

          <button
            onClick={() => setActiveTab('register_driver')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'register_driver'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            + Стать водителем
          </button>

          <button
            onClick={() => setActiveTab('register_customer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'register_customer'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            + Стать заказчиком
          </button>
        </div>
      </div>

      {/* 1. CURRENT PROFILE / WORKSPACE VIEW */}
      {activeTab === 'profile' && (
        <div className="space-y-8">
          
          {/* Role Toggle Switch for demonstration */}
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Текущий профиль кабинета:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setCurrentRole('customer')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    currentRole === 'customer' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Заказчик (Грузовладелец)
                </button>
                <button
                  onClick={() => setCurrentRole('driver')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    currentRole === 'driver' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Водитель-экспедитор
                </button>
              </div>
            </div>

            <span className="text-xs text-amber-400 font-medium hidden sm:inline">
              Доступны все права авторизованного пользователя
            </span>
          </div>

          {/* CUSTOMER WORKSPACE */}
          {currentRole === 'customer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Customer Profile Card (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
                    <Building className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{currentCustomer.companyName}</h3>
                    <div className="text-xs text-slate-400">БИН: {currentCustomer.inn} • {currentCustomer.kpp}</div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-1">
                      Корпоративный аккаунт ЭСФ
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Контактное лицо:</span>
                    <strong className="text-white">{currentCustomer.contactPerson}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Телефон:</span>
                    <strong className="text-white font-mono">{currentCustomer.phone}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Email для актов:</span>
                    <strong className="text-slate-200">{currentCustomer.email}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Юр. адрес:</span>
                    <span className="text-slate-300 text-right truncate max-w-xs">{currentCustomer.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Всего отправлено</span>
                    <span className="text-lg font-mono font-bold text-white">{orders.length} грузов</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Объем фрахта</span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {(orders.reduce((acc, o) => acc + o.totalCostKzt, 0)).toLocaleString('ru-RU')} ₸
                    </span>
                  </div>
                </div>

                <button
                  onClick={onGoToOrder}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Оформить новую заявку</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Customer Active Orders List (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Активные перевозки компании
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">{orders.length} рейсов в базе</span>
                </div>

                <div className="space-y-3">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-amber-400">{order.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {order.senderCity} → {order.receiverCity}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {order.cargoDescription} • {(order.weightKg / 1000).toFixed(1)} т • ТС: {order.vehicleCategory}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2">
                        <div className="font-mono text-sm font-bold text-white">
                          {order.totalCostKzt.toLocaleString('ru-RU')} ₸
                        </div>
                        <button
                          onClick={() => onGoToTracking(order.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                        >
                          <span>Отследить</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* DRIVER WORKSPACE */}
          {currentRole === 'driver' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Driver Profile Card (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                  <img
                    src={currentDriver.photoUrl}
                    alt={currentDriver.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/80 shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{currentDriver.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{currentDriver.rating} (340+ выполненных рейсов)</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-1">
                      Статус: На рейсе (Казань)
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Тягач:</span>
                    <strong className="text-white">{currentDriver.truckModel}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Госномер тягача:</span>
                    <strong className="text-amber-400 font-mono">{currentDriver.licensePlate}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Госномер полуприцепа:</span>
                    <strong className="text-slate-300 font-mono">{currentDriver.trailerPlate || 'АА 4192 77'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Телефон водителя:</span>
                    <strong className="text-white font-mono">{currentDriver.phone}</strong>
                  </div>
                </div>

                {/* Earnings card in Tenge */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      Заработано за месяц:
                    </span>
                    <span className="text-emerald-400 font-bold">+18% к плану</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">2 485 200 ₸</div>
                  <div className="text-[11px] text-slate-500">Выплата на Kaspi Gold по завершению рейса</div>
                </div>

                {/* Tachograph & Rest status */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Режим труда и отдыха (ЕСТР)
                  </div>
                  <div>Управление: 4 ч. 20 мин. / Доступно: 4 ч. 40 мин.</div>
                </div>
              </div>

              {/* Driver Current Trip & Work (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Текущий активный рейс
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">TLX-8492-KZ</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500 uppercase">Маршрут рейса</div>
                      <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                        <span>Алматы</span>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                        <span>Москва (Подольск РЦ)</span>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-xs text-slate-500 uppercase">Срок прибытия</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">15 ноября 2026, 14:00</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block">Характер груза:</span>
                      <strong className="text-slate-200">Промышленные сервоприводы Siemens</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Пломба:</span>
                      <strong className="text-amber-400 font-mono">PLOMB-KZ-98214</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Оплата водителю за рейс:</span>
                      <strong className="text-emerald-400 font-mono font-bold">745 000 ₸ + суточные</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => onGoToTracking('TLX-8492-KZ')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      Открыть трекер и маршрут
                    </button>
                    <button
                      onClick={() => onGoToTracking('TLX-8492-KZ')}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                    >
                      Электронная накладная ТТН
                    </button>
                  </div>
                </div>

                {/* Available cargo loads to take (Биржа грузов TransLogix) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Доступные обратные загрузки на бирже:
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'LD-401', route: 'Алматы → Астана', cargo: 'Товары народного потребления (Тент 20т)', price: '480 000 ₸', date: 'Завтра 10:00' },
                      { id: 'LD-402', route: 'Шымкент → Караганда', cargo: 'Стройматериалы на паллетах', price: '650 000 ₸', date: '16 ноября' },
                      { id: 'LD-403', route: 'Астана → Алматы', cargo: 'Автозапчасти (Еврофура 20т)', price: '520 000 ₸', date: '17 ноября' }
                    ].map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{item.route}</div>
                          <div className="text-[11px] text-slate-400">{item.cargo} • Погрузка: {item.date}</div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="font-mono font-bold text-amber-400">{item.price}</span>
                          <button
                            onClick={() => alert(`Заявка на бронирование груза ${item.id} отправлена диспетчеру`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold border border-slate-700"
                          >
                            Взять загрузку
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* 2. REGISTRATION AS DRIVER */}
      {activeTab === 'register_driver' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Truck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Анкета водителя-экспедитора</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Регистрация перевозчика в парке</h2>
            <p className="text-xs text-slate-400 mt-1">
              Постоянные загрузки по Казахстану и СНГ, гарантированная выплата в тенге на карту Kaspi / Halyk и топливные карты.
            </p>
          </div>

          <form onSubmit={handleRegisterDriver} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">ФИО водителя:</label>
                <input
                  type="text"
                  required
                  placeholder="Жумабаев Бауржан"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Мобильный телефон:</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (701) 000-00-00"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Марка, модель тягача и тип кузова:</label>
                <input
                  type="text"
                  required
                  value={driverTruck}
                  onChange={(e) => setDriverTruck(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Город базирования:</label>
                <input
                  type="text"
                  required
                  value={driverCity}
                  onChange={(e) => setDriverCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Госномер тягача:</label>
                <input
                  type="text"
                  required
                  placeholder="512 AKZ 02"
                  value={driverPlate}
                  onChange={(e) => setDriverPlate(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-amber-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Госномер полуприцепа:</label>
                <input
                  type="text"
                  placeholder="884 BC 02"
                  value={driverTrailerPlate}
                  onChange={(e) => setDriverTrailerPlate(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-amber-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Стаж категории Е:</label>
                <input
                  type="text"
                  value={driverExperience}
                  onChange={(e) => setDriverExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            {/* Special Permits */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block mb-2">Наличие допусков и оборудования:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAdr}
                    onChange={(e) => setHasAdr(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Свидетельство ADR (опасные)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSan}
                    onChange={(e) => setHasSan(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Санпаспорт (продукты/фарма)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAsmap}
                    onChange={(e) => setHasAsmap(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Допуск АСМАП (международный)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl transition"
            >
              Зарегистрироваться и активировать кабинет перевозчика
            </button>
          </form>
        </div>
      )}

      {/* 3. REGISTRATION AS CUSTOMER */}
      {activeTab === 'register_customer' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Building className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Корпоративный аккаунт</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Регистрация заказчика перевозок</h2>
            <p className="text-xs text-slate-400 mt-1">
              Заключение договора транспортной экспедиции, работа по ЭСФ (ИС ЭСФ РК), отсрочка платежа в тенге до 14 банковских дней.
            </p>
          </div>

          <form onSubmit={handleRegisterCustomer} className="space-y-4">
            {/* Entity type */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="radio"
                  name="cust_type"
                  checked={customerType === 'legal_entity'}
                  onChange={() => setCustomerType('legal_entity')}
                  className="text-amber-500"
                />
                <span>Юридическое лицо (ТОО / АО)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="radio"
                  name="cust_type"
                  checked={customerType === 'individual'}
                  onChange={() => setCustomerType('individual')}
                  className="text-amber-500"
                />
                <span>Индивидуальный предприниматель (ИП)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Наименование компании:</label>
                <input
                  type="text"
                  required
                  placeholder="ТОО «АлатауЛогистик»"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Контактное лицо (Логист/Директор):</label>
                <input
                  type="text"
                  required
                  placeholder="Аскар Нуржанов"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">БИН / ИИН (РК):</label>
                <input
                  type="text"
                  required
                  placeholder="201140029410"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Город / Регион:</label>
                <input
                  type="text"
                  placeholder="г. Алматы"
                  value={kpp}
                  onChange={(e) => setKpp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Рабочий телефон:</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (727) 000-00-00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email для документов и счетов:</label>
                <input
                  type="email"
                  required
                  placeholder="buh@company.kz"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Юридический адрес:</label>
                <input
                  type="text"
                  required
                  placeholder="г. Алматы, ул. Абая, 150"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl transition"
              >
                Зарегистрировать компанию и войти в кабинет
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
