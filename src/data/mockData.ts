import { Order, DriverInfo, CallTicket, CustomerUser } from '../types/logistics';

export const INITIAL_DRIVERS: DriverInfo[] = [
  {
    id: 'DRV-101',
    name: 'Алексей Медведев',
    phone: '+7 (916) 432-88-19',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    rating: 4.96,
    completedTrips: 342,
    truckModel: 'Scania R500 Topline (Тент 92м³)',
    licensePlate: 'В774ОХ 777',
    trailerPlate: 'АА 4192 77',
    currentLocationCity: 'Казань',
    status: 'on_trip',
  },
  {
    id: 'DRV-102',
    name: 'Бауржан Жумабаев',
    phone: '+7 (701) 942-55-30',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 4.92,
    completedTrips: 218,
    truckModel: 'Volvo FH16 Рефрижератор (-20°C / +15°C)',
    licensePlate: '512 AKZ 02',
    trailerPlate: '884 BC 02',
    currentLocationCity: 'Самара',
    status: 'on_trip',
  },
  {
    id: 'DRV-103',
    name: 'Дмитрий Смирнов',
    phone: '+7 (921) 883-11-45',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 4.88,
    completedTrips: 185,
    truckModel: 'Mercedes-Benz Actros 1845',
    licensePlate: 'К390МР 78',
    trailerPlate: 'ВВ 7201 78',
    currentLocationCity: 'Москва',
    status: 'free',
  },
  {
    id: 'DRV-104',
    name: 'Игорь Васильев',
    phone: '+7 (903) 612-40-99',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    rating: 4.98,
    completedTrips: 412,
    truckModel: 'MAN TGX Низкорамный Трал (до 50т)',
    licensePlate: 'Р819ЕС 116',
    trailerPlate: 'ТТ 9012 16',
    currentLocationCity: 'Екатеринбург',
    status: 'free',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'TLX-8492-KZ',
    createdAt: '2026-11-10 08:30',
    senderCity: 'Алматы',
    senderAddress: 'пр. Райымбека, 496, Логистический терминал «Жетысу»',
    senderContact: 'ТОО «Евразия Трейд Логистик» (Нурлан С.)',
    senderPhone: '+7 (727) 349-11-00',
    receiverCity: 'Москва',
    receiverAddress: 'МО, г. Подольск, распределительный центр «Южные Врата»',
    receiverContact: 'ООО «ТехноПром Сети» (Ольга Михайлова)',
    receiverPhone: '+7 (495) 789-22-33',
    distanceKm: 3950,
    estimatedDeliveryDate: '15 ноября 2026, 14:00',
    cargoCategory: 'pallet',
    cargoDescription: 'Промышленные сервоприводы и контроллеры Siemens в жесткой упаковке',
    weightKg: 18500,
    volumeM3: 78,
    packagesCount: 32,
    declaredValueKzt: 75000000,
    sealNumber: 'PLOMB-KZ-98214',
    vehicleCategory: 'euro_truck',
    driver: INITIAL_DRIVERS[0],
    baseRateKzt: 1912000,
    insuranceKzt: 112500,
    servicesKzt: 70000,
    vatKzt: 251340,
    totalCostKzt: 2345840,
    paymentStatus: 'paid_full',
    paymentMethod: 'invoice',
    paidAmountKzt: 2345840,
    status: 'in_transit',
    currentProgressPercent: 68,
    currentCity: 'Казань (Трасса М-7 Волга)',
    lastGpsCoordinates: { lat: 55.7961, lng: 49.1064 },
    insuranceIncluded: true,
    loadersNeeded: true,
    temperatureLogger: false,
    docReturnNeeded: true,
    strictTimeWindow: true,
    checkpoints: [
      {
        id: 'cp-1',
        title: 'Заказ принят и обработан логистом',
        location: 'Центральный диспетчерский офис TransLogix',
        timestamp: '10.11.2026 08:30',
        completed: true,
        notes: 'Договор-заявка №8492 подписана по ЭДО'
      },
      {
        id: 'cp-2',
        title: 'Погрузка и опечатывание',
        location: 'Алматы, Терминал «Жетысу»',
        timestamp: '10.11.2026 14:20',
        completed: true,
        notes: 'Груз проверен, пломба #PLOMB-KZ-98214 установлена без замечаний',
        inspectorOrDriver: 'А. Медведев (Водитель)'
      },
      {
        id: 'cp-3',
        title: 'Таможенный переход и весовой контроль',
        location: 'КПП Маштаково / Сырым',
        timestamp: '11.11.2026 23:45',
        completed: true,
        notes: 'Весогабаритный контроль пройден: 38.2 т (норма 40 т)'
      },
      {
        id: 'cp-4',
        title: 'Транзитный хаб Волга',
        location: 'Казань, стоянка АСМАП М-7',
        timestamp: '12.11.2026 06:15',
        completed: true,
        current: true,
        notes: 'Водитель на регламентном отдыхе по тахографу (45 мин), выезд по графику'
      },
      {
        id: 'cp-5',
        title: 'Прибытие на РЦ назначения',
        location: 'МО, Подольск, РЦ «Южные Врата»',
        timestamp: '15.11.2026 14:00 (план)',
        completed: false,
        notes: 'Ожидается оформление слота разгрузки'
      }
    ]
  },
  {
    id: 'TLX-3914-RU',
    createdAt: '2026-11-11 11:15',
    senderCity: 'Санкт-Петербург',
    senderAddress: 'Парнас, 3-й Верхний переулок, 12',
    senderContact: 'АО «ФармаЛог» (Ирина С.)',
    senderPhone: '+7 (812) 600-44-55',
    receiverCity: 'Екатеринбург',
    receiverAddress: 'ул. Черняховского, 86, Складской комплекс «Чкаловский»',
    receiverContact: 'ООО «Урал-Медика»',
    receiverPhone: '+7 (343) 220-77-88',
    distanceKm: 2260,
    estimatedDeliveryDate: '14 ноября 2026, 10:00',
    cargoCategory: 'refrigerated',
    cargoDescription: 'Медицинские термочувствительные препараты, режим +2°C...+8°C',
    weightKg: 11200,
    volumeM3: 45,
    packagesCount: 480,
    declaredValueKzt: 160000000,
    temperatureRequired: '+4.2°C (активный мониторинг)',
    sealNumber: 'PHARMA-RU-5519',
    vehicleCategory: 'refr_truck',
    driver: INITIAL_DRIVERS[1],
    baseRateKzt: 1440000,
    insuranceKzt: 240000,
    servicesKzt: 125000,
    vatKzt: 216600,
    totalCostKzt: 2021600,
    paymentStatus: 'paid_partially',
    paymentMethod: 'invoice',
    paidAmountKzt: 1010800,
    status: 'in_transit',
    currentProgressPercent: 44,
    currentCity: 'Самара (Обход Самары)',
    lastGpsCoordinates: { lat: 53.2415, lng: 50.2212 },
    insuranceIncluded: true,
    loadersNeeded: false,
    temperatureLogger: true,
    docReturnNeeded: true,
    strictTimeWindow: true,
    checkpoints: [
      {
        id: 'cp-201',
        title: 'Заказ подтвержден фарма-протоколом',
        location: 'Санкт-Петербург, Диспетчерский отдел',
        timestamp: '11.11.2026 11:15',
        completed: true
      },
      {
        id: 'cp-202',
        title: 'Загрузка в термофургон и калибровка датчиков',
        location: 'СПб, Парнас, Фарма-терминал',
        timestamp: '11.11.2026 16:30',
        completed: true,
        notes: 'Температура перед опломбированием: +4.1°C'
      },
      {
        id: 'cp-203',
        title: 'Телеметрия в пути',
        location: 'Трасса М-5 Урал, район Самары',
        timestamp: '12.11.2026 09:20',
        completed: true,
        current: true,
        temperature: '+4.3°C (в норме)',
        notes: 'Рефрижераторная установка Carrier Vector 1550 работает штатно'
      },
      {
        id: 'cp-204',
        title: 'Разгрузка на фармацевтическом складе',
        location: 'Екатеринбург, СК Чкаловский',
        timestamp: '14.11.2026 10:00 (план)',
        completed: false
      }
    ]
  },
  {
    id: 'TLX-7102-BY',
    createdAt: '2026-11-12 01:20',
    senderCity: 'Минск',
    senderAddress: 'Промзона Шабаны, ул. Селицкого, 21',
    senderContact: 'ОАО «БелАгроТехника» (Григорий В.)',
    senderPhone: '+375 (17) 388-90-11',
    receiverCity: 'Астана',
    receiverAddress: 'Индустриальный парк №1, ул. А184',
    receiverContact: 'ТОО «АгроСпецКомплект»',
    receiverPhone: '+7 (7172) 99-88-11',
    distanceKm: 3450,
    estimatedDeliveryDate: '18 ноября 2026, 17:00',
    cargoCategory: 'oversized',
    cargoDescription: 'Запасные части и гидравлические узлы комбайнов (негабарит)',
    weightKg: 24000,
    volumeM3: 65,
    packagesCount: 6,
    declaredValueKzt: 45000000,
    vehicleCategory: 'lowboy',
    baseRateKzt: 2911000,
    insuranceKzt: 67500,
    servicesKzt: 180000,
    vatKzt: 379020,
    totalCostKzt: 3537520,
    paymentStatus: 'unpaid',
    paymentMethod: 'invoice',
    paidAmountKzt: 0,
    status: 'driver_assigned',
    currentProgressPercent: 12,
    currentCity: 'Минск (Ожидание погрузки)',
    lastGpsCoordinates: { lat: 53.9045, lng: 27.5615 },
    insuranceIncluded: true,
    loadersNeeded: true,
    temperatureLogger: false,
    docReturnNeeded: true,
    strictTimeWindow: false,
    checkpoints: [
      {
        id: 'cp-301',
        title: 'Заявка принята, спецразрешение оформлено',
        location: 'Минск, Отдел негабаритных перевозок',
        timestamp: '12.11.2026 01:20',
        completed: true,
        notes: 'Спецпропуск по трассам РБ-РФ-РК получен'
      },
      {
        id: 'cp-302',
        title: 'Назначен тягач с низкорамным тралом',
        location: 'Минск',
        timestamp: '12.11.2026 03:00',
        completed: true,
        current: true,
        notes: 'Назначен водитель высшей категории И. Васильев'
      },
      {
        id: 'cp-303',
        title: 'Погрузка и строповка груза',
        location: 'Минск, Селицкого 21',
        timestamp: '12.11.2026 14:00 (план)',
        completed: false
      }
    ]
  }
];

