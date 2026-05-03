import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const getStorageKey = () => (user ? `wishlist_${user._id}` : 'wishlist_guest');

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      setWishlist(JSON.parse(stored));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const saveToStorage = (items) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  };

  const addToWishlist = (product) => {
    if (!user) return;
    const exists = wishlist.some(item => item._id === product._id);
    if (!exists) {
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      saveToStorage(newWishlist);
    }
  };

  const removeFromWishlist = (productId) => {
    if (!user) return;
    const newWishlist = wishlist.filter(item => item._id !== productId);
    setWishlist(newWishlist);
    saveToStorage(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist };
};

export default useWishlist;