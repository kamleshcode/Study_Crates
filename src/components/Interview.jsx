import React, { useState, useRef, useEffect } from 'react';

const Interview = () => {
  const [messages, setMessages] = useState([]); // Stores chat messages for the current session
  const [input, setInput] = useState(''); // Current user input
  const [jobRole, setJobRole] = useState(''); // User's specified job role for current session
  const [interviewStarted, setInterviewStarted] = useState(false); // Flag to start interview questions
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [questionCount, setQuestionCount] = useState(0); // Tracks how many questions have been asked
  const [interviewComplete, setInterviewComplete] = useState(false); // Flag when interview is done
  const [feedbackContent, setFeedbackContent] = useState(''); // Stores the detailed feedback from AI
  const chatEndRef = useRef(null); // Ref for scrolling to bottom of chat
  const feedbackRef = useRef(null); // Ref for scrolling feedback to top

  const MAX_QUESTIONS = 15; // Define the number of number of questions for the interview

  // Dummy data for previous chats - NOT USED IN UI, KEPT FOR REFERENCE IF NEEDED LATER
  // const [previousInterviews, setPreviousInterviews] = useState([
  //   { id: '1', jobRole: 'Yong Tonghyon', time: '11:32 AM', lastMessage: 'What makes it different fro...', avatar: 'https://placehold.co/40x40/5B21B6/FFFFFF?text=YT' },
  //   { id: '2', jobRole: 'Sarah Miller', time: '10:45 AM', lastMessage: 'The project deadline is approachi...', avatar: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=SM' },
  //   { id: '3', jobRole: 'David Chen', time: '9:20 AM', lastMessage: 'Can we schedule a meeting...', avatar: 'https://placehold.co/40x40/7C3AED/FFFFFF?text=DC' },
  // ]);

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll feedback to top when it appears
  useEffect(() => {
    if (interviewComplete && feedbackRef.current) {
      feedbackRef.current.scrollTop = 0;
    }
  }, [interviewComplete, feedbackContent]);

  // Initial message from the AI when the component mounts
  useEffect(() => {
    setMessages([
      { sender: 'ai', text: "Hello! I'm your AI HR Expert and career guide. To start, please tell me the job role you are preparing for." }
    ]);
  }, []);

  const sendMessage = async (text, sender = 'user') => {
    const newMessages = [...messages, { sender, text }];
    setMessages(newMessages);
    setInput(''); // Clear input after sending

    if (sender === 'user') {
      setLoading(true);
      try {
        if (!interviewStarted) {
          // First message is the job role
          setJobRole(text);
          setInterviewStarted(true);
          // Ask the first question
          await getAIResponse('ask_first_question', newMessages);
        } else if (questionCount < MAX_QUESTIONS) {
          // User answered a question, now ask the next one
          setQuestionCount(prev => prev + 1);
          await getAIResponse('ask_next_question', newMessages);
        } else {
          // All questions answered, time for feedback
          setInterviewComplete(true);
          await getAIResponse('provide_feedback', newMessages);
        }
      } catch (err) {
        console.error("Error communicating with Gemini API:", err);
        setMessages(prev => [...prev, { sender: 'ai', text: "Oops! Something went wrong. Please try again." }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const getAIResponse = async (type, currentChatHistory) => {
    let prompt = "";
    let chatHistoryForGemini = [];

    switch (type) {
      case 'ask_first_question':
        prompt = `You are an HR expert specializing in '${jobRole}'. You are conducting a mock interview. Please ask the first interview question. Keep your questions focused on the job role and common interview scenarios. Do not provide solutions or tips until the end. Just ask one question at a time.`;
        chatHistoryForGemini = [{ role: "user", parts: [{ text: prompt }] }];
        break;
      case 'ask_next_question':
        const relevantChatHistory = currentChatHistory.filter(msg =>
          (msg.sender === 'user' && !msg.text.includes("job role you are preparing for")) ||
          msg.sender === 'ai'
        ).slice(-6); // Take last 6 messages (3 Q&A pairs) for context

        chatHistoryForGemini = relevantChatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
        prompt = `I have answered your previous question. Please ask me the next interview question. This is question ${questionCount + 1} of ${MAX_QUESTIONS}. Remember to ask only one question at a time.`;
        chatHistoryForGemini.push({ role: "user", parts: [{ text: prompt }] });
        break;
      case 'provide_feedback':
        chatHistoryForGemini = currentChatHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
        // Modified prompt for shorter, point-based feedback
        prompt = `I have now answered all ${MAX_QUESTIONS} of your interview questions for the '${jobRole}' role. Based on our conversation and my answers, please provide constructive feedback and actionable tips for how I can improve my interview performance for this role. Summarize my strengths and areas for development. Present your feedback in short, concise bullet points, focusing on key actionable advice.`;
        chatHistoryForGemini.push({ role: "user", parts: [{ text: prompt }] });
        break;
      default:
        break;
    }

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: chatHistoryForGemini })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const aiText = result.candidates[0].content.parts[0].text;
        if (type === 'provide_feedback') {
          setFeedbackContent(aiText);
        }
        setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiText }]);
      } else {
        throw new Error('No content received from AI.');
      }
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: "I'm having trouble connecting right now. Please try again later." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim() !== '' && !loading) {
      sendMessage(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 pt-25 pb-24 font-sans text-white">
      <div className="flex flex-col w-full max-w-7xl h-[calc(100vh-40px)] bg-[#1A1A2E] rounded-xl shadow-2xl overflow-hidden md:flex-row">

        {/* Removed Left Sidebar section */}

        {/* Left Side (formerly Middle): Current Chat Interface (now occupies md:w-3/4) */}
        <div className="flex flex-col flex-1 p-4 bg-[#23233A] md:w-3/4"> {/* Adjusted width to 3/4 */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-xl font-semibold text-gray-200">AI Interview Chat</h2>
            <span className="text-sm text-gray-400">Mock Interview Session</span>
            
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm text-sm break-words ${
                    msg.sender === 'user'
                      ? 'bg-[#7A36F8] text-white rounded-bl-lg rounded-br-md rounded-tl-lg rounded-tr-lg'
                      : 'bg-[#3A3A54] text-gray-100 rounded-bl-md rounded-br-lg rounded-tl-lg rounded-tr-lg'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-[#3A3A54] text-gray-100 animate-pulse">
                  AI is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          {!interviewComplete && (
            <div className="mt-4 flex gap-3 p-2 bg-[#23233A] border-t border-gray-700">
              <input
                type="text"
                className="flex-1 p-3 rounded-lg bg-[#3A3A54] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A36F8] border border-transparent text-sm"
                placeholder={interviewStarted ? "Type your answer..." : "Enter your job role (e.g., 'Software Engineer')..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button
                className="bg-[#7A36F8] hover:bg-[#682ad9] text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-colors duration-200"
                onClick={() => sendMessage(input.trim())}
                disabled={!input.trim() || loading}
              >
                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          )}
           {interviewComplete && (
            <div className="mt-4 text-center text-base font-semibold text-green-400 p-2 bg-[#23233A] border-t border-gray-700">
              Interview complete! View your personalized feedback on the right.
            </div>
          )}
        </div>

        {/* Right Side: Tips and Guidance / Feedback (now occupies md:w-1/4) */}
        <div className="flex flex-col md:w-1/4 p-4 bg-[#1A1A2E] border-l border-gray-800 items-center text-center">
          <h3 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-3 w-full">
            {interviewComplete ? "Your Interview Feedback" : "Guidance & Tips"}
          </h3>
          <div ref={feedbackRef} className="flex-1 overflow-y-auto custom-scrollbar text-left text-sm text-gray-300 leading-relaxed w-full">
            {interviewComplete ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Here's a detailed analysis of your interview performance:
                </p>
                {/* Directly render feedbackContent which should be markdown */}
                <div dangerouslySetInnerHTML={{ __html: feedbackContent.replace(/\n/g, '<br/>') }} />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center text-center">
                {/* Placeholder for AI HR image */}
                <img
                  src="https://placehold.co/100x100/5B21B6/FFFFFF?text=AI+HR"
                  alt="AI HR Expert"
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#7A36F8]"
                />
                <h4 className="text-lg font-semibold text-gray-100 mb-2">Your AI HR Expert</h4>
                <p className="text-sm text-gray-400 mb-4">
                  I will provide personalized feedback and tips based on your mock interview.
                  Stay focused and good luck!
                </p>
                <p className="text-center text-gray-500 py-10">
                  This section will show valuable tips and a comprehensive analysis after all questions have been answered.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
       {/* Custom Scrollbar CSS */}
       <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1A1A2E; /* Background of the main containers */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #7A36F8; /* Purple accent */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #682ad9; /* Darker purple on hover */
        }
        /* Prose styling for markdown content */
        .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 {
          color: #E2E8F0; /* gray-200 */
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-size: 1.1em; /* Adjust heading size for compact feedback */
        }
        .prose-invert strong {
            color: #FCD34D; /* yellow-400 */
        }
        .prose-invert ul, .prose-invert ol {
            list-style-position: inside;
            padding-left: 0.5em; /* Reduce padding */
        }
        .prose-invert li {
            margin-bottom: 0.3em; /* Reduce spacing between list items */
        }
        .prose-invert p {
            margin-bottom: 0.5em;
        }
        .prose-invert a {
            color: #90CDF4;
            text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Interview;
