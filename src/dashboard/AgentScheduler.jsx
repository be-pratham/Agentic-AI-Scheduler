import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, Clock, Trash2, CheckCircle2, Zap, Loader2, RotateCcw } from 'lucide-react';
// IMPORTING THE N8N SERVICE
import { callN8nAgent } from '../schedule/n8n'; 

const AgentScheduler = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Scheduler. Type /c at any time to reset. Ready to start?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setInput('');

    // OPTIMISTIC UPDATE: Show user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);

    // RESET LOGIC: If user types /c, clear everything immediately
    if (userQuery.trim() === '/c') {
      setMessages([{ role: 'assistant', content: 'Conversation and schedule cleared. Let\'s start over. What time do you wake up?' }]);
      setSchedule([]);
      return; 
    }

    setIsThinking(true);

    try {
      // Call n8n with history context
      const response = await callN8nAgent(userQuery, schedule, messages);

      // Handle the response
      if (response.agent_status === 'reset') {
        // Fallback if the service triggers a reset
        setSchedule([]);
        setMessages([{ role: 'assistant', content: response.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
        // Only update schedule if the Agent actually returned one
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

  // ... (Keep the rest of your JSX Render logic exactly the same) ...
  // Ensure the return statement includes the same UI structure as before
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Left Panel - Chat */}
      <div className="w-1/3 flex flex-col border-r border-slate-200 bg-white shadow-xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-lg"><Zap size={20} className="text-white" /></div>
             <h1 className="font-bold text-xl">Agentic Scheduler</h1>
           </div>
           <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">n8n Connected</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
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

        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100">
          <div className="relative">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type /c to reset or chat..." 
              className="w-full p-4 pr-12 bg-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600"><Send size={20} /></button>
          </div>
        </form>
      </div>

      {/* Right Panel - Artifact */}
      <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
         <h2 className="text-3xl font-bold text-slate-800 mb-8">Live Schedule</h2>
         <div className="space-y-4">
           {schedule.map(item => (
             <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center group">
               <div className="flex gap-6 items-center">
                 <div className="font-bold text-indigo-600 text-lg w-20">{item.time}</div>
                 <div>
                   <div className="font-bold text-slate-800">{item.activity}</div>
                   <div className="text-sm text-slate-500 flex gap-2 items-center">
                      <Clock size={14}/> {item.duration} 
                      <span className={`px-2 rounded-full text-[10px] ${item.type === 'work' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{item.type}</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
             </div>
           ))}
           {schedule.length === 0 && <div className="text-center text-slate-400 mt-20">Waiting for agent inputs...</div>}
         </div>
      </div>
    </div>
  );
};

export default AgentScheduler;