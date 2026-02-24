import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, Clock, Trash2, CheckCircle2, Zap, Loader2, RotateCcw } from 'lucide-react';
import { callN8nAgent } from '../schedule/n8n'; 

const AgentScheduler = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Scheduler. Type /c at any time to reset. Ready to start?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);

    if (userQuery.trim() === '/c') {
      setMessages([{ role: 'assistant', content: 'Conversation and schedule cleared. Let\'s start over. What time do you wake up?' }]);
      setSchedule([]);
      return; 
    }

    setIsThinking(true);

    try {
      const response = await callN8nAgent(userQuery, schedule, messages);

      if (response.agent_status === 'reset') {
        setSchedule([]);
        setMessages([{ role: 'assistant', content: response.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
        if (response.generated_schedule && response.generated_schedule.length > 0) {
          setSchedule(response.generated_schedule);
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the server." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const removeItem = (id) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100">
      {/* Left Panel - Chat */}
      <div className="w-1/3 flex flex-col border-r border-slate-800 bg-slate-900 shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-lg"><Zap size={20} className="text-white" /></div>
             <h1 className="font-bold text-xl text-white">Agentic Scheduler</h1>
           </div>
           <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">n8n Connected</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-4 rounded-2xl ${
                 msg.role === 'user' 
                 ? 'bg-indigo-600 text-white rounded-br-none' 
                 : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
               }`}>
                 <p className="text-sm">{msg.content}</p>
               </div>
             </div>
          ))}
          {isThinking && (
             <div className="flex items-center gap-2 text-slate-400 text-sm p-4">
               <Loader2 className="animate-spin" size={16} /> thinking...
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="relative">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type /c to reset or chat..." 
              className="w-full p-4 pr-12 bg-slate-800 text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none border border-slate-700 placeholder:text-slate-500" 
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel*/}
      <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
         <h2 className="text-3xl font-bold text-slate-100 mb-8">Live Schedule</h2>
         <div className="space-y-4">
           {schedule.map(item => (
             <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex justify-between items-center group hover:border-slate-700 transition-colors">
               <div className="flex gap-6 items-center">
                 <div className="font-bold text-indigo-400 text-lg w-20">{item.time}</div>
                 <div>
                   <div className="font-bold text-slate-100">{item.activity}</div>
                   <div className="text-sm text-slate-400 flex gap-2 items-center mt-1">
                      <Clock size={14}/> {item.duration} 
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        item.type === 'work' 
                        ? 'bg-blue-900/30 text-blue-300 border border-blue-800' 
                        : 'bg-emerald-900/30 text-emerald-300 border border-emerald-800'
                      }`}>
                        {item.type}
                      </span>
                   </div>
                 </div>
               </div>
               <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
             </div>
           ))}
           {schedule.length === 0 && (
             <div className="flex flex-col items-center justify-center mt-20 text-slate-500 space-y-4">
               <div className="bg-slate-900 p-4 rounded-full border border-slate-800">
                  <Calendar size={48} className="opacity-20" />
               </div>
               <div className="text-center">Waiting for agent inputs...</div>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default AgentScheduler;