import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Header from '../Home/Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/users/forgot-password', { email });
      toast.success('Reset link sent to your email!');
      setSent(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-black italic text-center mb-2">Forgot Password</h2>
          <p className="text-gray-500 text-center mb-6">
            Enter your email and we'll send you a reset link
          </p>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-300 py-3 px-2 mb-6 focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              {error && (
  <div className="bg-red-100 mt-2 text-red-700 p-3 rounded-lg mb-4 text-sm">
    {error}
  </div>
)}
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600 mb-4">✓ Check your email for the reset link</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;