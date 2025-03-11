import React from 'react'

const Home = () => {
  return (
    <div>
      
      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col h-150 items-center justify-center text-center py-20 bg-indigo-500 text-white"
      >
        <h2 className="text-4xl font-extrabold mb-4">🐾 Welcome to Pet Crazy Moments!</h2>
        <p className="text-lg mb-6">
          Share and discover adorable and funny pet moments.
        </p>
        <button className="bg-yellow-400 text-black px-6 py-3 rounded-full hover:bg-yellow-500 transition">
          Get Started
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-4 text-indigo-600">About Us</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We love pets as much as you do! Our platform is a place where you can share and explore fun pet moments.
          </p>
        </div>
      </section>


    </div>
  )
}

export default Home
