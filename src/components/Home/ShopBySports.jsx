import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ShopBySports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollContainerRef = useRef(null);

  const sports = [
    { image: "Sports1.avif", name: "Basketball", filterValue: "BASKETBALL" },
    { image: "Sports2.avif", name: "Football", filterValue: "FOOTBALL" },
    { image: "Sports3.avif", name: "Running", filterValue: "RUNNING" },
    { image: "Sports4.avif", name: "Tennis", filterValue: "TENNIS" },
    { image: "Sports5.avif", name: "Golf", filterValue: "GOLF" },
    { image: "Sports6.avif", name: "Skateboarding", filterValue: "SKATEBOARDING" }
  ];

  const handleSportClick = (sport) => {
    if (user) {
      // Redirect to products page with shoeType filter only
      navigate(`/products?shoeType=${sport.filterValue}`);
    } else {
      navigate('/login');
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="px-4 mb-10">
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl flex mt-4 mb-8 ml-12'>Shop by Sports</h1>
        <div className="flex space-x-4">
          <button onClick={scrollLeft} className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110'>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={scrollRight} className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-300 hover:scale-110'>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollContainerRef} className='flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {sports.map((sport, index) => (
          <div key={index} className="flex-shrink-0 w-80 snap-start group cursor-pointer" onClick={() => handleSportClick(sport)}>
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img src={sport.image} alt={sport.name} className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-black tracking-tight">{sport.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default ShopBySports;