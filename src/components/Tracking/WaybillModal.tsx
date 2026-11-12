import React from 'react';
import { Order } from '../../types/logistics';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface WaybillModalProps {
  order: Order;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 print:p-0 print:shadow-none print:m-0 animate-in zoom-in-95 duration-200">
        
        {/* Top Action Bar (hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-mono font-bold">
              ЭЛЕКТРОННАЯ ТТН (ФОРМА 1-Т) / CMR
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Подписано ЭЦП
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Печать / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Document Body */}
        <div className="space-y-6 text-xs leading-relaxed border-2 border-slate-800 p-6 rounded-2xl bg-slate-50/50">
          
          {/* Header of Waybill */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
            <div>
              <div className="text-lg font-black tracking-tight text-slate-900">
                ТОВАРНО-ТРАНСПОРТНАЯ НАКЛАДНАЯ
              </div>
              <div className="text-xs font-bold text-slate-600 font-mono mt-0.5">
                № {order.id} от {order.createdAt.split(' ')[0]}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Экспедитор: ООО «ТрансЛоджикс Карго Сервис», ОГРН 1207700294101
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg p-1 flex items-center justify-center shadow-sm">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">UUID: {order.id}-GOV-CIS</span>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-300 pb-4">
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">1. Грузоотправитель:</span>
              <div className="font-bold text-slate-900 mt-0.5">{order.senderContact}</div>
              <div className="text-slate-600 mt-0.5">{order.senderCity}, {order.senderAddress}</div>
              <div className="text-slate-500 font-mono mt-0.5">Тел: {order.senderPhone}</div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">2. Грузополучатель:</span>
              <div className="font-bold text-slate-900 mt-0.5">{order.receiverContact}</div>
              <div className="text-slate-600 mt-0.5">{order.receiverCity}, {order.receiverAddress}</div>
              <div className="text-slate-500 font-mono mt-0.5">Тел: {order.receiverPhone}</div>
            </div>
          </div>

          {/* Transport & Driver */}
          <div className="grid grid-cols-3 gap-3 border-b border-slate-300 pb-4">
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">3. Водитель-экспедитор:</span>
              <div className="font-bold text-slate-900 mt-0.5">{order.driver?.name || 'Назначенный водитель'}</div>
              <div className="text-slate-600 font-mono mt-0.5">{order.driver?.phone || '—'}</div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">4. Тягач / Госномер:</span>
              <div className="font-bold text-slate-900 mt-0.5">{order.driver?.truckModel || 'Еврофура'}</div>
              <div className="text-slate-700 font-mono font-bold mt-0.5">
                {order.driver?.licensePlate || 'А000АА 77'} (Прицеп: {order.driver?.trailerPlate || 'АА 0000 77'})
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block">5. Номер пломбы:</span>
              <div className="font-bold text-amber-600 font-mono mt-0.5">{order.sealNumber || 'TLX-SEAL-01'}</div>
              <div className="text-[10px] text-slate-500">Замок опломбирован</div>
            </div>
          </div>

          {/* Cargo specification table */}
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-2">
              6. Сведения о грузе:
            </span>
            <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">Наименование груза</th>
                  <th className="border border-slate-300 p-2 text-center">Категория</th>
                  <th className="border border-slate-300 p-2 text-center">Мест</th>
                  <th className="border border-slate-300 p-2 text-center">Масса (брутто)</th>
                  <th className="border border-slate-300 p-2 text-center">Объем</th>
                  <th className="border border-slate-300 p-2 text-right">Объявленная ценность</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium">{order.cargoDescription}</td>
                  <td className="border border-slate-300 p-2 text-center">{order.cargoCategory}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{order.packagesCount}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold">{(order.weightKg / 1000).toFixed(1)} т ({order.weightKg} кг)</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{order.volumeM3} м³</td>
                  <td className="border border-slate-300 p-2 text-right font-mono font-bold">{order.declaredValueKzt.toLocaleString('ru-RU')} ₸</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Temperature & Special Conditions */}
          {order.temperatureRequired && (
            <div className="bg-cyan-50 border border-cyan-200 p-2.5 rounded-xl flex items-center justify-between text-cyan-900">
              <span className="font-bold">Температурный режим перевозки:</span>
              <span className="font-mono font-bold">{order.temperatureRequired}</span>
            </div>
          )}

          {/* Signatures & Seal stamp simulation */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 block">Отпустил (Грузоотправитель):</span>
              <div className="mt-4 border-b border-slate-400 pb-1 font-semibold text-slate-800">
                {order.senderContact.split(' ')[0]} /подпись/
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">Принял к перевозке (Экспедитор):</span>
              <div className="mt-4 border-b border-slate-400 pb-1 font-semibold text-slate-800">
                {order.driver?.name || 'Водитель'} /подпись/
              </div>
            </div>

            <div className="relative">
              <span className="text-[10px] text-slate-500 block">Штамп диспетчера:</span>
              <div className="w-24 h-24 rounded-full border-2 border-indigo-700/80 p-1 flex flex-col items-center justify-center text-center text-indigo-700 font-bold text-[8px] transform -rotate-12 mt-1">
                <span>TransLogix Cargo</span>
                <span className="text-[7px]">ВЫПУСК РАЗРЕШЕН</span>
                <span className="text-[7px] font-mono">{order.createdAt.split(' ')[0]}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-4 text-[10px] text-slate-400 text-center print:hidden">
          Документ сформирован в государственной системе электронных перевозочных документов (ГИС ЭПД).
        </div>

      </div>
    </div>
  );
};