export const INITIAL_CALL_TICKETS: CallTicket[] = [
  {
    id: 'TCK-501',
    createdAt: '12.11.2026 05:40',
    driverName: 'Алексей Медведев',
    driverPhone: '+7 (916) 432-88-19',
    orderId: 'TLX-8492-KZ',
    urgency: 'medium',
    topic: 'Уточнение въезда на РЦ «Южные Врата»',
    status: 'resolved',
    dispatcherNotes: 'Передан номер дежурного начальника смены РЦ Подольск. Пропуск заказан.',
    location: 'Казань, М-7'
  },
  {
    id: 'TCK-502',
    createdAt: '12.11.2026 08:15',
    driverName: 'Бауржан Жумабаев',
    driverPhone: '+7 (701) 942-55-30',
    orderId: 'TLX-3914-RU',
    urgency: 'high',
    topic: 'Ремонтные работы на участке М-5 перед Уфой',
    status: 'in_progress',
    dispatcherNotes: 'Диспетчер согласовал объезд через Бугульму. Задержка не более 1.5 часов.',
    location: 'Самарская обл.'
  },
  {
    id: 'TCK-503',
    createdAt: '12.11.2026 09:50',
    driverName: 'Михаил Ковалев (Рейс TLX-1092)',
    driverPhone: '+7 (905) 112-77-44',
    orderId: 'TLX-1092-MSK',
    urgency: 'critical_sos',
    topic: 'Прокол спарки задней оси на трассе М-4, требуется шиномонтаж',
    status: 'in_progress',
    dispatcherNotes: 'Вызвана мобильная грузовая техничка АвтоСпас-Дон, расчетное время прибытия 30 мин.',
    location: 'М-4 Дон, 492 км'
  }
];

export const MOCK_OPERATORS = [
  {
    id: 'OP-1',
    name: 'Марина Соколова',
    role: 'Старший диспетчер смены',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    activeCalls: 12
  },
  {
    id: 'OP-2',
    name: 'Константин Орлов',
    role: 'Специалист по международным рейсам и таможне',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    activeCalls: 8
  },
  {
    id: 'OP-3',
    name: 'Елена Белова',
    role: 'Диспетчер по температурным грузам (Фарма/Реф)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    activeCalls: 15
  }
];

export const POPULAR_CITIES = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Москва',
  'Санкт-Петербург',
  'Екатеринбург',
  'Казань',
  'Новосибирск',
  'Самара',
  'Минск',
  'Ташкент',
  'Бишкек'
];

export const VEHICLE_DETAILS = {
  gazelle: {
    title: 'Газель / Тент Next',
    capacity: '1.5 - 2.0 т',
    volume: '12 - 16 м³',
    pallets: 'до 4 паллет',
    ratePerKm: 180,
    baseBooking: 25000,
    speedAvg: '70 км/ч',
    icon: 'Truck',
    description: 'Идеально для городской доставки и экспресс-перевозок по области'
  },
  medium: {
    title: 'Среднетоннажник 5-тонник',
    capacity: 'до 5.0 т',
    volume: '30 - 36 м³',
    pallets: 'до 15 паллет',
    ratePerKm: 310,
    baseBooking: 45000,
    speedAvg: '65 км/ч',
    icon: 'Container',
    description: 'Межгород, средние партии оборудования, сырья и товаров'
  },
  euro_truck: {
    title: 'Еврофура Тент / Штора 20т',
    capacity: '20 - 22 т',
    volume: '86 - 92 м³',
    pallets: 'до 33 паллет',
    ratePerKm: 460,
    baseBooking: 95000,
    speedAvg: '60 км/ч',
    icon: 'Boxes',
    description: 'Магистральные перевозки генеральных и паллетированных грузов'
  },
  refr_truck: {
    title: 'Рефрижератор 20т (Термос/Холод)',
    capacity: '20 т',
    volume: '86 м³',
    pallets: 'до 33 паллет',
    ratePerKm: 580,
    baseBooking: 130000,
    speedAvg: '60 км/ч',
    icon: 'Snowflake',
    description: 'Продукты питания, фармацевтика, температурный режим -20°C...+15°C'
  },
  lowboy: {
    title: 'Низкорамный трал (Негабарит)',
    capacity: 'до 60 т',
    volume: 'Спецразмеры',
    pallets: 'Спецтехника',
    ratePerKm: 780,
    baseBooking: 220000,
    speedAvg: '45 км/ч',
    icon: 'Construction',
    description: 'Строительная и сельхоз техника, промышленное негабаритное оборудование'
  },
  air_express: {
    title: 'Авиа Экспресс Чартер',
    capacity: 'до 1.0 т',
    volume: 'до 8 м³',
    pallets: 'до 2 паллет',
    ratePerKm: 1500,
    baseBooking: 350000,
    speedAvg: '650 км/ч',
    icon: 'Plane',
    description: 'Срочная доставка от 12 часов до любого международного аэропорта'
  }
};
