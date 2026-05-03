// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Features = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // General handler for normal products (go to /products)
//   const handleShopClick = () => {
//     if (user) {
//       navigate('/products');
//     } else {
//       navigate('/login');
//     }
//   };

//   // Special handler for AIR JORDAN 40 EDGE PF
//   const handleJordanProductClick = () => {
//     if (user) {
//       // Replace with the actual product ID from your database
//       navigate('/product/69f1a475dd88c76ea13322da');
//     } else {
//       navigate('/login');
//     }
//   };

//   const images = [
//     {
//       src: "Features1.jpg",
//       title: "AIR JORDAN 40 EDGE PF",
//       button: "Shop",
//       isJordan: true  // 👈 flag to identify this specific product
//     },
//     {
//       src: "Features2.avif",
//       title: "FORCA BARCA!",
//       subtitle: "Rep your favorite team on match day and beyond",
//       button: "Shop",
//       isJordan: false
//     },
//     {
//       src: "Features5.jpg",
//       title: "GET SET FOR RACE",
//       button: "Shop",
//       isJordan: false
//     },
//     {
//       src: "Features3.jpg",
//       title: "NEW ARRIVALS",
//       button: "Shop",
//       isJordan: false
//     }
//   ];

//   return (
//     <>
//       <section className="bg-white">
//         <h1 className='text-2xl flex mt-8 mb-8 ml-12'>Featured</h1>
//         {/* First Row */}
//         <div className="max-w-full w-full flex flex-col md:flex-row">
//           {images.slice(0, 2).map((image, index) => (
//             <div key={index} className="w-full md:w-1/2 relative group overflow-hidden">
//               <img
//                 className="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
//                 src={image.src}
//                 alt={image.title}
//               />
//               <div className="absolute bottom-6 left-6 text-white z-10">
//                 <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
//                   {image.title}
//                 </h3>
//                 {image.subtitle && (
//                   <p className="text-sm md:text-base mb-4 max-w-xs">
//                     {image.subtitle}
//                   </p>
//                 )}
//                 <button
//                   onClick={image.isJordan ? handleJordanProductClick : handleShopClick}
//                   className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
//                 >
//                   {image.button}
//                 </button>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//             </div>
//           ))}
//         </div>

//         {/* Second Row */}
//         <div className="max-w-full w-full flex flex-col md:flex-row">
//           {images.slice(2, 4).map((image, index) => (
//             <div key={index} className="w-full md:w-1/2 relative group overflow-hidden">
//               <img
//                 className="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
//                 src={image.src}
//                 alt={image.title}
//               />
//               <div className="absolute bottom-6 left-6 text-white z-10">
//                 <h3 className="text-lg md:text-3xl font-black mb-2 tracking-tight">
//                   {image.title}
//                 </h3>
//                 <button
//                   onClick={image.isJordan ? handleJordanProductClick : handleShopClick}
//                   className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
//                 >
//                   {image.button}
//                 </button>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Jordan brand section (separate) – already has its own handler, but keep as is or change if needed */}
//       <article>
//         <div className='flex justify-between items-center ml-10 mr-10'>
//           <div><img className='h-20' src="JordanLogo.svg" alt="" /></div>
//           <div className='flex-col justify-center items-center text-center py-10 mt-8 mb-8'>
//             <h5 className='font-bold'>Jordan</h5>
//             <h1 className='font-extrabold text-6xl italic'>COLDEST IN THE GAME</h1>
//             <button
//               onClick={handleShopClick}  // same product page or keep separate
//               className="bg-black text-white mt-6 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
//             >
//               Shop
//             </button>
//           </div>
//           <div><img className='h-20' src="JordanLogo.svg" alt="" /></div>
//         </div>
//       </article>
//     </>
//   );
// };

// export default Features;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Features = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // General shop (go to /products)
  const handleShopClick = () => {
    user ? navigate('/products') : navigate('/login');
  };

  // Special handler for AIR JORDAN 40 EDGE PF (specific product)
  const handleJordanProductClick = () => {
    user ? navigate('/product/69f1a475dd88c76ea13322da') : navigate('/login');
  };

  // Special handler for NEW ARRIVALS (show newest products first)
  const handleNewArrivalsClick = () => {
    user ? navigate('/products?sort=newest') : navigate('/login');
  };

  const images = [
    {
      src: "Features1.jpg",
      title: "AIR JORDAN 40 EDGE PF",
      button: "Shop",
      type: "jordan"
    },
    {
      src: "Features2.avif",
      title: "FORCA BARCA!",
      subtitle: "Rep your favorite team on match day and beyond",
      button: "Shop",
      type: "general"
    },
    {
      src: "Features5.jpg",
      title: "GET SET FOR RACE",
      button: "Shop",
      type: "general"
    },
    {
      src: "Features3.jpg",
      title: "NEW ARRIVALS",
      button: "Shop",
      type: "newArrivals"
    }
  ];

  const getHandler = (type) => {
    if (type === "jordan") return handleJordanProductClick;
    if (type === "newArrivals") return handleNewArrivalsClick;
    return handleShopClick;
  };

  return (
    <>
      <section className="bg-white">
        <h1 className='text-2xl flex mt-8 mb-8 ml-12'>Featured</h1>
        {/* First Row */}
        <div className="max-w-full w-full flex flex-col md:flex-row">
          {images.slice(0, 2).map((image, index) => (
            <div key={index} className="w-full md:w-1/2 relative group overflow-hidden">
              <img
                className="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                src={image.src}
                alt={image.title}
              />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">{image.title}</h3>
                {image.subtitle && (
                  <p className="text-sm md:text-base mb-4 max-w-xs">{image.subtitle}</p>
                )}
                <button
                  onClick={getHandler(image.type)}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                >
                  {image.button}
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="max-w-full w-full flex flex-col md:flex-row">
          {images.slice(2, 4).map((image, index) => (
            <div key={index} className="w-full md:w-1/2 relative group overflow-hidden">
              <img
                className="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                src={image.src}
                alt={image.title}
              />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="text-lg md:text-3xl font-black mb-2 tracking-tight">{image.title}</h3>
                <button
                  onClick={getHandler(image.type)}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                >
                  {image.button}
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Jordan brand section (separate) */}
      <article>
        <div className='flex justify-between items-center ml-10 mr-10'>
          <div><img className='h-20' src="JordanLogo.svg" alt="" /></div>
          <div className='flex-col justify-center items-center text-center py-10 mt-8 mb-8'>
            <h5 className='font-bold'>Jordan</h5>
            <h1 className='font-extrabold text-6xl italic'>COLDEST IN THE GAME</h1>
            <button
              onClick={handleShopClick}
              className="bg-black text-white mt-6 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Shop
            </button>
          </div>
          <div><img className='h-20' src="JordanLogo.svg" alt="" /></div>
        </div>
      </article>
    </>
  );
};

export default Features;