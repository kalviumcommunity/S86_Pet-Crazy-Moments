import React from 'react'
import Navbar from '../HomepageComponents.jsx/Navbar'
import About from '../HomepageComponents.jsx/About'
import Contact from '../HomepageComponents.jsx/Contact'
import Footer from '../HomepageComponents.jsx/Footer'
import Showcase from '../HomepageComponents.jsx/Showcase'


const Home = () => {
  return (
    <div>
      <Navbar />
      <Showcase />
      <About/>
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
