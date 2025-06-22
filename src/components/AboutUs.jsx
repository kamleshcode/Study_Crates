import React from 'react';
import aboutUs from '../assets/aboutUs.jpg';

const AboutUs = () => {
  return (
    <section className="bg-[#f5f5f5] py-16 px-4 flex justify-center items-center min-h-[70vh]">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12">
        {/* Left: Image & Icon */}
        <div className="relative w-full md:w-1/2 flex flex-col items-center">
          <img
            src={aboutUs}
            alt="About Us"
            className="rounded-lg shadow-xl w-full max-w-xs object-cover"
          />
          {/* Social icons (optional) */}
          <div className="flex gap-4 mt-4 text-gray-500 text-xl">
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        {/* Right: Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-5xl font-extrabold tracking-widest text-gray-900 mb-6">
            ABOUT US
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            StudyCrate started as a small initiative to help students organize their learning resources and collaborate on projects. Our mission is to empower learners with curated notes, interactive tools, and a supportive community, making education accessible and enjoyable for everyone.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Today, we offer a wide range of academic resources, project collaboration features, and personalized dashboards to help you track your progress. Join us and be a part of a vibrant learning journey!
          </p>
          {/* Decorative line */}
          <div className="mt-8 w-16 h-1 bg-gray-800 rounded"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;