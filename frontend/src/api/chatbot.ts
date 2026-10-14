import api from './client';

export interface QuickAction {
  label: string;
  path: string;
  actionType: 'NAVIGATE' | 'QUERY' | 'EXTERNAL';
}

export interface ChatbotResponse {
  reply: string;
  intent: string;
  quickActions?: QuickAction[];
  dataCard?: Record<string, any>;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  intent?: string;
  quickActions?: QuickAction[];
  dataCard?: Record<string, any>;
  timestamp: Date;
}

export const sendChatMessage = async (message: string, context?: string): Promise<ChatbotResponse> => {
  try {
    const response = await api.post<ChatbotResponse>('/chatbot/message', { message, context });
    return response.data;
  } catch (error) {
    console.warn('Backend chatbot API unavailable, using intelligent client fallback:', error);
    return getOfflineFallbackResponse(message);
  }
};

export const fetchChatbotSuggestions = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/chatbot/suggestions');
    return response.data;
  } catch (error) {
    return [
      'What is my attendance percentage?',
      'What is my current CGPA & mid marks?',
      'Do I have pending fee dues?',
      'What classes do I have today?',
      'Show latest college notices',
      'What are the demo login credentials?',
    ];
  }
};

// Client-side intelligent fallback in case backend is offline
function getOfflineFallbackResponse(message: string): ChatbotResponse {
  const q = message.toLowerCase().trim();

  if (q.includes('attendance') || q.includes('bunk') || q.includes('shortage')) {
    return {
      reply: "### 📊 Attendance Regulations\n\nMLRIT Autonomous requires a minimum of **75% overall attendance** to be eligible for End Semester Examinations.\n- **75% and above**: Eligible for exams.\n- **65% to 74.9%**: Medical condonation required with prior principal approval.\n- **Below 65%**: Detained for the semester.\n\n*Log in with your hall ticket to view real-time attendance!*",
      intent: 'ATTENDANCE',
      quickActions: [{ label: 'View Attendance', path: '/student/attendance', actionType: 'NAVIGATE' }],
    };
  }

  if (q.includes('fee') || q.includes('dues') || q.includes('pay') || q.includes('receipt')) {
    return {
      reply: "### 💳 Fee Payments & Dues\n\nTuition fees and examination dues can be paid online directly on the portal via UPI or Netbanking, or offline at the Accounts Office.\n\nImmediate e-receipts with reference numbers are issued for all transactions.",
      intent: 'FEES',
      quickActions: [{ label: 'Fee Portal', path: '/student/fees', actionType: 'NAVIGATE' }],
    };
  }

  if (q.includes('mark') || q.includes('cgpa') || q.includes('grade') || q.includes('result')) {
    return {
      reply: "### 🎯 Examination & Marks\n\nMLRIT follows a 10-point Letter Grading scale (O, A+, A, B+, B, C, F) under Choice Based Credit System (CBCS). Check your Mid marks and SGPA/CGPA history on your dashboard.",
      intent: 'MARKS',
      quickActions: [{ label: 'View Marks', path: '/student/marks', actionType: 'NAVIGATE' }],
    };
  }

  if (q.includes('placement') || q.includes('package') || q.includes('recruit')) {
    return {
      reply: "### 🚀 MLRIT Placements\n\n- **Highest Package**: **30+ LPA**\n- **Average Package**: **5.5 - 6.5 LPA**\n- **Placement Rate**: 85%+ consistently\n- **Key Recruiters**: Amazon, TCS Digital, EPAM, Virtusa, Infosys, Capgemini, Cognizant, Darwinbox.",
      intent: 'PLACEMENTS',
      quickActions: [{ label: 'Campus Details', path: '/admin/campus', actionType: 'NAVIGATE' }],
    };
  }

  if (q.includes('login') || q.includes('credential') || q.includes('demo') || q.includes('password')) {
    return {
      reply: "### 🔑 Demo Accounts for Portal Testing\n\n- **Student**: `21R21A0501` / `Student@123`\n- **Faculty**: `MLRIT-FAC-101` / `Faculty@123`\n- **Admin**: `admin` / `Admin@123`",
      intent: 'CREDENTIALS',
      quickActions: [{ label: 'Go to Login', path: '/login', actionType: 'NAVIGATE' }],
    };
  }

  return {
    reply: "### 🎓 MLRIT Mitra Campus Assistant\n\nI can help you with:\n- 📊 Attendance checking & criteria\n- 🎯 Mid marks & CGPA evaluation\n- 💳 Fee balance & online payments\n- 📅 Timetable & classrooms\n- 🚀 Placements, departments & campus info\n- 🔑 Demo login credentials",
    intent: 'GENERAL',
    quickActions: [
      { label: 'Check Attendance', path: '/student/attendance', actionType: 'NAVIGATE' },
      { label: 'Fee Dues', path: '/student/fees', actionType: 'NAVIGATE' },
      { label: 'Login Screen', path: '/login', actionType: 'NAVIGATE' },
    ],
  };
}
