import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import logo from '../assets/Logo.png';
import { FaHome, FaUserGraduate, FaBook, FaListAlt, FaMapSigns } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/aboutus', label: 'About Us', icon: <FaUserGraduate /> },
  { to: '/subjects', label: 'Subjects', icon: <FaBook /> },
  { to: '/library', label: 'Crate Library', icon: <FaListAlt /> },
  { to: '/aptitude', label: 'Aptitude', icon: <FaListAlt /> },
  { to: '/roadmaps', label: 'Roadmaps', icon: <FaMapSigns /> },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAboutUsActive = () =>
    typeof window !== 'undefined' && window.location.hash === '#aboutus';

  const isActive = (link) =>
    link.to.startsWith('#')
      ? isAboutUsActive()
      : location.pathname === link.to;

  return (
    <motion.nav
      variants={fadeIn ? fadeIn('down', 0.2) : {}}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-3xl"
      style={{ background: 'transparent' }}
    >
      <div className="relative flex justify-center">
        {/* Pill background */}
        <div className="bg-white/10 backdrop-blur-xl rounded-full shadow-2xl flex px-3 py-2 gap-1 sm:gap-3 md:gap-4 items-end w-full border border-white/40">
          {navLinks.map((link, idx) => (
            <div key={link.to} className="relative flex flex-col items-center flex-1">
              {/* Icon as button */}
              {link.to.startsWith('#') ? (
                <a
                  href={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-center rounded-full w-8 h-8 transition-colors duration-200 mb-1
                    ${isActive(link)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-transparent text-gray-400 hover:bg-purple-100 hover:text-purple-600'
                    }`}
                  style={{ fontSize: '1.1rem' }}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ) : (
                <Link
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-center rounded-full w-8 h-8 transition-colors duration-200 mb-1
                    ${isActive(link)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-transparent text-gray-400 hover:bg-purple-100 hover:text-purple-600'
                    }`}
                  style={{ fontSize: '1.1rem' }}
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              )}
              {/* Label (not clickable) */}
              <span
                className={`text-[10px] sm:text-xs font-semibold select-none
                  ${isActive(link) ? 'text-purple-600' : 'text-gray-500'}`}
              >
                {link.label}
              </span>
            </div>
          ))}
          {/* Sign In Button */}
          <button
            className="ml-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold shadow-lg transition-all flex items-center justify-center"
            style={{
              height: '45px',
              minWidth: '100px',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              fontSize: '0.95rem',
              marginBottom: '0.15rem'
            }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div> 
      </div>

            
            
      {/* Mobile Menu Button */}
      <button
        className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-purple-700 bg-white/60 rounded-full shadow transition"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl rounded-3xl mt-4 mx-auto py-4 shadow-lg border border-white/30 w-[90vw] max-w-2xl">
          <div className="container mx-auto px-4 space-y-2">
            {navLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                {link.to.startsWith('#') ? (
                  <a
                    href={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center rounded-full w-8 h-8 transition-colors duration-200
                      ${isActive(link)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-transparent text-purple-600 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                    style={{ fontSize: '1rem' }}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center rounded-full w-8 h-8 transition-colors duration-200
                      ${isActive(link)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-transparent text-purple-600 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                    style={{ fontSize: '1rem' }}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </Link>
                )}
                <span
                  className={`text-xs font-medium select-none
                    ${isActive(link) ? 'text-purple-600' : 'text-gray-800'}`}
                >
                  {link.label}
                </span>
              </div>
            ))}
            {/* Sign In Button for Mobile */}
            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold shadow-lg mt-2 transition-all flex items-center justify-center"
              style={{
                height: '32px',
                fontSize: '0.95rem'
              }}
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/login');
              }}
            >
              Sign In
            </button>
            <button
              className="w-full bg-white/90 text-purple-700 px-7 py-2.5 rounded-full font-medium shadow hover:bg-white transition-all mt-2"
            >
              <Link to="/library">Go to Library</Link>
            </button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;

