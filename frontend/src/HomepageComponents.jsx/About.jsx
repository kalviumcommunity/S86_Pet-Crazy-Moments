import React from 'react';
import { useNavigate } from 'react-router-dom';
import videoImg from '../assets/Video files-amico.svg';
import imageImg from '../assets/Image folder-amico.svg';
import uploadImg from '../assets/Image upload-amico.svg';

const About = () => {
    const navigate = useNavigate();

    return (
        <section id="about" className="py-16 px-0 pt-20 bg-white">
            <div className="container mx-auto text-center">
                <h3 className="text-4xl font-bold mb-6 text-gray-600 transition duration-300 hover:text-indigo-600">
                    About Us
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    We love pets as much as you do!  
                    <br />
                    Our platform lets you share, explore, and upload fun pet moments.
                </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-evenly mt-12">
                {/* Video Section */}
                <div
                    className="relative bg-gray-700 w-80 md:h-95 h-80 md:w-95 flex justify-center items-center rounded-2xl group cursor-pointer transition duration-300 hover:shadow-xl"
                    onClick={() => navigate('/video')}
                >
                    <img src={videoImg} className="h-60 w-60 transition duration-300 group-hover:opacity-30" alt="Video" />
                    <div className="absolute opacity-0 group-hover:opacity-100 text-white text-center p-4 transition duration-300">
                        <h4 className="text-xl font-bold">Watch & Share Videos</h4>
                        <p className="text-sm">Explore and upload pet videos from various sources.</p>
                    </div>
                </div>

                {/* Image Section */}
                <div
                    className="relative bg-gray-700 w-80 md:h-95 h-80 md:w-95 flex justify-center items-center rounded-2xl group cursor-pointer transition duration-300 hover:shadow-xl"
                    onClick={() => navigate('/image')}
                >
                    <img src={imageImg} className="h-90 w-90 transition duration-300 group-hover:opacity-30" alt="Image" />
                    <div className="absolute opacity-0 group-hover:opacity-100 text-white text-center p-4 transition duration-300">
                        <h4 className="text-xl font-bold">Browse & Upload Images</h4>
                        <p className="text-sm">Discover amazing pet photos and share yours!</p>
                    </div>
                </div>

                {/* Upload Section */}
                <div
                    className="relative bg-gray-700 w-80 md:h-95 h-80 md:w-95 flex justify-center items-center rounded-2xl group cursor-pointer transition duration-300 hover:shadow-xl"
                    onClick={() => navigate('/upload')}
                >
                    <img src={uploadImg} className="h-60 w-60 transition duration-300 group-hover:opacity-30" alt="Upload" />
                    <div className="absolute opacity-0 group-hover:opacity-100 text-white text-center p-4 transition duration-300">
                        <h4 className="text-xl font-bold">Upload Your Content</h4>
                        <p className="text-sm">Share your pet's best moments with the world.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
