// src/components/Profile/Profile.jsx (updated)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Header from '../Home/Header';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    mobile: '',
    houseNo: '',
    addressLine: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddressWarning, setShowAddressWarning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (location.state?.fromCheckout) {
      setShowAddressWarning(true);
      // Auto-hide after 8 seconds or keep until address filled? Better keep until address is filled.
      // We'll keep it visible and let user dismiss manually.
    }
  }, [location]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.data);
      if (res.data.data.address) {
        setAddress(res.data.data.address);
        // Check if address is complete after fetch
        const isComplete = checkAddressComplete(res.data.data.address);
        if (isComplete) setShowAddressWarning(false);
      }
    } catch (err) {
      toast.error('Failed to load profile');
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const checkAddressComplete = (addr) => {
    if (!addr) return false;
    const required = ['mobile', 'houseNo', 'addressLine', 'city', 'district', 'state', 'pincode'];
    return required.every(field => addr[field] && addr[field].trim() !== '');
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await api.put('/users/address', address, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Address updated successfully');
      setShowAddressWarning(false); // hide warning after saving
      // Optionally redirect back to product page? User can manually go back.
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading profile...</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Warning Banner */}
          {showAddressWarning && !checkAddressComplete(address) && (
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Action Required:</strong> Please complete your delivery address below before making a purchase.
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button onClick={() => setShowAddressWarning(false)} className="text-yellow-500 hover:text-yellow-700">
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rest of profile UI (same as before) */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-black text-white px-6 py-4">
              <h1 className="text-2xl font-bold italic">My Profile</h1>
            </div>

            {/* User Info - Read Only */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-gray-900 font-medium">{user?.name} {user?.surname || ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email Address</label>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Address Form */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ... same address fields as before ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                    <input type="tel" name="mobile" value={address.mobile} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black" placeholder="9876543210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">House/Flat No. *</label>
                    <input type="text" name="houseNo" value={address.houseNo} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black" placeholder="A-101, Saffron Towers" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address Line *</label>
                  <input type="text" name="addressLine" value={address.addressLine} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-black focus:border-black" placeholder="Street, locality, landmark" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700">City/Town *</label><input type="text" name="city" value={address.city} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">District *</label><input type="text" name="district" value={address.district} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700">State *</label><input type="text" name="state" value={address.state} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium text-gray-700">Pincode *</label><input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2" pattern="[0-9]{6}" maxLength="6" /></div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={saving} className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;