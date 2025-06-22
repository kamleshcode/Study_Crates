import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import Roadmaps from './components/Roadmaps';
import Cratelibrary from './components/Cratelibrary';
import Aptitude from './components/Aptitude';
import Login from './components/Login';
import Signup from './components/Signup';
import Services from './components/Services';
import Notes from './components/Notes';
import ConsolePage from './components/ConsolePage';
import QuizPage from './components/QuizePage';
import Interview from './components/Interview';


const Home = () => (
  <>
    <Hero />
    <AboutUs />
    <Services />
    <ContactUs />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/library" element={<Cratelibrary />} />
        <Route path="/aptitude" element={<Aptitude />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/subjects" element={<Notes />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/console" element={<ConsolePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="*" element={<h1 className="text-center text-2xl font-bold mt-20">Page Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};
export default App;