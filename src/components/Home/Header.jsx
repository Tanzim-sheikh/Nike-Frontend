// import { useState, useRef, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { MagnifyingGlassIcon, HeartIcon, UserIcon, ArrowLeftOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setShowDropdown(false);
//   };

//   const handleNavigation = (path, params = {}) => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     const queryString = new URLSearchParams(params).toString();
//     navigate(queryString ? `${path}?${queryString}` : path);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
//     setShowSearch(false);
//     setSearchQuery('');
//   };

//   const navItems = [
//     { label: 'New Releases', params: { sort: 'newest' } },
//     { label: 'Men', params: { gender: 'MEN' } },
//     { label: 'Women', params: { gender: 'WOMEN' } },
//     { label: 'Kids', params: { gender: 'KIDS' } },
//     { label: 'Sale', params: { sale: 'true' } }
//   ];

//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <div className="flex items-center cursor-pointer shrink-0" onClick={() => navigate('/')}>
//             <img src="nike.png" alt="Nike" className="h-8 w-8 object-contain" />
//             <span className="ml-2 text-xl font-bold text-gray-900 italic">NIKE</span>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
//             {navItems.map(item => (
//               <button
//                 key={item.label}
//                 onClick={() => handleNavigation('/products', item.params)}
//                 className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
//               >
//                 {item.label}
//               </button>
//             ))}
//           </nav>

//           {/* Right side icons + auth */}
//           <div className="flex items-center space-x-3">
//             {/* Search */}
//             <div className="hidden md:block relative">
//               {showSearch ? (
//                 <form onSubmit={handleSearchSubmit} className="flex items-center">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search products..."
//                     className="w-48 lg:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black/20"
//                     autoFocus
//                   />
//                   <button type="submit" className="ml-2 p-1.5 hover:bg-gray-100 rounded-full">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowSearch(false)}
//                     className="ml-1 p-1.5 hover:bg-gray-100 rounded-full"
//                   >
//                     <XMarkIcon className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </form>
//               ) : (
//                 <button
//                   onClick={() => setShowSearch(true)}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
//                 </button>
//               )}
//             </div>

//             {/* Auth Buttons / User Dropdown */}
//             <div className="hidden sm:flex items-center space-x-3">
//               {!user ? (
//                 <>
//                   <button
//                     onClick={() => navigate('/login')}
//                     className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition"
//                   >
//                     Sign In
//                   </button>
//                   <button
//                     onClick={() => navigate('/register')}
//                     className="bg-gray-900 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-black transition"
//                   >
//                     Join Us
//                   </button>
//                 </>
//               ) : (
//                 <div className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={() => setShowDropdown(!showDropdown)}
//                     className="flex items-center gap-2 text-gray-700 hover:text-black font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition"
//                   >
//                     <span>Hi, {user.name || user.email?.split('@')[0] || 'User'}</span>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {showDropdown && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
//                       <button
//                         onClick={() => {
//                           setShowDropdown(false);
//                           navigate('/wishlist');
//                         }}
//                         className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                       >
//                         <HeartIcon className="h-5 w-5" />
//                         My Wishlist
//                       </button>
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
//                       >
//                         <ArrowLeftOnRectangleIcon className="h-5 w-5" />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden p-2 rounded-lg hover:bg-gray-50"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
//             {navItems.map(item => (
//               <button
//                 key={item.label}
//                 onClick={() => {
//                   handleNavigation('/products', item.params);
//                   setIsMenuOpen(false);
//                 }}
//                 className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 rounded-lg"
//               >
//                 {item.label}
//               </button>
//             ))}
//             {/* Mobile search */}
//             <div className="px-4 py-2">
//               <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-200 rounded-full px-3 py-1">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="flex-1 text-sm outline-none bg-transparent"
//                 />
//                 <button type="submit" className="p-1">
//                   <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
//                 </button>
//               </form>
//             </div>
//             <div className="border-t border-gray-200 pt-4 mt-2">
//               {!user ? (
//                 <>
//                   <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg">Sign In</button>
//                   <button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg mt-1">Join Us</button>
//                 </>
//               ) : (
//                 <>
//                   <span className="block px-4 py-2 text-gray-700 font-medium">Hi, {user.name || user.email}</span>
//                   <button onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
//                     <HeartIcon className="h-5 w-5" /> Wishlist
//                   </button>
//                   <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-1">
//                     <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MagnifyingGlassIcon, HeartIcon, UserIcon, ArrowLeftOnRectangleIcon, XMarkIcon, UserCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleNavigation = (path, params = {}) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const queryString = new URLSearchParams(params).toString();
    navigate(queryString ? `${path}?${queryString}` : path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  const navItems = [
    { label: 'New Releases', params: { sort: 'newest' } },
    { label: 'Men', params: { gender: 'MEN' } },
    { label: 'Women', params: { gender: 'WOMEN' } },
    { label: 'Kids', params: { gender: 'KIDS' } },
    { label: 'Sale', params: { sale: 'true' } }
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <img src="nike.png" alt="Nike" className="h-8 w-8 object-contain" />
            <span className="ml-2 text-xl font-bold text-gray-900 italic">NIKE</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavigation('/products', item.params)}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side icons + auth */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:block relative">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 lg:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black/20"
                    autoFocus
                  />
                  <button type="submit" className="ml-2 p-1.5 hover:bg-gray-100 rounded-full">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="ml-1 p-1.5 hover:bg-gray-100 rounded-full"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* Auth Buttons / User Dropdown */}
            <div className="hidden sm:flex items-center space-x-3">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-gray-900 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-black transition"
                  >
                    Join Us
                  </button>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-gray-700 hover:text-black font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span>{user.name || user.email?.split('@')[0] || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/profile');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <UserIcon className="h-5 w-5" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/wishlist');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <HeartIcon className="h-5 w-5" />
                        My Wishlist
                      </button>
                      <button 
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/my-orders');
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <ShoppingBagIcon className="h-5 w-5" />
                        My Orders
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  handleNavigation('/products', item.params);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 rounded-lg"
              >
                {item.label}
              </button>
            ))}
            {/* Mobile search */}
            <div className="px-4 py-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-sm outline-none bg-transparent"
                />
                <button type="submit" className="p-1">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                </button>
              </form>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-2">
              {!user ? (
                <>
                  <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg">Sign In</button>
                  <button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg mt-1">Join Us</button>
                </>
              ) : (
                <>
                  <span className="block px-4 py-2 text-gray-700 font-medium">Hi, {user.name || user.email}</span>
                  <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    <UserIcon className="h-5 w-5" /> My Profile
                  </button>
                  <button onClick={() => { navigate('/my-orders'); setIsMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    <ShoppingBagIcon className="h-5 w-5" /> My Orders
                  </button>
                  <button onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    <HeartIcon className="h-5 w-5" /> Wishlist
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-1">
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;