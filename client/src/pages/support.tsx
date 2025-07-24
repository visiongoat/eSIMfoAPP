import { useState } from "react";
import { useLocation } from "wouter";

export default function LiveChatScreen() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');

  return (
    <div className="mobile-screen bg-gradient-to-br from-pink-100 via-white to-pink-100 min-h-screen flex flex-col">
      {/* Header - Holafly Style */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-4 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold">eSIMfo</h1>
          </div>
          <button 
            onClick={() => setLocation('/')}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Support Team Avatars */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-pink-400">
              <span className="text-sm">👩‍💼</span>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-pink-400">
              <span className="text-sm">👨‍💼</span>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-pink-400">
              <span className="text-sm">👩‍💻</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-medium mb-1">Hi, Welcome to eSIMfo 👋</h2>
        <p className="text-pink-100 text-sm">Our support team is here to help you 24/7</p>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 px-4 py-6 space-y-4">
          {/* Welcome Message from Bot */}
          <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[85%]">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🎧</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">eSIMfo Support</div>
                <div className="text-gray-700">
                  Hello, adventurer! 🌍✨ At eSIMfo, we're here to make your travel experience epic. How can we assist you today?
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📱</span>
                  <span className="font-medium text-gray-900">I want an eSIM</span>
                </div>
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🛠️</span>
                  <span className="font-medium text-gray-900">I already purchased an eSIM</span>
                </div>
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send us a message"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="ml-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}