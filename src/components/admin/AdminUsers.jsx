import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const needle = searchTerm.toLowerCase();
    return users.filter(user => {
      const address = user.address ? Object.values(user.address).join(' ') : '';
      return `${user.name} ${user.surname} ${user.email} ${address}`.toLowerCase().includes(needle);
    });
  }, [users, searchTerm]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black italic">Users</h1>
            <p className="text-gray-500">Customer accounts, verification status, and saved delivery addresses.</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="bg-white border px-4 py-2 rounded-lg font-semibold">Dashboard</button>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, city, or pincode..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mobile</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{user.name} {user.surname}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4">{user.address?.mobile || '-'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {user.address?.addressLine ? `${user.address.houseNo}, ${user.address.addressLine}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}` : 'No address'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-gray-500">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
