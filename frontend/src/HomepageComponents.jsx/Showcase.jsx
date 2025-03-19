import React from 'react';
import { useNavigate } from 'react-router-dom';

const Showcase = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section
        id="Showcase"
        className="flex flex-wrap gap-20 min-h-150 items-center justify-center text-center py-20 bg-gray-900 text-white"
      >
        <div className="relative ml-10 shrink-1">
          <div className="p-5 rotate-3 bg-white w-80 shadow-2xl shadow-gray-400 ">
            <img
              src="https://ii1.pepperfry.com/assets/46b9f9_1676556007597_Pets_1280_nocompanionlikeacat_16feb_3.jpg"
              alt="Pet Crazy Moments"
            />
          </div>
          <div className="absolute top-10 p-5 rotate-350 bg-white w-80 shadow-2xl shadow-gray-900">
            <img
              src="https://ii1.pepperfry.com/assets/2092b9_1676556197312_Pets_1280_foryourfurrybuddy_16feb_3.jpg"
              alt="Pet Crazy Moments"
            />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold mb-4"> Welcome to Pet Crazy Moments!</h2>
          <p className="text-lg mb-6">
            Share and discover adorable and funny pet moments.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-400 cursor-pointer text-black font-semibold  px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-yellow-500"
          >
            Get Started
          </button>

    </div>
      </section >
    </div >
  );
};

export default Showcase;
