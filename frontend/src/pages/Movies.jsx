import { useState } from "react";

const Movies = () => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);

    const searchMovies = async () => {
        if (!query.trim()) return;
        try {
            const resp = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
            );
            const data = await resp.json();
            setMovies(data.results || []);
        } catch (err) {
            console.error("Error searching movies:", err);
        }
    };

    return (
        <div >
            <div >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                />
                <button onClick={searchMovies} >
                    Search
                </button>
            </div>

            <div>
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card ">
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                                    : "placeholder.jpg"
                            }
                            alt={movie.title} />
                        <h3>{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Movies;
