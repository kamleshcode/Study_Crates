import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import contactBg from '../assets/Contactus.jpg';

const ContactUs = () => {
  return (
    <section
      id="contact"
      // className="bg-gradient-to-br from-blue-900 via-black to-gray-950 min-h-[60vh] flex items-center justify-center px-4 py-16"
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{
      backgroundImage: `url(${contactBg})`,
    }}
    >
      
      {/* <div className="absolute inset-0 bg-black/40"></div> */}
      <div className="max-w-3xl w-full mx-auto bg-black/40 rounded-2xl shadow-2xl p-8 md:p-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center">
          Contact Us
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <FaEnvelope className="text-blue-400 text-2xl" />
              <span className="text-white text-lg">kamleshit21@email.com</span>
            </motion.div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <FaPhoneAlt className="text-green-400 text-2xl" />
              <span className="text-white text-lg">+91 94296 58314</span>
            </motion.div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <FaMapMarkerAlt className="text-pink-400 text-2xl" />
              <span className="text-white text-lg">Gujarat, India</span>
            </motion.div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <a href="https://www.linkedin.com/in/kamlesh-patel-962580242/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition">
                <FaLinkedin className="text-blue-500 text-2xl" />
                <span className="text-white text-lg">LinkedIn</span>
              </a>
            </motion.div>
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <a href="https://github.com/kamleshcode" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition">
                <FaGithub className="text-gray-300 text-2xl" />
                <span className="text-white text-lg">GitHub</span>
              </a>
            </motion.div>
          </div>
          {/* Contact Form */}
          <motion.form
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-6"
            onSubmit={e => e.preventDefault()}
          >
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                rows="4"
                placeholder="Your message..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;