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
      } else if (message.includes('Activation') || message.includes('problem')) {
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
      {/* Support Options Modal - Airalo Style */}
      {!showInAppSupport && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]" 
          onClick={onClose}
        >
          <div 
            ref={supportModalRef}
            className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md transform animate-in slide-in-from-bottom duration-300 shadow-2xl relative border-t border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleSupportModalTouchStart}
            onTouchMove={handleSupportModalTouchMove}
            onTouchEnd={handleSupportModalTouchEnd}
            style={{
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 pb-4 pt-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
                Choose your preferred channel to get help from the support team.
              </p>
            </div>

            {/* Support Options - Airalo Style */}
            <div className="bg-gray-50 dark:bg-gray-800 mx-4 mb-3 rounded-xl overflow-hidden">
              {/* In-app Chat */}
              <button 
                onClick={() => {
                  setShowInAppSupport(true);
                }}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">Chat in the app</span>
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              {/* WhatsApp Support */}
              <button 
                onClick={() => {
                  onClose();
                  window.open(`https://wa.me/436766440122`, '_blank');
                }}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-900 dark:text-gray-100 font-medium">WhatsApp</span>
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </button>
            </div>

            {/* Cancel Button - Airalo Style */}
            <div className="mx-4 mb-4">
              <button 
                onClick={onClose}
                className="w-full py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Support Screen - eSIMfo Style */}
      {showInAppSupport && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[9999] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">eSIMfo</h1>
            <button
              onClick={() => setShowInAppSupport(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date Header */}
          <div className="text-center py-3 bg-gray-50 dark:bg-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">27 Eylül 18:30</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800">
            {supportMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSupport ? 'justify-start' : 'justify-end'}`}
              >
                <div className="flex items-start space-x-2 max-w-xs">
                  {message.isSupport && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div 
                      className={`px-4 py-3 rounded-2xl ${
                        message.isSupport 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md' 
                          : 'bg-blue-500 text-white rounded-br-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 ${message.isSupport ? 'text-left' : 'text-right'}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Message Options */}
            {supportMessages.length <= 2 && (
              <div className="flex flex-col space-y-2 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">Quick options:</p>
                <button
                  onClick={() => handleQuickMessage('I need help with my eSIM')}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">I need help with my eSIM</span>
                </button>
                <button
                  onClick={() => handleQuickMessage('Activation problem')}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">Activation problem</span>
                </button>
                <button
                  onClick={() => handleQuickMessage('Talk to support')}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">Talk to support</span>
                </button>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              {/* Attachment Button */}
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Mesaj yazın"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Send Button */}
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
