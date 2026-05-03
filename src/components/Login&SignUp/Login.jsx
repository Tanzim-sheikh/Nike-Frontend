// import React, { useState, useEffect } from 'react';
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import Header from '../Home/Header';
// import api from '../../api/axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//  const Submit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError('');

//   // Basic validation
//   if (!email || !password) {
//     setError('Please fill in all fields');
//     setIsLoading(false);
//     return;
//   }

//   const loginData = {
//     email,
//     password,
//   };

//   console.log('Login Data:', loginData);

//   try {
//     const response = await api.post('/users/login', loginData);
    
//     console.log('Login successful:', response.data);
    
//     // Show success message
//     toast.success('Login successful!');
    
//     // Store user data in localStorage
//     localStorage.setItem('user', JSON.stringify(response.data.data));
    
//     // Store token if available
//     if (response.data.data.token) {
//       localStorage.setItem('token', response.data.data.token);
//       console.log('Token stored:', response.data.data.token);
//     }
    
//     // Set default Authorization header for future requests
//     if (response.data.data.token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
//     }
    
//     // Redirect to home page or dashboard
//     navigate('/');
    
//   } catch (error) {
//     console.error('Login Error:', error);
    
//     // Handle different error scenarios
//     if (error.response?.status === 401) {
//       setError('Invalid email or password. Please try again.');
//       toast.error('Invalid email or password');
//     } else if (error.response?.status === 403) {
//       setError('Please verify your email before logging in.');
//       toast.error('Email not verified');
      
//       // Optionally redirect to verification page
//       localStorage.setItem('unverifiedEmail', email);
//       navigate('/verify-email', { state: { email } });
//     } else if (error.response?.data?.message) {
//       setError(error.response.data.message);
//       toast.error(error.response.data.message);
//     } else {
//       setError('Login failed. Please check your credentials and try again.');
//       toast.error('Login failed');
//     }
//   } finally {
//     setIsLoading(false);
//   }
// }
//   return (
//     <>
//       <Header className="fixed top-2 left-0 right-0 z-50"/>
//       <div className="min-h-screen flex" style={{ backgroundColor: '#AFAFAF' }}>

//         {/* Right Side - Sign In Form */}
//         <div className="flex-1 flex items-center justify-center h-screen overflow-hidden bg-[#E1E1E1]">
//           <div className="w-full max-w-md mx-8">
          
//             <div className="py-8 px-8 rounded-3xl">
//               <div className="text-center mb-10">
//                 <h2 className="text-4xl italic font-black text-gray-900 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-2">
//                   SIGN IN
//                 </h2>
//                 <p className="text-gray-600 font-medium text-lg">
//                   Welcome back to Nike
//                 </p>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <p className="text-red-700 text-sm font-medium">{error}</p>
//                 </div>
//               )}

//               <form className="space-y-6" onSubmit={Submit}>
                
//                 <div>
//                   <input
//                     name="email"
//                     type="email"
//                     required
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
//                     placeholder="Email Address"
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Password"
//                     className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 
//                     focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
//                     disabled={isLoading}
//                   />

