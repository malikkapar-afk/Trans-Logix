import React, { useState, useEffect } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Radio, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';
import { playPhoneBeep, playRadioClick } from '../../utils/audioTones';

export const VoipCallModal: React.FC = () => {
  const { activeVoipCall, endVoipCall, showToast } = useLogistics();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [messages, setMessages] = useState<Array<{ sender: 'dispatcher' | 'driver'; text: string; time: string }>>([]);

  useEffect(() => {
    if (activeVoipCall?.status === 'ringing') {
      playPhoneBeep();
      const interval = setInterval(() => {
        playPhoneBeep();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeVoipCall?.status]);

  useEffect(() => {
    if (activeVoipCall?.status === 'connected') {
      playRadioClick();
      const initialGreeting = activeVoipCall.callType === 'sos'
        ? `Внимание! Сигнал SOS принят. Диспетчер безопасности на проводе. Координаты зафиксированы. Доложите ситуацию!`
        : `Здравствуйте! Дежурный диспетчер ${activeVoipCall.operatorName} на связи. Слушаю вас по рейсу. Чем могу помочь?`;

      setMessages([
        {
          sender: 'dispatcher',
          text: initialGreeting,
          time: 'сейчас'
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [activeVoipCall?.status, activeVoipCall?.callType]);

  if (!activeVoipCall || !activeVoipCall.isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleQuickReply = (text: string) => {
    playRadioClick();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setMessages(prev => [
      ...prev,
      { sender: 'driver', text, time: timeStr }
    ]);

    // Dispatcher auto-response
    setTimeout(() => {
      playRadioClick();
      let reply = 'Принято в обработку. Фиксирую в журнале рейса.';
      if (text.includes('простой')) {
        reply = 'Связался со складом получателя. Слот выгрузки подтвержден через 25 минут, акт простоя сформирован.';
      } else if (text.includes('колеса') || text.includes('поломка') || text.includes('SOS')) {
        reply = 'Ближайшая грузовая техпомощь выехала. Расстояние до вас 18 км. Ожидайте на безопасной обочине.';
      } else if (text.includes('прибыл') || text.includes('разгрузку')) {
        reply = 'Отлично! Отметка о прибытии внесена в систему. Сканы ТТН можете загрузить прямо в приложении.';
      } else if (text.includes('документ')) {
        reply = 'Электронная ТТН и доверенность отправлены в ваш кабинет водителя. Проверьте раздел документов.';
      }

      setMessages(prev => [
        ...prev,
        { sender: 'dispatcher', text: reply, time: timeStr }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          activeVoipCall.callType === 'sos' ? 'bg-red-950/70 border-red-800/80' : 'bg-slate-800/50 border-slate-700/60'
        }`}>
          <div className="flex items-center gap-2">
            {activeVoipCall.callType === 'sos' ? (
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm animate-pulse">
                <ShieldAlert className="w-5 h-5" />
                <span>ЭКСТРЕННАЯ ЛИНИЯ SOS 24/7</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-400 font-medium text-sm">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Диспетчерская рация TransLogix Direct</span>
              </div>
            )}
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            {activeVoipCall.status === 'ringing' ? 'Вызов...' : activeVoipCall.status === 'connected' ? 'В эфире' : 'Завершен'}
          </span>
        </div>

        {/* Operator Profile & Call State */}
        <div className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <img
              src={activeVoipCall.operatorAvatar}
              alt={activeVoipCall.operatorName}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 shadow-xl mx-auto"
            />
            {activeVoipCall.status === 'connected' && (
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
            )}
            {activeVoipCall.status === 'connected' && (
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-1">{activeVoipCall.operatorName}</h3>
          <p className="text-xs text-slate-400 mb-2">{activeVoipCall.operatorRole}</p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/70 mb-4">
            <span className="text-xs text-slate-400">Тема:</span>
            <span className="text-xs font-medium text-amber-300 max-w-xs truncate">{activeVoipCall.topic}</span>
          </div>

          {/* Status / Timer */}
          <div className="mb-6">
            {activeVoipCall.status === 'ringing' ? (
              <div className="flex items-center justify-center gap-2 text-amber-400 text-sm animate-pulse">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Соединение с оператором колл-центра...</span>
              </div>
            ) : activeVoipCall.status === 'connected' ? (
              <div className="text-2xl font-mono font-bold text-emerald-400 tracking-wider">
                {formatTimer(activeVoipCall.durationSeconds)}
              </div>
            ) : (
              <div className="text-sm text-slate-400">Вызов завершен</div>
            )}
          </div>

          {/* Interactive Live Radio Dialogue Transcript */}
          {activeVoipCall.status === 'connected' && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-left mb-5 max-h-48 overflow-y-auto space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Эфир радиосвязи (голос + текст)</span>
              </div>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl text-xs ${
                    m.sender === 'dispatcher'
                      ? 'bg-slate-800/80 text-slate-200 border border-slate-700/60 mr-6'
                      : 'bg-amber-500/20 text-amber-200 border border-amber-500/30 ml-6 text-right'
                  }`}
                >
                  <div className="font-semibold text-[10px] opacity-75 mb-0.5">
                    {m.sender === 'dispatcher' ? `Диспетчер ${activeVoipCall.operatorName}` : 'Водитель-экспедитор'}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Driver Quick Response Chips */}
          {activeVoipCall.status === 'connected' && (
            <div className="mb-6">
              <p className="text-[11px] text-slate-400 mb-2 text-left">Быстрые доклады с борта:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Прибыл на склад выгрузки',
                  'Простой на рампе более 2ч',
                  'Поломка, нужен техник SOS',
                  'Документы ТТН подписаны'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleQuickReply(chip)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition active:scale-95"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Control Bar */}
          <div className="flex items-center justify-center gap-5 pt-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                showToast(isMuted ? 'Микрофон включен' : 'Микрофон отключен');
              }}
              className={`p-4 rounded-full transition ${
                isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Включить микрофон' : 'Отключить микрофон'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Hang up button */}
            <button
              onClick={endVoipCall}
              className="p-5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition transform hover:scale-105 active:scale-95"
              title="Завершить вызов"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            <button
              onClick={() => {
                setIsSpeaker(!isSpeaker);
                showToast(isSpeaker ? 'Громкая связь отключена' : 'Громкая связь включена');
              }}
              className={`p-4 rounded-full transition ${
                isSpeaker ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isSpeaker ? 'Громкая связь' : 'В трубку'}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
