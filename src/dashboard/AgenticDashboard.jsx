// // import React, { useState, useEffect } from 'react';
// // import { Calendar, CheckCircle2, Loader2, Trash2, Edit3, Send, Zap } from 'lucide-react';
// // import { mockN8nWebhook } from './schedule/mockSchedulerApi';

// // const AGENT_STEPS = [
// //   "Parsing Request...",
// //   "Checking Calendar Availability...",
// //   "Optimizing Route...",
// //   "Finalizing Schedule"
// // ];

// // const AgenticDashboard = () => {
// //   const [input, setInput] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [stepIndex, setStepIndex] = useState(0);
// //   const [schedule, setSchedule] = useState([]);

// //   // Simulate the "Thinking" process
// //   useEffect(() => {
// //     let interval;
// //     if (loading && stepIndex < AGENT_STEPS.length - 1) {
// //       interval = setInterval(() => {
// //         setStepIndex((prev) => prev + 1);
// //       }, 500);
// //     }
// //     return () => clearInterval(interval);
// //   }, [loading, stepIndex]);

// // const handleGenerate = async (e) => {
// //     e.preventDefault();
// //     if (!input) return;

// //     setLoading(true);
// //     setStepIndex(0);
// //     setSchedule([]); // Reset previous schedule

// //     try {
// //       // 1. Get the raw response from your API service
// //       const apiResponse = await mockN8nWebhook(input);
// //       console.log("🔍 RAW API RESPONSE:", apiResponse);

// //       // 2. DIG for the data. n8n structures can be tricky.
// //       // We check multiple possible locations for 'generated_schedule'
// //       const payload = apiResponse.data || apiResponse;
      
// //       let foundSchedule = 
// //         payload.generated_schedule ||
// //         payload.data?.generated_schedule ||
// //         payload.json?.generated_schedule ||
// //         (Array.isArray(payload) ? payload[0]?.generated_schedule : []);

// //       console.log("✅ FOUND SCHEDULE:", foundSchedule);

// //       if (foundSchedule && foundSchedule.length > 0) {
// //         setSchedule(foundSchedule);
// //       } else {
// //         console.warn("❌ Schedule array is empty or missing.");
// //         alert("Agent finished, but returned no tasks. Check Console (F12) for 'RAW API RESPONSE'.");
// //       }

// //     } catch (err) {
// //       console.error("💥 CRITICAL ERROR:", err);
// //       alert("Failed to connect to Agent. Check console.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const deleteItem = (id) => {
// //     setSchedule(schedule.filter(item => item.id !== id));
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
// //       <div className="max-w-4xl mx-auto space-y-8">
        
// //         {/* Header */}
// //         <header className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-3xl font-bold tracking-tight">Agentic Scheduler</h1>
// //             <p className="text-slate-500">n8n-powered AI orchestration</p>
// //           </div>
// //           <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
// //             <Zap size={24} fill="currentColor" />
// //           </div>
// //         </header>

// //         {/* Input Section */}
// //         <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
// //           <form onSubmit={handleGenerate} className="flex gap-4">
// //             <input 
// //               className="flex-1 bg-slate-100 border-none rounded-xl px-4 focus:ring-2 focus:ring-indigo-500"
// //               placeholder="e.g., I need to study React for 2 hours and go to the gym..."
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //             />
// //             <button 
// //               disabled={loading}
// //               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
// //             >
// //               {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
// //               {loading ? 'Thinking...' : 'Generate'}
// //             </button>
// //           </form>

// //           {/* Agent Status Indicator */}
// //           {loading && (
// //             <div className="mt-4 flex items-center gap-3 text-sm font-medium text-indigo-600 animate-pulse">
// //               <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
// //               <span>{AGENT_STEPS[stepIndex]}</span>
// //             </div>
// //           )}
// //         </section>

// //         {/* Timeline Visualization */}
// //         <div className="grid grid-cols-1 gap-6">
// //           {schedule.length > 0 ? (
// //             <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-6">
// //               {schedule.map((item) => (
// //                 <div key={item.id} className="relative group">
// //                   {/* Timeline Dot */}
// //                   <div className="absolute -left-10.25 top-1 bg-white border-4 border-indigo-500 w-5 h-5 rounded-full z-10"></div>
                  
// //                   {/* Task Card */}
// //                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group-hover:border-indigo-300 transition-colors flex justify-between items-start">
// //                     <div>
// //                       <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{item.time}</span>
// //                       <h3 className="text-lg font-semibold mt-1">{item.activity}</h3>
// //                       <div className="flex gap-3 mt-2">
// //                         <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-medium">
// //                           {item.duration}
// //                         </span>
// //                         <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize 
// //                           ${item.type === 'work' ? 'bg-blue-100 text-blue-700' : 
// //                             item.type === 'health' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
// //                           {item.type}
// //                         </span>
// //                       </div>
// //                     </div>
                    
