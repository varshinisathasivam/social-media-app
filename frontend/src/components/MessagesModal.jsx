import React, { useState } from 'react';
import { X, Send, Smile, Phone, Video, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../services/api';

export default function MessagesModal({ isOpen, onClose }) {
  const { user, demoUsers } = useAuth();
  const contacts = (demoUsers || []).filter(u => u.id !== user?.id);
  const [selectedContact, setSelectedContact] = useState(contacts[0] || null);
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'contact', text: 'Hey there! Did you check out the new design system update?', time: '10:30 AM' },
    { id: '2', senderId: 'me', text: 'Yes, absolutely love the colors and snappy micro-animations!', time: '10:32 AM' },
    { id: '3', senderId: 'contact', text: 'Awesome! Let me know if you want to collaborate on the next post 🚀', time: '10:33 AM' }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    // Simulate smart friendly reply after 1.2 seconds
    setTimeout(() => {
      const replies = [
        "That sounds fantastic! Let's build something epic! 💻🔥",
        "Got it! Thanks for sharing this with me.",
        "Totally agree with you on that! 🙌",
        "Super cool! Talk to you soon ✨"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(p => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          senderId: 'contact',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-white dark:bg-[#121926] w-full max-w-4xl h-[85vh] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 flex">
        
        {/* Left Sidebar: Contacts */}
        <div className="w-1/3 min-w-[200px] border-r border-gray-100 dark:border-[#1e2838] flex flex-col bg-gray-50/50 dark:bg-[#0e141f]">
          <div className="p-4 border-b border-gray-100 dark:border-[#1e2838] flex items-center justify-between">
            <span className="font-black text-sm text-gray-900 dark:text-white">Direct Messages</span>
            <span className="text-xs text-pink-500 font-semibold">{contacts.length} chats</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {contacts.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  selectedContact?.id === c.id
                    ? 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 font-bold shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-[#172131] text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="relative">
                  <img
                    src={resolveImageUrl(c.avatar)}
                    alt={c.username}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-pink-500"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#121926]" />
                </div>
                <div className="truncate">
                  <p className="text-xs truncate">{c.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">@{c.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Chat Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#121926]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-[#1e2838] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedContact && (
                <>
                  <img
                    src={resolveImageUrl(selectedContact.avatar)}
                    alt={selectedContact.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedContact.name}</p>
                    <p className="text-[11px] text-emerald-500 font-semibold">Active now</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.senderId === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.senderId === 'me'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none shadow-md shadow-pink-500/10'
                      : 'bg-gray-100 dark:bg-[#1b2536] text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-[#1e2838] flex items-center gap-2">
            <input
              type="text"
              placeholder="Message..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f141f] text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-pink-600 text-white disabled:opacity-40 hover:bg-pink-700 transition-colors shadow-md shadow-pink-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
