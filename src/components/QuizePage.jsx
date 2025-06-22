import React, { useState, useEffect, useCallback } from 'react';

// Define the API key. In a real application, this would be loaded securely (e.g., from environment variables).
// For Canvas environment, leave it as an empty string and the environment will provide it.
// const GEMINI_API_KEY = "AIzaSyDIPvO_K3fsYq6ituIvdCdsBWUAnQ8vTP0"
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


// Helper function for API calls to Gemini
const callGeminiApi = async (prompt, responseSchema = null, model = "gemini-2.0-flash") => {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
        contents: chatHistory,
        generationConfig: responseSchema ? {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        } : {}
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            // If a schema was provided, attempt to parse JSON
            return responseSchema ? JSON.parse(text) : text;
        } else {
            throw new Error("Invalid response structure from Gemini API. Please try again.");
        }
    } catch (err) {
        console.error("Error calling Gemini API:", err);
        throw new Error(`Failed to fetch from Gemini API: ${err.message}`); // Re-throw to be caught by the calling function
    }
};

// --- Performance Dashboard Component (Conceptually in PerformanceDashboard.jsx) ---
function PerformanceDashboard({ quizHistory, onBack }) {
    // Calculate overall stats
    const totalQuizzes = quizHistory.length;
    const totalQuestionsAttempted = quizHistory.reduce((acc, quiz) => acc + quiz.numQuestions, 0);
    const totalCorrectAnswers = quizHistory.reduce((acc, quiz) => acc + quiz.score, 0);
    const overallAccuracy = totalQuestionsAttempted > 0 
        ? ((totalCorrectAnswers / totalQuestionsAttempted) * 100).toFixed(2) 
        : 0;
    const totalPointsEarned = quizHistory.reduce((acc, quiz) => acc + quiz.pointsEarned, 0);

    // Analyze favorite topics (simple count for demonstration)
    const topicCounts = quizHistory.reduce((acc, quiz) => {
        acc[quiz.topic] = (acc[quiz.topic] || 0) + 1;
        return acc;
    }, {});
    const sortedTopics = Object.entries(topicCounts).sort(([, a], [, b]) => b - a);
    const favoriteTopics = sortedTopics.slice(0, 3).map(([topic, count]) => `${topic} (${count})`).join(', ') || 'N/A';

    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-700 rounded-lg shadow-lg min-h-[600px]">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">📊 Performance Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-400">Total Quizzes</p>
                    <p className="text-3xl font-bold text-blue-400">{totalQuizzes}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-400">Overall Accuracy</p>
                    <p className="text-3xl font-bold text-green-400">{overallAccuracy}%</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-400">Total Points</p>
                    <p className="text-3xl font-bold text-yellow-400">{totalPointsEarned}</p>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">Quiz History</h3>
                {quizHistory.length === 0 ? (
                    <p className="text-gray-400">No quiz history available yet. Complete some quizzes!</p>
                ) : (
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {quizHistory.map((quiz, index) => (
                            <li key={index} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{quiz.topic} ({quiz.difficulty})</p>
                                    <p className="text-sm text-gray-300">Score: {quiz.score}/{quiz.numQuestions} | Points: {quiz.pointsEarned}</p>
                                    <p className="text-xs text-gray-400">{new Date(quiz.timestamp).toLocaleString()}</p>
                                </div>
                                <span className={`px-2 py-1 text-sm rounded-full ${
                                    (quiz.score / quiz.numQuestions) > 0.7 ? 'bg-green-500' : 
                                    (quiz.score / quiz.numQuestions) > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                } text-white`}>
                                    {((quiz.score / quiz.numQuestions) * 100).toFixed(0)}%
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">🚀 Achievements (Concept)</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                    <div className="bg-gray-900 p-3 rounded-lg text-center flex flex-col items-center text-sm text-gray-300">
                        <span className="text-4xl">🥇</span>
                        First Quiz Master
                        <span className="text-xs text-gray-500 mt-1">Complete your first quiz!</span>
                    </div>
                     <div className="bg-gray-900 p-3 rounded-lg text-center flex flex-col items-center text-sm text-gray-300">
                        <span className="text-4xl">🔥</span>
                        Streak Starter
                        <span className="text-xs text-gray-500 mt-1">Achieve a 3-question streak!</span>
                    </div>
                     <div className="bg-gray-900 p-3 rounded-lg text-center flex flex-col items-center text-sm text-gray-300">
                        <span className="text-4xl">💡</span>
                        Topic Explorer
                        <span className="text-xs text-gray-500 mt-1">Attempt 5 different topics!</span>
                    </div>
                     <div className="bg-gray-900 p-3 rounded-lg text-center flex flex-col items-center text-sm text-gray-300">
                        <span className="text-4xl">🌟</span>
                        Quiz Enthusiast
                        <span className="text-xs text-gray-500 mt-1">Complete 10 quizzes!</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mt-4 text-center">
                    Badges unlock as you achieve milestones! Keep quizzing!
                </p>
            </div>

            <button
                onClick={onBack}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-md shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Back to Quiz Setup
            </button>
        </div>
    );
}

// --- Main QuizPage Component ---
function QuizPage() {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium'); // Default difficulty
    const [numQuestions, setNumQuestions] = useState(10); // Default to 10 questions
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // Stores answers as {questionId: [selectedOptions]}
    const [showResults, setShowResults] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [error, setError] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false); // To toggle showing correct answers

    // Gamification states
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes * 60 seconds
    const [timerActive, setTimerActive] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [skippedCount, setSkippedCount] = useState(0);
    const [quizHistory, setQuizHistory] = useState([]); // Stores data for performance dashboard
    const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);

    // Points mapping for difficulties
    const difficultyPoints = {
        easy: 10,
        medium: 20,
        hard: 30,
    };

    // Timer useEffect
    useEffect(() => {
        let timerInterval;
        if (timerActive && timeLeft > 0 && !showResults) {
            timerInterval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive && !showResults) {
            handleQuizEnd(); // Automatically end quiz when timer runs out
        }
        return () => clearInterval(timerInterval);
    }, [timerActive, timeLeft, showResults]); // Dependencies updated

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    /**
     * Fetches quiz questions from the Gemini API based on user input.
     */
    const fetchQuiz = async () => {
        setLoadingQuiz(true);
        setError(null);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setShowResults(false);
        setShowAnswers(false);
        setTimeLeft(600); // Reset timer to 10 minutes
        setTimerActive(false); // Deactivate timer until questions load
        setCurrentStreak(0);
        setTotalPoints(0);
        setCorrectCount(0);
        setIncorrectCount(0);
        setSkippedCount(0);
        setShowPerformanceDashboard(false); // Hide dashboard if starting new quiz

        if (!topic.trim()) {
            setError("Please enter a topic for the quiz.");
            setLoadingQuiz(false);
            return;
        }

        try {
            const prompt = `Generate a JSON array of ${numQuestions} multiple-choice questions (MCQs) about '${topic}' at a ${difficulty} difficulty level.
            Each question object should have:
            - 'id': a unique string identifier.
            - 'questionText': the question string.
            - 'options': an array of 4-5 strings representing answer choices.
            - 'correctAnswers': an array of strings containing the text of all correct answers (allowing for multiple correct answers).
            - 'type': a string, either 'single-choice' or 'multiple-choice'.
            - 'explanation': a brief explanation for the correct answer.

            Ensure diverse questions and realistic options.
            Example structure:
            [
              {
                "id": "q1",
                "questionText": "What is 2+2?",
                "options": ["3", "4", "5", "6"],
                "correctAnswers": ["4"],
                "type": "single-choice",
                "explanation": "2 plus 2 equals 4."
              },
              {
                "id": "q2",
                "questionText": "Which of these are prime numbers?",
                "options": ["2", "4", "7", "9", "11"],
                "correctAnswers": ["2", "7", "11"],
                "type": "multiple-choice",
                "explanation": "Prime numbers are natural numbers greater than 1 that have no positive divisors other than 1 and themselves."
              }
            ]`;

            const quizSchema = {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        id: { type: "STRING" },
                        questionText: { type: "STRING" },
                        options: {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        },
                        correctAnswers: {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        },
                        type: { type: "STRING", enum: ["single-choice", "multiple-choice"] },
                        explanation: { type: "STRING" } // Add explanation field
                    },
                    propertyOrdering: ["id", "questionText", "options", "correctAnswers", "type", "explanation"]
                }
            };
            
            const generatedQuestions = await callGeminiApi(prompt, quizSchema);
            if (generatedQuestions && generatedQuestions.length > 0) {
                setQuestions(generatedQuestions);
                setTimerActive(true); // Start timer once questions are loaded
            } else {
                setError("Could not generate questions. Please try a different topic or difficulty.");
            }
        } catch (err) {
            console.error("Failed to fetch quiz:", err);
            setError(`Failed to generate quiz: ${err.message}`);
        } finally {
            setLoadingQuiz(false);
        }
    };

    /**
     * Checks if the user's answer for a given question is correct.
     * @param {object} question - The question object.
     * @param {string[]} userAnswer - Array of user's selected options.
     * @returns {boolean} True if correct, false otherwise.
     */
    const isAnswerCorrect = useCallback((question, userAnswer) => {
        const sortedUserAnswers = [...(userAnswer || [])].sort();
        const sortedCorrectAnswers = [...question.correctAnswers].sort();
        return sortedUserAnswers.length === sortedCorrectAnswers.length &&
               sortedUserAnswers.every((val, index) => val === sortedCorrectAnswers[index]);
    }, []); // No dependencies, can be memoized

    /**
     * Handles selection/deselection of options for the current question.
     * Supports both single and multiple-choice questions.
     * @param {string} option - The option text that was clicked.
     */
    const handleOptionChange = (option) => {
        const currentQuestion = questions[currentQuestionIndex];
        const questionId = currentQuestion.id;

        setUserAnswers(prevAnswers => {
            const currentSelected = prevAnswers[questionId] || [];
            let newSelected;

            if (currentQuestion.type === 'single-choice') {
                newSelected = [option]; // For single-choice, replace existing selection
            } else {
                if (currentSelected.includes(option)) {
                    newSelected = currentSelected.filter(item => item !== option); // For multiple-choice, toggle selection
                } else {
                    newSelected = [...currentSelected, option];
                }
            }
            return { ...prevAnswers, [questionId]: newSelected };
        });
    };

    /**
     * Moves to the next question or finishes the quiz if it's the last question.
     */
    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const userAnswerForCurrent = userAnswers[currentQuestion.id] || [];
        
        // Update counts for gamification
        if (userAnswerForCurrent.length === 0) { // If user didn't select anything
            setSkippedCount(prev => prev + 1);
            setCurrentStreak(0); // Break streak if skipped
        } else if (isAnswerCorrect(currentQuestion, userAnswerForCurrent)) {
            setCorrectCount(prev => prev + 1);
            const points = difficultyPoints[difficulty] || 0;
            setTotalPoints(prev => prev + points);
            setCurrentStreak(prev => {
                const newStreak = prev + 1;
                setHighestStreak(oldHighest => Math.max(oldHighest, newStreak));
                return newStreak;
            });
        } else {
            setIncorrectCount(prev => prev + 1);
            setCurrentStreak(0); // Reset streak on incorrect answer
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            handleQuizEnd(); // End of quiz
        }
    };

    /**
     * Handles the end of the quiz, calculates final score and updates history.
     */
    const handleQuizEnd = () => {
        setTimerActive(false); // Stop the timer
        setShowResults(true);

        const finalScore = calculateScore();
        const quizRecord = {
            id: Date.now(), // Unique ID for the quiz instance
            topic,
            difficulty,
            numQuestions,
            score: finalScore,
            pointsEarned: totalPoints,
            correctCount,
            incorrectCount,
            skippedCount,
            timestamp: new Date().toISOString(),
        };
        setQuizHistory(prevHistory => [...prevHistory, quizRecord]);
    };

    /**
     * Calculates the user's score based on their answers and correct answers.
     * @returns {number} The calculated score.
     */
    const calculateScore = () => {
        let score = 0;
        questions.forEach(q => {
            const userAnswer = userAnswers[q.id] || [];
            if (isAnswerCorrect(q, userAnswer)) {
                score++;
            }
        });
        return score;
    };

    const score = showResults ? calculateScore() : 0;
    const questionsAttempted = correctCount + incorrectCount + skippedCount;
    const accuracyPercentage = questionsAttempted > 0 
        ? ((correctCount / questionsAttempted) * 100).toFixed(0) 
        : 0;

    if (showPerformanceDashboard) {
        return <PerformanceDashboard quizHistory={quizHistory} onBack={() => setShowPerformanceDashboard(false)} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8 pt-60 flex justify-center items-center font-[Inter]">
            <div className="max-w-6xl w-full bg-gray-800 p-8 rounded-lg shadow-2xl flex flex-col lg:flex-row gap-8">
                {/* Header */}
                <div className="w-full absolute top-0 left-0 right-0 flex justify-center z-10 pt-40">
                    <h1 className="text-4xl font-bold text-white  rounded-md bg-gradient-to-r from-green-600 to-teal-700 px-8 py-4 shadow-xl mt-[-2.5rem] border-4 border-gray-800">
                        Quizzes & MCQs 
                    </h1>
                </div>

                {error && (
                    <div className="absolute top-20 w-full max-w-lg bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded-lg shadow-xl left-1/2 -translate-x-1/2 z-50 animate-fade-in" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {questions.length === 0 && !loadingQuiz ? (
                    // Quiz setup section
                    <div className="flex flex-col gap-6 p-6 bg-gray-700 rounded-lg shadow-lg w-full">
                        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Generate Your Quiz</h2>
                        <div>
                            <label htmlFor="topic" className="block text-gray-300 text-sm font-bold mb-2">Quiz Topic:</label>
                            <input
                                type="text"
                                id="topic"
                                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-900"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Python Programming, World History, Machine Learning"
                            />
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block text-gray-300 text-sm font-bold mb-2">Difficulty:</label>
                            <select
                                id="difficulty"
                                className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-900"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="numQuestions" className="block text-gray-300 text-sm font-bold mb-2">Number of Questions (1-30):</label>
                            <input
                                type="number"
                                id="numQuestions"
                                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-900"
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(Math.min(Math.max(1, parseInt(e.target.value) || 0), 30))}
                                min="1"
                                max="30"
                            />
                        </div>
                        <button
                            onClick={fetchQuiz}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-md shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            disabled={loadingQuiz || !topic.trim()}
                        >
                            {loadingQuiz ? 'Generating Quiz...' : 'Generate Quiz'}
                        </button>
                        <button
                            onClick={() => setShowPerformanceDashboard(true)}
                            className="mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-semibold rounded-md shadow-lg hover:from-purple-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            Performance Dashboard
                        </button>
                    </div>
                ) : loadingQuiz ? (
                    // Loading state for quiz generation
                    <div className="text-center text-gray-400 text-xl p-10 w-full flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-4"></div>
                        <p>Generating your quiz on "{topic}" ({difficulty} level)...</p>
                        <p>This might take a moment.</p>
                    </div>
                ) : showResults ? (
                    // Quiz Results section
                    <div className="flex flex-col gap-6 p-6 bg-gray-700 rounded-lg shadow-lg text-center w-full">
                        <h2 className="text-3xl font-bold text-gray-100 mb-4">🎉 Quiz Completed!</h2>
                        <p className="text-xl text-white">Your Score: <span className="text-green-400">{score}</span> / {questions.length}</p>
                        <p className="text-xl text-white">Total Points Earned: <span className="text-yellow-400">{totalPoints}</span></p>
                        <p className="text-lg text-gray-300">Accuracy: <span className="font-semibold text-blue-400">{accuracyPercentage}%</span></p>
                        <p className="text-lg text-gray-300">Longest Streak: <span className="font-semibold text-red-400">{highestStreak}</span></p>

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={() => setShowAnswers(!showAnswers)}
                                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-700 text-white font-semibold rounded-md shadow-lg hover:from-yellow-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                            >
                                {showAnswers ? 'Hide Answers' : 'Show Answers'}
                            </button>
                            <button
                                onClick={fetchQuiz} // Re-fetch quiz with current settings
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-md shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Take Another Quiz
                            </button>
                             <button
                                onClick={() => setShowPerformanceDashboard(true)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-semibold rounded-md shadow-lg hover:from-purple-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                            >
                                Performance Dashboard
                            </button>
                        </div>

                        {showAnswers && (
                            <div className="mt-8 text-left bg-gray-900 p-6 rounded-lg shadow-inner">
                                <h3 className="text-2xl font-semibold text-gray-100 mb-4">Correct Answers & Explanations:</h3>
                                {questions.map((q, qIndex) => (
                                    <div key={q.id} className="mb-6 pb-4 border-b border-gray-700 last:border-b-0">
                                        <p className="font-bold text-lg text-blue-400">Q{qIndex + 1}: {q.questionText}</p>
                                        <p className="text-gray-300 mt-2">Your Answer(s): {userAnswers[q.id]?.join(', ') || 'None'}</p>
                                        <p className="text-green-400">Correct Answer(s): {q.correctAnswers.join(', ')}</p>
                                        {q.explanation && <p className="text-gray-400 text-sm mt-1">Explanation: {q.explanation}</p>}
                                        {/* Visual feedback for correct/incorrect */}
                                        {
                                            isAnswerCorrect(q, userAnswers[q.id]) ?
                                            (
                                                <span className="text-green-500 font-bold flex items-center mt-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Correct
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-bold flex items-center mt-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    Incorrect
                                                </span>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Quiz taking section (split into two columns)
                    <>
                        {/* Left Column: Question Area */}
                        <div className="flex-1 flex flex-col gap-6 p-6 bg-gray-700 rounded-lg shadow-lg">
                            {questions.length > 0 && (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-gray-300 text-lg font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
                                        <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                                            ⏰ {formatTime(timeLeft)}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-400 mb-4">{questions[currentQuestionIndex].questionText}</h3>
                                    <div className="flex flex-col gap-3">
                                        {questions[currentQuestionIndex].options.map(option => (
                                            <label
                                                key={option}
                                                className={`block p-4 rounded-md cursor-pointer transition-all duration-200
                                                    ${(userAnswers[questions[currentQuestionIndex].id] || []).includes(option)
                                                        ? 'bg-blue-600 text-white shadow-lg border-blue-400'
                                                        : 'bg-gray-900 text-gray-200 hover:bg-gray-800 border border-gray-700'
                                                    }`}
                                            >
                                                <input
                                                    type={questions[currentQuestionIndex].type === 'single-choice' ? 'radio' : 'checkbox'}
                                                    name={`question-${questions[currentQuestionIndex].id}`}
                                                    value={option}
                                                    checked={(userAnswers[questions[currentQuestionIndex].id] || []).includes(option)}
                                                    onChange={() => handleOptionChange(option)}
                                                    className="mr-3 transform scale-125 accent-blue-400"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-700 text-white font-semibold rounded-md shadow-lg hover:from-green-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Right Column: Quick Stats & Gamification */}
                        <div className="flex-none w-full lg:w-80 flex flex-col gap-6 p-6 bg-gray-700 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-100">🚀 Quick Stats</h2>
                            <div className="space-y-3">
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Correct:</span>
                                    <span className="font-bold text-green-400 text-lg">{correctCount}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Incorrect:</span>
                                    <span className="font-bold text-red-400 text-lg">{incorrectCount}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Skipped:</span>
                                    <span className="font-bold text-yellow-400 text-lg">{skippedCount}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Accuracy:</span>
                                    <span className="font-bold text-blue-400 text-lg">{accuracyPercentage}%</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Current Streak:</span>
                                    <span className="font-bold text-purple-400 text-lg">{currentStreak}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Highest Streak:</span>
                                    <span className="font-bold text-red-400 text-lg">{highestStreak}</span>
                                </div>
                                <div className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                    <span className="text-gray-300">Total Points:</span>
                                    <span className="font-bold text-yellow-400 text-lg">{totalPoints}</span>
                                </div>
                            </div>
                            
                            {/* Achievement Badges Section (Conceptual) */}
                            <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-inner text-center">
                                <h3 className="text-xl font-semibold text-gray-100 mb-3">🏅 Your Badges</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="text-3xl" title="First Quiz Completed">🌟</span>
                                    <span className="text-3xl" title="5 Correct Answers in a row">🔥</span>
                                    <span className="text-3xl opacity-50" title="Not yet unlocked">🏆</span> {/* Example of locked badge */}
                                </div>
                                <p className="text-gray-400 text-sm mt-2">Keep playing to unlock more!</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* Visual celebration for streak (simple fade-in/out) */}
            {currentStreak > 0 && currentStreak % 3 === 0 && (
                <div className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-fade-in-out z-50">
                    🔥 Streak! {currentStreak}
                </div>
            )}
        </div>
    );
}

export default QuizPage;
