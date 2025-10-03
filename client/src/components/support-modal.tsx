import { useState, useRef, useEffect } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [showInAppSupport, setShowInAppSupport] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [supportMessages, setSupportMessages] = useState([
    {
      id: 1,
      text: 'Hello! Welcome to eSIMfo live support team! 👋',
      isBot: false,
      isSupport: true,
      time: '18:30'
    },
    {
      id: 2,
      text: 'How can we help you? You can choose one of the options below or write directly.',
      isBot: false,
      isSupport: true,
      time: '18:30'
    }
  ]);

  // Support modal swipe states
  const [supportModalStartY, setSupportModalStartY] = useState<number>(0);
  const [supportModalCurrentY, setSupportModalCurrentY] = useState<number>(0);
  const [isSupportModalDragging, setIsSupportModalDragging] = useState<boolean>(false);
  const supportModalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when support modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [isOpen]);

  // Reset showInAppSupport when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowInAppSupport(false);
    }
  }, [isOpen]);

  // Touch event handlers for Support modal swipe-down dismissal
  const handleSupportModalTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSupportModalStartY(touch.clientY);
    setSupportModalCurrentY(touch.clientY);
    setIsSupportModalDragging(true);
  };

  const handleSupportModalTouchMove = (e: React.TouchEvent) => {
    if (!isSupportModalDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - supportModalStartY;
    
    setSupportModalCurrentY(touch.clientY);
    
    if (deltaY > 0) {
      e.preventDefault();
      
      if (supportModalRef.current) {
        supportModalRef.current.style.transform = `translateY(${Math.min(deltaY, 300)}px)`;
        supportModalRef.current.style.opacity = `${Math.max(1 - deltaY / 300, 0.3)}`;
      }
    }
  };

  const handleSupportModalTouchEnd = () => {
    if (!isSupportModalDragging) return;
    
    const deltaY = supportModalCurrentY - supportModalStartY;
    
    if (deltaY > 80 && supportModalRef.current) {
      supportModalRef.current.style.transform = 'translateY(100%)';
      supportModalRef.current.style.opacity = '0';
      setTimeout(() => {
        onClose();
      }, 200);
    } else if (supportModalRef.current) {
      supportModalRef.current.style.transform = 'translateY(0)';
      supportModalRef.current.style.opacity = '1';
    }
    
    setIsSupportModalDragging(false);
    setSupportModalStartY(0);
    setSupportModalCurrentY(0);
  };

  // Support message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: supportMessages.length + 1,
      text: currentMessage,
      isBot: false,
      isSupport: false,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    setTimeout(() => {
      const response = {
        id: supportMessages.length + 2,
        text: 'Thank you for your message. A support team member will respond to you shortly.',
        isBot: false,
        isSupport: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setSupportMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleQuickMessage = (message: string) => {
    const userMessage = {
      id: supportMessages.length + 1,
      text: message,
      isBot: false,
      isSupport: false,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      let response = '';
      if (message.includes('eSIM')) {
        response = 'We received your eSIM question. Which country eSIM are you using and what kind of problem are you experiencing?';
      } else if (message.includes('Activation')) {
        response = 'We are ready to help with your activation issue. Could you please share the ICCID number of your eSIM?';
      } else {
        response = 'A support team member will respond to you shortly. Is there anything else I can help with?';
      }
      
      const botResponse = {
        id: supportMessages.length + 2,
        text: response,
        isBot: false,
        isSupport: true,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setSupportMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Support Options Modal */}
      {!showInAppSupport && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-[99] transition-opacity duration-200"
          onClick={onClose}
        >
          <div 
            ref={supportModalRef}
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-lg shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleSupportModalTouchStart}
            onTouchMove={handleSupportModalTouchMove}
            onTouchEnd={handleSupportModalTouchEnd}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  data-testid="button-close-support"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How can we help you today?</p>
            </div>

            {/* Support Options */}
            <div className="p-6 space-y-3 pb-8">
              {/* WhatsApp Support */}
              <button
                onClick={() => {
                  window.open('https://wa.me/436766440122', '_blank');
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 rounded-2xl transition-all duration-200 group border border-green-100 dark:border-green-800/50"
                data-testid="button-whatsapp-support"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">WhatsApp Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quick response via chat</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* In-App Support */}
              <button
                onClick={() => setShowInAppSupport(true)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-2xl transition-all duration-200 group border border-blue-100 dark:border-blue-800/50"
                data-testid="button-inapp-support"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">Live Chat Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chat with our support team</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Support Chat Screen */}
      {showInAppSupport && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-4 py-3 shadow-lg">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowInAppSupport(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                data-testid="button-back-support"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-base">eSIMfo Support</h3>
                <p className="text-xs text-blue-100">Usually responds instantly</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
            {supportMessages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.isSupport ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] ${message.isSupport ? 'order-2' : 'order-1'}`}>
                  {message.isSupport && (
                    <div className="flex items-center space-x-2 mb-1 pl-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Support</span>
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.isSupport 
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isSupport 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-blue-100'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Reply Suggestions */}
            {supportMessages.length <= 3 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 px-1">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleQuickMessage('I have a problem with my eSIM')}
                    className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    📱 eSIM Problem
                  </button>
                  <button 
                    onClick={() => handleQuickMessage('Activation issue')}
                    className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    🔄 Activation
                  </button>
                  <button 
                    onClick={() => handleQuickMessage('Refund request')}
                    className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    💰 Refund
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 min-h-[44px] flex items-center">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none outline-none text-sm max-h-24"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                  }}
                  data-testid="input-support-message"
                />
              </div>
              <button
                type="submit"
                disabled={!currentMessage.trim()}
                className={`p-3 rounded-full transition-colors ${
                  currentMessage.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
