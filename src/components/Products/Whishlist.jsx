// src/components/Products/Wishlist.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWishlist from '../../hooks/useWishlist';
import ProductCard from './ProductCard';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  if (!wishlist.length) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items here</p>
            <button onClick={() => navigate('/products')} className="bg-black text-white px-6 py-2 rounded-full">Explore Products</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold italic mb-8">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;