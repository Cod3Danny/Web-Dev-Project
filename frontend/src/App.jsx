import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import TV from "./pages/TV";
import Watchlist from "./pages/Watchlist";
import Movies from "./pages/Movies";
import Search from "./pages/Search";
import './App.css'
function App() {
  return (
    <>
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/> 
          <Route path="tv" element={<TV />}/>
          <Route path="movies" element={<Movies/>}/>
          <Route path="watchlist" element={<Watchlist/>}/>
          <Route path="search" element={<Search/>}/>
          <Route path="*" element={<div className="error-page">404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
