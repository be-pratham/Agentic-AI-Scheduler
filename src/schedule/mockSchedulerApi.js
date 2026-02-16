let currentStep = 'START';
let userData = { wakeTime: '', focus: '', habit: '' };

export const mockSchedulerApi = async (input, currentSchedule = []) => {
  const query = input.toLowerCase();
  
  // No "Thinking" delay for the very first command
  if (query === 'start' || query === 'plan my day') {
    currentStep = 'AWAITING_WAKE';
    return {
      agent_status: "question",
      message: "Let's build it. What's your wake-up time today?",
      generated_schedule: currentSchedule
    };
  }

  // Simulate thinking for all subsequent reasoning
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // --- SCENARIO: EDIT / CHANGE FEATURE ---
  if (query.includes("change") || query.includes("move") || query.includes("to")) {
    // Basic NLP extraction (Example: "change Morning Routine to 10am")
    const newTimeMatch = query.match(/(\d+)(am|pm)/);
    
    if (newTimeMatch) {
      const newTime = newTimeMatch[0].toUpperCase();
      const updatedSchedule = currentSchedule.map(item => {
        // Find if the user mentioned a specific activity in the query
        if (query.includes(item.activity.toLowerCase())) {
          return { ...item, time: newTime };
        }
        return item;
      });

      // Conflict Check: Is there another task at this new time?
      const conflict = currentSchedule.find(item => 
        item.time.replace(/\s/g, '').toLowerCase() === newTime.toLowerCase()
      );

      if (conflict) {
        return {
          agent_status: "success",
          message: `I've moved that to ${newTime}, but careful—you already have "${conflict.activity}" then. Should I clear that slot?`,
          generated_schedule: updatedSchedule
        };
      }

      return {
        agent_status: "success",
        message: `Done! I've updated your timeline.`,
        generated_schedule: updatedSchedule
      };
    }
  }

  // --- SCENARIO: SEQUENTIAL QUESTIONS ---
  if (currentStep === 'AWAITING_WAKE') {
    userData.wakeTime = input;
    currentStep = 'AWAITING_FOCUS';
    return {
      agent_status: "question",
      message: `Registered: ${input}. What is your #1 high-focus project today?`,
      generated_schedule: currentSchedule
    };
  }

  if (currentStep === 'AWAITING_FOCUS') {
    userData.focus = input;
    currentStep = 'AWAITING_HABIT';
    return {
      agent_status: "question",
      message: `Got it. "${input}". Do you have a specific health habit (gym, walk, meditation) to include?`,
      generated_schedule: currentSchedule
    };
  }

  if (currentStep === 'AWAITING_HABIT') {
    userData.habit = input;
    currentStep = 'IDLE';
    const newSchedule = [
      { id: 1, time: userData.wakeTime, activity: "Morning Routine", duration: "45m", type: "health" },
      { id: 2, time: "10:00 AM", activity: userData.focus, duration: "120m", type: "work" },
      { id: 3, time: "02:00 PM", activity: userData.habit, duration: "60m", type: "health" },
      { id: 4, time: "06:00 PM", activity: "Admin & Email", duration: "60m", type: "work" },
    ];
    return {
      agent_status: "success",
      message: "Schedule synchronized! You can now move items by saying 'Move [Task] to [Time]'.",
      generated_schedule: newSchedule
    };
  }

  return {
    agent_status: "success",
    message: "I'm listening. Tell me to change a task time or add something new.",
    generated_schedule: currentSchedule
  };
};