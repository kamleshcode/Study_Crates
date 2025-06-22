import React from 'react';
import crateLibraryImg from '../assets/bg6.webp';
import smartQuizzesImg from '../assets/bg6.webp';
import handwrittenNotesImg from '../assets/bg6.webp';
import codingChallengesImg from '../assets/bg6.webp';
import studyRoadmapsImg from '../assets/bg6.webp';
import interviewPrepImg from '../assets/bg6.webp';

const services = [
  {
    title: 'Crate Library',
    subtitle: 'Save, Organize, and Revisit',
    description:
      'A personal space where you can store your favorite notes, flashcards, quizzes, and study plans. Organize resources by subject, difficulty, or exams — all accessible with a single click.',
    img: crateLibraryImg,
    features: ['Organize Notes', 'Study Plans'],
  },
  {
    title: 'Smart Quizzes & MCQs',
    subtitle: 'Learn by Doing',
    description:
      'Topic-wise and level-based quizzes with instant feedback, explanations, and performance tracking. Perfect for revision, practice, and building exam confidence.',
    img: smartQuizzesImg,
    features: ['Instant Feedback', 'Performance Tracking'],
  },
  {
    title: 'Handwritten Notes',
    subtitle: 'Visual & Exam-Focused Learning',
    description:
      'Access beautifully scanned handwritten notes for subjects like Physics, Chemistry, and Math. Designed to simplify concepts and save time — ideal for visual learners and last-minute prep.',
    img: handwrittenNotesImg,
    features: ['Simplified Concepts', 'Visual Learning'],
  },
  {
    title: 'Coding Challenges',
    subtitle: 'Practice with Purpose',
    description:
      'Solve structured programming problems from basic to advanced. Ideal for computer science students preparing for technical interviews or building algorithmic thinking.',
    img: codingChallengesImg,
    features: ['Algorithmic Thinking', 'Interview Prep'],
  },
  {
    title: 'Study Roadmaps',
    subtitle: 'Structured Learning Paths',
    description:
      'Clear, goal-oriented roadmaps for exams, subjects, or careers (e.g., NEET, JEE, Python Developer). Each roadmap breaks complex goals into achievable weekly milestones.',
    img: studyRoadmapsImg,
    features: ['Goal-Oriented', 'Weekly Milestones'],
  },
  {
    title: 'Interview Preparation',
    subtitle: 'Get Job-Ready',
    description:
      'Explore a rich set of frequently asked technical and HR interview questions. Includes coding interview patterns, behavioral questions, and resume-building tips.',
    img: interviewPrepImg,
    features: ['Technical Q&A', 'Resume Tips'],
  },
];

const Services = () => (
  <section className="w-full min-h-screen bg-black flex flex-col items-center py-16 px-0 font-sans">
    {/* Page Title Section */}
    <div className="w-full max-w-7xl mx-auto px-4 mb-12 text-center">
      <div className="uppercase tracking-widest text-gray-400 mb-2" style={{fontFamily: 'San Francisco, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", sans-serif'}}>Features</div>
      <h2
        className="text-3xl md:text-4xl font-extrabold mb-4 text-[#d65cc6]"
        style={{ fontFamily: 'San Francisco, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", sans-serif' }}
      >
        Our Features & Services.
      </h2>
    </div>

    {/* Horizontal Carousel */}
    <div className="w-full max-w-7xl overflow-x-auto scrollbar-hide px-4">
      <div className="flex space-x-8 pb-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl overflow-hidden min-h-[480px] w-80 flex-shrink-0 flex flex-col justify-end shadow-2xl"
            style={{
              minHeight: 480,
              boxShadow:
                '0 8px 32px 0 rgba(0,0,0,0.75), 0 2px 8px 0 rgba(42,124,111,0.15)',
            }}
          >
            {/* Full card image */}
            <img
              src={service.img}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-black/40 to-transparent"></div>
            {/* Card Content */}
            <div className="relative z-10 flex flex-col h-full justify-end p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-white/90 text-sm mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="w-full bg-black text-[#aa3ba8] px-6 py-3 rounded-full font-semibold
                           shadow-md hover:bg-purple-400 transition-colors duration-300
                           focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 mt-auto"
              >
                MORE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Custom Scrollbar hide styles */}
    <style jsx="true">{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  </section>
);

export default Services;