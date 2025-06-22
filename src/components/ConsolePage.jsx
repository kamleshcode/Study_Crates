// import React, { useState, useEffect } from 'react';

// // Define the API key. In a real application, this would be loaded securely (e.g., from environment variables).
// // For Canvas environment, leave it as an empty string and the environment will provide it.
// const GEMINI_API_KEY = "AIzaSyDIPvO_K3fsYq6ituIvdCdsBWUAnQ8vTP0"; // Canvas will automatically provide the API key at runtime.

// function ConsolePage() {
//   const [question, setQuestion] = useState(null);
//   const [previousQuestions, setPreviousQuestions] = useState([]); // To store history of questions
//   const [userCode, setUserCode] = useState('');
//   const [testResults, setTestResults] = useState([]);
//   const [loadingQuestion, setLoadingQuestion] = useState(false);
//   const [loadingCheck, setLoadingCheck] = useState(false);
//   const [loadingHint, setLoadingHint] = useState(false); // New state for hint loading
//   const [hint, setHint] = useState(''); // New state for storing hint
//   const [error, setError] = useState(null);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for success popup visibility

//   // Helper function for API calls to Gemini
//   const callGeminiApi = async (prompt, responseSchema = null, model = "gemini-2.0-flash") => {
//     let chatHistory = [];
//     chatHistory.push({ role: "user", parts: [{ text: prompt }] });

//     const payload = {
//       contents: chatHistory,
//       generationConfig: responseSchema ? {
//         responseMimeType: "application/json",
//         responseSchema: responseSchema
//       } : {}
//     };

//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();

//       if (result.candidates && result.candidates.length > 0 &&
//           result.candidates[0].content && result.candidates[0].content.parts &&
//           result.candidates[0].content.parts.length > 0) {
//         const text = result.candidates[0].content.parts[0].text;
//         // If a schema was provided, attempt to parse JSON
//         return responseSchema ? JSON.parse(text) : text;
//       } else {
//         throw new Error("Invalid response structure from Gemini API.");
//       }
//     } catch (err) {
//       console.error("Error calling Gemini API:", err);
//       setError(`Failed to fetch from Gemini API: ${err.message}`);
//       throw err; // Re-throw to be caught by the calling function
//     }
//   };

//   /**
//    * Fetches a coding question from the Gemini API.
//    * The API is prompted to generate a structured JSON output for the question.
//    * @param {boolean} isPrevious - True if this call is from "See Previous Question" to avoid saving current question.
//    */
//   const fetchCodingQuestion = async (isPrevious = false) => {
//     setLoadingQuestion(true);
//     setError(null);
//     setHint(''); // Clear hint when fetching a new question
//     setTestResults([]); // Clear previous test results
//     setShowSuccessPopup(false); // Hide success popup on new question

//     try {
//       const prompt = `Generate a moderately challenging coding question in JSON format suitable for C++.
//       Include 'id' (string), 'title' (string), 'description' (string), 'starterCode' (a C++ function signature, e.g., 'int solve(int n, vector<int>& arr) {\\n  // Write your code here.\\n}'),
//       'language' (string, 'cpp'), and an array of 'testCases' (at least 2).
//       Each test case should have 'input' (string) and 'output' (string).
//       Example 'starterCode': "int maximumSubarraySum(int n, vector<int> &v) {\\n  // Write your code here.\\n}"
//       Example 'testCases': [{ "input": "5\\n1 -5 1 1 -4", "output": "3" }]
//       Ensure the output is a single, valid JSON object.`;

//       const questionSchema = {
//         type: "OBJECT",
//         properties: {
//           id: { type: "STRING" },
//           title: { type: "STRING" },
//           description: { type: "STRING" },
//           starterCode: { type: "STRING" },
//           language: { type: "STRING", enum: ["cpp"] }, // Limiting to cpp for this example
//           testCases: {
//             type: "ARRAY",
//             items: {
//               type: "OBJECT",
//               properties: {
//                 input: { type: "STRING" },
//                 output: { type: "STRING" }
//               },
//               propertyOrdering: ["input", "output"]
//             }
//           }
//         },
//         propertyOrdering: ["id", "title", "description", "starterCode", "language", "testCases"]
//       };

//       if (question && !isPrevious) { // Save current question to previous if it's not a 'previous' fetch
//         setPreviousQuestions(prev => [...prev, question]);
//       }
//       const q = await callGeminiApi(prompt, questionSchema);
//       setQuestion(q);
//       setUserCode(q.starterCode || ''); // Pre-fill user code with starter code
//     } catch (err) {
//       console.error("Failed to fetch coding question:", err);
//     } finally {
//       setLoadingQuestion(false);
//     }
//   };

