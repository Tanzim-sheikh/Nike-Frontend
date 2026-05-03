// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from '../../api/axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Header from '../Home/Header';

// const OTPVerification = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [canResend, setCanResend] = useState(true);
//   const [verificationStatus, setVerificationStatus] = useState('pending');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Check if user came from verification link
//     const token = searchParams.get('token');
//     if (token) {
//       handleAutoVerify(token);
//       return;
//     }

//     // Get email from location state or localStorage
//     const getEmailFromSource = () => {
//       if (location.state?.email) {
//         return location.state.email;
//       }
//       const savedEmail = localStorage.getItem('unverifiedEmail');
//       return savedEmail || '';
//     };

//     const userEmail = getEmailFromSource();
//     if (userEmail) {
//       setEmail(userEmail);
//     } else {
//       toast.error('No email found. Please register first.');
//       navigate('/register');
//     }
//   }, [location, navigate, searchParams]);

//   // Countdown timer for resend button
//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     } else {
//       setCanResend(true);
//     }
//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [countdown]);

//   const handleAutoVerify = async (token) => {
//     try {
//       setIsLoading(true);
//       setError('');
      
//       const response = await axios.get(`/users/verify-email?token=${token}`);
      
//       toast.success('Email verified successfully!');
//       setVerificationStatus('verified');
      
//       const userEmail = localStorage.getItem('unverifiedEmail') || email;
      
//       setTimeout(() => {
//         localStorage.removeItem('unverifiedEmail');
//         navigate('/login', { 
//           state: { 
//             email: userEmail,
//             message: 'Email verified successfully! Please login with your credentials.'
//           } 
//         });
//       }, 2000);
      
//     } catch (error) {
//       console.error('Auto-verify error:', error);
//       const errorMessage = error.response?.data?.message || 'Verification failed';
      
//       // Set specific error messages based on backend response
//       if (errorMessage.includes('Invalid or expired')) {
//         setError('This verification link has expired or is invalid. Please request a new verification email.');
//       } else if (errorMessage.includes('token')) {
//         setError('Invalid verification link. Please check the link or request a new one.');
//       } else {
//         setError(errorMessage);
//       }
      
//       toast.error(errorMessage);
//       setVerificationStatus('error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendVerificationEmail = async () => {
//     if (!email) {
//       setError('Email not found. Please register again.');
//       toast.error('Email not found. Please register again.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError('');
      
//       const response = await axios.post('/users/resend-verification', 
//         { email: email },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       if (response.data.success) {
//         toast.success('Verification email sent successfully! Check your inbox.');
//         setVerificationStatus('sent');
//         setCountdown(60);
//         setCanResend(false);
//         setError('');
//       }
//     } catch (error) {
//       console.error('Resend verification error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to send verification email';
      
