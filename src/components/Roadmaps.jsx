import React, { useState } from 'react';
import bgImg from '../assets/bg3.jpg';

const roles = [
  { title: "Frontend Developer", icon: "🧑‍💻" },
  { title: "Backend Developer", icon: "🖥️" },
  { title: "Full Stack Developer", icon: "🌍" },
  { title: "Data Scientist", icon: "📈" },
  { title: "DevOps Engineer", icon: "⚙️" },
  { title: "UI/UX Designer", icon: "🎨" },
];

const frontendRoadmap = [
  { label: 'HTML & CSS (Design)', color: 'bg-blue-100 text-blue-800' },
  {
    label: 'JavaScript (Logic)', color: 'bg-yellow-100 text-yellow-800', children: [
      { label: 'DOM', color: 'bg-yellow-50 text-yellow-700' },
      { label: 'ES6+', color: 'bg-yellow-50 text-yellow-700' },
      { label: 'Async JS', color: 'bg-yellow-50 text-yellow-700' },
    ]
  },
  {
    label: 'Frameworks', color: 'bg-green-100 text-green-800', children: [
      { label: 'React | Vue', color: 'bg-green-50 text-green-700' },
    ]
  },
  {
    label: 'UI/UX Design', color: 'bg-pink-100 text-pink-800', children: [
      { label: 'Figma | Tailwind', color: 'bg-pink-50 text-pink-700' },
    ]
  },
  {
    label: 'Tools', color: 'bg-purple-100 text-purple-800', children: [
      { label: 'Git | Webpack', color: 'bg-purple-50 text-purple-700' },
    ]
  },
  {
    label: 'Projects', color: 'bg-orange-100 text-orange-800', children: [
      { label: 'Portfolio, App, PWA', color: 'bg-orange-50 text-orange-700' },
    ]
  },
  {
    label: 'Soft Skills', color: 'bg-gray-100 text-gray-800', children: [
      { label: 'Communication, Debugging', color: 'bg-gray-50 text-gray-700' },
    ]
  },
];

const backendRoadmap = [
  { label: 'Programming Language', color: 'bg-blue-100 text-blue-800', children: [
    { label: 'Python | Java | Node.js | Go', color: 'bg-blue-50 text-blue-700' }
  ]},
  { label: 'Web Frameworks', color: 'bg-green-100 text-green-800', children: [
    { label: 'Express (Node) | Django (Python) | Spring Boot (Java)', color: 'bg-green-50 text-green-700' }
  ]},
  { label: 'Databases', color: 'bg-yellow-100 text-yellow-800', children: [
    { label: 'SQL: PostgreSQL, MySQL', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'NoSQL: MongoDB, Redis', color: 'bg-yellow-50 text-yellow-700' }
  ]},
  { label: 'APIs', color: 'bg-pink-100 text-pink-800', children: [
    { label: 'REST | GraphQL', color: 'bg-pink-50 text-pink-700' }
  ]},
  { label: 'Authentication', color: 'bg-purple-100 text-purple-800', children: [
    { label: 'JWT | OAuth', color: 'bg-purple-50 text-purple-700' }
  ]},
  { label: 'Testing', color: 'bg-orange-100 text-orange-800', children: [
    { label: 'Postman | Unit Tests', color: 'bg-orange-50 text-orange-700' }
  ]},
  { label: 'Deployment', color: 'bg-gray-100 text-gray-800', children: [
    { label: 'Docker | Heroku | AWS', color: 'bg-gray-50 text-gray-700' }
  ]},
  { label: 'Projects 🚀', color: 'bg-blue-200 text-blue-900', children: [
    { label: 'Blog Backend, Chat Server, REST API', color: 'bg-blue-50 text-blue-700' }
  ]},
];