//   /**
//    * Fetches the previous coding question from the history.
//    */
//   const fetchPreviousQuestion = () => {
//     if (previousQuestions.length > 0) {
//       const lastQuestion = previousQuestions[previousQuestions.length - 1];
//       setQuestion(lastQuestion);
//       setUserCode(lastQuestion.starterCode || '');
//       setTestResults([]); // Clear previous test results
//       setPreviousQuestions(prev => prev.slice(0, prev.length - 1)); // Remove from history
//       setHint(''); // Clear hint when going to previous question
//       setShowSuccessPopup(false); // Hide success popup when navigating
//     } else {
//       setError("No previous questions available.");
//     }
//   };

//   /**
//    * Generates a hint for the current coding question using the Gemini API.
//    * The hint should guide the user without providing the code directly.
//    */
//   const getHint = async () => {
//     if (!question) {
//       setError("Please fetch a question first to get a hint.");
//       return;
//     }
//     setLoadingHint(true);
//     setError(null);
//     setShowSuccessPopup(false); // Hide success popup when asking for hint
//     try {
//       const prompt = `You are a coding tutor. Provide a conceptual hint for the following coding problem without giving away the exact code. Focus on the approach or key concepts.

//       Problem Title: ${question.title}
//       Problem Description: ${question.description}
//       Starter Code:
//       \`\`\`${question.language}
//       ${question.starterCode}
//       \`\`\`

//       Consider guiding the user on data structures, algorithms, or problem-solving strategies relevant to this problem. For example, if it's a dynamic programming problem, you might suggest thinking about optimal substructure or overlapping subproblems. If it's an array manipulation problem, you could hint at using two pointers or a sliding window.`;
      
//       const generatedHint = await callGeminiApi(prompt);
//       setHint(generatedHint);
//     } catch (err) {
//       console.error("Failed to get hint:", err);
//     } finally {
//       setLoadingHint(false);
//     }
//   };

//   /**
//    * Checks the provided code against the question's test cases using the Gemini API.
//    * This now acts as the "Run" button functionality.
//    */
//   const runCode = async () => {
//     if (!userCode || !question || !question.language || !question.testCases) {
//       setError("Please provide code, fetch a question, and ensure it has test cases to run.");
//       return;
//     }
//     setLoadingCheck(true);
//     setError(null);
//     setShowSuccessPopup(false); // Hide any previous success popup
//     try {
//       const prompt = `Given the following ${question.language} code and test cases, verify if the code produces the expected output for each test case.
//       Assume standard library includes are available (e.g., <iostream>, <vector> for C++).
//       Return the results in a JSON array of objects, where each object has a 'passed' (boolean) property.
      
//       Code:
//       \`\`\`${question.language}
//       ${userCode}
//       \`\`\`
      
//       Test Cases (input and expected output):
//       ${JSON.stringify(question.testCases, null, 2)}
      
//       Example expected output: [{ "passed": true }, { "passed": false }]`;

//       const testResultsSchema = {
//         type: "ARRAY",
//         items: {
//           type: "OBJECT",
//           properties: {
//             passed: { type: "BOOLEAN" }
//           },
//           propertyOrdering: ["passed"]
//         }
//       };

//       const results = await callGeminiApi(prompt, testResultsSchema);
//       setTestResults(results);

//       // Check if all tests passed
//       const allPassed = results.every(r => r.passed);
//       if (allPassed) {
//         setShowSuccessPopup(true);
//       }
//     } catch (err) {
//       console.error("Failed to run code:", err);
//     } finally {
//       setLoadingCheck(false);
//     }
//   };

//   // Initial fetch for a question when the component mounts
//   useEffect(() => {
//     fetchCodingQuestion();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-200 p-8 flex justify-center items-center font-[Inter]">
//       <div className="max-w-7xl w-full bg-gray-800 p-8 rounded-lg shadow-2xl flex flex-col lg:flex-row gap-8">
//         {/* Header (positioned above the two-column layout) */}
//         <div className="w-full lg:absolute lg:top-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-fit text-center mb-8 lg:mb-0">
//           <h1 className="text-4xl font-bold text-white rounded-md bg-blue-700 p-4 shadow-xl">
//             Code Challenge Platform
//           </h1>
//         </div>

//         {error && (
//           <div className="absolute top-32 w-full max-w-lg bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded-lg shadow-xl relative mx-auto" role="alert">
//             <strong className="font-bold">Error:</strong>
//             <span className="block sm:inline ml-2">{error}</span>
//           </div>
//         )}

