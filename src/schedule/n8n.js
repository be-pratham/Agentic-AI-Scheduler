// // // src/services/mockSchedulerApi.js

// // const SLEEP_TIME = 2000;

// // export const mockN8nWebhook = async (prompt) => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       const lowerPrompt = prompt.toLowerCase();
// //       let generatedSchedule = [];

// //       // --- LOGIC 1: Handle Greetings (Don't schedule anything) ---
// //       if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi") || lowerPrompt.length < 5) {
// //          resolve({
// //           data: {
// //             agent_status: "greeting",
// //             message: "Hello! I am your AI scheduler. Tell me what you want to do (e.g., 'Gym at 8pm').",
// //             generated_schedule: []
// //           }
// //         });
// //         return;
// //       }

// //       // --- LOGIC 2: Dynamic Parsing (The "Smart" Part) ---
      
// //       // 1. Detect Time (looks for "10pm", "9am", "14:00")
// //       const timeMatch = lowerPrompt.match(/(\d{1,2})(:?(\d{2}))?\s*(am|pm)/);
// //       const detectedTime = timeMatch ? timeMatch[0].toUpperCase() : "09:00 AM"; // Default time if none found

// //       // 2. Detect Activity Type
// //       if (lowerPrompt.includes("gym") || lowerPrompt.includes("workout")) {
// //         generatedSchedule.push({
// //           id: Date.now(),
// //           time: detectedTime, 
// //           activity: "Gym Session: " + (lowerPrompt.includes("leg") ? "Leg Day" : "General Fitness"),
// //           duration: "60m",
// //           type: "health"
// //         });
// //       } 
// //       else if (lowerPrompt.includes("study") || lowerPrompt.includes("code") || lowerPrompt.includes("react")) {
// //          generatedSchedule.push({
// //           id: Date.now(),
// //           time: detectedTime,
// //           activity: "Deep Work: " + prompt.substring(0, 20) + "...",
// //           duration: "120m",
// //           type: "work"
// //         });
// //       }
// //       else {
// //         // Fallback for unknown tasks
// //         generatedSchedule.push({
// //           id: Date.now(),
// //           time: detectedTime,
// //           activity: "Task: " + prompt,
// //           duration: "30m",
// //           type: "leisure"
// //         });
// //       }

// //       resolve({
// //         data: {
// //           agent_status: "success",
// //           generated_schedule: generatedSchedule
// //         }
// //       });
      
// //     }, SLEEP_TIME);
// //   });
// // };

// //---------------------------------------------------------------------------------------------------------------------------------------------
// //---------------------------------------------------------------------------------------------------------------------------------------------
// //---------------------------------------------------------------------------------------------------------------------------------------------
// //---------------------------------------------------------------------------------------------------------------------------------------------
// //---------------------------------------------------------------------------------------------------------------------------------------------

// import axios from 'axios';

// // Use the proxy path we set up in Vite
// const N8N_URL = "/webhook-test/schedule"; 

// export const mockN8nWebhook = async (prompt) => {
//   try {
//     console.log("1. Sending Prompt:", prompt);
    
//     const response = await axios.post(N8N_URL, { prompt: prompt });
//     let rawData = response.data;
    
//     console.log("2. Raw n8n Response:", rawData);

//     let parsedData = {};

//     // SCENARIO A: n8n returns an object with a 'text' string (Standard LLM Chain)
//     if (rawData.text && typeof rawData.text === 'string') {
//       console.log("   -> Detected 'text' wrapper. Parsing inside...");
//       try {
//         // Clean any markdown blocks the AI might have left
//         const cleanJson = rawData.text.replace(/```json/g, "").replace(/```/g, "").trim();
//         parsedData = JSON.parse(cleanJson);
//       } catch (e) {
//         console.error("   -> Failed to parse the 'text' field:", e);
//       }
//     } 
//     // SCENARIO B: n8n returns the object directly (Standard Webhook Response)
//     else if (typeof rawData === 'object') {
//       parsedData = rawData;
//     }

//     // Validation: Ensure the schedule exists
//     if (!parsedData.generated_schedule) {
//       console.warn("   -> Still missing 'generated_schedule'. Defaulting to empty.");
//       parsedData.generated_schedule = [];
//     }

//     console.log("3. Final Data for React:", parsedData);
    
//     // Return standard format
//     return { data: parsedData }; 

//   } catch (error) {
//     console.error("API Error:", error);
//     return { 
//       data: { 
//         agent_status: "error", 
//         generated_schedule: [] 
//       } 
//     };
//   }
// };

//==========================================================================================================================
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/agent-scheduler";
export const callN8nAgent = async (input, currentSchedule = [], conversationHistory = []) => {
  // Client-side reset command
  if (input.trim() === '/c') {
    return {
      agent_status: "reset",
      message: "Session cleared. Let's start fresh. What time do you wake up?",
      generated_schedule: []
    };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userQuery: input, 
        currentSchedule: currentSchedule,
        history: conversationHistory.slice(-5) 
      }),
    });

    if (!response.ok) throw new Error(`n8n HTTP Error: ${response.status}`);

    const textData = await response.text();
    console.log("RAW N8N RESPONSE:", textData); // <--- Check your Browser Console for this!

    // --- THE NUCLEAR PARSER ---
    // This finds the JSON object buried inside ANY text
    const jsonStart = textData.indexOf('{');
    const jsonEnd = textData.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in response");
    }

    const cleanJsonString = textData.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(cleanJsonString);
    // --------------------------

    return data;

  } catch (error) {
    console.error("Agent Parsing Error:", error);
    return {
      agent_status: "error",
      message: "I couldn't process the schedule. Check the console (F12) for details.",
      generated_schedule: currentSchedule
    };
  }
};