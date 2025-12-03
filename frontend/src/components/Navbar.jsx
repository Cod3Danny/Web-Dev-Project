import { useState, useEffect } from "react";
import { loadUser, logoutUser } from "../services/userServices";
import "./Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const data = await loadUser();
            setUser(data);
        }
        fetchUser();
    }, []);

    const handleLogout = () => {
        logoutUser();
        setUser(null);
    }

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

            <ul className="nav-right">
                <li><a href="/search" className="icon">🔍</a></li>
                {user ? (
                     <li><a className="nav-link" href="/" onClick={handleLogout}>Logout</a></li>
                ) : (
                    <li><a className="nav-link" href="/login">Login</a></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
