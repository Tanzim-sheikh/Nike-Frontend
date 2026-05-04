

// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// const Product = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [isPaused, setIsPaused] = useState(false);
//     const progressRef = useRef(null);
//     const navigate = useNavigate();
//     const { user } = useAuth();

//     const slides = [
//         {
//             id: 1,
//             image: "Jordan1.avif",
//             mainText: "KICKS THAT CAN'T MISS",
//             subText: "Gift the perfect start sneakers that every move",
//             buttonText: "Shop",
//             title: "JORDAN 1 RETRO HIGH",
//             description: "Classic design meets modern comfort"
//         },
//         {
//             id: 2,
//             image: "Jordan2.avif",
//             mainText: "BUBBLE BOY",
//             subText: "While the pandemic changed the world, the king's dominance remains the same",
//             buttonText: "Notify Me",
//             title: "AIR JORDAN 4",
//             description: "Iconic silhouette with premium materials"
//         },
//         {
//             id: 3,
//             image: "Jordan3.avif",
//             mainText: "LEGEND RETURNS",
//             subText: "The legacy continues with groundbreaking innovation and style",
//             buttonText: "Explore",
//             title: "JORDAN 11 LEGEND",
//             description: "Elegance and performance combined"
//         }
//     ];

//     const handleShopClick = () => {
//     user ? navigate('/products') : navigate('/login');
//   };

//     // Auto slide with progress bar
//     useEffect(() => {
//         if (isPaused) return;

//         const interval = setInterval(() => {
//             setCurrentSlide((prev) => (prev + 1) % slides.length);
//         }, 5000);

//         // Reset progress bar animation
//         if (progressRef.current) {
//             progressRef.current.style.animation = 'none';
//             setTimeout(() => {
//                 if (progressRef.current) {
//                     progressRef.current.style.animation = 'progress 5s linear';
//                 }
//             }, 10);
//         }

//         return () => clearInterval(interval);
//     }, [currentSlide, isPaused, slides.length]);

//     const nextSlide = () => {
//         setCurrentSlide((prev) => (prev + 1) % slides.length);
//     };

//     const prevSlide = () => {
//         setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     };

//     const goToSlide = (index) => {
//         setCurrentSlide(index);
//     };

//     // Nike images for proper infinite loop
//     const nikeImages = Array(12).fill("nike.png");

//     // Animation variants
//     const imageVariants = {
//         enter: {
//             opacity: 0,
//             x: 300,
//             scale: 0.8
//         },
//         center: {
//             opacity: 1,
//             x: 0,
//             scale: 1,
//             transition: {
//                 duration: 0.8,
//                 ease: [0.4, 0, 0.2, 1]
//             }
//         },
//         exit: {
//             opacity: 0,
//             x: -300,
//             scale: 0.8,
//             transition: {
//                 duration: 0.6,
//                 ease: [0.4, 0, 0.2, 1]
//             }
//         }
//     };

//     const textVariants = {
//         enter: {
//             opacity: 0,
//             y: 50
//         },
//         center: {
//             opacity: 1,
//             y: 0,
//             transition: {
//                 duration: 0.6,
//                 delay: 0.3,
//                 ease: [0.4, 0, 0.2, 1]
//             }
//         },
//         exit: {
//             opacity: 0,
//             y: -50
//         }
//     };

//     return (
//         <section className="bg-white min-h-screen">
//             <div className="max-w-7xl mx-auto">

//                 {/* Container 1: Full Width Image Container with Nike Slider */}
//                 <div className="w-full bg-gray-100 overflow-hidden rounded-2xl relative">

//                     {/* Vertical Nike Slider - Proper Infinite Loop */}
//                     <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 h-80 overflow-hidden">
//                         <div className="animate-smooth-vertical-scroll">
//                             <div className="flex flex-col gap-8">
//                                 {nikeImages.map((nike, index) => (
//                                     <motion.img
//                                         key={index}
//                                         className="h-10 w-auto object-contain flex-shrink-0"
//                                         src={nike}
//                                         alt={`Nike ${index + 1}`}
//                                         whileHover={{ scale: 1.2, rotate: 5 }}
//                                         transition={{ type: "spring", stiffness: 300 }}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Product Image with Smooth Animation */}
//                     <div className="flex justify-center items-center h-[500px] lg:h-[700px] ml-20 overflow-hidden">
//                         <AnimatePresence mode="wait">
//                             <motion.img
//                                 key={currentSlide}
//                                 src={slides[currentSlide].image}
//                                 alt={slides[currentSlide].title}
//                                 className="w-full h-[110%] object-cover -mt-12"
//                                 variants={imageVariants}
//                                 initial="enter"
//                                 animate="center"
//                                 exit="exit"
//                                 whileHover={{ scale: 1.02 }}
//                                 transition={{ duration: 0.3 }}
//                             />
//                         </AnimatePresence>
//                     </div>
//                 </div>