//       if (errorMessage.includes('already verified')) {
//         setError('Your email is already verified. You can proceed to login.');
//         setVerificationStatus('verified');
//       } else {
//         setError(errorMessage);
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCheckVerification = async () => {
//     if (!email) {
//       setError('Email not found. Please register again.');
//       toast.error('Email not found. Please register again.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError('');
      
//       // Try to resend verification - if it says "already verified", then user is verified
//       await axios.post('/users/resend-verification', { email: email });
      
//       // If no error, user is not verified yet
//       setVerificationStatus('sent');
//       setError('Please check your email and click the verification link. If you already did, wait a moment and try again.');
//       toast.info('Please check your email and click the verification link');
        
//     } catch (error) {
//       console.error('Check verification error:', error);
      
//       if (error.response?.data?.message?.includes('already verified')) {
//         // User is verified!
//         setVerificationStatus('verified');
//         setError('');
//         toast.success('Email verified successfully!');
        
//         setTimeout(() => {
//           localStorage.removeItem('unverifiedEmail');
//           navigate('/login', { 
//             state: { 
//               email,
//               message: 'Email verified successfully! Please login with your credentials.'
//             } 
//           });
//         }, 2000);
//       } else {
//         const errorMessage = error.response?.data?.message || 'Please check your email and click the verification link';
//         setError(errorMessage);
//         setVerificationStatus('sent');
//         toast.info('Please check your email and click the verification link');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleContinueToLogin = () => {
//     localStorage.removeItem('unverifiedEmail');
//     navigate('/login', { 
//       state: { 
//         email,
//         message: 'Please check your email and verify your account before logging in.'
//       } 
//     });
//   };

//   // If user came from verification link, show verifying message
//   if (searchParams.get('token') && isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Verifying your email...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header className="fixed top-0 left-0 right-0 z-50" />
//       <div className="min-h-screen flex" style={{ backgroundColor: '#AFAFAF' }}>

//         {/* Right Side - Verification Form */}
//         <div className="flex-1 flex pt-8 items-center justify-center h-screen overflow-hidden bg-[#E1E1E1]">
//           <div className="w-full max-w-md mx-8">
//             <div className="py-10 px-8">
//               <div className="text-center mb-10">
//                 <h2 className="text-4xl font-black text-900-gray italic bg-clip-text mb-2">
//                   VERIFY EMAIL
//                 </h2>
//                 {/* <p className="text-gray-600 font-medium text-lg">
//                   Complete your registration
//                 </p> */}
//                 <p className="text-sm text-gray-500 mt-1 break-all">
//                   {email}
//                 </p>
//               </div>

//               {/* Error Messages */}
//               {error && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
//                   <div className="flex items-start">
//                     <svg className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                     <div className="flex-1">
//                       <p className="text-red-800 font-medium text-sm">{error}</p>
//                       {error.includes('expired') && (
//                         <button
//                           onClick={handleSendVerificationEmail}
//                           disabled={!canResend || isLoading}
//                           className="text-red-600 text-xs underline mt-1 hover:text-red-800"
//                         >
//                           Click here to get a new verification link
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Status Messages */}
//               {verificationStatus === 'verified' && !error && (
//                 <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <p className="text-green-800 font-medium">Email verified successfully!</p>
//                   </div>
//                   <p className="text-green-600 text-sm mt-1">Redirecting to login...</p>
//                 </div>
//               )}

//               {/* Instructions */}
//               <div className="bg-gray-50 p-6 rounded-xl mb-3 border border-gray-200">
//                 <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">What to do:</h4>
//                 <ol className="text-sm text-gray-600 space-y-3">
//                   <li className="flex items-start">
//                     <span className="flex-shrink-0 h-5 w-5 bg-black text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
//                     <span className="flex-1">Check your email inbox for verification link</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="flex-shrink-0 h-5 w-5 bg-black text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
//                     <span className="flex-1">Click the verification link in the email</span>
//                   </li>
//                   <li className="flex items-start">
//                     <span className="flex-shrink-0 h-5 w-5 bg-black text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
//                     <span className="flex-1">Return here and confirm verification</span>
//                   </li>
//                 </ol>

//                 {/* Additional Help for Common Issues */}
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <p className="text-xs text-gray-500 mb-2">Having trouble?</p>
//                   <ul className="text-xs text-gray-500 space-y-1">
//                     <li>• Check your spam folder</li>
//                     <li>• Ensure you're using the same email you registered with</li>
//                     <li>• Verification links expire after 24 hours</li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="space-y-3">
//                 <button
//                   type="button"
//                   onClick={handleCheckVerification}
//                   disabled={isLoading || !email}
//                   className={`w-full py-4 px-4 border border-transparent rounded-2xl shadow-2xl text-base font-black text-white 
//                     bg-black hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center
//                     ${(isLoading || !email) ? "opacity-70 cursor-not-allowed" : ""}`}
//                 >
//                   {isLoading ? (
//                     <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     "I'VE VERIFIED MY EMAIL"
//                   )}
//                 </button>