const fullstackRoadmap = [
  { label: 'Frontend (Client Side)', color: 'bg-blue-100 text-blue-800', children: [
    { label: 'HTML, CSS, JavaScript', color: 'bg-blue-50 text-blue-700' },
    { label: 'React | Vue', color: 'bg-blue-50 text-blue-700' }
  ]},
  { label: 'Backend (Server Side)', color: 'bg-green-100 text-green-800', children: [
    { label: 'Node.js | Django | Spring', color: 'bg-green-50 text-green-700' },
    { label: 'APIs & Logic', color: 'bg-green-50 text-green-700' }
  ]},
  { label: 'Databases', color: 'bg-yellow-100 text-yellow-800', children: [
    { label: 'MySQL | MongoDB', color: 'bg-yellow-50 text-yellow-700' }
  ]},
  { label: 'Authentication', color: 'bg-pink-100 text-pink-800', children: [
    { label: 'JWT | Sessions', color: 'bg-pink-50 text-pink-700' }
  ]},
  { label: 'Dev Tools', color: 'bg-purple-100 text-purple-800', children: [
    { label: 'Git | GitHub | Postman', color: 'bg-purple-50 text-purple-700' }
  ]},
  { label: 'Deployment', color: 'bg-orange-100 text-orange-800', children: [
    { label: 'Netlify, Vercel (Frontend)', color: 'bg-orange-50 text-orange-700' },
    { label: 'Heroku, Render (Backend)', color: 'bg-orange-50 text-orange-700' }
  ]},
  { label: 'Projects 🚀', color: 'bg-green-200 text-green-900', children: [
    { label: 'E-commerce, Blog, Chat App', color: 'bg-green-50 text-green-700' }
  ]},
];

const dataScientistRoadmap = [
  { label: 'Programming', color: 'bg-blue-100 text-blue-800', children: [
    { label: 'Python | R', color: 'bg-blue-50 text-blue-700' }
  ]},
  { label: 'Math & Stats', color: 'bg-yellow-100 text-yellow-800', children: [
    { label: 'Probability | Linear Algebra', color: 'bg-yellow-50 text-yellow-700' }
  ]},
  { label: 'Data Handling', color: 'bg-green-100 text-green-800', children: [
    { label: 'Pandas | NumPy', color: 'bg-green-50 text-green-700' }
  ]},
  { label: 'Data Visualization', color: 'bg-pink-100 text-pink-800', children: [
    { label: 'Matplotlib | Seaborn | PowerBI', color: 'bg-pink-50 text-pink-700' }
  ]},
  { label: 'Machine Learning', color: 'bg-purple-100 text-purple-800', children: [
    { label: 'Scikit-learn | XGBoost | TensorFlow', color: 'bg-purple-50 text-purple-700' }
  ]},
  { label: 'SQL & Databases', color: 'bg-orange-100 text-orange-800', children: [
    { label: 'PostgreSQL | MySQL', color: 'bg-orange-50 text-orange-700' }
  ]},
  { label: 'Projects 🚀', color: 'bg-blue-200 text-blue-900', children: [
    { label: 'Sales Prediction | NLP App | Clustering', color: 'bg-blue-50 text-blue-700' }
  ]},
  { label: 'Tools', color: 'bg-gray-100 text-gray-800', children: [
    { label: 'Jupyter | Google Colab | Git', color: 'bg-gray-50 text-gray-700' }
  ]},
];

const devopsRoadmap = [
  { label: 'OS & Terminal', color: 'bg-blue-100 text-blue-800', children: [
    { label: 'Linux | Shell Scripting', color: 'bg-blue-50 text-blue-700' }
  ]},
  { label: 'Version Control', color: 'bg-green-100 text-green-800', children: [
    { label: 'Git | GitHub Actions', color: 'bg-green-50 text-green-700' }
  ]},
  { label: 'CI/CD', color: 'bg-yellow-100 text-yellow-800', children: [
    { label: 'Jenkins | GitHub Actions', color: 'bg-yellow-50 text-yellow-700' }
  ]},
  { label: 'Containerization', color: 'bg-pink-100 text-pink-800', children: [
    { label: 'Docker | Podman', color: 'bg-pink-50 text-pink-700' }
  ]},
  { label: 'Orchestration', color: 'bg-purple-100 text-purple-800', children: [
    { label: 'Kubernetes', color: 'bg-purple-50 text-purple-700' }
  ]},
  { label: 'Cloud', color: 'bg-orange-100 text-orange-800', children: [
    { label: 'AWS | Azure | GCP', color: 'bg-orange-50 text-orange-700' }
  ]},
  { label: 'Monitoring', color: 'bg-gray-100 text-gray-800', children: [
    { label: 'Prometheus | Grafana', color: 'bg-gray-50 text-gray-700' }
  ]},
  { label: 'Projects 🚀', color: 'bg-blue-200 text-blue-900', children: [
    { label: 'Auto Deploy App | K8s Cluster Setup', color: 'bg-blue-50 text-blue-700' }
  ]},
];

