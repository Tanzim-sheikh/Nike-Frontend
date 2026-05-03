import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Home/Header';
import Footer from '../Home/Footer';

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount || 0);

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold italic mb-6">My Orders</h1>
        {orders.length === 0 && <p>No orders yet.</p>}
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-bold">Order ID: {order._id}</span>
                <span className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="text-sm capitalize">Status: {order.status}</div>
              <div className="text-sm">Payment ID: {order.paymentId}</div>
              <div className="text-sm">Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}</div>
              <div className="mt-3 space-y-2">
                {order.items.map(item => (
                  <div key={`${order._id}-${item.productId}-${item.size}`} className="flex gap-4 border-t pt-2">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p>Size: {item.size} | Qty: {item.quantity}</p>
                      <p>{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right font-bold mt-2">Total: {formatCurrency(order.totalAmount)}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
