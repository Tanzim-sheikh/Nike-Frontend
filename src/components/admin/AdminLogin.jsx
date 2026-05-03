// src/components/Admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // your axios instance
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !secretKey) {
      toast.error('All fields are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/admin/login', { email, password, secretKey });
      const { token } = response.data.data;
      // Store token in localStorage (or sessionStorage)
      localStorage.setItem('adminToken', token);
      toast.success('Admin login successful');
      navigate('/admin/dashboard'); // redirect to admin dashboard
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black italic">Admin Login</h2>
          <p className="text-gray-500 text-sm">Enter your credentials & secret key</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
              placeholder="admin@nike.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition"
              placeholder="Secret key"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Login as Admin'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          <span>⚠️ Only authorized personnel</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;