import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Order, PaymentTransaction } from '../../types/logistics';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Building, 
  Receipt,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentPortalViewProps {
  onGoToTracking: (orderId: string) => void;
}

export const PaymentPortalView: React.FC<PaymentPortalViewProps> = ({ onGoToTracking }) => {
  const { 
    orders, 
    processPayment, 
    selectedOrderForPayment, 
    setSelectedOrderForPayment, 
    currentCustomer 
  } = useLogistics();

  // Selected order to pay (default to first unpaid, or selectedOrderForPayment, or orders[0])
  const activeOrder = selectedOrderForPayment || orders.find(o => o.paymentStatus !== 'paid_full') || orders[0];

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr' | 'invoice' | 'cash_on_delivery'>('qr');
  const [cardNumber, setCardNumber] = useState('4400 4301 9821 5519');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('781');
  const [cardHolder, setCardHolder] = useState('NURLAN SADYKOV');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  const amountToPay = activeOrder ? (activeOrder.totalCostKzt - (activeOrder.paidAmountKzt || 0)) : 0;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      processPayment(activeOrder.id, paymentMethod, amountToPay);
      setPaymentSuccess(true);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback
      }
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            Безопасный эквайринг в тенге (₸) & Kaspi QR / B2B расчеты
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Прием платежей в тенге (KZT)</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Оплата через Kaspi QR / Kaspi Gold, Halyk Bank, банковскими картами Visa / Mastercard, или безналичный счет с НДС 12%.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-white">Мгновенное закрытие сделки</div>
            <div className="text-slate-400">Чек и ЭСФ (электронный счет-фактура)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Order Selector & Payment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Orders list with payment badges (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ваши заказы и счета</h3>
            <span className="text-xs text-slate-400">{orders.length} рейсов</span>
          </div>

          <div className="space-y-3">
            {orders.map(order => {
              const isSelected = activeOrder?.id === order.id;
              const remaining = order.totalCostKzt - (order.paidAmountKzt || 0);

              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderForPayment(order);
                    setPaymentSuccess(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      order.paymentStatus === 'paid_full'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : order.paymentStatus === 'paid_partially'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {order.paymentStatus === 'paid_full' ? 'Оплачен 100%' : order.paymentStatus === 'paid_partially' ? 'Предоплата 50%' : 'Ожидает оплаты'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-semibold mb-1">
                    {order.senderCity} → {order.receiverCity}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Сумма фрахта:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {order.totalCostKzt.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>

                  {order.paymentStatus !== 'paid_full' && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-rose-400">
                      <span>К доплате:</span>
                      <span className="font-mono font-bold">{remaining.toLocaleString('ru-RU')} ₸</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Payment Methods & Gateway (8 cols) */}
        <div className="lg:col-span-8">
          {activeOrder ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {/* Payment Success View */}
              {paymentSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Оплата успешно проведена!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Счет за рейс <span className="font-mono text-amber-400 font-bold">{activeOrder.id}</span> полностью оплачен в тенге. Фискальный чек и ЭСФ сформированы.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => onGoToTracking(activeOrder.id)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      Смотреть трекинг рейса
                    </button>
                    <button
                      onClick={() => setShowPrintInvoice(true)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
                    >
                      <Receipt className="w-4 h-4 text-amber-400" />
                      <span>Скачать квитанцию (₸)</span>
                    </button>
                    <button
                      onClick={() => setPaymentSuccess(false)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Оплатить другой счет
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
                    <div>
                      <div className="text-xs text-slate-400">Оплата перевозки по заявке:</div>
                      <div className="text-xl font-mono font-bold text-white mt-0.5">{activeOrder.id}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {activeOrder.senderCity} → {activeOrder.receiverCity} ({activeOrder.cargoDescription})
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">Сумма к оплате:</div>
                      <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                        {amountToPay.toLocaleString('ru-RU')} ₸
                      </div>
                      <div className="text-[10px] text-slate-500">в т.ч. НДС 12%</div>
                    </div>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qr')}
                      className={`p-3 rounded-2xl border text-center transition ${
                        paymentMethod === 'qr'
                          ? 'bg-amber-500/20 text-white border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-5 h-5 mx-auto mb-1 text-red-500" />
                      <div className="text-xs font-bold">Kaspi QR / СБП</div>
                      <div className="text-[10px] text-slate-400">Kaspi Red / QR 0%</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-center transition ${
                        paymentMethod === 'card'
                          ? 'bg-amber-500/20 text-white border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                      <div className="text-xs font-bold">Банковская карта</div>
                      <div className="text-[10px] text-slate-400">Kaspi Gold / Visa / MC</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('invoice')}
                      className={`p-3 rounded-2xl border text-center transition ${
                        paymentMethod === 'invoice'
                          ? 'bg-amber-500/20 text-white border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Building className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                      <div className="text-xs font-bold">Счет для ТОО / ИП</div>
                      <div className="text-[10px] text-slate-400">Безнал с НДС 12%</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`p-3 rounded-2xl border text-center transition ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-amber-500/20 text-white border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Receipt className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                      <div className="text-xs font-bold">При получении</div>
                      <div className="text-[10px] text-slate-400">Терминал водителю</div>
                    </button>
                  </div>

                  {/* Payment Method Content */}

                  {/* 1. Kaspi QR / Fast Payments */}
                  {paymentMethod === 'qr' && (
                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                        <Smartphone className="w-3.5 h-3.5" />
                        Оплата через Kaspi.kz / Halyk Bank
                      </div>

                      <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-2xl flex items-center justify-center border-4 border-red-500/80">
                        <QrCode className="w-40 h-40 text-slate-950" />
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">Отсканируйте камерой приложения Kaspi.kz</div>
                        <div className="text-xs text-slate-400 mt-1">
                          Поддерживается Kaspi QR, Kaspi Gold, Kaspi Pay, Halyk QR
                        </div>
                      </div>

                      <div className="inline-block px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-amber-400 font-bold">
                        К оплате: {amountToPay.toLocaleString('ru-RU')} ₸
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handlePay}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs shadow-lg transition"
                        >
                          Подтвердить оплату в Kaspi.kz
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. Credit Card */}
                  {paymentMethod === 'card' && (
                    <form onSubmit={handlePay} className="space-y-4">
                      {/* Realistic Visual Card Mockup */}
                      <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-800 to-amber-900/60 border border-slate-700 shadow-2xl text-white relative overflow-hidden mb-6">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Kaspi Gold / TransLogix</span>
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/10">VISA / MASTERCARD</span>
                        </div>

                        <div className="w-10 h-7 rounded bg-amber-400/80 mb-4 shadow-sm flex items-center justify-center text-[8px] font-mono font-bold text-slate-950">
                          CHIP
                        </div>

                        <div className="font-mono text-lg font-bold tracking-widest mb-4">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex justify-between text-[11px] font-mono text-slate-300">
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Держатель</span>
                            <span>{cardHolder || 'CARDHOLDER'}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Срок</span>
                            <span>{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-xs text-slate-400 block mb-1">Номер карты:</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Имя на карте (латиницей):</label>
                          <input
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white uppercase font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">Срок (ММ/ГГ):</label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono text-center"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-slate-400 block mb-1">CVV/CVC:</label>
                            <input
                              type="password"
                              maxLength={4}
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-4"
                      >
                        {isProcessing ? (
                          <span>Соединение с процессингом 3D Secure...</span>
                        ) : (
                          <span>Оплатить {amountToPay.toLocaleString('ru-RU')} ₸</span>
                        )}
                      </button>
                    </form>
                  )}

                  {/* 3. B2B Corporate Invoice */}
                  {paymentMethod === 'invoice' && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="font-bold text-white">Банковские реквизиты в тенге (ТОО «ТрансЛоджикс Карго Сервис»):</span>
                          <span className="font-mono text-amber-400 font-bold">НДС 12% (РК) включен</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-300">
                          <div>Получатель: <strong>ТОО «ТрансЛоджикс Карго Сервис»</strong></div>
                          <div>БИН: <strong>201140029410</strong></div>
                          <div>Банк: <strong>АО «Kaspi Bank», г. Алматы</strong></div>
                          <div>БИК: <strong>KZKOKZ22</strong></div>
                          <div>ИИК (расчетный счет): <strong className="font-mono text-amber-300">KZ489261802148102914</strong></div>
                          <div>Кбе: <strong>17</strong> • Назначение: <strong>Оплата фрахта по ТТН {activeOrder.id}</strong></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowPrintInvoice(true)}
                          className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Сформировать счет на оплату в тенге (₸)</span>
                        </button>

                        <button
                          onClick={handlePay}
                          className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                        >
                          Отметить как оплаченный (по платежному поручению)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. Cash on delivery */}
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white">Оплата экспедитору при вручении груза</div>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Водитель-экспедитор имеет мобильный POS-терминал для бесконтактной оплаты картой или примет оплату через Kaspi QR / наличными с фискальным чеком.
                      </p>
                      <button
                        onClick={handlePay}
                        className="mt-3 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                      >
                        Подтвердить согласование оплаты водителю ({amountToPay.toLocaleString('ru-RU')} ₸)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              Выберите заказ из списка слева для оплаты
            </div>
          )}
        </div>

      </div>

      {/* Official B2B Invoice Modal */}
      {showPrintInvoice && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 print:p-0 print:m-0">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4 print:hidden">
              <span className="text-xs font-bold text-slate-600 uppercase font-mono">Счет-договор на оплату в тенге (KZT)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Печать</span>
                </button>
                <button
                  onClick={() => setShowPrintInvoice(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Закрыть
                </button>
              </div>
            </div>

            {/* Invoice Print Content */}
            <div className="text-xs leading-relaxed space-y-4">
              <div className="text-center font-bold text-sm border-b pb-2">
                Счет на оплату № {activeOrder.id}/СЧ от {activeOrder.createdAt.split(' ')[0]} г. (Валюта: Тенге KZT)
              </div>

              <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg text-[11px]">
                <div>
                  <span className="font-bold block text-slate-500">Поставщик:</span>
                  <div className="font-bold">ТОО «ТрансЛоджикс Карго Сервис»</div>
                  <div>БИН 201140029410</div>
                  <div>ИИК KZ489261802148102914 в АО «Kaspi Bank»</div>
                  <div>БИК KZKOKZ22, Кбе 17</div>
                </div>
                <div>
                  <span className="font-bold block text-slate-500">Покупатель / Заказчик:</span>
                  <div className="font-bold">{activeOrder.senderContact}</div>
                  <div>Адрес: {activeOrder.senderCity}, {activeOrder.senderAddress}</div>
                  <div>Телефон: {activeOrder.senderPhone}</div>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border p-1.5">№</th>
                    <th className="border p-1.5">Наименование услуги</th>
                    <th className="border p-1.5 text-center">Кол-во</th>
                    <th className="border p-1.5 text-center">Ед.</th>
                    <th className="border p-1.5 text-right">Цена без НДС</th>
                    <th className="border p-1.5 text-right">Всего с НДС</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1.5">1</td>
                    <td className="border p-1.5">
                      Транспортно-экспедиционные услуги по перевозке груза по маршруту {activeOrder.senderCity} — {activeOrder.receiverCity} (ТТН {activeOrder.id})
                    </td>
                    <td className="border p-1.5 text-center">1</td>
                    <td className="border p-1.5 text-center">рейс</td>
                    <td className="border p-1.5 text-right font-mono">{activeOrder.baseRateKzt.toLocaleString('ru-RU')} ₸</td>
                    <td className="border p-1.5 text-right font-mono font-bold">{activeOrder.totalCostKzt.toLocaleString('ru-RU')} ₸</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-right text-xs font-bold space-y-1">
                <div>Итого без НДС: {(activeOrder.totalCostKzt - activeOrder.vatKzt).toLocaleString('ru-RU')} ₸</div>
                <div>НДС 12%: {activeOrder.vatKzt.toLocaleString('ru-RU')} ₸</div>
                <div className="text-sm text-slate-900 font-extrabold">Всего к оплате: {activeOrder.totalCostKzt.toLocaleString('ru-RU')} ₸</div>
              </div>

              <div className="pt-4 border-t flex justify-between items-end">
                <div>
                  <div className="font-bold">Директор: Садыков Н.С. /подпись/</div>
                  <div className="text-[10px] text-slate-500 mt-1">Главный бухгалтер: Белова И.Н. /подпись/</div>
                </div>
                <div className="w-20 h-20 rounded-full border-2 border-indigo-700 flex items-center justify-center text-[7px] text-indigo-700 font-bold transform -rotate-12">
                  ТОО «ТрансЛоджикс» ДЛЯ СЧЕТОВ
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