//                 {/* Container 2: Text Container with Smooth Animation */}
//                 <div className="w-full py-8 px-4">
//                     <div className="text-center max-w-4xl mx-auto">
//                         <AnimatePresence mode="wait">
//                             <motion.div
//                                 key={currentSlide}
//                                 variants={textVariants}
//                                 initial="enter"
//                                 animate="center"
//                                 exit="exit"
//                             >
//                                 <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight italic">
//                                     {slides[currentSlide].mainText}
//                                 </h2>
//                                 <h5 className="text-xl lg:text-2xl text-gray-600 font-light mb-6 leading-relaxed">
//                                     {slides[currentSlide].subText}
//                                 </h5>
//                                 <motion.button
//                                     className="bg-black text-white px-12 py-3 rounded-full font-bold text-lg tracking-widest hover:bg-gray-800"
//                                     onClick={handleShopClick}
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
                                    
//                                 >
//                                     {slides[currentSlide].buttonText}
//                                 </motion.button>
//                             </motion.div>
//                         </AnimatePresence>
//                     </div>
//                 </div>

//                 {/* Container 3: Controls Container */}
//                 <div className="w-full bg-gray-100 py-6 px-4">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="flex flex-col items-center space-y-4">

//                             {/* Controls Row - Dots center, buttons right */}
//                             <div className="flex items-center justify-between w-full">

//                                 {/* Left side - Empty space for balance */}
//                                 <div className="w-10"></div>

//                                 {/* Dots Navigation - Center */}
//                                 <div className="flex space-x-2 pl-30">
//                                     {slides.map((_, index) => (
//                                         <motion.button
//                                             key={index}
//                                             onClick={() => goToSlide(index)}
//                                             className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index
//                                                     ? 'bg-black scale-125'
//                                                     : 'bg-gray-400 hover:bg-gray-600'
//                                                 }`}
//                                             whileHover={{ scale: 1.3 }}
//                                             whileTap={{ scale: 0.8 }}
//                                         />
//                                     ))}
//                                 </div>

//                                 {/* Right side - All buttons together */}
//                                 <div className="flex items-center space-x-4">

                                    
//                                     {/* Left Arrow */}
//                                     <motion.button
//                                         onClick={prevSlide}
//                                         className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-black transition-all duration-300 shadow-sm"
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                     >
//                                         <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                                         </svg>
//                                     </motion.button>

//                                     {/* Play/Pause Button */}
//                                     <div className="relative">
//                                         <motion.button
//                                             onClick={() => setIsPaused(!isPaused)}
//                                             className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 relative overflow-hidden border-2 border-gray-300"
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                         >
//                                             {isPaused ? (
//                                                 <svg className="w-4 h-4 text-gray-700 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                                                 </svg>
//                                             ) : (
//                                                 <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
//                                                 </svg>
//                                             )}

//                                             {/* Circular Progress Bar */}
//                                             <div className="absolute inset-0">
//                                                 <div
//                                                     ref={progressRef}
//                                                     className="w-full h-full rounded-full border-2 border-transparent progress-bar"
//                                                     style={{
//                                                         background: `conic-gradient(#6b7280 ${isPaused ? 0 : 360}deg, transparent 0deg)`,
//                                                         mask: 'radial-gradient(white 50%, transparent 51%)',
//                                                         WebkitMask: 'radial-gradient(white 50%, transparent 51%)'
//                                                     }}
//                                                 />
//                                             </div>
//                                         </motion.button>
//                                     </div>


//                                     {/* Right Arrow */}
//                                     <motion.button
//                                         onClick={nextSlide}
//                                         className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-black transition-all duration-300 shadow-sm"
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                     >
//                                         <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                         </svg>
//                                     </motion.button>
//                                 </div>
//                             </div>

//                             {/* Slide Info - Center aligned */}
//                             <AnimatePresence mode="wait">
//                                 <motion.div
//                                     key={currentSlide}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.4 }}
//                                     className="text-center"
//                                 >
//                                     <p className="text-lg font-bold text-gray-900">{slides[currentSlide].title}</p>
//                                     <p className="text-gray-600 text-sm mt-1">{slides[currentSlide].description}</p>
//                                 </motion.div>
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* CSS Animations */}
//             <style jsx>{`
//         @keyframes progress {
//           0% {
//             background: conic-gradient(#000000 0deg, transparent 0deg);
//           }
//           100% {
//             background: conic-gradient(#000000 360deg, transparent 0deg);
//           }
//         }
//         @keyframes smoothVerticalScroll {
//           0% {
//             transform: translateY(0);
//           }
//           100% {
//             transform: translateY(-50%);
//           }
//         }
//         .progress-bar {
//           animation: progress 5s linear infinite;
//         }
//         .animate-smooth-vertical-scroll {
//           animation: smoothVerticalScroll 20s linear infinite;
//         }
//         .animate-smooth-vertical-scroll:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//         </section>
//     );
// };

