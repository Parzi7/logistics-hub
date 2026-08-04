import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2, CheckCircle2, AlertCircle, Truck, Package, Phone } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `Ви — професійний логістичний ШІ-аналітик.
Ваше завдання: проаналізувати вхідний текст та розпізнати заявку на ВАНТАЖ або ТРАНСПОРТ, навіть якщо текст складається з 1-2 слів!

СТРОГІ ПРАВИЛА РОЗПІЗНАВАННЯ:
1. Якщо текст містить слова: "авто", "машина", "тент", "реф", "вільне авто", "є машина", "шукаю вантаж" — це тип "transport"!
2. Якщо текст містить слова: "треба авто", "завантаження", "вантаж", "доставка", "бус" — це тип "cargo"!
3. Якщо є хоча б одне місто чи телефон — це НЕ SmallTalk, це ЗАЯВКА!
4. SmallTalk (isSmallTalk: true) використовуйте ТІЛЬКИ для чистих привітань: "Привіт", "Доброго дня", "Як справи", "Дякую".

Поверніть строго JSON-об'єкт:

Якщо SmallTalk:
{
  "isSmallTalk": true,
  "reply": "Вітаю! Вставте текст заявки на вантаж або вільне авто, і я її розпізнаю."
}

Якщо Заявка (Вантаж або Транспорт):
{
  "isSmallTalk": false,
  "data": {
    "type": "transport" або "cargo",
    "route": {
      "from": "Місто завантаження/знаходження (наприклад: Краків (PL))",
      "to": "Місто розвантаження/напрямок (якщо вказано, або 'За домовленістю')"
    },
    "cargo": "Назва вантажу або тип авто (наприклад: Вільне авто / Тент)",
    "vehicle": "Тип кузова (наприклад: Тент, Реф, Цельномет)",
    "weight": "Вага (якщо вказано)",
    "volume": "Об'єм (якщо вказано)",
    "dates": "Готовність (наприклад: Стрімко / Готовий до завантаження)",
    "price": "Ставка чи пропозиція (якщо є)",
    "company": "Компанія чи перевізник",
    "contact": "Контактна особа",
    "phone": "Телефон (у міжнародному чи звичайному форматі)",
    "notes": "Усі додаткові деталі (наприклад: Вільне авто в Кракові)"
  }
}`;

