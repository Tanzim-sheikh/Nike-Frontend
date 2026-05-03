import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const statuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount || 0);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const res = await api.get('/orders/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.patch(`/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: res.data.data.status } : order));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  };

  const filteredOrders = useMemo(() => {
    const needle = searchTerm.toLowerCase();
    return orders.filter(order => {
      const customer = `${order.user?.name || ''} ${order.user?.surname || ''} ${order.user?.email || ''}`.toLowerCase();
      const items = order.items.map(item => item.name).join(' ').toLowerCase();
      return order._id.toLowerCase().includes(needle) || customer.includes(needle) || items.includes(needle);
    });
  }, [orders, searchTerm]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black italic">Order Management</h1>
            <p className="text-gray-500">Review purchases, customers, payment IDs, and fulfillment status.</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="bg-white border px-4 py-2 rounded-lg font-semibold">Dashboard</button>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders, customers, or products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-lg border shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-gray-500">Order #{order._id}</p>
                  <h2 className="text-lg font-bold mt-1">{order.user?.name || 'Customer'} {order.user?.surname || ''}</h2>
                  <p className="text-sm text-gray-500">{order.user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Payment: {order.paymentId}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="text-right">
                    <p className="text-2xl font-black">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded-lg px-3 py-2 capitalize"
                  >
                    {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4 divide-y">
                {order.items.map(item => (
                  <div key={`${order._id}-${item.productId}-${item.size}`} className="py-3 flex gap-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover bg-gray-100" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Size {item.size} | Qty {item.quantity} | {formatCurrency(item.price)} each</p>
                    </div>
                    <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <span className="font-semibold">Ship to:</span> {order.address?.houseNo}, {order.address?.addressLine}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-lg border p-10 text-center text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
