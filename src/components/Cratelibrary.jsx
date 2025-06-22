import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaQuestionCircle, FaPenFancy, FaUserTie } from 'react-icons/fa';
import bgImg from '../assets/bg6.webp';

const Cratelibrary = () => {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen py-40 px-4 relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center mb-4 text-white flex items-center justify-center gap-2 drop-shadow-lg">
          📦 Crate Library – Your Personal Study Vault
        </h1>
        <p className="text-center text-lg text-gray-200 mb-12 drop-shadow">
          Organize and revisit all your favorite study materials and tools in one place.
        </p>
        <div className="grid gap-8">
          {/* Coding Challenges */}
          <div
            className="flex items-start gap-4 bg-black/60 rounded-xl shadow-2xl p-6 border border-blue-900 hover:scale-[1.03] hover:bg-black/80 transition-all cursor-pointer group"
            onClick={() => navigate('/console')}
          >
            <FaCode className="text-blue-400 text-2xl mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-lg text-blue-200 group-hover:text-blue-400 transition">Coding Challenges</div>
              <div className="text-gray-200 text-sm mb-2">
                A curated set of real-world coding problems from beginner to advanced levels.<br />
                <span className="text-blue-400 font-semibold">Benefits:</span> Improves problem-solving skills, helps with competitive programming, and interview prep.
              </div>
            </div>
          </div>
          {/* Quizzes & MCQs */}
          <div
            className="flex items-start gap-4 bg-black/60 rounded-xl shadow-2xl p-6 border border-purple-900 hover:scale-[1.03] hover:bg-black/80 transition-all cursor-pointer group"
            onClick={() => navigate('/quiz')}
          >
            <FaQuestionCircle className="text-purple-400 text-2xl mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-lg text-purple-200 group-hover:text-purple-400 transition">Quizzes & MCQs</div>
              <div className="text-gray-200 text-sm mb-2">
                Topic-wise multiple-choice quizzes with explanations.<br />
                <span className="text-purple-400 font-semibold">Benefits:</span> Boosts recall, helps exam prep, and tracks progress.
              </div>
            </div>
          </div>
          {/* Handwritten Notes */}
          <div
            className="flex items-start gap-4 bg-black/60 rounded-xl shadow-2xl p-6 border border-pink-900 hover:scale-[1.03] hover:bg-black/80 transition-all cursor-pointer group"
            onClick={() => navigate('/subjects')}
          >
            <FaPenFancy className="text-pink-400 text-2xl mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-lg text-pink-200 group-hover:text-pink-400 transition">Handwritten Notes</div>
              <div className="text-gray-200 text-sm mb-2">
                Uploads or shared scans of clean, handwritten summaries.<br />
                <span className="text-pink-400 font-semibold">Benefits:</span> Appeals to visual learners, fast revision, and exam-oriented key points.
              </div>
            </div>
          </div>
          {/* Interview Questions */}
          <div
            className="flex items-start gap-4 bg-black/60 rounded-xl shadow-2xl p-6 border border-green-900 hover:scale-[1.03] hover:bg-black/80 transition-all cursor-pointer group"
            onClick={() => navigate('/interview')}
          >
            <FaUserTie className="text-green-400 text-2xl mt-1 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-lg text-green-200 group-hover:text-green-400 transition">Interview Questions</div>
              <div className="text-gray-200 text-sm mb-2">
                Domain-specific and general HR/technical questions.<br />
                <span className="text-green-400 font-semibold">Benefits:</span> Helps students prepare for job interviews with curated Q&A.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cratelibrary;