export default function AIBotButton({ onAddParsedData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Привіт! 👋 Я розпізнаю будь-які заявки на вантажі та вільний транспорт (навіть короткі в 1 рядок!).' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null); // Реф для авторозширення текстового поля

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Динамічна зміна висоти поля вводу
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // Розрахунок висоти
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Обмежуємо максимальну висоту до 120px (далі вмикається скролл)
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || isTyping) return;

    if (!GROQ_API_KEY) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai-error',
        text: '⚠️ API-ключ Groq не знайдено! Перевірте VITE_GROQ_API_KEY у файлі .env'
      }]);
      return;
    }

    const newUserMessage = { id: Date.now(), type: 'user', text: text };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Скидаємо значення та висоту поля назад до 1 рядка
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsTyping(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: text }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Помилка API: ${response.status}`);
      }

      const rawData = await response.json();
      const content = rawData.choices?.[0]?.message?.content;
      if (!content) throw new Error('Отримано порожню відповідь.');

      const parsedResult = JSON.parse(content);

      if (parsedResult.isSmallTalk) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          text: parsedResult.reply || 'Вітаю! Вставте текст заявки.'
        }]);
      } else if (parsedResult.data) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai-parsed',
          text: `Розпізнано ${parsedResult.data.type === 'transport' ? '🚚 ТРАНСПОРТ' : '📦 ВАНТАЖ'}! Перевірте дані:`,
          data: parsedResult.data
        }]);
      }

    } catch (error) {
      console.error('Помилка Groq:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai-error',
        text: `Помилка: ${error.message}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    // Натискання Enter БЕЗ Shift відправляє повідомлення
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
    // При Shift + Enter вставляється новий рядок (\n) і поле авторозширюється
  };

  const handleApprove = (parsedData, messageId) => {
    const extraParts = [];
    if (parsedData.company) extraParts.push(`Компанія: ${parsedData.company}`);
    if (parsedData.paymentTerms) extraParts.push(`Оплата: ${parsedData.paymentTerms}`);
    if (parsedData.customs) extraParts.push(`Митниця: ${parsedData.customs}`);
    if (parsedData.notes) extraParts.push(parsedData.notes);

    const fullAdditionalText = extraParts.length > 0 ? extraParts.join(' | ') : 'Без додаткових умов';

    const formattedPayload = {
      id: Date.now(),
      timeAdded: 'Щойно',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...parsedData,
      additional: fullAdditionalText,
      details: fullAdditionalText,
      notes: fullAdditionalText
    };

    if (onAddParsedData) {
      onAddParsedData(formattedPayload);
    }

    const tabName = parsedData.type === 'transport' ? '«Транспорт»' : '«Вантажі»';

    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, type: 'ai', text: `✅ Заявку додано в розділ ${tabName}! Переключіть вкладку вгорі, щоб переглянути.` }
        : msg
    ));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {isOpen && (
        <div className="mb-4 w-[380px] h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Шапка */}
          <div className="bg-[#0f172a] p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-indigo-500 p-2 rounded-xl text-white">
                  <Bot size={20} />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Groq Llama-3.3 Аналітик</h3>
                <p className="text-indigo-200 text-[10px] font-medium flex items-center gap-1">
                  <Sparkles size={10} /> Розпізнавання Вантажів та Авто
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
              <X size={20} />
            </button>
          </div>

          {/* Чат */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[92%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.type === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                }`}>
                  {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.type === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : msg.type === 'ai-error' 
                        ? 'bg-rose-50 border border-rose-100 text-rose-600 rounded-tl-sm flex items-center gap-2'
                        : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.type === 'ai-error' && <AlertCircle size={16} className="shrink-0" />}
                    {msg.text}
                  </div>

                  {msg.type === 'ai-parsed' && msg.data && (
                    <div className="bg-white border border-indigo-100 rounded-2xl p-3 shadow-md w-full text-xs space-y-2">
                      <div className="font-bold border-b border-indigo-50 pb-1.5 flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 ${
                          msg.data.type === 'transport' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {msg.data.type === 'transport' ? <Truck size={12}/> : <Package size={12}/>}
                          {msg.data.type === 'transport' ? 'ТРАНСПОРТ (Авто)' : 'ВАНТАЖ'}
                        </span>
                        {msg.data.company && <span className="text-[10px] text-slate-400">{msg.data.company}</span>}
                      </div>
                      
                      <div className="space-y-1 text-slate-700">
                        <p><span className="font-semibold text-slate-400">Локація/Маршрут:</span> {msg.data.route?.from || '—'} → {msg.data.route?.to || '—'}</p>
                        <p><span className="font-semibold text-slate-400">Опис/Тип:</span> {msg.data.cargo || msg.data.vehicle || '—'}</p>
                        {msg.data.price && <p><span className="font-semibold text-slate-400">Ціна:</span> {msg.data.price}</p>}
                      </div>

                      <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-100 flex items-center gap-1">
                        <Phone size={12} className="text-emerald-600" />
                        <span className="font-mono font-medium">{msg.data.phone || msg.data.contact || 'Телефон не вказано'}</span>
                      </div>

                      <button 
                        onClick={() => handleApprove(msg.data, msg.id)}
                        className="w-full py-2 mt-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 transition-colors text-xs"
                      >
                        <CheckCircle2 size={14} /> Зберегти в таблицю
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле вводу з авторозширенням */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-3 focus-within:border-indigo-500 transition-all">
              <textarea 
                ref={textareaRef}
                rows={1}
                value={inputValue} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Вставте текст заявки..."
                className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 resize-none max-h-32 overflow-y-auto py-1 leading-normal"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-colors shrink-0 mb-0.5"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>

        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-[#0f172a] text-white hover:bg-indigo-600'
        }`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

    </div>
  );
}