import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FastForward,
} from 'lucide-react';
import { sendChatMessage, fetchChatbotSuggestions, ChatMessage, QuickAction } from '../../api/chatbot';
import { useAuth } from '../../context/AuthContext';

type TabCategory = 'ACADEMICS' | 'STUDY_CODE' | 'CAMPUS';

interface StreamState {
  messageId: string;
  displayedText: string;
  isStreaming: boolean;
  fullText: string;
}

export const ChatbotWidget: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<TabCategory>('ACADEMICS');
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Streaming real-time typing effect state
  const [streamState, setStreamState] = useState<StreamState | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamTimerRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `### 🎓 Welcome to MLRIT Mitra!
I am your **24/7 intelligent campus AI companion** for the MLRIT Student Management Portal.

Ask me **any question** — from live academic records to engineering concepts:
- 📊 **Real-time Attendance, Mid Marks & CGPA**
- 💳 **Fee Dues, Payments & Official E-Receipts**
- 💻 **Coding, Algorithms & Technical Subject Help**
- 📅 **Today's Timetable, Rooms & Faculty**
- 🚀 **Placements, CRT Preparation & Campus Facilities**`,
        timestamp: new Date(),
        quickActions: user?.role === 'STUDENT'
          ? [
              { label: 'Check My Attendance', path: '/student/attendance', actionType: 'NAVIGATE' },
              { label: 'View Mid Marks', path: '/student/marks', actionType: 'NAVIGATE' },
              { label: 'Fee Balance', path: '/student/fees', actionType: 'NAVIGATE' },
            ]
          : [
              { label: 'Portal Demo Logins', path: '/login', actionType: 'NAVIGATE' },
              { label: 'MLRIT Placements', path: '/login', actionType: 'NAVIGATE' },
            ],
      },
    ];
  });

  // Category questions for tabs (matching LoginPage role tab switcher)
  const categorySuggestions: Record<TabCategory, string[]> = {
    ACADEMICS: [
      'What is my attendance percentage?',
      'What are my mid evaluation marks and CGPA?',
      'Do I have pending fee dues?',
      'What classes do I have today?',
      'What is the exam revaluation procedure?',
    ],
    STUDY_CODE: [
      "Explain Dijkstra's algorithm with Python code",
      'How to implement Binary Search in Java?',
      'What are ACID properties in DBMS?',
      'Explain Deadlock Coffman conditions in OS',
      'How to prepare for campus placements?',
    ],
    CAMPUS: [
      'What is MLRIT highest placement package?',
      'Where is MLRIT campus located?',
      'Tell me about aeronautical wind tunnel labs',
      'What are the demo login credentials?',
      'Who is the Controller of Examinations?',
    ],
  };

  // Auto-scroll on message updates or streaming
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading, streamState?.displayedText]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_~>[\]]/g, '').replace(/\n+/g, '. ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Real-time word-by-word streaming effect
  const startStreamEffect = (botMsg: ChatMessage) => {
    const words = botMsg.text.split(' ');
    let currentIdx = 0;
    setStreamState({
      messageId: botMsg.id,
      displayedText: '',
      isStreaming: true,
      fullText: botMsg.text,
    });

    if (streamTimerRef.current) clearInterval(streamTimerRef.current);

    streamTimerRef.current = setInterval(() => {
      currentIdx += 2; // Stream 2 words per tick for smooth natural velocity
      if (currentIdx >= words.length) {
        clearInterval(streamTimerRef.current);
        setStreamState(null);
        setMessages((prev) => [...prev, botMsg]);
        speakText(botMsg.text);
      } else {
        const partial = words.slice(0, currentIdx).join(' ');
        setStreamState({
          messageId: botMsg.id,
          displayedText: partial,
          isStreaming: true,
          fullText: botMsg.text,
        });
      }
    }, 28);
  };

  const skipStreaming = () => {
    if (streamTimerRef.current && streamState) {
      clearInterval(streamTimerRef.current);
      const targetMsg = messages.find((m) => m.id === streamState.messageId);
      if (!targetMsg) {
        // Append completed message
        setMessages((prev) => [
          ...prev,
          {
            id: streamState.messageId,
            sender: 'bot',
            text: streamState.fullText,
            timestamp: new Date(),
          },
        ]);
      }
      speakText(streamState.fullText);
      setStreamState(null);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    // Finish any ongoing stream immediately
    if (streamState) skipStreaming();

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(query, location.pathname);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: res.reply,
        intent: res.intent,
        quickActions: res.quickActions,
        dataCard: res.dataCard,
        timestamp: new Date(),
      };

      // Launch real-time streaming effect
      startStreamEffect(botMsg);

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: 'I encountered an issue processing your query. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.actionType === 'NAVIGATE' && action.path) {
      navigate(action.path);
      if (window.innerWidth < 640) {
        setIsOpen(false);
      }
    } else if (action.actionType === 'QUERY' && action.path) {
      handleSend(action.path);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const clearChat = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setStreamState(null);
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'bot',
        text: 'Conversation cleared! Ask me anything about MLRIT, study topics, or live portal records.',
        timestamp: new Date(),
        quickActions: [
          { label: 'Check Attendance', path: '/student/attendance', actionType: 'NAVIGATE' },
          { label: 'Check Fee Dues', path: '/student/fees', actionType: 'NAVIGATE' },
        ],
      },
    ]);
  };

  // Formatted markdown renderer
  const renderFormattedContent = (raw: string, isStream = false) => {
    const lines = raw.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = '';

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'code';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const fullCode = codeBuffer.join('\n');
          const codeId = `code-${idx}`;
          elements.push(
            <div key={idx} className="my-2 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-[11px] font-mono shadow-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-slate-400 text-[10px]">
                <span className="uppercase font-semibold tracking-wider">{codeLanguage}</span>
                <button
                  type="button"
                  onClick={() => copyCode(fullCode, codeId)}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  {copiedCodeId === codeId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeId === codeId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 overflow-x-auto whitespace-pre leading-relaxed">{fullCode}</pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="font-bold text-[#1e3a8a] text-sm mt-2 mb-1 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }

      if (line.startsWith('> ')) {
        elements.push(
          <div key={idx} className="border-l-4 border-sky-500 bg-sky-50 text-sky-900 p-2 text-xs rounded-r my-1.5 font-medium">
            {line.replace('> ', '')}
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 my-0.5 leading-relaxed">
            <span className="text-[#1e40af] font-bold text-sm leading-none mt-0.5">•</span>
            <span>{parseInlineFormatting(line.substring(2))}</span>
          </div>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-1.5" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-slate-700 leading-relaxed my-0.5">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <div key="dangling-code" className="my-2 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 text-slate-100 text-[11px] font-mono p-3">
          <pre className="overflow-x-auto whitespace-pre">{codeBuffer.join('\n')}</pre>
        </div>
      );
    }

    return (
      <div>
        {elements}
        {isStream && (
          <span className="inline-block w-2 h-4 ml-1 bg-[#1e40af] animate-pulse align-middle" />
        )}
      </div>
    );
  };

  const parseInlineFormatting = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
      const codeMatch = remaining.match(/`(.*?)`/);

      const firstIndex = Math.min(
        boldMatch && boldMatch.index !== undefined ? boldMatch.index : Infinity,
        codeMatch && codeMatch.index !== undefined ? codeMatch.index : Infinity
      );

      if (firstIndex === Infinity) {
        parts.push(remaining);
        break;
      }

      if (firstIndex > 0) {
        parts.push(remaining.substring(0, firstIndex));
      }

      if (boldMatch && boldMatch.index === firstIndex) {
        parts.push(
          <strong key={key++} className="font-semibold text-slate-900">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.substring(firstIndex + boldMatch[0].length);
      } else if (codeMatch && codeMatch.index === firstIndex) {
        parts.push(
          <code key={key++} className="bg-slate-100 text-[#1e40af] font-mono text-[11px] px-1 py-0.5 rounded border border-slate-200">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.substring(firstIndex + codeMatch[0].length);
      }
    }

    return parts;
  };

  return (
    <>
      {/* Floating Launcher Button (Styled like LoginPage branding) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="group relative flex items-center gap-3 bg-[#1e40af] hover:bg-[#1e3a8a] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 px-4 py-3 rounded-full border border-blue-300/40"
            aria-label="Open MLRIT Mitra Assistant"
          >
            {/* Signature 'M' logo block from LoginPage */}
            <div className="w-7 h-7 rounded bg-white text-[#1e40af] flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              M
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                MLRIT Mitra
                <span className="text-[10px] bg-sky-400 text-slate-900 font-extrabold px-1.5 py-0.2 rounded shadow-2xs">
                  AI 24/7
                </span>
              </span>
              <span className="text-[10px] text-blue-100 font-medium">Ask any academic or portal question</span>
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-sky-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Main Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl rounded-xl border border-slate-200 bg-white overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[620px] sm:h-[750px] max-w-full max-h-full'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[600px] max-h-[88vh]'
          }`}
        >
          {/* Header - Styled strictly like LoginPage Header */}
          <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              {/* Signature M Brand Box */}
              <div className="w-9 h-9 rounded-lg bg-[#1e40af] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#1e40af] tracking-wide leading-tight">
                    MLRIT STUDENT MANAGEMENT PORTAL
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-medium">
                    MLRIT Mitra AI Assistant
                  </span>
                  <span className="flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 py-0.2 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center space-x-1 text-slate-500">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-1.5 rounded-md hover:bg-slate-100 transition ${
                  ttsEnabled ? 'text-[#1e40af] bg-blue-50 font-bold' : 'hover:text-slate-800'
                }`}
                title={ttsEnabled ? 'Mute Speech Readout' : 'Enable Voice Readout'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={clearChat}
                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-800 transition"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-800 transition"
                title={isExpanded ? 'Restore Size' : 'Expand Size'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-800 transition"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Role / Category Tabs (Matching LoginPage's Role Switcher) */}
          <div className="bg-white border-b border-slate-100 px-3 pt-2.5 pb-2">
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('ACADEMICS')}
                className={`flex items-center justify-center py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all ${
                  activeTab === 'ACADEMICS'
                    ? 'bg-[#1e40af] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 mr-1" />
                Academics
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('STUDY_CODE')}
                className={`flex items-center justify-center py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all ${
                  activeTab === 'STUDY_CODE'
                    ? 'bg-[#1e40af] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                Code & Study
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CAMPUS')}
                className={`flex items-center justify-center py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all ${
                  activeTab === 'CAMPUS'
                    ? 'bg-[#1e40af] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 mr-1" />
                Campus
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#1e40af] text-white rounded-br-xs font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    <div>
                      {renderFormattedContent(msg.text)}

                      {/* Visual Card: Attendance (LoginPage Style Card) */}
                      {msg.dataCard?.type === 'ATTENDANCE' && (
                        <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-[#1e3a8a]">Examination Eligibility</span>
                            {msg.dataCard.isEligible ? (
                              <span className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Eligible
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Shortage
                              </span>
                            )}
                          </div>

                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-2 border border-slate-200">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                msg.dataCard.percentage >= 75
                                  ? 'bg-emerald-500'
                                  : msg.dataCard.percentage >= 65
                                  ? 'bg-amber-500'
                                  : 'bg-rose-600'
                              }`}
                              style={{ width: `${Math.min(msg.dataCard.percentage, 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                            <span>Classes Attended: {msg.dataCard.attendedClasses} / {msg.dataCard.totalClasses}</span>
                            <span className="text-[#1e40af] font-bold">{msg.dataCard.percentage}%</span>
                          </div>
                        </div>
                      )}

                      {/* Visual Card: Fees */}
                      {msg.dataCard?.type === 'FEES' && (
                        <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-bold text-[#1e3a8a]">Account Balance Status</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                msg.dataCard.isCleared
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-sky-50 text-sky-800 border-sky-200'
                              }`}
                            >
                              {msg.dataCard.isCleared ? 'Cleared' : 'Pending Dues'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="block text-[10px] text-slate-500">Total Fee</span>
                              <span className="font-bold text-slate-800">₹{Number(msg.dataCard.totalFee).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                              <span className="block text-[10px] text-slate-500">Pending Dues</span>
                              <span className={`font-bold ${msg.dataCard.isCleared ? 'text-emerald-600' : 'text-rose-600'}`}>
                                ₹{Number(msg.dataCard.feeDues).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Action Navigation Pills */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {msg.quickActions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1e40af] text-[11px] font-semibold rounded-md border border-blue-200/80 transition-all hover:scale-102 active:scale-98"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3 h-3 text-[#1e40af]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Live Streaming Message Box */}
            {streamState && streamState.isStreaming && (
              <div className="flex flex-col items-start">
                <div className="max-w-[88%] rounded-2xl rounded-bl-xs p-3.5 text-xs bg-white border border-slate-200 text-slate-800 shadow-xs">
                  {renderFormattedContent(streamState.displayedText, true)}
                  <div className="mt-2 pt-1 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={skipStreaming}
                      className="text-[10px] text-[#1e40af] hover:underline font-semibold flex items-center gap-1"
                    >
                      <FastForward className="w-3 h-3" /> Show full answer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !streamState && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-xs w-28 shadow-xs text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#1e40af] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#1e40af] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#1e40af] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px]">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Suggestion Pills (Filtered by active tab) */}
          <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
              <Sparkles className="w-3 h-3 text-sky-500" /> Suggestions:
            </span>
            {categorySuggestions[activeTab].map((sug, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSend(sug)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-[#1e40af] text-[11px] font-medium rounded-md border border-slate-300 hover:border-blue-300 shadow-2xs transition-all shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar (Styled matching LoginPage form controls) */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask any question (academics, coding, fees, MLRIT)..."
                  disabled={isLoading}
                  className="w-full text-xs py-2.5 pl-3.5 pr-9 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition ${
                    isListening
                      ? 'text-red-600 bg-red-100 animate-pulse'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Speak your question'}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-3.5 py-2.5 bg-[#1e40af] hover:bg-[#1e3a8a] disabled:bg-slate-300 text-white rounded-lg shadow-xs transition duration-150 flex items-center justify-center font-bold text-xs shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
              <span>MLRIT Mitra • Answering Any Academic or Tech Question</span>
              <span>Press ↵ to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
