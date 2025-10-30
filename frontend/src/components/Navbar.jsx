import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav>
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            </div>
            <div className="logo">Movie Explorer</div>

            <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
                <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                    <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                    <div className={`bar ${menuOpen ? "open" : ""}`}></div>
                </div>
                <li><a className='nav-link' href="/">Home</a></li>
                <li><a className='nav-link' href="/tv">TV</a></li>
                <li><a className='nav-link' href="/movies">Movies</a></li>
                <li><a className='nav-link' href="/watchlist">Watch List</a></li>
            </ul>

            <div className="nav-right">
                <a href="/search" className="icon">🔍</a>
                <div className="profile">?</div>
            </div>
        </nav>
    );
};

export default Navbar;
