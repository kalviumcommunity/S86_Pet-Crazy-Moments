import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div>
            <nav className="bg-gray-700 shadow-lg fixed top-0 left-0 w-full z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">
                        Pet<span className="text-green-300">Crazy</span>
                    </h1>
                    <div className="flex items-center justify-center">
                        <button onClick={() => navigate('/')} className="bg-indigo-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                            Back to Home
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
