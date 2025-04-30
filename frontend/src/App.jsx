import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Home, Login, Signup, Profile, ImagePage, VideoPage, UploadPage, Admin} from './Routes.jsx';
import UserEntityFilter from './components/UserEntityFilter.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sqltest" element={<UserEntityFilter/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path='/admin' element={<Admin/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
