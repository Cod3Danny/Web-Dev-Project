
const Navbar = () => {
    return (
        <nav>
            <div className="logo">Movie Explorer</div>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="tv">TV</a></li>
                <li><a href="movies">Movies</a></li>
                <li><a href="watchlist">Watch List</a></li>
            </ul>
            <div className="nav-right">
                <a href="/search" className="icon">🔍</a>
                <div className="profile">?</div>
            </div>
        </nav>
    )
}

export default Navbar; 