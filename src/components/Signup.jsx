import React, { useState } from 'react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async e => {
    e.preventDefault();
    setSuccess('');
    if (!email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
      } else {
        setSuccess('Signup successful! Please login.');
        setEmail('');
        setPassword('');
        setConfirm('');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-3xl overflow-hidden">
        {/* Left Side - Info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-700 to-purple-500 w-1/2 p-8">
          <h2 className="text-white text-2xl font-bold mb-4 text-left w-full">Join StudyCrate for smarter learning</h2>
          <p className="text-purple-100 text-base">Create your free account and start your journey!</p>
        </div>
        {/* Right Side - Signup Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">Sign Up</h2>
          <p className="text-gray-500 mb-6">Create your StudyCrate account</p>
          <button className="flex items-center w-full mb-3 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <FaGoogle className="text-red-500 mr-3" /> Sign up with Google
          </button>
          <button className="flex items-center w-full mb-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <FaFacebookF className="text-blue-600 mr-3" /> Sign up with Facebook
          </button>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-sm">Or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign Up
            </button>
          </form>
          <div className="text-center text-sm mt-2">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;