const uiuxRoadmap = [
  { label: 'UI Design', color: 'bg-blue-100 text-blue-800', children: [
    { label: 'Colors | Layouts | Typography', color: 'bg-blue-50 text-blue-700' }
  ]},
  { label: 'Tools', color: 'bg-green-100 text-green-800', children: [
    { label: 'Figma | Adobe XD | Sketch', color: 'bg-green-50 text-green-700' }
  ]},
  { label: 'UX Research', color: 'bg-yellow-100 text-yellow-800', children: [
    { label: 'Personas | User Journeys', color: 'bg-yellow-50 text-yellow-700' }
  ]},
  { label: 'Wireframing', color: 'bg-pink-100 text-pink-800', children: [
    { label: 'Low-fidelity | High-fidelity', color: 'bg-pink-50 text-pink-700' }
  ]},
  { label: 'Prototyping', color: 'bg-purple-100 text-purple-800', children: [
    { label: 'Interactive Demos (Figma)', color: 'bg-purple-50 text-purple-700' }
  ]},
  { label: 'Design Systems', color: 'bg-orange-100 text-orange-800', children: [
    { label: 'Components | Guidelines', color: 'bg-orange-50 text-orange-700' }
  ]},
  { label: 'Handoff to Devs', color: 'bg-gray-100 text-gray-800', children: [
    { label: 'Dev Mode in Figma | Zeplin', color: 'bg-gray-50 text-gray-700' }
  ]},
  { label: 'Projects 🚀', color: 'bg-blue-200 text-blue-900', children: [
    { label: 'App UI, Website Redesign, UX Audit', color: 'bg-blue-50 text-blue-700' }
  ]},
];

const roadmapMap = {
  "Frontend Developer": { roadmap: frontendRoadmap, icon: "🧑‍💻" },
  "Backend Developer": { roadmap: backendRoadmap, icon: "🖥️" },
  "Full Stack Developer": { roadmap: fullstackRoadmap, icon: "🌍" },
  "Data Scientist": { roadmap: dataScientistRoadmap, icon: "📈" },
  "DevOps Engineer": { roadmap: devopsRoadmap, icon: "⚙️" },
  "UI/UX Designer": { roadmap: uiuxRoadmap, icon: "🎨" },

};

function VisualRoadmap({ title }) {
  const { roadmap, icon } = roadmapMap[title] || {};
  if (!roadmap) return null;
  return (
    <div className="bg-white/90 rounded-2xl p-6 mt-10 mb-8 shadow-xl border-l-8 border-blue-500 max-w-2xl mx-auto animate-fade-in">
      <div className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-700">
        <span>{title}</span> <span>{icon}</span>
      </div>
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-blue-200 to-blue-400 rounded-full"></div>
        <ul className="space-y-4">
          {roadmap.map((item, idx) => (
            <li key={idx} className="relative">
              <div className="flex items-center gap-3">
                {/* Node dot */}
                <span className="w-4 h-4 rounded-full bg-blue-400 border-2 border-white shadow absolute -left-7 top-2"></span>
                {/* Main node */}
                <span className={`px-4 py-2 rounded-lg font-semibold shadow-sm ${item.color}`}>
                  {item.label}
                </span>
              </div>
              {/* Children */}
              {item.children && (
                <ul className="ml-10 mt-2 space-y-2">
                  {item.children.map((child, cidx) => (
                    <li key={cidx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-200 border-2 border-white shadow"></span>
                      <span className={`px-3 py-1 rounded font-medium text-sm shadow-sm ${child.color}`}>
                        {child.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const Roadmaps = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section className="min-h-screen py-36 px-4 relative"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* <div className="max-w-4xl mx-auto"> */}
      <div className="absolute inset-0 bg-black/60"></div> {/* Overlay for readability */}
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Career Navigator</h1>
        <p className="text-center text-lg text-purple-500 mb-12">
          Explore step-by-step roadmaps for every tech role. Click a role to view its detailed roadmap!
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(selected === role.title ? null : role.title)}
              className={`block w-full bg-white rounded-xl shadow-lg p-6 hover:bg-blue-100 transition border border-blue-200 text-left focus:outline-none ${
                selected === role.title ? "ring-2 ring-blue-400" : ""
              }`}
              type="button"
            >
              <span className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                {role.icon} {role.title}
              </span>
            </button>
          ))}
        </div>
        {selected && <VisualRoadmap title={selected} />}
      </div>
    </section>
  );
};

export default Roadmaps;