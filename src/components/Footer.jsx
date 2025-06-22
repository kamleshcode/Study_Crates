import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-black text-white py-10 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            StudyCrate
          </span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-full ml-2">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex gap-6 mb-4 md:mb-0">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
            <FaGithub size={22} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">
            <FaLinkedin size={22} />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
            <FaTwitter size={22} />
          </a>
        </div>
        <div className="text-xs text-gray-300 text-center md:text-right">
          Made with <span className="text-pink-400">♥</span> for learners everywhere.
        </div>
      </div>
    </footer>
  );
};

export default Footer;