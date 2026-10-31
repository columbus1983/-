import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatThread } from '../types';
import { generateFarmerAutoReply, formatChatTimestamp } from '../utils/chatUtils';
import { Send, Phone, ArrowRight, Sparkles, MessageCircle, Mic, Image, CheckCheck, Users } from 'lucide-react';
import { playClickSound, playWinCelebration } from '../utils/audio';

interface ChatSpaceProps {
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (threadId: string, message: ChatMessage) => void;
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
}

export const ChatSpace: React.FC<ChatSpaceProps> = ({
  threads,
  messages,
  onSendMessage,
  activeThreadId,
  onSelectThread,
}) => {
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'group'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find((t) => t.id === activeThreadId) || (activeThreadId ? null : threads[0]);
  const currentMessages = currentThread ? messages[currentThread.id] || [] : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeThreadId]);

  const filteredThreads = threads.filter((t) => {
    if (filterType === 'direct') return t.type === 'direct';
    if (filterType === 'group') return t.type === 'group';
    return true;
  });

  const handleSend = (textToSend?: string, photoUrl?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text && !photoUrl) return;
    if (!currentThread) return;

    playClickSound();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId: currentThread.id,
      senderId: 'user-me',
      senderName: 'أنا (مواطن تضامني)',
      senderRole: 'citoyen',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      text,
      timestamp: formatChatTimestamp(),
      isMe: true,
      photoUrl,
    };

    onSendMessage(currentThread.id, newMsg);
    setInputText('');

    // If direct chat with a farmer, simulate a realistic farmer response
    if (currentThread.type === 'direct') {
      setTimeout(() => {
        const replyText = generateFarmerAutoReply(currentThread.title, text);
        const replyMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          threadId: currentThread.id,
          senderId: currentThread.producerId || 'producer',
          senderName: currentThread.title,
          senderRole: 'producteur',
          senderAvatar: currentThread.avatar,
          text: replyText,
          timestamp: formatChatTimestamp(),
          isMe: false,
        };
        onSendMessage(currentThread.id, replyMsg);
        playWinCelebration();
      }, 1400);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  const handleSendHarvestPhoto = () => {
    const sampleHarvestPhoto = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80';
    handleSend('هل الطماطم ما زالت متوفرة بهذه الجودة؟', sampleHarvestPhoto);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>فضاء المحادثة بين الفلاحين والمواطنين</span>
          </div>
          <h2 className="font-serif-display font-extrabold text-xl sm:text-2xl text-white">
            شات الفلاّحة وأولاد الحومة 💬
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-sm mx-auto mt-1 leading-relaxed">
            تواصل مباشرة مع عم سالم وخالتي فاطمة أو انضم لمجلس الحومة لتنسيق الشراء الجماعي وطلب المحاصيل الطازجة!
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs flex flex-col md:flex-row h-[620px]">
        {/* Threads List Sidebar (Desktop or when no thread selected on mobile) */}
        <div className={`w-full md:w-80 border-b md:border-b-0 md:border-l border-stone-200 flex flex-col shrink-0 ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
          {/* Thread Filter Chips */}
          <div className="p-3 border-b border-stone-100 flex items-center gap-1.5 bg-stone-50">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              الكل ({threads.length})
            </button>
            <button
              onClick={() => setFilterType('group')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'group'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              مجلس الحومة 👥
            </button>
            <button
              onClick={() => setFilterType('direct')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'direct'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              مع الفلاّح 🚜
            </button>
          </div>

          {/* Threads list */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === currentThread?.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    playClickSound();
                    onSelectThread(thread.id);
                  }}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-emerald-50/70 border-r-4 border-r-emerald-700' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={thread.avatar}
                      alt={thread.title}
                      className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shadow-2xs"
                    />
                    {thread.isOnline && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -left-0.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-display font-bold text-xs text-stone-900 truncate">
                        {thread.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {thread.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {thread.subtitle}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-stone-700 line-clamp-1 font-medium">
                        {thread.lastMessage}
                      </p>
                      {thread.unreadCount > 0 && (
                        <span className="bg-amber-400 text-stone-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 mr-1 font-mono">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Conversation View */}
        {currentThread ? (
          <div className={`flex-1 flex flex-col h-full ${activeThreadId ? 'flex' : 'hidden md:flex'}`}>
            {/* Conversation Header */}
            <div className="p-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Back button for mobile */}
                <button
                  onClick={() => onSelectThread('')}
                  className="md:hidden w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                  aria-label="الرجوع لقائمة المحادثات"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative">
                  <img
                    src={currentThread.avatar}
                    alt={currentThread.title}
                    className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                  />
                  {currentThread.isOnline && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white absolute -bottom-0.5 -left-0.5" />
                  )}
                </div>

                <div>
                  <h3 className="font-serif-display font-bold text-sm text-stone-900 leading-tight">
                    {currentThread.title}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {currentThread.type === 'group' ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Users className="w-3 h-3" />
                        مجلس الحومة المفتوح · 142 مشارك
                      </span>
                    ) : (
                      <span>{currentThread.subtitle} · <strong className="text-emerald-700">متواجد في السانية الآن</strong></span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              {currentThread.type === 'direct' && (
                <a
                  href="tel:98450120"
                  className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">اتصال مباشر</span>
                </a>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-amber-50/20">
              {currentMessages.length === 0 ? (
                <div className="text-center p-8 space-y-2 text-stone-500">
                  <MessageCircle className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="text-xs font-semibold">ابدأ المحادثة مع {currentThread.title}</p>
                  <p className="text-[11px] text-stone-400">استفسر عن الصابة، أوقات التسليم، أو احجز طلبك مباشرة</p>
                </div>
              ) : (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.isMe ? 'flex-row' : 'flex-row-reverse justify-end'}`}
                  >
                    {!msg.isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-stone-200 shadow-2xs"
                      />
                    )}

                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-2xs space-y-1.5 ${
                      msg.isMe
                        ? 'bg-emerald-700 text-white rounded-br-xs'
                        : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs'
                    }`}>
                      {!msg.isMe && (
                        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-1">
                          <span className="text-[11px] font-bold text-stone-800">
                            {msg.senderName}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            msg.senderRole === 'producteur'
                              ? 'bg-amber-100 text-amber-900'
                              : msg.senderRole === 'coordinateur'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}>
                            {msg.senderRole === 'producteur' ? 'فلاّح' : msg.senderRole === 'coordinateur' ? 'منسق' : 'مواطن'}
                          </span>
                        </div>
                      )}

                      {/* Photo if present */}
                      {msg.photoUrl && (
                        <img
                          src={msg.photoUrl}
                          alt="صورة ملحقة"
                          className="rounded-xl w-full max-h-48 object-cover border border-black/10"
                        />
                      )}

                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      <div className={`flex items-center justify-end gap-1 text-[10px] ${
                        msg.isMe ? 'text-emerald-200' : 'text-stone-400'
                      }`}>
                        <span className="font-mono">{msg.timestamp}</span>
                        {msg.isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-stone-400 shrink-0 font-bold">اقتراحات سريعة:</span>
              <button
                onClick={() => handleQuickQuestion('عسلامة عمي، هل الصابة طازجة اليوم؟')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-stone-200 rounded-xl text-[11px] text-stone-700 font-semibold whitespace-nowrap transition-colors cursor-pointer"
              >
                هل الصابة طرية اليوم؟
              </button>
              <button
                onClick={() => handleQuickQuestion('وقتاش أوقات التسليم في السانية؟')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-stone-200 rounded-xl text-[11px] text-stone-700 font-semibold whitespace-nowrap transition-colors cursor-pointer"
              >
                وقتاش أوقات التسليم؟
              </button>
              <button
                onClick={() => handleQuickQuestion('نحب نحجز قفة خضار 6 كغ')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-stone-200 rounded-xl text-[11px] text-stone-700 font-semibold whitespace-nowrap transition-colors cursor-pointer"
              >
                حجز قفة خضار
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSendHarvestPhoto}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                title="إرسال صورة للمحصول أو السانية"
              >
                <Image className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSend('تسجيل صوتي: "عسلامة، الصابة اليوم ما شاء الله مباركة!"')}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                title="تسجيل صوتي"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={currentThread.type === 'group' ? 'اكتب رسالة لمجلس الحومة والفلاحة...' : `اكتب لـ ${currentThread.title}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                  inputText.trim()
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
                aria-label="إرسال الرسالة"
              >
                <Send className="w-4 h-4 transform rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-400 text-center space-y-2">
            <MessageCircle className="w-12 h-12 text-stone-300" />
            <p className="font-serif-display font-bold text-sm text-stone-700">اختر محادثة لبدء التواصل المباشر</p>
          </div>
        )}
      </div>
    </div>
  );
};
