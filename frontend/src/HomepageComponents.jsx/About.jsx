import React from 'react'
import videoImg from '../assets/Video files-amico.svg'
import Imageimg from '../assets/Image folder-amico.svg'
import uploadimg from '../assets/Image upload-amico.svg'
import { useNavigate } from 'react-router-dom'

const About = () => {
    const navigate = useNavigate();

    return (
        <div>
            <section id="about" className="py-16 px-6 pt-20 bg-white">
                <div className="container mx-auto text-center">
                    <h3 className="text-4xl font-bold mb-4 text-gray-600 transition delay-150 ease-in-out hover:text-indigo-600">About Us</h3>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        We love pets as much as you do!
                        <br/>
                        Our platform is a place where you can share and explore fun pet moments.
                    </p>
                </div>
                <div className='flex flex-wrap gap-2 justify-evenly mt-15'>
                    <div className="bg-gray-700 h-80 w-80 flex justify-center items-center rounded-2xl ">
                        <img src={videoImg} onClick={()=>navigate('/video')} className='h-56 w-60 cursor-pointer' alt="" />
                    </div>
                    <div className="bg-gray-700 h-80 w-80 flex justify-center items-center rounded-2xl">
                        <img src={Imageimg} onClick={()=>navigate('/image')} className='h-60 w-60 cursor-pointer'alt="" />
                    </div>
                    <div className="bg-gray-700 h-80 w-80 flex justify-center items-center rounded-2xl">
                        <img src={uploadimg} onClick={()=>navigate('/upload')} className='h-60 w-60 cursor-pointer' alt="" />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