//         {/* Success Popup */}
//         {showSuccessPopup && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//             <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full mx-4 relative transform scale-105 animate-bounce-in">
//               <button
//                 onClick={() => setShowSuccessPopup(false)}
//                 className="absolute top-3 right-3 text-white text-opacity-80 hover:text-opacity-100 text-2xl"
//               >
//                 &times;
//               </button>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h2 className="text-3xl font-bold mb-2">Success!</h2>
//               <p className="text-lg">You've successfully solved the problem!</p>
//               <button
//                 onClick={() => setShowSuccessPopup(false)}
//                 className="mt-6 px-6 py-3 bg-white text-green-700 font-semibold rounded-md shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
//               >
//                 Great!
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Question Section - Left Panel */}
//         <div className="flex-1 p-6 bg-gray-700 rounded-lg shadow-lg flex flex-col">
//           <h2 className="text-2xl font-semibold text-gray-100 mb-4">Coding Question</h2>
//           {loadingQuestion ? (
//             <div className="text-gray-400">Loading question...</div>
//           ) : question ? (
//             <>
//               <h3 className="text-xl font-bold text-blue-400 mb-2">{question.title}</h3>
//               <p className="text-gray-300 mb-4 whitespace-pre-wrap">{question.description}</p>
//               <div className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-200 font-mono">
//                 <h4 className="font-semibold mb-2">Starter Code ({question.language}):</h4>
//                 <pre className="whitespace-pre-wrap">{question.starterCode}</pre>
//               </div>
//               <div className="mt-4">
//                 <h4 className="font-semibold mb-2 text-gray-200">Test Cases:</h4>
//                 {question.testCases && question.testCases.length > 0 ? (
//                   <ul className="list-disc list-inside text-gray-300">
//                     {question.testCases.map((tc, index) => (
//                       <li key={index} className="mb-1">
//                         <strong className="text-gray-100">Input:</strong> {tc.input} |{' '}
//                         <strong className="text-gray-100">Output:</strong> {tc.output}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-400">No test cases provided for this question.</p>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="text-gray-400">No question loaded.</div>
//           )}
//           {hint && (
//             <div className="mt-4 p-4 bg-gray-900 rounded-md text-gray-300 shadow-inner">
//               <h4 className="font-semibold mb-2">Hint:</h4>
//               <p className="whitespace-pre-wrap">{hint}</p>
//             </div>
//           )}
//         </div>

//         {/* Code Editor and Actions (Console) - Right Panel */}
//         <div className="flex-1 p-6 bg-gray-700 rounded-lg shadow-lg flex flex-col">
//           <h2 className="text-2xl font-semibold text-gray-100 mb-4">Your Code Console</h2>
//           <textarea
//             className="w-full h-64 p-4 mb-4 border border-gray-600 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400 font-mono text-gray-200 text-sm bg-gray-900"
//             value={userCode}
//             onChange={(e) => setUserCode(e.target.value)}
//             placeholder="// Write your code here..."
//           ></textarea>

//           {/* All action buttons consolidated at the bottom right */}
//           <div className="flex flex-wrap justify-end gap-4 mt-auto">
//             <button
//               onClick={() => fetchCodingQuestion(false)} // Pass false to indicate not a previous question fetch
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-md shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex-grow"
//               disabled={loadingQuestion}
//             >
//               {loadingQuestion ? 'Fetching...' : 'Fetch New Question'}
//             </button>
//             <button
//               onClick={fetchPreviousQuestion}
//               className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-md shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex-grow"
//               disabled={previousQuestions.length === 0 || loadingQuestion}
//             >
//               See Previous Question
//             </button>
//             <button
//               onClick={getHint}
//               className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-700 text-white font-semibold rounded-md shadow-lg hover:from-yellow-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex-grow"
//               disabled={loadingHint || !question}
//             >
//               {loadingHint ? 'Getting Hint...' : 'Hint'}
//             </button>
//             <button
//               onClick={runCode}
//               className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white font-semibold rounded-md shadow-lg hover:from-red-700 hover:to-pink-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex-grow"
//               disabled={loadingCheck || !userCode || !question || !question.testCases || question.testCases.length === 0}
//             >
//               {loadingCheck ? 'Running...' : 'Run Code'}
//             </button>
//           </div>

//           {/* Test Results Section (moved inside the right panel and separated from buttons) */}
//           {testResults.length > 0 && (
//             <div className="p-6 bg-gray-900 rounded-lg shadow-md mt-4">
//               <h2 className="text-2xl font-semibold text-gray-100 mb-4">Test Results</h2>
//               <div className="space-y-3">
//                 {testResults.map((result, index) => (
//                   <div
//                     key={index}
//                     className={`p-3 rounded-md flex items-center justify-between shadow-sm ${
//                       result.passed ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
//                     }`}
//                   >
//                     <span>Test Case {index + 1}:</span>
//                     <span className="font-bold">
//                       {result.passed ? (
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                         </svg>
//                       ) : (
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       )}
//                       {result.passed ? 'Passed' : 'Failed'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConsolePage;

import React, { useState, useEffect } from 'react';

