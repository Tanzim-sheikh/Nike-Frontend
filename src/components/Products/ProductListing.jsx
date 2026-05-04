import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProductCard from './ProductCard';
import Footer from '../Home/Footer';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  UserCircleIcon,
  HeartIcon,
  ArrowLeftOnRectangleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const ProductListing = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    shoeType: searchParams.get('shoeType') || '',
    search: searchParams.get('search') || '',
    sale: searchParams.get('sale') === 'true' || false,
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [itemsToShow, setItemsToShow] = useState(9);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch all products once
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        setAllProducts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, searchParams]);

  // Filter + Sort
  useEffect(() => {
    if (!allProducts.length) return;
    let filtered = [...allProducts];
    
    if (filters.gender) filtered = filtered.filter(p => p.gender === filters.gender);
    if (filters.shoeType) filtered = filtered.filter(p => p.shoeType === filters.shoeType);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
    }
    if (filters.sale) filtered = filtered.filter(p => p.sale === true);
    if (filters.minPrice) filtered = filtered.filter(p => (p.sale && p.salePrice ? p.salePrice : p.price) >= Number(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => (p.sale && p.salePrice ? p.salePrice : p.price) <= Number(filters.maxPrice));

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'price_asc') {
      filtered.sort((a, b) => (a.sale && a.salePrice ? a.salePrice : a.price) - (b.sale && b.salePrice ? b.salePrice : b.price));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => (b.sale && b.salePrice ? b.salePrice : b.price) - (a.sale && a.salePrice ? a.salePrice : a.price));
    } else if (sortBy === 'random') {
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }

    setProducts(filtered);
    setItemsToShow(9); // reset pagination on filter/sort change

    const urlParams = {};
    if (filters.gender) urlParams.gender = filters.gender;
    if (filters.shoeType) urlParams.shoeType = filters.shoeType;
    if (filters.search) urlParams.search = filters.search;
    if (filters.sale) urlParams.sale = 'true';
    if (filters.minPrice) urlParams.minPrice = filters.minPrice;
    if (filters.maxPrice) urlParams.maxPrice = filters.maxPrice;
    if (sortBy !== 'newest') urlParams.sort = sortBy;
    setSearchParams(urlParams);
  }, [filters, allProducts, sortBy, setSearchParams]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => {
    setFilters({ gender: '', shoeType: '', search: '', sale: false, minPrice: '', maxPrice: '' });
    setItemsToShow(9);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const visibleProducts = products.slice(0, itemsToShow);
  const hasMore = itemsToShow < products.length;

  const genders = ['MEN', 'WOMEN', 'KIDS', 'UNISEX'];
  const shoeTypes = ['RUNNING', 'BASKETBALL', 'TENNIS', 'GOLF', 'SKATEBOARDING', 'FOOTBALL', 'TRAINING', 'LIFESTYLE'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1">
        {/* Top Bar: Logo + User Dropdown */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src="/nike.png" alt="Nike" className="h-8 w-8 object-contain" />
            <span className="ml-2 text-xl font-bold text-gray-900 italic">NIKE</span>
          </div>
          <div className="relative">
            {user ? (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-gray-700 hover:text-black font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>{user.name || user.email?.split('@')[0]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-black font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Sign In
              </button>
            )}
            {showDropdown && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                <button
                  onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  My Profile
                </button>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/my-orders'); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  My Orders
                </button>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/wishlist'); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <HeartIcon className="h-5 w-5" />
                  My Wishlist
                </button>
                <button
                  onClick={() => { setShowDropdown(false); handleLogout(); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row: Back button + Search bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors duration-200 self-start sm:self-auto"
          >
            <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="relative w-full sm:max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 rounded-full py-3 px-4 shadow-sm text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters & Sort
            {(filters.gender || filters.shoeType || filters.sale || filters.minPrice || filters.maxPrice) && (
              <span className="ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
                {[filters.gender, filters.shoeType, filters.sale ? 'sale' : null, filters.minPrice || filters.maxPrice ? 'price' : null].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Two column layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white overflow-auto' : 'hidden'} md:block md:relative md:bg-transparent w-full md:w-72 lg:w-80 flex-shrink-0 transition-all`}>
            <div className="sticky top-6 md:top-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
              {showFilters && (
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 md:hidden">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-1 rounded-full bg-gray-100">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-base text-gray-900">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500">Clear all</button>
              </div>

              {/* Gender */}
              <div>
                <h4 className="font-semibold text-xs text-gray-900 uppercase tracking-wide mb-2">Gender</h4>
                <div className="space-y-1.5">
                  {genders.map(g => (
                    <label key={g} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="gender" value={g} checked={filters.gender === g} onChange={() => handleFilterChange('gender', g)} className="w-3.5 h-3.5" />
                      <span className="text-sm text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shoe Type */}
              <div>
                <h4 className="font-semibold text-xs text-gray-900 uppercase tracking-wide mb-2">Category</h4>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-2 custom-scrollbar">
                  {shoeTypes.map(type => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={filters.shoeType === type} onChange={() => handleFilterChange('shoeType', filters.shoeType === type ? '' : type)} className="w-3.5 h-3.5 rounded" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-xs text-gray-900 uppercase tracking-wide mb-2">Price Range</h4>
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm" />
                  <span className="text-gray-400 text-xs">—</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className="w-full border rounded-lg px-2 py-1.5 text-sm" />
                </div>
              </div>

              {/* Sale */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={filters.sale} onChange={(e) => handleFilterChange('sale', e.target.checked)} className="w-3.5 h-3.5 rounded" />
                <span className="text-sm text-gray-700">On Sale Only</span>
              </label>

              {/* Active tags */}
              {(filters.gender || filters.shoeType || filters.sale || filters.minPrice || filters.maxPrice) && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1.5">
                    {filters.gender && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{filters.gender} <button onClick={() => handleFilterChange('gender', '')}>✕</button></span>}
                    {filters.shoeType && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{filters.shoeType} <button onClick={() => handleFilterChange('shoeType', '')}>✕</button></span>}
                    {filters.sale && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Sale <button onClick={() => handleFilterChange('sale', false)}>✕</button></span>}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                        <button onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }}>✕</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="mt-4 text-sm text-black underline">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 && 's'}</p>
                  <div className="relative">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer">
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="random">Random</option>
                    </select>
                    <ChevronUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {visibleProducts.map(product => <ProductCard key={product._id} product={product} />)}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setItemsToShow(prev => prev + 9)}
                      className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListing;