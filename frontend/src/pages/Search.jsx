import { useState } from "react";

export default function Search() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY; // use your .env key

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchMovies = async () => {
    if (!query.trim()) return;

    try {
      const resp = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
      );
      const data = await resp.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Error searching movies:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchMovies();
  };

  return (
    <div>
      {/* === Search Bar === */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie, TV show..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      {/* === Results Section === */}
      <section className="section search-results">
        <h2>Search Results</h2>

        <div id="resultsContainer" className="movies">
          {results.length === 0 && query && <p>No results found.</p>}
          {results.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                    : "placeholder.jpg"
                }
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}