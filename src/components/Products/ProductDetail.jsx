// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../api/axios';
// import { toast } from 'react-toastify';
// import { ShoppingBagIcon, ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
// import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
// import { useAuth } from '../../context/AuthContext';
// import useWishlist from '../../hooks/useWishlist';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [mainImage, setMainImage] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [userAddress, setUserAddress] = useState(null);
//   const [addressLoading, setAddressLoading] = useState(true);
//   const [sizeError, setSizeError] = useState(false);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/products/${id}`);
//         setProduct(res.data.data);
//         if (res.data.data.images?.length) setMainImage(res.data.data.images[0]);
//       } catch (err) {
//         toast.error('Product not found');
//         navigate('/products');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id, navigate]);

//   useEffect(() => {
//     const fetchUserAddress = async () => {
//       if (!user) {
//         setAddressLoading(false);
//         return;
//       }
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No token');
//         const res = await api.get('/users/profile', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUserAddress(res.data.data.address || null);
//       } catch (err) {
//         setUserAddress(null);
//       } finally {
//         setAddressLoading(false);
//       }
//     };
//     fetchUserAddress();
//   }, [user]);

//   const isAddressComplete = (address) => {
//     if (!address) return false;
//     const required = ['mobile', 'houseNo', 'addressLine', 'city', 'district', 'state', 'pincode'];
//     return required.every(field => address[field] && address[field].trim() !== '');
//   };

//   const handleWishlist = () => {
//     if (!user) {
//       toast.error('Please login to add to wishlist');
//       navigate('/login');
//       return;
//     }
//     if (isInWishlist(product._id)) {
//       removeFromWishlist(product._id);
//       toast.success('Removed from wishlist');
//     } else {
//       addToWishlist(product);
//       toast.success('Added to wishlist');
//     }
//   };

//   const handleAddToCart = () => {
//     if (!selectedSize) {
//       setSizeError(true);
//       toast.error('Please select a size');
//       setTimeout(() => setSizeError(false), 1000);
//       return;
//     }
//     if (!user) {
//       toast.error('Please login first');
//       navigate('/login');
//       return;
//     }
//     if (addressLoading) {
//       toast.info('Fetching address, please wait...');
//       return;
//     }
//     if (!isAddressComplete(userAddress)) {
//       toast.warning('Please complete your address before buying');
//       navigate('/profile', { state: { fromCheckout: true, productId: id, size: selectedSize, quantity } });
//       return;
//     }
//     // Initiate payment
//     handlePayment();
//   };

//   // Load Razorpay script dynamically
//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     // Check if script loaded
//     const isScriptLoaded = await loadRazorpayScript();
//     if (!isScriptLoaded) {
//       toast.error('Payment gateway failed to load. Please try again.');
//       return;
//     }

//     const options = {
//       key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//       amount: (product.sale && product.salePrice ? product.salePrice : product.price) * quantity * 100, // in paise
//       currency: 'INR',
//       name: 'Nike Store',
//       description: `${product.name} (Size: ${selectedSize}) x ${quantity}`,
//       image: '/nike.png', // optional
//       prefill: {
//         name: `${user?.name} ${user?.surname || ''}`,
//         email: user?.email,
//         contact: userAddress?.mobile || '',
//       },
//       notes: {
//         address: `${userAddress?.addressLine}, ${userAddress?.city}, ${userAddress?.state} - ${userAddress?.pincode}`,
//         productId: product._id,
//         size: selectedSize,
//         quantity: quantity,
//       },
//       theme: {
//         color: '#000000',
//       },
//       handler: function (response) {
//         // Payment successful
//         toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
//         // TODO: Save order in backend, clear cart, redirect to success page
//         console.log('Payment success:', response);
//         // navigate('/order-success', { state: { paymentId: response.razorpay_payment_id } });
//       },
//       modal: {
//         ondismiss: function () {
//           toast.info('Payment cancelled');
//         },
//       },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   };

//   if (loading) return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-50">
//       <div className="animate-pulse text-center">
//         <div className="w-24 h-24 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading product...</p>
//       </div>
//     </div>
//   );
//   if (!product) return null;

//   const liked = isInWishlist(product._id);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="group flex items-center gap-2 text-gray-500 hover:text-black transition mb-6"
//         >
//           <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
//           <span className="text-sm font-medium">Back to Products</span>
//         </button>

//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
//           {/* Left: Image Gallery */}
//           <div className="lg:w-1/2">
//             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
//               <div className="aspect-square w-full overflow-hidden bg-white">
//                 <img
//                   src={mainImage}
//                   alt={product.name}
//                   className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
//                 />
//               </div>
//             </div>
//             {/* Thumbnails */}
//             {product.images?.length > 1 && (
//               <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2">
//                 {product.images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setMainImage(img)}
//                     className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-400'
//                       }`}
//                   >
//                     <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right: Product Details */}
//           <div className="lg:w-1/2 space-y-6">
//             {/* Title & Wishlist */}
//             <div className="flex justify-between items-start gap-4">
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
//                 {product.name}
//               </h1>
//               <button
//                 onClick={handleWishlist}
//                 className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition"
//               >
//                 {liked ? (
//                   <HeartSolid className="h-6 w-6 text-red-500" />
//                 ) : (
//                   <HeartIcon className="h-6 w-6 text-gray-600" />
//                 )}
//               </button>
//             </div>

//             {/* Meta */}
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                 {product.gender} · {product.shoeType}
//               </span>
//               {product.featured && (
//                 <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Featured</span>
//               )}
//               {product.sale && (
//                 <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">Sale</span>
//               )}
//             </div>

//             {/* Description */}
//             {product.description && (
//               <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
//             )}

//             {/* Price */}
//             <div className="border-t border-gray-100 pt-4">
//               {product.sale && product.salePrice ? (
//                 <div className="flex items-center gap-3">
//                   <span className="text-3xl font-bold text-red-600">${product.salePrice}</span>
//                   <span className="text-lg line-through text-gray-400">${product.price}</span>
//                   <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Save ${(product.price - product.salePrice).toFixed(2)}</span>
//                 </div>
//               ) : (
//                 <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//               )}
//             </div>