// //                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
// //                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600">
// //                         <Edit3 size={18} />
// //                       </button>
// //                       <button 
// //                         onClick={() => deleteItem(item.id)}
// //                         className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"
// //                       >
// //                         <Trash2 size={18} />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             !loading && (
// //               <div className="text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300">
// //                 <Calendar className="mx-auto text-slate-400 mb-4" size={48} />
// //                 <p className="text-slate-500 font-medium">Your agentic schedule will appear here.</p>
// //               </div>
// //             )
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AgenticDashboard;


// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Calendar, Clock, Trash2, CheckCircle2, Zap, Loader2 } from 'lucide-react';
// import { mockSchedulerApi } from './schedule/mockSchedulerApi';

// const AgentScheduler = () => {
//   const [messages, setMessages] = useState([
//     { role: 'assistant', content: 'Hello! I am your Agentic Scheduler. How can I help you organize your day?' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isThinking, setIsThinking] = useState(false);
//   const [thinkingStep, setThinkingStep] = useState('');
//   const [schedule, setSchedule] = useState([]);
//   const chatEndRef = useRef(null);

//   // Auto-scroll chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isThinking]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = input;
//     setInput('');
//     setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
//     // Start Agentic Reasoning
//     setIsThinking(true);
//     setThinkingStep('Analyzing request...');
    
//     setTimeout(() => setThinkingStep('Checking calendar conflicts...'), 1000);

//     try {
//       const response = await mockSchedulerApi(userMessage, schedule);
      
//       setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
//       if (response.generated_schedule) {
//         setSchedule(response.generated_schedule);
//       }
//     } catch (error) {
//       setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I hit a snag processing that.' }]);
//     } finally {
//       setIsThinking(false);
//       setThinkingStep('');
//     }
//   };

//   const removeItem = (id) => {
//     setSchedule(prev => prev.filter(item => item.id !== id));
//   };

//   return (
//     <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
//       {/* LEFT PANEL: THE AGENT */}
//       <div className="w-1/3 flex flex-col border-r border-slate-200 bg-white shadow-xl">
//         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
//           <div className="bg-indigo-600 p-2 rounded-lg">
//             <Zap size={20} className="text-white" />
//           </div>
//           <h1 className="font-bold text-xl tracking-tight">Agentic Scheduler</h1>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {messages.map((msg, idx) => (
//             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-[85%] p-4 rounded-2xl ${
//                 msg.role === 'user' 
//                 ? 'bg-indigo-600 text-white rounded-br-none' 
//                 : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
//               }`}>
//                 <p className="text-sm leading-relaxed">{msg.content}</p>
//               </div>
//             </div>
//           ))}
          
//           {isThinking && (
//             <div className="flex justify-start">
//               <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
//                 <Loader2 className="animate-spin text-indigo-600" size={18} />
//                 <span className="text-sm text-slate-500 italic">{thinkingStep}</span>
//               </div>
//             </div>
//           )}
//           <div ref={chatEndRef} />
//         </div>

//         <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
//           <div className="relative">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="e.g., 'Plan my day' or 'Add gym at 6pm'"
//               className="w-full p-4 pr-12 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
//             />
//             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800">
//               <Send size={20} />
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* RIGHT PANEL: THE ARTIFACT */}
//       <div className="flex-1 flex flex-col bg-slate-50">
//         <div className="p-8 max-w-4xl mx-auto w-full">
//           <header className="mb-8 flex justify-between items-end">
//             <div>
//               <h2 className="text-3xl font-bold text-slate-800">Daily Timeline</h2>
//               <p className="text-slate-500">Live view of your optimized day</p>
//             </div>
//             <div className="flex gap-2 text-sm font-medium bg-white p-1 rounded-lg border border-slate-200">
//               <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md">Today</span>
//               <span className="px-3 py-1 text-slate-400">Week</span>
//             </div>
//           </header>

//           <div className="space-y-4">
//             {schedule.length === 0 ? (
//               <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
//                 <Calendar size={48} strokeWidth={1} className="mb-4" />
//                 <p>No activities scheduled yet.</p>
//                 <p className="text-sm">Ask the agent to "Plan my day" to begin.</p>
//               </div>
//             ) : (
//               schedule.map((item) => (
//                 <div 
//                   key={item.id} 
//                   className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
//                 >
//                   <div className="flex items-center gap-6">
//                     <div className="text-center min-w-20">
//                       <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider">{item.time.split(' ')[1]}</span>
//                       <span className="block text-lg font-bold text-indigo-600">{item.time.split(' ')[0]}</span>
//                     </div>
                    
//                     <div className="h-10 w-0.5 bg-slate-100"></div>

//                     <div>
//                       <h4 className="font-bold text-slate-800 flex items-center gap-2">
//                         {item.activity}
//                         {item.type === 'health' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Health</span>}
//                         {item.type === 'work' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Work</span>}
//                         {item.type === 'leisure' && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Leisure</span>}
//                       </h4>
//                       <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
//                         <span className="flex items-center gap-1"><Clock size={14} /> {item.duration}</span>
//                         <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Confirmed</span>
//                       </div>
//                     </div>
//                   </div>

//                   <button 
//                     onClick={() => removeItem(item.id)}
//                     className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgentScheduler;