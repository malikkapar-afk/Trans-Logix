import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  DriverInfo, 
  CallTicket, 
  CustomerUser, 
  UserRole, 
  OrderStatus, 
  PaymentTransaction 
} from '../types/logistics';
import { INITIAL_DRIVERS, INITIAL_ORDERS, INITIAL_CALL_TICKETS, MOCK_OPERATORS } from '../data/mockData';

interface VoipCallState {
  isOpen: boolean;
  operatorName: string;
  operatorRole: string;
  operatorAvatar: string;
  topic: string;
  status: 'ringing' | 'connected' | 'ended';
  durationSeconds: number;
  callType: 'support' | 'sos';
  notes?: string;
}

interface LogisticsContextType {
  orders: Order[];
  drivers: DriverInfo[];
  callTickets: CallTicket[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentCustomer: CustomerUser;
  currentDriver: DriverInfo;
  activeTrackingCode: string;
  setActiveTrackingCode: (code: string) => void;
  selectedOrderForPayment: Order | null;
  setSelectedOrderForPayment: (order: Order | null) => void;
  activeVoipCall: VoipCallState | null;
  
  // Actions
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, progressPercent?: number, checkpointNote?: string) => void;
  assignDriver: (orderId: string, driverId: string) => void;
  processPayment: (orderId: string, method: PaymentTransaction['method'], amount: number) => boolean;
  startVoipCall: (topic: string, callType?: 'support' | 'sos') => void;
  endVoipCall: () => void;
  triggerSosAlert: (location: string, details: string, orderId?: string) => void;
  resolveCallTicket: (ticketId: string, notes: string) => void;
  registerDriver: (driverData: Partial<DriverInfo>) => void;
  registerCustomer: (customerData: Partial<CustomerUser>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ORDERS = 'translogix_orders_kzt_v2';
const LOCAL_STORAGE_KEY_DRIVERS = 'translogix_drivers_kzt_v2';
const LOCAL_STORAGE_KEY_TICKETS = 'translogix_tickets_kzt_v2';

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [drivers, setDrivers] = useState<DriverInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DRIVERS);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [callTickets, setCallTickets] = useState<CallTicket[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS);
      return saved ? JSON.parse(saved) : INITIAL_CALL_TICKETS;
    } catch {
      return INITIAL_CALL_TICKETS;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('TLX-8492-KZ');
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser>({
    id: 'CUST-802',
    type: 'legal_entity',
    companyName: 'ТОО «Евразия Трейд Логистик»',
    inn: '201140029410', // БИН РК
    kpp: 'KZ-ALA',
    contactPerson: 'Нурлан Садыков',
    phone: '+7 (727) 349-11-00',
    email: 'logistics@eurasia-trade.kz',
    address: 'г. Алматы, пр. Достык, 180, БЦ «Коктем», офис 504',
    ordersCount: 18,
    totalSpentKzt: 26800000,
  });

  const [currentDriver, setCurrentDriver] = useState<DriverInfo>(INITIAL_DRIVERS[0]);

  // VoIP call state
  const [activeVoipCall, setActiveVoipCall] = useState<VoipCallState | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DRIVERS, JSON.stringify(drivers));
    } catch (e) {
      console.warn('Could not save drivers to localStorage', e);
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(callTickets));
    } catch (e) {
      console.warn('Could not save call tickets to localStorage', e);
    }
  }, [callTickets]);

  // Call timer effect
  useEffect(() => {
    let timer: any = null;
    if (activeVoipCall && activeVoipCall.status === 'connected') {
      timer = setInterval(() => {
        setActiveVoipCall(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeVoipCall?.status]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const countrySuffix = 'KZ';
    
    const newId = `TLX-${randomNum}-${countrySuffix}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: newId,
      createdAt: formattedDate,
      senderCity: orderData.senderCity || 'Алматы',
      senderAddress: orderData.senderAddress || 'Центральный хаб «Жетысу»',
      senderContact: orderData.senderContact || currentCustomer.companyName,
      senderPhone: orderData.senderPhone || currentCustomer.phone,
      receiverCity: orderData.receiverCity || 'Астана',
      receiverAddress: orderData.receiverAddress || 'Склад получателя',
      receiverContact: orderData.receiverContact || 'Представитель получателя',
      receiverPhone: orderData.receiverPhone || '+7 (7172) 00-00-00',
      distanceKm: orderData.distanceKm || 1220,
      estimatedDeliveryDate: orderData.estimatedDeliveryDate || 'Через 1-2 дня',
      cargoCategory: orderData.cargoCategory || 'general',
      cargoDescription: orderData.cargoDescription || 'Сборный коммерческий груз',
      weightKg: orderData.weightKg || 1200,
      volumeM3: orderData.volumeM3 || 5,
      packagesCount: orderData.packagesCount || 4,
      declaredValueKzt: orderData.declaredValueKzt || 2500000,
      sealNumber: `PLOMB-KZ-${Math.floor(10000 + Math.random() * 90000)}`,
      vehicleCategory: orderData.vehicleCategory || 'euro_truck',
      driver: drivers.find(d => d.status === 'free') || drivers[0],
      baseRateKzt: orderData.baseRateKzt || 245000,
      insuranceKzt: orderData.insuranceKzt || 7500,
      servicesKzt: orderData.servicesKzt || 25000,
      vatKzt: orderData.vatKzt || 33300,
      totalCostKzt: orderData.totalCostKzt || 310800,
      paymentStatus: 'unpaid',
      paidAmountKzt: 0,
      status: 'confirmed',
      currentProgressPercent: 15,
      currentCity: `${orderData.senderCity || 'Алматы'} (Погрузочный терминал)`,
      lastGpsCoordinates: { lat: 43.2389, lng: 76.8897 },
      insuranceIncluded: orderData.insuranceIncluded ?? true,
      loadersNeeded: orderData.loadersNeeded ?? false,
      temperatureLogger: orderData.temperatureLogger ?? false,
      docReturnNeeded: orderData.docReturnNeeded ?? true,
      strictTimeWindow: orderData.strictTimeWindow ?? false,
      checkpoints: [
        {
          id: `cp-${Date.now()}-1`,
          title: 'Электронная заявка принята диспетчером',
          location: 'TransLogix Диспетчерский центр',
          timestamp: formattedDate,
          completed: true,
          notes: 'Грузоперевозке присвоен приоритет стандарт, ТТН сформирована в системе'
        },
        {
          id: `cp-${Date.now()}-2`,
          title: 'Назначен водитель-экспедитор',
          location: orderData.senderCity || 'Алматы',
          timestamp: 'В течение 1 часа',
          completed: true,
          current: true,
          notes: 'Транспорт направлен на склад отправки'
        },
        {
          id: `cp-${Date.now()}-3`,
          title: 'Погрузка и опломбирование',
          location: `${orderData.senderCity || 'Алматы'}, ${orderData.senderAddress || 'Терминал'}`,
          timestamp: 'Ожидается',
          completed: false
        },
        {
          id: `cp-${Date.now()}-4`,
          title: 'Магистральный рейс (В пути)',
          location: 'Трасса следования',
          timestamp: 'Ожидается',
          completed: false
        },
        {
          id: `cp-${Date.now()}-5`,
          title: 'Прибытие и вручение получателю',
          location: `${orderData.receiverCity || 'Астана'}, ${orderData.receiverAddress || 'Адрес'}`,
          timestamp: 'По графику',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingCode(newOrder.id);
    showToast(`Заказ ${newOrder.id} успешно создан и передан в диспетчерскую!`);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    newStatus: OrderStatus, 
    progressPercent?: number, 
    checkpointNote?: string
  ) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const updatedCheckpoints = order.checkpoints.map(cp => {
        if (cp.current) {
          return { ...cp, completed: true, current: false };
        }
        return cp;
      });

      if (checkpointNote) {
        updatedCheckpoints.push({
          id: `cp-${Date.now()}`,
          title: `Статус: ${newStatus}`,
          location: order.currentCity,
          timestamp: `Сегодня, ${timeStr}`,
          completed: true,
          current: true,
          notes: checkpointNote
        });
      }

      const calculatedProgress = progressPercent !== undefined 
        ? progressPercent 
        : newStatus === 'delivered' 
        ? 100 
        : newStatus === 'out_for_delivery' 
        ? 85 
        : newStatus === 'in_transit' 
        ? 55 
        : newStatus === 'customs_hub' 
        ? 70 
        : 30;

      return {
        ...order,
        status: newStatus,
        currentProgressPercent: calculatedProgress,
        checkpoints: updatedCheckpoints
      };
    }));

    showToast(`Статус груза ${orderId} обновлен: ${newStatus}`);
  };

  const assignDriver = (orderId: string, driverId: string) => {
    const selectedDriver = drivers.find(d => d.id === driverId);
    if (!selectedDriver) return;

    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        driver: selectedDriver,
        status: o.status === 'confirmed' ? 'driver_assigned' : o.status
      };
    }));

    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return { ...d, status: 'on_trip' };
      }
      return d;
    }));

    showToast(`Водитель ${selectedDriver.name} назначен на рейс ${orderId}`);
  };

  const processPayment = (orderId: string, method: PaymentTransaction['method'], amount: number): boolean => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const newPaidAmount = (order.paidAmountKzt || 0) + amount;
      const isFull = newPaidAmount >= order.totalCostKzt;

      return {
        ...order,
        paidAmountKzt: newPaidAmount,
        paymentStatus: isFull ? 'paid_full' : 'paid_partially',
        paymentMethod: method,
        status: order.status === 'pending_payment' ? 'confirmed' : order.status
      };
    }));

    showToast(`Платеж ${amount.toLocaleString('ru-RU')} ₸ успешно проведен!`);
    return true;
  };

  const startVoipCall = (topic: string, callType: 'support' | 'sos' = 'support') => {
    const operator = MOCK_OPERATORS[Math.floor(Math.random() * MOCK_OPERATORS.length)];
    
    setActiveVoipCall({
      isOpen: true,
      operatorName: operator.name,
      operatorRole: operator.role,
      operatorAvatar: operator.avatar,
      topic,
      status: 'ringing',
      durationSeconds: 0,
      callType
    });

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setActiveVoipCall(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 2200);
  };

  const endVoipCall = () => {
    setActiveVoipCall(prev => prev ? { ...prev, status: 'ended' } : null);
    setTimeout(() => {
      setActiveVoipCall(null);
    }, 1500);
  };

  const triggerSosAlert = (location: string, details: string, orderId?: string) => {
    const newTicket: CallTicket = {
      id: `SOS-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: 'Только что',
      driverName: currentRole === 'driver' ? currentDriver.name : 'Экстренная линия водителя',
      driverPhone: currentRole === 'driver' ? currentDriver.phone : '+7 (701) 942-55-30',
      orderId: orderId || activeTrackingCode,
      urgency: 'critical_sos',
      topic: details,
      status: 'in_progress',
      location: location || 'Трасса Алматы — Астана / GPS координата зафиксирована',
      dispatcherNotes: 'КРИТИЧЕСКИЙ ВЫЗОВ: Экстренный экипаж оповещен, аудиоканал с водителем открыт'
    };

    setCallTickets(prev => [newTicket, ...prev]);
    startVoipCall(`SOS: ${details}`, 'sos');
    showToast('ВНИМАНИЕ: Сигнал SOS принят дежурной службой безопасности TransLogix!');
  };

  const resolveCallTicket = (ticketId: string, notes: string) => {
    setCallTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status: 'resolved',
        dispatcherNotes: notes
      };
    }));
    showToast(`Обращение ${ticketId} успешно закрыто`);
  };

  const registerDriver = (driverData: Partial<DriverInfo>) => {
    const newDriver: DriverInfo = {
      id: `DRV-${Math.floor(200 + Math.random() * 800)}`,
      name: driverData.name || 'Новый Водитель',
      phone: driverData.phone || '+7 (777) 000-00-00',
      photoUrl: driverData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      rating: 5.0,
      completedTrips: 0,
      truckModel: driverData.truckModel || 'Scania R500 Тент 20т',
      licensePlate: driverData.licensePlate || '555 KZ 02',
      trailerPlate: driverData.trailerPlate || '99 KZ 02',
      currentLocationCity: driverData.currentLocationCity || 'Алматы',
      status: 'free'
    };

    setDrivers(prev => [newDriver, ...prev]);
    setCurrentDriver(newDriver);
    setCurrentRole('driver');
    showToast(`Водитель ${newDriver.name} успешно зарегистрирован и активирован!`);
  };

  const registerCustomer = (customerData: Partial<CustomerUser>) => {
    const newCustomer: CustomerUser = {
      id: `CUST-${Math.floor(500 + Math.random() * 500)}`,
      type: customerData.type || 'legal_entity',
      companyName: customerData.companyName || 'ТОО «Новый Клиент»',
      inn: customerData.inn || '230140000000', // БИН
      kpp: customerData.kpp || 'KZ-ALA',
      contactPerson: customerData.contactPerson || 'Менеджер',
      phone: customerData.phone || '+7 (777) 000-00-00',
      email: customerData.email || 'order@company.kz',
      address: customerData.address || 'г. Алматы',
      ordersCount: 0,
      totalSpentKzt: 0
    };

    setCurrentCustomer(newCustomer);
    setCurrentRole('customer');
    showToast(`Заказчик ${newCustomer.companyName} успешно зарегистрирован!`);
  };

  return (
    <LogisticsContext.Provider
      value={{
        orders,
        drivers,
        callTickets,
        currentRole,
        setCurrentRole,
        currentCustomer,
        currentDriver,
        activeTrackingCode,
        setActiveTrackingCode,
        selectedOrderForPayment,
        setSelectedOrderForPayment,
        activeVoipCall,
        createOrder,
        updateOrderStatus,
        assignDriver,
        processPayment,
        startVoipCall,
        endVoipCall,
        triggerSosAlert,
        resolveCallTicket,
        registerDriver,
        registerCustomer,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const ctx = useContext(LogisticsContext);
  if (!ctx) {
    throw new Error('useLogistics must be used within LogisticsProvider');
  }
  return ctx;
};
