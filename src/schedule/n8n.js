const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_URL;

export const callN8nAgent = async (input, currentSchedule = [], conversationHistory = []) => {
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
    console.log("RAW N8N RESPONSE:", textData);

    const jsonStart = textData.indexOf('{');
    const jsonEnd = textData.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in response");
    }

    const cleanJsonString = textData.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(cleanJsonString);

    if (data.text && typeof data.text === 'string') {
      const innerStart = data.text.indexOf('{');
      const innerEnd = data.text.lastIndexOf('}');
      
      if (innerStart !== -1 && innerEnd !== -1) {
         const cleanInner = data.text.substring(innerStart, innerEnd + 1);
         return JSON.parse(cleanInner);
      }
    }
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