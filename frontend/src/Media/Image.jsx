import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const ImagePage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/media/image")
      .then(response => setImages(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar/>
      <h1 className="text-3xl font-bold text-center mb-4 mt-20">Image Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="rounded-lg shadow-lg bg-white p-4 text-center">
            <img
              src={image.url.startsWith("http") ? image.url : `http://localhost:3000${image.url}`}
              className="rounded-lg shadow-lg w-full h-48 object-cover"
              alt={image.title}
            />
            <h2 className="mt-2 font-semibold">{image.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePage;