// Define the API key. In a real application, this would be loaded securely (e.g., from environment variables).
// const GEMINI_API_KEY = "AIzaSyDIPvO_K3fsYq6ituIvdCdsBWUAnQ8vTP0";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function ConsolePage() {
    const [question, setQuestion] = useState(null);
    const [previousQuestions, setPreviousQuestions] = useState([]);
    const [userCode, setUserCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [loadingHint, setLoadingHint] = useState(false);
    const [loadingExplanation, setLoadingExplanation] = useState(false); // New: for code explanation
    const [loadingAlternative, setLoadingAlternative] = useState(false); // New: for alternative solutions
    const [hint, setHint] = useState('');
    const [codeExplanation, setCodeExplanation] = useState(''); // New: for code explanation
    const [alternativeSolution, setAlternativeSolution] = useState(''); // New: for alternative solution
    const [error, setError] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [difficulty, setDifficulty] = useState('Easy'); // State for difficulty
    const [language, setLanguage] = useState('cpp'); // New state for selected language
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // To manage navigation
    const [customInput, setCustomInput] = useState(''); // New: for custom test cases
    const [customOutput, setCustomOutput] = useState(''); // New: for custom test case output

    // Define supported languages
    const supportedLanguages = [
        { key: 'cpp', name: 'C++' },
        { key: 'python', name: 'Python' },
        { key: 'java', name: 'Java' },
        { key: 'javascript', name: 'JavaScript' }
    ];

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
                return responseSchema ? JSON.parse(text) : text;
            } else {
                throw new Error("Invalid response structure from Gemini API.");
            }
        } catch (err) {
            console.error("Error calling Gemini API:", err);
            setError(`Failed to fetch from Gemini API: ${err.message}`);
            throw err;
        }
    };

    const fetchCodingQuestion = async (selectedDifficulty = difficulty, selectedLanguage = language, isNavigation = false) => {
        setLoadingQuestion(true);
        setError(null);
        setHint('');
        setTestResults([]);
        setShowSuccessPopup(false);
        setCodeExplanation(''); // Clear previous explanations
        setAlternativeSolution(''); // Clear previous alternative solutions

        try {
            let difficultyPrompt = "";
            switch (selectedDifficulty) {
                case 'Easy':
                    difficultyPrompt = "an easy coding question";
                    break;
                case 'Medium':
                    difficultyPrompt = "a moderately challenging coding question";
                    break;
                case 'Hard':
                    difficultyPrompt = "a challenging coding question";
                    break;
                default:
                    difficultyPrompt = "a moderately challenging coding question";
            }

            const prompt = `Generate ${difficultyPrompt} in JSON format suitable for ${selectedLanguage}.
            Include 'id' (string), 'title' (string), 'description' (string), 'starterCode' (a function signature for ${selectedLanguage}),
            'language' (string, should be '${selectedLanguage}'), and an array of 'testCases' (at least 2).
            Each test case should have 'input' (string) and 'output' (string).
            Ensure the output is a single, valid JSON object.
            
            Example 'starterCode' for C++: "int maximumSubarraySum(int n, vector<int> &v) {\\n  // Write your code here.\\n}"
            Example 'starterCode' for Python: "def add(a, b):\\n   # Write your code here.\\n"
            Example 'testCases': [{ "input": "5\\n1 -5 1 1 -4", "output": "3" }]
            
            For 'Sum of Two Numbers' (easy question), the starterCode should be:
            - C++: 'int add(int a, int b) {\\n  // Write your code here.\\n}'
            - Python: 'def add(a, b):\\n  # Write your code here.\\n'
            - Java: 'public class Solution {\\n    public int add(int a, int b) {\\n        // Write your code here.\\n    }\\n}'
            - JavaScript: 'function add(a, b) {\\n  // Write your code here.\\n}'
            
            And have example test cases like: [{"input": "2\\n3", "output": "5"}, {"input": "10\\n-5", "output": "5"}].
            Make sure the problem title is concise and descriptive.`;

            const questionSchema = {
                type: "OBJECT",
                properties: {
                    id: { type: "STRING" },
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    starterCode: { type: "STRING" },
                    language: { type: "STRING", enum: supportedLanguages.map(l => l.key) },
                    testCases: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                input: { type: "STRING" },
                                output: { type: "STRING" }
                            },
                            propertyOrdering: ["input", "output"]
                        }
                    }
                },
                propertyOrdering: ["id", "title", "description", "starterCode", "language", "testCases"]
            };

            const q = await callGeminiApi(prompt, questionSchema);

            // Special handling for "Sum of Two Numbers" to ensure consistent starter code and description
            if (selectedDifficulty === 'Easy' && q.title.toLowerCase().includes('sum of two numbers')) {
                q.description = "Write a function that takes two numbers as parameters and returns their sum.\n\nExample:\n- Input: add(2, 3)\n- Output: 5\n\nRequirements:\n- Function should be named 'add'\n- Should accept two parameters: a and b\n- Should return the sum of a and b";
                q.testCases = [{"input": "2\n3", "output": "5"}, {"input": "10\n-5", "output": "5"}, {"input": "0\n0", "output": "0"}];

                // Set language-specific starter code for 'Sum of Two Numbers'
                switch (selectedLanguage) {
                    case 'cpp':
                        q.starterCode = 'int add(int a, int b) {\n  // Write your code here.\n}';
                        break;
                    case 'python':
                        q.starterCode = 'def add(a, b):\n  # Write your code here.\n';
                        break;
                    case 'java':
                        q.starterCode = 'public class Solution {\n    public int add(int a, int b) {\n        // Write your code here.\n    }\n}';
                        break;
                    case 'javascript':
                        q.starterCode = 'function add(a, b) {\n  // Write your code here.\n}';
                        break;
                    default:
                        // Fallback or error if language not supported
                        q.starterCode = `// Starter code for ${selectedLanguage} for 'Sum of Two Numbers'`;
                }
            }


            setQuestion(q);
            setUserCode(q.starterCode || '');
            if (!isNavigation) {
                // Only add to history if it's a *new* question, not navigating back/forward
                setPreviousQuestions(prev => [...prev.slice(0, currentQuestionIndex), q]);
                setCurrentQuestionIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error("Failed to fetch coding question:", err);
        } finally {
            setLoadingQuestion(false);
        }
    };

    const handleDifficultyChange = (newDifficulty) => {
        setDifficulty(newDifficulty);
        setPreviousQuestions([]); // Clear history for new difficulty
        setCurrentQuestionIndex(0);
        fetchCodingQuestion(newDifficulty, language); // Pass current language
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        setPreviousQuestions([]); // Clear history for new language
        setCurrentQuestionIndex(0);
        fetchCodingQuestion(difficulty, newLanguage); // Pass current difficulty and new language
    };

    const navigateQuestion = (direction) => {
        if (direction === 'previous') {
            if (currentQuestionIndex > 0) {
                const prevIndex = currentQuestionIndex - 1;
                const prevQ = previousQuestions[prevIndex];
                setQuestion(prevQ);
                setUserCode(prevQ.starterCode || '');
                setTestResults([]);
                setHint('');
                setCodeExplanation('');
                setAlternativeSolution('');
                setShowSuccessPopup(false);
                setCurrentQuestionIndex(prevIndex);
            } else {
                setError("No previous questions available.");
            }
        } else if (direction === 'next') {
            if (currentQuestionIndex < previousQuestions.length) { // Check if there's a pre-fetched next question
                const nextIndex = currentQuestionIndex + 1;
                if (nextIndex < previousQuestions.length) { // If it's already in history
                    const nextQ = previousQuestions[nextIndex];
                    setQuestion(nextQ);
                    setUserCode(nextQ.starterCode || '');
                    setTestResults([]);
                    setHint('');
                    setCodeExplanation('');
                    setAlternativeSolution('');
                    setShowSuccessPopup(false);
                    setCurrentQuestionIndex(nextIndex);
                } else { // Need to fetch a new one
                    fetchCodingQuestion(difficulty, language, false); // isNavigation = false to add to history
                }
            } else {
                 // This case should ideally not be reached if previous logic is sound, but good fallback
                fetchCodingQuestion(difficulty, language, false); // Fetch a new one if somehow at the end and no next exists
            }
        }
    };


    const getHint = async () => {
        if (!question) {
            setError("Please fetch a question first to get a hint.");
            return;
        }
        setLoadingHint(true);
        setError(null);
        setShowSuccessPopup(false);
        try {
            const prompt = `You are a coding tutor. Provide a conceptual hint for the following coding problem in ${question.language} without giving away the exact code. Focus on the approach or key concepts.

            Problem Title: ${question.title}
            Problem Description: ${question.description}
            Starter Code:
            \`\`\`${question.language}
            ${question.starterCode}
            \`\`\`

            Consider guiding the user on data structures, algorithms, or problem-solving strategies relevant to this problem. For example, if it's a dynamic programming problem, you might suggest thinking about optimal substructure or overlapping subproblems. If it's an array manipulation problem, you could hint at using two pointers or a sliding window.`;

            const generatedHint = await callGeminiApi(prompt);
            setHint(generatedHint);
        } catch (err) {
            console.error("Failed to get hint:", err);
        } finally {
            setLoadingHint(false);
        }
    };

    // New AI Feature: Contextual Code Explanations
    const getCodeExplanation = async () => {
        if (!userCode) {
            setError("Please write some code to get an explanation.");
            return;
        }
        setLoadingExplanation(true);
        setError(null);
        try {
            const prompt = `Explain the following ${language} code step-by-step. Focus on the logic and purpose of each section. If the code is incomplete or has obvious errors, mention that.
            
            Code:
            \`\`\`${language}
            ${userCode}
            \`\`\`
            `;
            const explanation = await callGeminiApi(prompt);
            setCodeExplanation(explanation);
        } catch (err) {
            console.error("Failed to get code explanation:", err);
        } finally {
            setLoadingExplanation(false);
        }
    };

    // New AI Feature: Alternative Solution Generation
    const getAlternativeSolution = async () => {
        if (!question) {
            setError("Please fetch a question first to get an alternative solution.");
            return;
        }
        setLoadingAlternative(true);
        setError(null);
        try {
            const prompt = `Generate an alternative ${language} solution for the following coding problem. Provide only the code, enclosed in a code block. Do not include explanations or additional text.

            Problem Title: ${question.title}
            Problem Description: ${question.description}
            Starter Code:
            \`\`\`${language}
            ${question.starterCode}
            \`\`\`
            `;
            const altSolution = await callGeminiApi(prompt);
            setAlternativeSolution(altSolution);
        } catch (err) {
            console.error("Failed to get alternative solution:", err);
        } finally {
            setLoadingAlternative(false);
        }
    };


    const runCode = async (isCustomTest = false) => {
        let testsToRun = question.testCases;
        if (isCustomTest && customInput) {
            testsToRun = [{ input: customInput, output: "" }]; // Output will be predicted by Gemini
        }

        if (!userCode || !question || !question.language || !testsToRun || testsToRun.length === 0) {
            setError("Please provide code, fetch a question, and ensure it has test cases to run.");
            return;
        }
        setLoadingCheck(true);
        setError(null);
        setShowSuccessPopup(false);
        setCustomOutput(''); // Clear custom output when running

        try {
            const prompt = `Given the following ${language} code and test cases, verify if the code produces the expected output for each test case.
            Assume standard library includes are available (e.g., <iostream>, <vector> for C++; import statements for Python/Java).
            For each test case, simulate the execution and determine if the 'actual output' matches the 'expected output'.
            If the code fails any test case, provide a brief 'errorAnalysis' for that specific test case, indicating what might have gone wrong or a common type of error (e.g., "off-by-one error", "incorrect loop condition", "infinite loop", "wrong data type usage", "edge case not handled").
            Return the results in a JSON array of objects, where each object has 'passed' (boolean), 'input' (string), 'expectedOutput' (string), 'actualOutput' (string, simulate the execution to get this), and optionally 'errorAnalysis' (string).
            
            Code:
            \`\`\`${language}
            ${userCode}
            \`\`\`
            
            Test Cases (input and expected output):
            ${JSON.stringify(testsToRun, null, 2)}
            
            Example expected output: 
            [{ 
                "passed": true, 
                "input": "...", 
                "expectedOutput": "...", 
                "actualOutput": "..." 
            }, 
            { 
                "passed": false, 
                "input": "...", 
                "expectedOutput": "...", 
                "actualOutput": "...", 
                "errorAnalysis": "..." 
            }]`;

            const testResultsSchema = {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        passed: { type: "BOOLEAN" },
                        input: { type: "STRING" },
                        expectedOutput: { type: "STRING" },
                        actualOutput: { type: "STRING" },
                        errorAnalysis: { type: "STRING" } // Optional field
                    },
                    propertyOrdering: ["passed", "input", "expectedOutput", "actualOutput", "errorAnalysis"]
                }
            };

            const results = await callGeminiApi(prompt, testResultsSchema);
            setTestResults(results);

            if (isCustomTest && results.length > 0) {
                setCustomOutput(results[0].actualOutput); // Display actual output for custom test
            }

            const allPassed = results.every(r => r.passed);
            if (allPassed && !isCustomTest) { // Only show success popup for main tests
                setShowSuccessPopup(true);
            }
        } catch (err) {
            console.error("Failed to run code:", err);
        } finally {
            setLoadingCheck(false);
        }
    };

    // Placeholder for Interactive Code Visualizer
    const startCodeVisualization = () => {
        setError("Code Visualization is a complex feature requiring a dedicated backend. This is a placeholder.");
        // In a real application, you'd send the userCode to a backend service
        // that could run it, capture state, and send data back for visualization.
    };

    useEffect(() => {
        fetchCodingQuestion(difficulty, language, false); // Fetch initial question with default language
        // eslint-disable-next-line
    }, []); // Only run on mount

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-gray-200 p-8 pt-24 flex justify-center font-[Inter] overflow-hidden">
            <div className="max-w-7xl w-full relative ">
                {/* Header with Difficulty and Language Buttons */}
                <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-[#1a1a1a] z-20">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-100">Coding Playground</h1>
                    </div>
                    <div className="flex space-x-4 items-center">
                        {/* Language Selector */}
                        <div className="relative">
                            <select
                                value={language}
                                onChange={handleLanguageChange}
                                className="appearance-none bg-gray-700 text-gray-300 py-2 pl-3 pr-8 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                            >
                                {supportedLanguages.map((lang) => (
                                    <option key={lang.key} value={lang.key}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15 8.707l-1.414-1.414L10 11.586l-3.586-3.586L5 8.707z"/></svg>
                            </div>
                        </div>

                        {/* Difficulty Buttons */}
                        <div className="flex space-x-2">
                            {['Easy', 'Medium', 'Hard'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => handleDifficultyChange(level)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                                        difficulty === level
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 mt-20"> {/* Adjusted margin-top */}
                    {error && (
                        <div className="absolute top-0 w-full max-w-lg bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-xl left-1/2 -translate-x-1/2 z-50 animate-fade-in" role="alert">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    )}

                    {/* Success Popup */}
                    {showSuccessPopup && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                            <div className="bg-gradient-to-br from-[#23232b] to-[#1a1a1a] border-4 border-green-500 text-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4 relative animate-fade-in">
                                <button
                                    onClick={() => setShowSuccessPopup(false)}
                                    className="absolute top-3 right-3 text-green-400 hover:text-green-200 text-3xl transition"
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                                <div className="flex flex-col items-center">
                                    <div className="bg-green-600 rounded-full p-4 mb-4 shadow-lg animate-bounce">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" fill="#22c55e" />
                                            <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-extrabold mb-2 text-green-300 drop-shadow">All Test Cases Passed!</h2>
                                    <p className="text-lg text-gray-200 mb-6">Congratulations, your solution is correct.</p>
                                    <button
                                        onClick={() => {
                                            setShowSuccessPopup(false);
                                            fetchCodingQuestion(difficulty, language, false); // Fetch next problem of current difficulty and language
                                        }}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Next Challenge
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Question Section - Left Panel */}
                    <div className="w-1/2 p-6 bg-[#18181b] rounded-2xl shadow-2xl flex flex-col border border-[#23232b]/80">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-blue-400 font-semibold uppercase text-sm">{difficulty}</span>
                            <span className="text-gray-400 text-sm">
                                {question ? `Question: ${currentQuestionIndex + 1}` : 'Loading...'}
                            </span>
                        </div>

                        {loadingQuestion ? (
                            <div className="text-gray-400 text-lg flex items-center justify-center h-full">Loading question...</div>
                        ) : question ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-100 mb-2">{question.title}</h3>
                                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{question.description}</p>
                                <div className="bg-[#23232b] p-4 rounded-md overflow-x-auto text-sm text-gray-200 font-mono border border-[#23232b]/60">
                                    <h4 className="font-semibold mb-2 text-blue-300">Starter Code ({question.language}):</h4>
                                    <pre className="whitespace-pre-wrap">{question.starterCode}</pre>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-400 text-lg flex items-center justify-center h-full">No question loaded.</div>
                        )}

                        {/* Hint Section */}
                        {hint && (
                            <div className="mt-4 p-4 bg-[#23232b] rounded-md text-yellow-200 shadow-inner border border-yellow-700/40">
                                <h4 className="font-semibold mb-2 text-yellow-300">Hint:</h4>
                                <p className="whitespace-pre-wrap">{hint}</p>
                            </div>
                        )}
                        {/* Alternative Solution Section */}
                        {alternativeSolution && (
                            <div className="mt-4 p-4 bg-[#23232b] rounded-md text-purple-200 shadow-inner border border-purple-700/40">
                                <h4 className="font-semibold mb-2 text-purple-300">Alternative Solution:</h4>
                                <pre className="whitespace-pre-wrap text-sm font-mono">{alternativeSolution}</pre>
                            </div>
                        )}
                        {/* Code Explanation Section */}
                        {codeExplanation && (
                            <div className="mt-4 p-4 bg-[#23232b] rounded-md text-teal-200 shadow-inner border border-teal-700/40">
                                <h4 className="font-semibold mb-2 text-teal-300">Code Explanation:</h4>
                                <p className="whitespace-pre-wrap">{codeExplanation}</p>
                            </div>
                        )}

                        {/* Question Navigation Buttons and Hint/Alternative buttons */}
                        <div className="mt-auto flex flex-wrap justify-between items-center pt-6 border-t border-gray-700 gap-4">
                            <button
                                onClick={() => navigateQuestion('previous')}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                disabled={currentQuestionIndex === 0}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Previous
                            </button>
                            <button
                                onClick={() => navigateQuestion('next')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                            <button
                                onClick={getHint}
                                className="w-full py-3 bg-yellow-600 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={loadingHint || !question}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712L12 16.5l-2.121-2.121c-1.172-1.025-1.172-2.687 0-3.712z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25a.75.75 0 01-.75-.75V15.75a.75.75 0 011.5 0v3.75c0 .414-.336.75-.75.75z" />
                                </svg>
                                {loadingHint ? 'Getting Hint...' : 'Show Hint'}
                            </button>
                             <button
                                onClick={getAlternativeSolution}
                                className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={loadingAlternative || !question}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.234 14.776L11.5 17.585V10.75m4.743 4.743L21 12.25l-4.257-4.257m-4.743 4.743L3.75 12.25l4.257-4.257" />
                                </svg>
                                {loadingAlternative ? 'Generating...' : 'Alternative Solution'}
                            </button>
                             <button
                                onClick={startCodeVisualization}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={!userCode}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0h.008v.008H21m-4.5 0h.008v.008H16.5m-4.5 0h.008v.008H12m-4.5 0h.008v.008H7.5M10.5 18H13.5" />
                                </svg>
                                Code Visualizer (Placeholder)
                            </button>
                        </div>
                    </div>

                    {/* Code Editor and Actions (Console) - Right Panel */}
                    <div className="w-1/2 p-6 bg-[#18181b] rounded-2xl shadow-2xl flex flex-col border border-[#23232b]/80">
                        <div className="flex items-center space-x-2 text-gray-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <span className="text-lg">Code Editor ({supportedLanguages.find(l => l.key === language)?.name})</span>
                        </div>

                        {/* Editor Area */}
                        <div className="relative flex-1 bg-[#23232b] rounded-lg mb-4 overflow-hidden">
                            {loadingQuestion ? (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg animate-pulse">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                                    <span className="ml-4">Loading editor...</span>
                                </div>
                            ) : (
                                <textarea
                                    className="w-full h-full p-4 border-none outline-none font-mono text-gray-200 text-base bg-[#23232b] resize-none"
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    placeholder={`// Write your ${language} code here...`}
                                ></textarea>
                            )}
                        </div>

                        {/* Run and Submit Buttons */}
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={() => runCode(false)} // Run with default test cases
                                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={loadingCheck || !userCode || !question} // removed testCases check as custom test might be used
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653A9.993 9.993 0 0012 21.75a9.993 9.993 0 006.75-16.097M10.5 5.25L10.5 5.25A9.953 9.953 0 0112 3a9.953 9.953 0 011.5.25" />
                                </svg>
                                {loadingCheck ? 'Running...' : 'Run'}
                            </button>
                            <button
                                onClick={() => runCode(false)} // Submit also runs with default test cases
                                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={loadingCheck || !userCode || !question}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit
                            </button>
                        </div>

                        {/* Output Section */}
                        <div className="p-4 bg-[#23232b] rounded-lg shadow-md border border-[#23232b]/60 flex-grow mb-4">
                            <h2 className="text-xl font-semibold text-gray-100 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-purple-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.756 3 12.25c0 1.229.183 2.404.515 3.536.65.234 1.347.377 2.075.407 2.208.083 4.298.375 6.21.897 1.018.272 2.012.483 2.98.636.568.09.95.698 1.03 1.157-.12 2.31-.622 3.398l-1.026 1.848-1.571-1.391a.75.75 0 01-.22-.53z" />
                                </svg>
                                Output
                            </h2>
                            {testResults.length > 0 ? (
                                <div className="space-y-3">
                                    {testResults.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-md shadow-sm ${
                                                result.passed ? 'bg-green-900/80 text-green-200' : 'bg-red-900/80 text-red-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>Test Case {index + 1}:</span>
                                                <span className="font-bold flex items-center gap-2">
                                                    {result.passed ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                    {result.passed ? 'Passed' : 'Failed'}
                                                </span>
                                            </div>
                                            <div className="text-sm mt-2 space-y-1">
                                                <p><strong>Input:</strong> {result.input}</p>
                                                <p><strong>Expected:</strong> {result.expectedOutput}</p>
                                                <p><strong>Actual:</strong> {result.actualOutput}</p>
                                                {result.errorAnalysis && (
                                                    <p className="text-red-300"><strong>Error Analysis:</strong> {result.errorAnalysis}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">Click "Run" to execute your code and see the results here.</p>
                            )}
                        </div>

                        {/* Custom Test Case Creation */}
                        <div className="p-4 bg-[#23232b] rounded-lg shadow-md border border-[#23232b]/60">
                            <h2 className="text-xl font-semibold text-gray-100 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-orange-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m-.75-7.5h.008v.008h-.008v-.008zm2.25 0h.008v.008h-.008v-.008zm2.25 0h.008v.008h-.008v-.008zm2.25 0h.008v.008h-.008v-.008zm-3.75 0h.008v.008h-.008v-.008zm-3.75 0h.008v.008h-.008v-.008zM18 10.5H12a2.25 2.25 0 00-2.25 2.25v.75A2.25 2.25 0 0112 15h6m-3-6h.008v.008h-.008v-.008z" />
                                </svg>
                                Custom Test Cases
                            </h2>
                            <textarea
                                className="w-full p-2 mb-2 border border-gray-600 rounded bg-gray-700 text-gray-200 font-mono text-sm resize-none"
                                rows="3"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter custom input (e.g., 5\n1 2 3 4 5)"
                            ></textarea>
                            <button
                                onClick={() => runCode(true)}
                                className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                disabled={loadingCheck || !userCode || !customInput}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-10.5a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 9v10.5a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                Run Custom Test
                            </button>
                            {customOutput && (
                                <div className="mt-2 p-2 bg-gray-800 rounded text-gray-200 font-mono text-sm">
                                    <strong>Custom Output:</strong> {customOutput}
                                </div>
                            )}
                        </div>

                        {/* AI-Powered Code Explanation Button (moved to right panel) */}
                        <button
                            onClick={getCodeExplanation}
                            className="w-full mt-4 py-3 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                            disabled={loadingExplanation || !userCode}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.174 2.305.153 3.484-.03 1.2-.192 2.323-.386 3.468-.52L14.25 19.5l3.75-2.25V4.5A2.25 2.25 0 0015 2.25H9.75a2.25 2.25 0 00-2.25 2.25v1.161A2.252 2.252 0 005.25 9.75c0 .624-.188 1.23-.523 1.769l-1.082 1.794a.75.75 0 00.27 1.017M12 19.5v-2.25m6-1.5V19.5" />
                            </svg>
                            {loadingExplanation ? 'Explaining...' : 'Explain My Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConsolePage;