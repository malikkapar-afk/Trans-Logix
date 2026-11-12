import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { MOCK_OPERATORS } from '../../data/mockData';
import { 
  Headphones, 
  PhoneCall, 
  ShieldAlert, 
  Radio, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  User, 
  MapPin, 
  Plus,
  Send
} from 'lucide-react';

export const CallCenterView: React.FC = () => {
  const { 
    callTickets, 
    startVoipCall, 
    triggerSosAlert, 
    resolveCallTicket,
    activeTrackingCode, 
    currentRole,
    currentDriver 
  } = useLogistics();

  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [newTicketTopic, setNewTicketTopic] = useState('');
  const [newTicketLocation, setNewTicketLocation] = useState('');
  const [newTicketUrgency, setNewTicketUrgency] = useState<'low' | 'medium' | 'high' | 'critical_sos'>('medium');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const filteredTickets = callTickets.filter(t => {
    if (ticketFilter === 'open') return t.status !== 'resolved';
    if (ticketFilter === 'resolved') return t.status === 'resolved';
    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTopic.trim()) return;

    if (newTicketUrgency === 'critical_sos') {
      triggerSosAlert(newTicketLocation, newTicketTopic);
    } else {
      startVoipCall(newTicketTopic, 'support');
    }

    setNewTicketTopic('');
    setNewTicketLocation('');
    setShowNewTicketForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
            <Radio className="w-4 h-4 animate-pulse" />
            Круглосуточный диспетчерский центр TransLogix 24/7
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Поддержка водителей и экспедиторов
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Прямая оперативная радиосвязь с диспетчером рейса, координация при поломках на трассе, юридическая помощь на таможенных КПП и круглосуточная аварийная служба SOS.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => startVoipCall('Срочный выход на дежурного диспетчера', 'support')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Вызов диспетчера в эфир</span>
          </button>

          <button
            onClick={() => triggerSosAlert('Трасса М-7 Волга (GPS координаты зафиксированы)', 'Экстренная поломка / SOS')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            <span>Красная кнопка SOS</span>
          </button>
        </div>
      </div>

      {/* Operators on duty cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>Дежурная смена диспетчеров (Онлайн)</span>
          </h3>
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            3 диспетчера на линии
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_OPERATORS.map(op => (
            <div
              key={op.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={op.avatar}
                    alt={op.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{op.name}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{op.role}</div>
                  <div className="text-[10px] text-amber-400 font-medium mt-0.5">
                    {op.activeCalls} рейсов на контроле
                  </div>
                </div>
              </div>

              <button
                onClick={() => startVoipCall(`Связь с оператором ${op.name}`, 'support')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                title="Позвонить в эфир"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Ticket Journal & Quick Incident creation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tickets and incident feed (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Журнал инцидентов и запросов с трассы
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {callTickets.length}
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setTicketFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  ticketFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setTicketFilter('open')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  ticketFilter === 'open' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                В работе
              </button>
              <button
                onClick={() => setTicketFilter('resolved')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  ticketFilter === 'resolved' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Решенные
              </button>
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-3">
            {filteredTickets.map(ticket => {
              const isSos = ticket.urgency === 'critical_sos';
              const isResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSos
                      ? 'bg-red-950/20 border-red-800/80'
                      : isResolved
                      ? 'bg-slate-900/40 border-slate-800'
                      : 'bg-slate-900 border-slate-700/80 shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{ticket.id}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isSos
                          ? 'bg-red-600 text-white animate-pulse'
                          : isResolved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {isSos ? '🚨 КРИТИЧЕСКИЙ SOS' : isResolved ? 'Решено' : 'В обработке диспетчером'}
                      </span>
                      {ticket.orderId && (
                        <span className="text-xs font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {ticket.orderId}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ticket.createdAt}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{ticket.topic}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{ticket.driverName} ({ticket.driverPhone})</span>
                    </div>
                    {ticket.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{ticket.location}</span>
                      </div>
                    )}
                  </div>

                  {ticket.dispatcherNotes && (
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 mb-3">
                      <div className="text-[10px] font-bold text-amber-400 mb-0.5">Отметка диспетчера смены:</div>
                      <div>{ticket.dispatcherNotes}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => startVoipCall(`Связь по инциденту ${ticket.id}: ${ticket.topic}`, isSos ? 'sos' : 'support')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Выйти на голосовую связь</span>
                    </button>

                    {!isResolved && (
                      <button
                        onClick={() => resolveCallTicket(ticket.id, 'Инцидент успешно урегулирован диспетчерской службой')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Отметить решенным</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Driver Quick Dispatch Request Form (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Новое обращение с борта</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Прямой эфир</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Задержка на складе? Простой? Вопрос по документам? Заполните форму, и дежурный диспетчер перезвонит в течение 2 минут.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Срочность запроса:</label>
                <select
                  value={newTicketUrgency}
                  onChange={(e) => setNewTicketUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="low">Обычная (консультация / график)</option>
                  <option value="medium">Средняя (задержка на погрузке / простой)</option>
                  <option value="high">Высокая (сложности на КПП / таможня)</option>
                  <option value="critical_sos">🚨 КРИТИЧЕСКИЙ SOS (Поломка / ДТП)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Суть обращения / описание проблемы:</label>
                <textarea
                  required
                  rows={3}
                  value={newTicketTopic}
                  onChange={(e) => setNewTicketTopic(e.target.value)}
                  placeholder="Опишите ситуацию, номер ворот или характер поломки..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Текущая локация / трасса:</label>
                <input
                  type="text"
                  required
                  value={newTicketLocation}
                  onChange={(e) => setNewTicketLocation(e.target.value)}
                  placeholder="Например: М-7, район Чебоксар, стоянка"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  newTicketUrgency === 'critical_sos'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Отправить в диспетчерскую</span>
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>📞 Дежурный телефон: <a href="tel:+77023203878" className="text-white hover:text-amber-400 font-bold font-mono transition">+7 (702) 320-38-78</a></div>
              <div>📻 Радиоканал экспедиторов: <strong className="text-amber-400 font-mono">15 канал АМ (27.135 МГц)</strong></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
