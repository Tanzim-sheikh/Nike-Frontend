// import React, { useState, useEffect, useRef } from 'react';

// const ShopByIcon = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const scrollContainerRef = useRef(null);

//   const categories = [
//     { image: "Category1.avif", name: "Running" },
//     { image: "Category2.avif", name: "Basketball" },
//     { image: "Category3.avif", name: "Football" },
//     { image: "Category4.avif", name: "Training" },
//     { image: "Category5.avif", name: "Tennis" },
//     { image: "Category6.avif", name: "Golf" },
//     { image: "Category7.avif", name: "Skateboarding" },
//     { image: "Category8.avif", name: "Yoga" },
//     { image: "Category9.avif", name: "Hiking" }
//   ];

//   // Create infinite loop array
//   const infiniteCategories = [...categories, ...categories, ...categories];

//   // Auto scroll every 4 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => prev + 1);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   // Calculate visible index for center popup
//   const visibleIndex = currentIndex % categories.length;

//   // Scroll to center item
//   useEffect(() => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const centerIndex = categories.length + visibleIndex;
//       const item = container.children[centerIndex];
      
//       if (item) {
//         const itemLeft = item.offsetLeft;
//         const itemWidth = item.offsetWidth;
//         const containerWidth = container.offsetWidth;
        
//         container.scrollTo({
//           left: itemLeft - (containerWidth - itemWidth) / 2,
//           behavior: 'smooth'
//         });
//       }
//     }
//   }, [currentIndex, categories.length, visibleIndex]);

//   const scrollLeft = () => {
//     setCurrentIndex((prev) => prev - 1);
//   };

//   const scrollRight = () => {
//     setCurrentIndex((prev) => prev + 1);
//   };

//   return (
//     <>
//       <section className="px-4 py-8 relative">
//         {/* Header */}
//         <div className='flex justify-between items-center mb-8 max-w-7xl mx-auto'>
//           <h1 className='text-2xl flex ml-12 '>Shop by Icons </h1>
//         </div>

//         {/* Slider Container */}
//         <div className="relative max-w-7xl mx-auto">
          
//           {/* Left Arrow - Center Position - Shadow removed */}
//           <button 
//             onClick={scrollLeft}
//             className='absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 z-10 hover:scale-110 border border-gray-200'
//           >
//             <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           {/* Right Arrow - Center Position - Shadow removed */}
//           <button 
//             onClick={scrollRight}
//             className='absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 z-10 hover:scale-110 border border-gray-200'
//           >
//             <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>

//           {/* Scrollable Container - Gap added */}
//           <div 
//             ref={scrollContainerRef}
//             className='flex gap-8 overflow-x-hidden scrollbar-hide scroll-smooth py-4'
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//           >
//             {infiniteCategories.map((category, index) => {
//               // Calculate if this is the center item
//               const isCenter = index === categories.length + visibleIndex;
              
//               return (
//                 <div 
//                   key={index} 
//                   className={`flex-shrink-0 transition-all duration-500 ${
//                     isCenter 
//                       ? 'scale-110 transform-gpu' 
//                       : 'scale-95 opacity-80'
//                   }`}
//                   style={{ width: '280px' }}
//                 >
//                   <div className="relative group cursor-pointer">
//                     <img 
//                       src={category.image} 
//                       alt={category.name}
//                       className="w-full h-80 object-contain rounded-2xl transition-all duration-500" 
//                     />
                    
//                     {/* Gradient Overlay - Removed shadow from here too */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 transition-opacity duration-300"></div>
                    
                 
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Custom Scrollbar Hide */}
//         <style jsx>{`
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//         `}</style>
//       </section>
//     </>
//   );
// };

// export default ShopByIcon;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ShopByIcon = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const categories = [
    { image: "Category1.avif", name: "Running", productId: "69f1ef445ee893495ce018c5" },
    { image: "Category2.avif", name: "Basketball", productId: "69f1f3a55ee893495ce018e2" },
    { image: "Category3.avif", name: "Football", productId: "69f21df25ee893495ce018ef" },
    { image: "Category4.avif", name: "Training", productId: "69f220fc5ee893495ce01922" },
    { image: "Category5.avif", name: "Tennis", productId: "69f1d75f5ee893495ce0183b" },
    { image: "Category6.avif", name: "Golf", productId: "69f1e0dd5ee893495ce01880" },
    { image: "Category7.avif", name: "Skateboarding", productId: "69f1e56f5ee893495ce01895" },
    { image: "Category8.avif", name: "Yoga", productId: "69f1e7635ee893495ce018a5" },
    { image: "Category9.avif", name: "Hiking", productId: "69f1edec5ee893495ce018b4" }
  ];

  // Click handler for category image
  const handleCategoryClick = (productId) => {
    if (user) {
      navigate(`/product/${productId}`);
    } else {
      navigate('/login');
    }
  };

  // ... (rest of the slider logic remains exactly same as yours)

  const infiniteCategories = [...categories, ...categories, ...categories];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleIndex = currentIndex % categories.length;

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const centerIndex = categories.length + visibleIndex;
      const item = container.children[centerIndex];
      if (item) {
        const itemLeft = item.offsetLeft;
        const itemWidth = item.offsetWidth;
        const containerWidth = container.offsetWidth;
        container.scrollTo({
          left: itemLeft - (containerWidth - itemWidth) / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex, categories.length, visibleIndex]);

  const scrollLeft = () => setCurrentIndex((prev) => prev - 1);
  const scrollRight = () => setCurrentIndex((prev) => prev + 1);

  return (
    <>
      <section className="px-4 py-8 relative">
        <div className='flex justify-between items-center mb-8 max-w-7xl mx-auto'>
          <h1 className='text-2xl flex ml-12'>Shop by Icons</h1>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <button onClick={scrollLeft} className='absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 z-10 hover:scale-110 border border-gray-200'>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={scrollRight} className='absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 z-10 hover:scale-110 border border-gray-200'>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div ref={scrollContainerRef} className='flex gap-8 overflow-x-hidden scrollbar-hide scroll-smooth py-4' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {infiniteCategories.map((category, index) => {
              const isCenter = index === categories.length + visibleIndex;
              return (
                <div key={index} className={`flex-shrink-0 transition-all duration-500 ${isCenter ? 'scale-110 transform-gpu' : 'scale-95 opacity-80'}`} style={{ width: '280px' }}>
                  <div className="relative group cursor-pointer" onClick={() => handleCategoryClick(category.productId)}>
                    <img src={category.image} alt={category.name} className="w-full h-80 object-contain rounded-2xl transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 transition-opacity duration-300 "></div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                      {category.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </section>
    </>
  );
};

export default ShopByIcon;