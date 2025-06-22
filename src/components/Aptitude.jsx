import React, { useState, useEffect } from 'react';

const AptitudeMCQ = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(''); // To show "Correct!" or "Incorrect."
  const [showModal, setShowModal] = useState(false); // State for custom completion modal

  const aptitudeTopics = [
    'Clock Questions',
    'Age Problems',
    'Time and Work',
    'Permutations and Combinations',
    'Probability',
    'Percentages',
    'Profit and Loss',
    'Simple and Compound Interest',
    'Ratios and Proportions',
    'Averages'
  ];

  // Function to fetch questions from Gemini API
  const fetchQuestions = async (topic) => {
    setLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setFeedback('');
    setError('');

    const prompt = `Generate 5 multiple-choice questions on '${topic}' aptitude. For each question, provide:
- The question text.
- Four answer options (A, B, C, D).
- The correct answer (e.g., "A", "B", "C", or "D").
- A detailed solution explaining how to solve the question.

Format the response as a JSON array of objects, where each object has 'question', 'options' (an array of strings), 'correctAnswer' (string, e.g., "A"), and 'solution' (string).`;

    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                correctAnswer: { type: "STRING" },
                solution: { type: "STRING" }
              },
              propertyOrdering: ["question", "options", "correctAnswer", "solution"]
            }
          }
        }
      };

      // Changed to use import.meta.env.VITE_GEMINI_API_KEY
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonString = result.candidates[0].content.parts[0].text;
        const parsedQuestions = JSON.parse(jsonString);
        setQuestions(parsedQuestions);
      } else {
        setError('No questions generated. Please try again.');
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(`Failed to fetch questions: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTopic) {
      fetchQuestions(selectedTopic);
    }
  }, [selectedTopic]);

  const handleOptionSelect = (option) => {
    if (!showResult) { // Only allow selecting if result is not shown
      setUserAnswer(option);
    }
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (userAnswer === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowResult(false);
      setFeedback('');
    } else {
      setShowModal(true); // Show custom modal instead of alert
    }
  };

  const resetQuiz = () => {
    setSelectedTopic('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowResult(false);
    setFeedback('');
    setShowModal(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 font-sans flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-6xl border-t-8 border-purple-600">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
          <h1 className="text-4xl font-extrabold text-purple-800 mb-4 md:mb-0">Aptitude Quiz</h1>
          <div className="text-md text-gray-700">
            <span className="font-semibold text-purple-600">Question:</span> {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Topic Selection */}
        <div className="mb-8">
          <label htmlFor="topic-select" className="block text-gray-700 text-sm font-bold mb-2">
            Choose Your Aptitude Topic:
          </label>
          <select
            id="topic-select"
            className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select a Topic to Begin --</option>
            {aptitudeTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-center text-blue-600 text-xl font-medium my-12">Fetching exciting questions...</div>
        )}

        {error && (
          <div className="text-center text-red-600 text-xl font-medium my-12">{error}</div>
        )}

        {!selectedTopic && !loading && !error && (
          <div className="text-center text-gray-600 text-xl my-12">
            Select a topic from the dropdown to challenge your aptitude skills!
          </div>
        )}

        {currentQuestion && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side: Question and Options */}
            <div className="md:w-1/2 bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                Question {currentQuestionIndex + 1}:
              </h3>
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                {currentQuestion.question}
              </p>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`block w-full text-left p-4 rounded-xl cursor-pointer shadow-sm
                      ${userAnswer === String.fromCharCode(65 + index)
                        ? 'bg-blue-300 border-blue-600 ring-2 ring-blue-500 font-semibold text-blue-900' // Selected answer
                        : 'bg-white border-gray-300 hover:bg-blue-100 hover:border-blue-400 text-gray-800'
                      }
                      ${showResult && currentQuestion.correctAnswer === String.fromCharCode(65 + index)
                        ? 'bg-green-200 border-green-600 ring-2 ring-green-500 font-bold text-green-900' // Correct answer when results are shown
                        : ''
                      }
                      ${showResult && userAnswer === String.fromCharCode(65 + index) && userAnswer !== currentQuestion.correctAnswer
                        ? 'bg-red-200 border-red-600 ring-2 ring-red-500 font-bold text-red-900' // Incorrect selected answer when results are shown
                        : ''
                      }
                      transition-all duration-200 ease-in-out transform hover:-translate-y-0.5`}
                    onClick={() => handleOptionSelect(String.fromCharCode(65 + index))}
                    disabled={showResult} // Disable options once result is shown
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 w-full sm:w-auto"
                  onClick={() => {
                    setUserAnswer('');
                    setShowResult(false);
                    setFeedback('');
                  }}
                  disabled={!userAnswer || showResult}
                >
                  Clear Selection
                </button>
                {!showResult ? (
                  <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 w-full sm:w-auto transform hover:scale-105"
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 w-full sm:w-auto transform hover:scale-105"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Solution */}
            <div className={`md:w-1/2 p-6 rounded-lg shadow-inner border transition-all duration-500 ease-in-out
              ${showResult ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'}`}>
              <h4 className={`text-2xl font-extrabold mb-4 ${feedback === 'Correct!' ? 'text-green-800' : 'text-red-800'}`}>
                {showResult ? feedback : 'Solution'}
              </h4>
              {showResult && (
                <>
                  <p className="text-gray-900 text-md mb-4">
                    <span className="font-semibold text-purple-700">Your Answer:</span>{' '}
                    <span className={`font-bold ${userAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                      {userAnswer}
                    </span>
                  </p>
                  <p className="text-gray-900 text-md mb-4">
                    <span className="font-semibold text-purple-700">Correct Answer:</span>{' '}
                    <span className="font-bold text-green-600">{currentQuestion.correctAnswer}</span>
                  </p>
                  <div className="text-gray-800 text-sm">
                    <h5 className="font-bold text-lg mb-2 text-purple-700">Detailed Solution:</h5>
                    <p className="leading-relaxed">{currentQuestion.solution}</p>
                  </div>
                </>
              )}
              {!showResult && (
                <div className="text-center text-gray-500 text-md py-10">
                  Submit your answer to view the solution.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Completion Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full text-center border-t-8 border-green-500">
              <h2 className="text-3xl font-bold text-green-700 mb-4">Quiz Completed!</h2>
              <p className="text-gray-700 text-lg mb-6">
                You've finished all questions for this topic.
              </p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                onClick={resetQuiz}
              >
                Start New Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeMCQ;