//             {/* Size Selector */}
//             <div>
//               <p className={`font-semibold text-gray-800 mb-3 ${sizeError ? 'text-red-600' : ''}`}>
//                 Select Size {sizeError && <span className="text-xs ml-2">(required)</span>}
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {product.sizes.map(size => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       setSizeError(false);
//                     }}
//                     className={`min-w-[60px] px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-200 ${selectedSize === size
//                         ? 'bg-black text-white border-black shadow-md'
//                         : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:shadow-sm'
//                       } ${sizeError ? 'border-red-500 ring-2 ring-red-200' : ''}`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity */}
//             <div>
//               <p className="font-semibold text-gray-800 mb-3">Quantity</p>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => quantity > 1 && setQuantity(quantity - 1)}
//                   className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
//                 >
//                   -
//                 </button>
//                 <span className="w-12 text-center text-lg font-medium">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Buy Button */}
//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.01]"
//             >
//               <ShoppingBagIcon className="h-5 w-5" />
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { ShoppingBagIcon, ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import useWishlist from '../../hooks/useWishlist';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [userAddress, setUserAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
        if (res.data.data.images?.length) setMainImage(res.data.data.images[0]);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!user) {
        setAddressLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserAddress(res.data.data.address || null);
      } catch (err) {
        setUserAddress(null);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchUserAddress();
  }, [user]);

  const isAddressComplete = (address) => {
    if (!address) return false;
    const required = ['mobile', 'houseNo', 'addressLine', 'city', 'district', 'state', 'pincode'];
    return required.every(field => address[field] && address[field].trim() !== '');
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.error('Payment config missing');
      return;
    }

  const amountInPaise = 100; // ₹1 for testing – later replace with actual calculation

    const checkoutAmountInPaise = Math.round((product.sale && product.salePrice ? product.salePrice : product.price) * quantity * 100);

  // 1. Create order from backend
    let order;
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/payment/create-order', {
        amount: checkoutAmountInPaise,
        currency: 'INR',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      order = response.data.order;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create payment order');
      console.error('Razorpay order creation failed:', err.response?.data || err);
      return;
    }

  // 2. Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error('Payment gateway failed to load');
      return;
    }

    const orderId = order.id;
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
    name: 'Nike Store',
    description: `${product.name} (Size: ${selectedSize}) x ${quantity}`,
    order_id: orderId,          // ✅ critical: use order_id from backend
    prefill: {
      name: `${user?.name} ${user?.surname || ''}`.trim(),
      email: user?.email,
      contact: userAddress?.mobile || '9999999999',
    },
    notes: {
      address: `${userAddress?.addressLine}, ${userAddress?.city}, ${userAddress?.state} - ${userAddress?.pincode}`,
      productId: product._id,
      size: selectedSize,
      quantity,
    },
    theme: { color: '#000000' },
    handler: async (response) => {
      const orderData = {
        razorpayOrderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        items: [{
          productId: product._id,
          name: product.name,
          price: product.sale && product.salePrice ? product.salePrice : product.price,
          size: selectedSize,
          quantity,
          image: product.images?.[0] || mainImage,
        }],
        totalAmount: order.amount / 100,
        address: {
          mobile: userAddress.mobile,
          houseNo: userAddress.houseNo,
          addressLine: userAddress.addressLine,
          city: userAddress.city,
          district: userAddress.district,
          state: userAddress.state,
          pincode: userAddress.pincode,
        },
      };

      try {
        const token = localStorage.getItem('token');
        const orderResponse = await api.post('/orders', orderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(prev => ({
          ...prev,
          items_left: Math.max(0, Number(prev.items_left || 0) - quantity),
        }));
        setQuantity(1);
        toast.success('Payment successful. Order placed!');
        console.log('Order placed:', orderResponse.data.data);
        navigate('/my-orders');
      } catch (err) {
        console.error('Order save failed', err.response?.data || err);
        toast.error(err.response?.data?.message || 'Payment captured, but order save failed');
      }
    },
    modal: {
      ondismiss: () => toast.info('Payment cancelled'),
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.on('payment.failed', (response) => {
    const error = response.error || {};
    toast.error(error.description || error.reason || 'Payment failed');
    console.error('Razorpay payment failed:', error);
  });
  razorpay.open();
};

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      toast.error('Please select a size');
      setTimeout(() => setSizeError(false), 1000);
      return;
    }
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (Number(product.items_left || 0) <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity > Number(product.items_left || 0)) {
      toast.error(`Only ${product.items_left} item(s) left in stock`);
      return;
    }
    if (addressLoading) {
      toast.info('Fetching address, please wait...');
      return;
    }
    if (!isAddressComplete(userAddress)) {
      toast.warning('Please complete your address before buying');
      navigate('/profile', { state: { fromCheckout: true, productId: id, size: selectedSize, quantity } });
      return;
    }
    initiatePayment();
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-pulse text-center">
        <div className="w-24 h-24 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product...</p>
      </div>
    </div>
  );
  if (!product) return null;

  const liked = isInWishlist(product._id);
  const unitPrice = product.sale && product.salePrice ? product.salePrice : product.price;
  const totalPrice = unitPrice * quantity;
  const stockLeft = Number(product.items_left || 0);
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-black transition mb-6">
          <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back to Products</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-square w-full overflow-hidden bg-white">
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            {product.images?.length > 1 && (
              <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-400'}`}>
                    <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
              <button onClick={handleWishlist} className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition">
                {liked ? <HeartSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6 text-gray-600" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.gender} · {product.shoeType}</span>
              {product.featured && <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">Featured</span>}
              {product.sale && <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">Sale</span>}
            </div>

            {product.description && <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>}

            <div className="border-t border-gray-100 pt-4">
              {product.sale && product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-red-600">{formatCurrency(product.salePrice)}</span>
                  <span className="text-lg line-through text-gray-400">{formatCurrency(product.price)}</span>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Save {formatCurrency(product.price - product.salePrice)}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className={`px-3 py-1 rounded-full ${stockLeft > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {stockLeft > 0 ? `${stockLeft} in stock` : 'Out of stock'}
                </span>
                <span className="text-gray-600">Total: <strong>{formatCurrency(totalPrice)}</strong></span>
              </div>
            </div>

            {/* Size */}
            <div>
              <p className={`font-semibold text-gray-800 mb-3 ${sizeError ? 'text-red-600' : ''}`}>
                Select Size {sizeError && <span className="text-xs ml-2">(required)</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`min-w-[60px] px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-200 ${selectedSize === size ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-black hover:shadow-sm'
                      } ${sizeError ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">-</button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => quantity < stockLeft ? setQuantity(quantity + 1) : toast.info(`Only ${stockLeft} item(s) left in stock`)}
                  disabled={stockLeft <= 0 || quantity >= stockLeft}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >+</button>
              </div>
              <p className="mt-2 text-sm text-gray-500">Line total: {formatCurrency(totalPrice)}</p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={stockLeft <= 0}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <ShoppingBagIcon className="h-5 w-5" /> {stockLeft > 0 ? `Buy Now - ${formatCurrency(totalPrice)}` : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