// export default Product;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const slides = [
    {
      id: 1,
      image: "Jordan1.avif",
      mainText: "KICKS THAT CAN'T MISS",
      subText: "Gift the perfect start sneakers that every move",
      buttonText: "Shop",
      title: "JORDAN 1 RETRO HIGH",
      description: "Classic design meets modern comfort"
    },
    {
      id: 2,
      image: "Jordan2.avif",
      mainText: "BUBBLE BOY",
      subText: "While the pandemic changed the world, the king's dominance remains the same",
      buttonText: "Notify Me",
      title: "AIR JORDAN 4",
      description: "Iconic silhouette with premium materials"
    },
    {
      id: 3,
      image: "Jordan3.avif",
      mainText: "LEGEND RETURNS",
      subText: "The legacy continues with groundbreaking innovation and style",
      buttonText: "Explore",
      title: "JORDAN 11 LEGEND",
      description: "Elegance and performance combined"
    }
  ];

  const handleShopClick = () => {
    user ? navigate('/products') : navigate('/login');
  };

  // Auto slide with progress bar
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = 'progress 5s linear';
        }
      }, 10);
    }
    return () => clearInterval(interval);
  }, [currentSlide, isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const nikeImages = Array(12).fill("nike.png");

  const imageVariants = {
    enter: { opacity: 0, x: 300, scale: 0.8 },
    center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, x: -300, scale: 0.8, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
  };

  const textVariants = {
    enter: { opacity: 0, y: 50 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <section className="bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Container - No fixed height, full width, maintains aspect naturally */}
        <div className="w-full bg-gray-100 rounded-2xl relative overflow-hidden">
          {/* Vertical Nike Slider - Hidden on mobile, shown on md+ */}
          <div className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 h-60 sm:h-80 overflow-hidden hidden md:block">
            <div className="animate-smooth-vertical-scroll">
              <div className="flex flex-col gap-6 sm:gap-8">
                {nikeImages.map((nike, index) => (
                  <motion.img
                    key={index}
                    className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
                    src={nike}
                    alt={`Nike ${index + 1}`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Image - No cropping, always contain */}
          <div className="flex justify-center items-center w-full ml-0 md:ml-20">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-auto max-h-[85vh] object-contain"
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Text Container */}
        <div className="w-full py-6 sm:py-8 px-2 sm:px-4">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} variants={textVariants} initial="enter" animate="center" exit="exit">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-3 sm:mb-4 tracking-tight italic px-2">
                  {slides[currentSlide].mainText}
                </h2>
                <h5 className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light mb-4 sm:mb-6 leading-relaxed px-2">
                  {slides[currentSlide].subText}
                </h5>
                <motion.button
                  className="bg-black text-white px-8 sm:px-12 py-2.5 sm:py-3 rounded-full font-bold text-base sm:text-lg tracking-widest hover:bg-gray-800 transition"
                  onClick={handleShopClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slides[currentSlide].buttonText}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls Container */}
        <div className="w-full bg-gray-100 py-4 sm:py-6 px-4 rounded-2xl mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              {/* Top row: dots + buttons */}
              <div className="flex items-center justify-between w-full">
                <div className="w-8 sm:w-10"></div>
                {/* Dots */}
                <div className="flex space-x-2 sm:space-x-3">
                  {slides.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-black scale-125' : 'bg-gray-400 hover:bg-gray-600'
                        }`}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                    />
                  ))}
                </div>
                {/* Buttons group */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <motion.button
                    onClick={prevSlide}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-black transition shadow-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsPaused(!isPaused)}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition border-2 border-gray-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPaused ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                      )}
                      <div className="absolute inset-0">
                        <div
                          ref={progressRef}
                          className="w-full h-full rounded-full border-2 border-transparent progress-bar"
                          style={{
                            background: `conic-gradient(#6b7280 ${isPaused ? 0 : 360}deg, transparent 0deg)`,
                            mask: 'radial-gradient(white 50%, transparent 51%)',
                            WebkitMask: 'radial-gradient(white 50%, transparent 51%)'
                          }}
                        />
                      </div>
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={nextSlide}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-black transition shadow-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="text-base sm:text-lg font-bold text-gray-900">{slides[currentSlide].title}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{slides[currentSlide].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progress {
          0% { background: conic-gradient(#000000 0deg, transparent 0deg); }
          100% { background: conic-gradient(#000000 360deg, transparent 0deg); }
        }
        @keyframes smoothVerticalScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .progress-bar {
          animation: progress 5s linear infinite;
        }
        .animate-smooth-vertical-scroll {
          animation: smoothVerticalScroll 20s linear infinite;
        }
        .animate-smooth-vertical-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Product;