//                   {/* Eye Button */}
//                   <span
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-[#E1E1E1] p-1"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <input
//                       id="rememberMe"
//                       name="rememberMe"
//                       type="checkbox"
//                       className="focus:ring-black h-5 w-5 text-black border-gray-400 rounded transition-colors duration-300"
//                       disabled={isLoading}
//                     />
//                     <label htmlFor="rememberMe" className="block text-sm text-gray-700 font-medium">
//                       Remember me
//                     </label>
//                   </div>
                  
//                   <a href="/forgot-password" className="text-sm font-black text-gray-900 hover:underline transition-all duration-300">
//                     FORGOT PASSWORD?
//                   </a>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full py-4 px-4 border border-transparent rounded-2xl shadow-2xl text-base font-black text-white 
//                     bg-black hover:bg-gray-800 transition-all duration-300 flex items-center justify-center
//                     ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
//                 >
//                   {isLoading ? (
//                     <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     "SIGN IN"
//                   )}
//                 </button>

//                 <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
//                   Don't have an account?{' '}
//                   <a href="/register" className="font-black text-gray-900 hover:underline transition-all duration-300">
//                     JOIN NIKE
//                   </a>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Left Side - Clean Sketchfab 3D Model */}
//         <div className="hidden lg:flex lg:w-1/2 h-screen">
//           <iframe 
//             title="NIKE AIR JORDAN MOCHA"
//             className="w-full h-full"
//             src="https://sketchfab.com/models/dca80390837a49b3bfd869d4dcf74442/embed?autospin=1&autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_annotations=0&ui_color=FFFFFF&ui_fps=0&ui_hint=0&ui_toolbar=0&ui_theme=dark&camera=0&scrollwheel=true"
//             frameBorder="0"
//             allow="autoplay; fullscreen; xr-spatial-tracking"
//             allowFullScreen
//             mozAllowFullScreen="true"
//             webkitAllowFullScreen="true"
//             style={{ backgroundColor: '#AFAFAF' }}
//           ></iframe>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Header from '../Home/Header';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ✅ import kiya hai

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ context se login method lo

  const Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const loginData = { email, password };

    try {
      const response = await api.post('/users/login', loginData);
      console.log('Login successful:', response.data);

      // ✅ Store in localStorage (already hai, but context update karo)
      const userData = response.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }

      // ✅ IMPORTANT: context update karo
      login(userData);

      toast.success('Login successful!');
      navigate('/'); // home page pe jayega, header update ho jayega
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password.');
        toast.error('Invalid credentials');
      } else if (error.response?.status === 403) {
        setError('Please verify your email first.');
        toast.error('Email not verified');
        localStorage.setItem('unverifiedEmail', email);
        navigate('/verify-email', { state: { email } });
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError('Login failed. Try again.');
        toast.error('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex" style={{ backgroundColor: '#AFAFAF' }}>
        {/* Right Side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center h-screen overflow-hidden bg-[#E1E1E1]">
          <div className="w-full max-w-md mx-8">
            <div className="py-8 px-8 rounded-3xl">
              <div className="text-center mb-10">
                <h2 className="text-4xl italic font-black text-gray-900 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-2">
                  SIGN IN
                </h2>
                <p className="text-gray-600 font-medium text-lg">Welcome back to Nike</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={Submit}>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
                    placeholder="Email Address"
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border-b-2 border-gray-300 px-3 py-3 placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300 bg-transparent font-medium"
                    disabled={isLoading}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 bg-[#E1E1E1] p-1"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input id="rememberMe" type="checkbox" className="focus:ring-black h-5 w-5 text-black border-gray-400 rounded" disabled={isLoading} />
                    <label htmlFor="rememberMe" className="block text-sm text-gray-700 font-medium">Remember me</label>
                  </div>
                  <a href="/forgot-password" className="text-sm font-black text-gray-900 hover:underline">FORGOT PASSWORD?</a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-4 border border-transparent rounded-2xl shadow-2xl text-base font-black text-white bg-black hover:bg-gray-800 transition-all duration-300 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "SIGN IN"}
                </button>

                <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                  Don't have an account?{' '}
                  <a href="/register" className="font-black text-gray-900 hover:underline">JOIN NIKE</a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Left Side - 3D Model */}
        <div className="hidden lg:flex lg:w-1/2 h-screen">
          <iframe
            title="NIKE AIR JORDAN MOCHA"
            className="w-full h-full"
            src="https://sketchfab.com/models/dca80390837a49b3bfd869d4dcf74442/embed?autospin=1&autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_fullscreen=0&ui_annotations=0&ui_color=FFFFFF&ui_fps=0&ui_hint=0&ui_toolbar=0&ui_theme=dark&camera=0&scrollwheel=true"
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            style={{ backgroundColor: '#AFAFAF' }}
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Login;