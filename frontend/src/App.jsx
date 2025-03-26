import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Home, Login, Signup, ImagePage, VideoPage, UploadPage, Admin} from './Routes.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path='/admin' element={<Admin/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
