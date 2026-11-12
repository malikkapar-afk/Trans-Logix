export type UserRole = 'customer' | 'driver' | 'dispatcher';

export type CargoCategory = 
  | 'general' // Сборный / Обычный груз
  | 'pallet' // Паллетный груз
  | 'refrigerated' // Рефрижератор (-20°C...+12°C)
  | 'oversized' // Негабарит / Спецтехника
  | 'hazardous' // Опасный груз (ADR)
  | 'fragile' // Хрупкий / Ценный
  | 'bulk'; // Насыпной / Наливной

export type VehicleCategory =
  | 'gazelle' // Газель 1.5т / 12м³
  | 'medium' // 5-тонник / 36м³
  | 'euro_truck' // Еврофура 20т / 86м³
  | 'refr_truck' // Рефрижератор 20т / 86м³
  | 'lowboy' // Трал / Низкорамник 40-60т
  | 'air_express'; // Экспресс авиадоставка

export type OrderStatus =
  | 'draft' // Черновик
  | 'pending_payment' // Ожидает оплаты
  | 'confirmed' // Заказ подтвержден
  | 'driver_assigned' // Назначен экспедитор
  | 'loading' // На погрузке
  | 'in_transit' // В пути (на трассе)
  | 'customs_hub' // Таможня / Сортировочный хаб
  | 'out_for_delivery' // На доставке по городу
  | 'delivered' // Успешно доставлен
  | 'cancelled'; // Отменен

export interface Checkpoint {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  notes?: string;
  inspectorOrDriver?: string;
  temperature?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
  rating: number;
  completedTrips: number;
  truckModel: string;
  licensePlate: string;
  trailerPlate?: string;
  currentLocationCity: string;
  status: 'free' | 'on_trip' | 'maintenance';
}

export interface Order {
  id: string; // e.g. TLX-8492-KZ
  createdAt: string;
  senderCity: string;
  senderAddress: string;
  senderContact: string;
  senderPhone: string;
  receiverCity: string;
  receiverAddress: string;
  receiverContact: string;
  receiverPhone: string;
  distanceKm: number;
  estimatedDeliveryDate: string;
  
  // Cargo
  cargoCategory: CargoCategory;
  cargoDescription: string;
  weightKg: number;
  volumeM3: number;
  packagesCount: number;
  declaredValueKzt: number;
  temperatureRequired?: string;
  sealNumber?: string;
  
  // Transport
  vehicleCategory: VehicleCategory;
  driver?: DriverInfo;
  
  // Financials in Tenge (KZT)
  baseRateKzt: number;
  insuranceKzt: number;
  servicesKzt: number;
  vatKzt: number;
  totalCostKzt: number;
  paymentStatus: 'unpaid' | 'paid_partially' | 'paid_full';
  paymentMethod?: 'card' | 'qr' | 'invoice' | 'cash_on_delivery';
  paidAmountKzt: number;
  
  // Status & Journey
  status: OrderStatus;
  currentProgressPercent: number;
  currentCity: string;
  lastGpsCoordinates: {
    lat: number;
    lng: number;
  };
  checkpoints: Checkpoint[];
  
  // Additional services
  insuranceIncluded: boolean;
  loadersNeeded: boolean;
  temperatureLogger: boolean;
  docReturnNeeded: boolean;
  strictTimeWindow: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  date: string;
  method: 'card' | 'qr' | 'invoice' | 'cash_on_delivery';
  status: 'completed' | 'processing' | 'failed';
  payerName: string;
  payerInn?: string;
  receiptNumber: string;
}

export interface CallTicket {
  id: string;
  createdAt: string;
  driverName: string;
  driverPhone: string;
  orderId?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical_sos';
  topic: string;
  status: 'open' | 'in_progress' | 'resolved';
  dispatcherNotes?: string;
  location?: string;
}

export interface CustomerUser {
  id: string;
  type: 'individual' | 'legal_entity';
  companyName: string;
  inn: string;
  kpp?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  ordersCount: number;
  totalSpentKzt: number;
}
