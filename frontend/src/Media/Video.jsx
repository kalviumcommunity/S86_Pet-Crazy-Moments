import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/media/video")
      .then(response => setVideos(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <h1 className="text-3xl font-bold text-center mb-4 mt-20">Video Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video, index) => {
          const videoType = getVideoType(video.url);

          return (
            <div key={index} className="rounded-lg shadow-lg w-full bg-black p-4">
              <h2 className="text-white text-center mb-2 font-semibold">{video.title}</h2>
              
              {videoType === "youtube" && (
                <iframe
                  className="w-full h-48"
                  src={`https://www.youtube.com/embed/${extractVideoId(video.url)}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {videoType === "vimeo" && (
                <iframe
                  className="w-full h-48"
                  src={`https://player.vimeo.com/video/${extractVideoId(video.url)}`}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}

              {videoType === "other" && (
                <iframe
                  className="w-full h-48"
                  src={video.url}
                  title={video.title}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
              )}

              {videoType === "file" && (
                <video className="rounded-lg shadow-lg w-full" controls>
                  <source 
                    src={`http://localhost:3000${video.url}`} 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getVideoType = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.startsWith("http") && !url.includes("localhost")) return "other";
  return "file";
};

const extractVideoId = (url) => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  if (youtubeMatch) return youtubeMatch[1];

  const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
  if (vimeoMatch) return vimeoMatch[1];

  return url;
};

export default VideoPage;
