// // src/components/Products/ProductCard.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
// import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   const handleWishlist = (e) => {
//     e.stopPropagation();
//     setIsWishlisted(!isWishlisted);
//     // TODO: Save to API or localStorage
//   };

//   const primaryImage = product.images?.[0] || '/placeholder.jpg';

//   return (
//     <div className="group cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
//       <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
//         <img src={primaryImage} alt={product.name} className="w-full h-80 object-cover group-hover:scale-105 transition duration-300" />
//         <button
//           onClick={handleWishlist}
//           className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
//         >
//           {isWishlisted ? <HeartSolid className="h-5 w-5 text-red-500" /> : <HeartOutline className="h-5 w-5 text-gray-600" />}
//         </button>
//         {product.sale && (
//           <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">SALE</span>
//         )}
//       </div>
//       <div className="mt-3">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
//             <p className="text-sm text-gray-500">{product.gender} · {product.shoeType}</p>
//           </div>
//           <div className="text-right">
//             {product.sale && product.salePrice ? (
//               <div>
//                 <span className="text-sm line-through text-gray-400">${product.price}</span>
//                 <span className="font-bold text-red-600 ml-2">${product.salePrice}</span>
//               </div>
//             ) : (
//               <span className="font-bold">${product.price}</span>
//             )}
//           </div>
//         </div>
//         <button className="mt-3 w-full bg-black text-white py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition">
//           Buy Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

// src/components/Products/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useWishlist from '../../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const liked = isInWishlist(product._id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (liked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const primaryImage = product.images?.[0] || '/placeholder.jpg';

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
        <img src={primaryImage} alt={product.name} className="w-full h-80 object-cover group-hover:scale-105 transition duration-300" />
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          {liked ? <HeartSolid className="h-5 w-5 text-red-500" /> : <HeartOutline className="h-5 w-5 text-gray-600" />}
        </button>
        {product.sale && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">SALE</span>
        )}
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.gender} · {product.shoeType}</p>
          </div>
          <div className="text-right">
            {product.sale && product.salePrice ? (
              <div>
                <span className="text-sm line-through text-gray-400">${product.price}</span>
                <span className="font-bold text-red-600 ml-2">${product.salePrice}</span>
              </div>
            ) : (
              <span className="font-bold">${product.price}</span>
            )}
          </div>
        </div>
        <button className="mt-3 w-full bg-black text-white py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;