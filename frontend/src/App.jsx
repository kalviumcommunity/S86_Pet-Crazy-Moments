import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Home, Login, Signup, Images, Video, Upload} from './Routes.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/image" element={<Images />} />
        <Route path="/video" element={<Video />} />
        <Route path="/upload" element={<Upload />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
