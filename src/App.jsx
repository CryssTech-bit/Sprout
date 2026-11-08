import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Home from "./components/Home";
import MyGallery from "./components/MyGallery";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/today" element={<Home />} />
        <Route path="/my-gallery" element={<MyGallery />} />
      </Routes>
    </BrowserRouter>
  );
}