//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     type="button"
//                     onClick={handleSendVerificationEmail}
//                     disabled={!canResend || isLoading || !email}
//                     className={`py-3 px-4 border border-gray-300 rounded-2xl text-sm font-bold text-gray-700 
//                       bg-white hover:bg-gray-50 transition-all duration-300 flex items-center justify-center
//                       ${(!canResend || isLoading || !email) ? "opacity-50 cursor-not-allowed" : ""}`}
//                   >
//                     {canResend ? 'RESEND EMAIL' : `RESEND IN ${countdown}s`}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleContinueToLogin}
//                     disabled={isLoading}
//                     className="py-3 px-4 border border-gray-300 rounded-2xl text-sm font-bold text-gray-700 
//                       bg-white hover:bg-gray-50 transition-all duration-300"
//                   >
//                     CONTINUE TO LOGIN
//                   </button>
//                 </div>
//               </div>

//               {/* Help Text */}
//               <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-200 mt-6">
//                 Didn't receive the email?{' '}
//                 <button
//                   onClick={handleSendVerificationEmail}
//                   disabled={!canResend || isLoading}
//                   className={`font-black text-gray-900 hover:underline transition-all duration-300
//                     ${(!canResend || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   RESEND VERIFICATION EMAIL
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OTPVerification;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Home/Header';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleAutoVerify(token);
      return;
    }

    const getEmailFromSource = () => {
      if (location.state?.email) return location.state.email;
      const savedEmail = localStorage.getItem('unverifiedEmail');
      return savedEmail || '';
    };

    const userEmail = getEmailFromSource();
    if (userEmail) {
      setEmail(userEmail);
    } else {
      toast.error('No email found. Please register first.');
      navigate('/register');
    }
  }, [location, navigate, searchParams]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => timer && clearTimeout(timer);
  }, [countdown]);

  const handleAutoVerify = async (token) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await axios.get(`/users/verify-email?token=${token}`);

      toast.success('Email verified successfully!');
      setVerificationStatus('verified');

      const userEmail = localStorage.getItem('unverifiedEmail') || email;

      setTimeout(() => {
        localStorage.removeItem('unverifiedEmail');
        navigate('/login', {
          state: {
            email: userEmail,
            message: 'Email verified successfully! Please login.'
          }
        });
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!email) return toast.error('Email not found. Please register again.');

    try {
      setIsLoading(true);
      setError('');

      const response = await axios.post(
        '/users/resend-verification',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        toast.success('Verification email sent!');
        setVerificationStatus('sent');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsLoading(true);
      setError('');

      await axios.post('/users/resend-verification', { email });

      setVerificationStatus('sent');
      toast.info('Check your inbox and click the verify link.');

    } catch (error) {
      const message = error.response?.data?.message;

      if (message?.includes('already verified')) {
        toast.success('Email verified successfully!');
        setVerificationStatus('verified');

        setTimeout(() => {
          localStorage.removeItem('unverifiedEmail');
          navigate('/login', {
            state: { email, message: 'Email verified! Login now.' }
          });
        }, 2000);
      } else {
        setError(message || 'Verification pending');
        toast.info('Please click the verification link in your inbox.');
        setVerificationStatus('sent');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToLogin = () => {
    localStorage.removeItem('unverifiedEmail');
    navigate('/login', {
      state: { email, message: 'Please verify before login.' }
    });
  };

  return (
    <>
      <Header />

      {/* Full width + full height content */}
      <div className="min-h-screen bg-gray-100 w-full flex justify-center pt-24 pb-10 px-4">

        {/* Center Box */}
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black italic">VERIFY EMAIL</h2>
            <p className="text-gray-600 text-sm mt-1">{email}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Verified Message */}
          {verificationStatus === 'verified' && (
            <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-xl text-sm font-medium">
              Email Verified Successfully!
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 p-5 rounded-xl border mb-5">
            <h4 className="text-sm font-bold mb-3">What to do</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Check your email inbox</li>
              <li>• Click the verification link</li>
              <li>• Return here and click “I've verified my email”</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={isLoading}
              className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900"
            >
              {isLoading ? 'Checking...' : "I'VE VERIFIED MY EMAIL"}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleSendVerificationEmail}
                disabled={!canResend || isLoading}
                className="py-3 border rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50"
              >
                {canResend ? 'RESEND EMAIL' : `WAIT ${countdown}s`}
              </button>

              <button
                onClick={handleContinueToLogin}
                className="py-3 border rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50"
              >
                CONTINUE TO LOGIN
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default OTPVerification;
