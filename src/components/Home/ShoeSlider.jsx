import React from 'react'

const ShoeSlider = () => {
  const shoes = [
    "basketball.png",
    "fashion.png", 
    "fashion (1).png",
    "shoe (1).png",
    "shoe.png",
    "trainer.png"
  ];

  // Duplicate images for seamless loop
  const sliderShoes = [...shoes, ...shoes, ...shoes];

  return (
    <div className="relative overflow-hidden mt-5 mb-4 py-4">
      {/* Animated Slider Container */}
      <div className="animate-scroll">
        <div className="flex gap-4 md:gap-6 lg:gap-8 whitespace-nowrap">
          {sliderShoes.map((shoe, index) => (
            <img 
              key={index}
              className="h-12 sm:h-16 lg:h-20 object-contain shrink-0 transform hover:scale-110 transition-transform duration-300"
              src={shoe} 
              alt={`Shoe ${index + 1}`} 
            />
          ))}
        </div>
      </div>

      {/* Custom CSS for animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default ShoeSlider