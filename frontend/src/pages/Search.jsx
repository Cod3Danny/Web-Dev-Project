import {useEffect, useState } from "react";
import './Search.css'

export default function Search() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY; 

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

  useEffect(() => {
    const delay = setTimeout(() => {
      searchMovies();
    }, 500); // wait 0.5s after typing stops

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie, TV show..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <section className="search-results">
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