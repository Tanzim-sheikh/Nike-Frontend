import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount || 0);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.get('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const cards = [
    { label: 'Revenue', value: formatCurrency(stats?.totalRevenue), icon: CurrencyRupeeIcon },
    { label: 'Orders', value: stats?.totalOrders || 0, icon: ShoppingBagIcon },
    { label: 'Users', value: stats?.totalUsers || 0, icon: UserGroupIcon },
    { label: 'Products', value: stats?.totalProducts || 0, icon: ArchiveBoxIcon },
    { label: 'Low Stock', value: stats?.lowStock || 0, icon: ExclamationTriangleIcon },
    { label: 'Out of Stock', value: stats?.outOfStock || 0, icon: ClipboardDocumentListIcon },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-black italic">Nike Admin</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-gray-500">Store performance, stock health, users, and order activity.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/products" className="bg-black text-white px-4 py-2 rounded-lg font-semibold">Products</Link>
            <Link to="/admin/orders" className="bg-white border px-4 py-2 rounded-lg font-semibold">Orders</Link>
            <Link to="/admin/users" className="bg-white border px-4 py-2 rounded-lg font-semibold">Users</Link>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{label}</p>
                <Icon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-3xl font-black mt-3">{value}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm font-semibold text-black">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.recentOrders || []).map(order => (
                  <tr key={order._id}>
                    <td className="px-5 py-4 font-mono text-xs">{order._id.slice(-8)}</td>
                    <td className="px-5 py-4">{order.user?.name || 'Customer'} {order.user?.surname || ''}</td>
                    <td className="px-5 py-4 font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4 capitalize">{order.status}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <div className="p-8 text-center text-gray-500">No orders yet.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
