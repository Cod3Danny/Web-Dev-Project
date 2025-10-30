import { useEffect, useState } from "react";
import Masthead from "../components/Masthead";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

const TV = () => {
  const API = "https://api.themoviedb.org/3";
  const apiToken = import.meta.env.VITE_apiToken;
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [category, setCategory] = useState("popular");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Infinity);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Loading…");

  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const tmdb = async (path, params = {}) => {
    const url = new URL(API + path);
    const hasV4 = !!apiToken;
    const hasV3 = !!apiKey;

    if (!hasV4 && !hasV3) throw new Error("TMDB API key or token missing");

    if (!hasV4) url.searchParams.set("api_key", apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }

    const res = await fetch(url, {
      headers: hasV4
        ? { Authorization: `Bearer ${apiToken}`, Accept: "application/json" }
        : { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`TMDB ${res.status}`);
    return await res.json();
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await tmdb("/genre/tv/list");
        setGenres(data.genres || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const fetchRoute = (cat, pageNum) => {
    switch (cat) {
      case "trending_day":
        return tmdb("/trending/tv/day", { page: pageNum });
      case "trending_week":
        return tmdb("/trending/tv/week", { page: pageNum });
      case "top_rated":
        return tmdb("/tv/top_rated", { page: pageNum });
      case "airing_today":
        return tmdb("/tv/airing_today", { page: pageNum });
      case "on_the_air":
        return tmdb("/tv/on_the_air", { page: pageNum });
      default:
        return tmdb("/tv/popular", { page: pageNum });
    }
  };


  const loadMovies = async (pageNum = 1) => {
    if (loading) return;
    setLoading(true);

    const isMobile = window.innerWidth < 500;
    /**
     * 1 page on mobile, 4 on desktop
     * each TMDB request only has 1 page of 20 movies; results → 2 = 40 results
     */
    const pagesToCombine = isMobile ? 1 : 4;

    try {
      setStatus("Loading…");

      // Create an array of page numbers to fetch
      const pageNumbers = Array.from(
        { length: pagesToCombine },
        (_, i) => (pageNum - 1) * pagesToCombine + (i + 1)
      );

      // Fetch all those pages in parallel
      const responses = await Promise.all(
        pageNumbers.map((p) => fetchRoute(category, p))
      );

      // Combine all movie results into one big list
      const combinedResults = responses.flatMap((res) => res.results || []);

      // TMDB’s total_pages is based on 20 movies per page, so divide it down
      const total = Math.ceil(
        (responses[0]?.total_pages || 1) / pagesToCombine
      );

      setMovies(combinedResults);
      setTotalPages(total);
      setPage(pageNum);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(currentPage);
  }, [currentPage, category, genre]);

  return (
    <div id="movies-page">
      <Masthead
        title="TV"
        description="Browse popular, trending, and top-rated films"
      />

      <div id="select-options">
        <label>
          <p>Category:</p>
          <select
            className="selection"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="popular">Popular</option>
            <option value="trending_day">Trending · Today</option>
            <option value="trending_week">Trending · This Week</option>
            <option value="top_rated">Top Rated</option>
            <option value="airing_today">Airing Today</option>
            <option value="on_the_air">On the Air</option>

          </select>
        </label>

      </div>

      <h2 id="category-title">
        {category.replace("_", " ").toUpperCase()} TV
      </h2>

      <section id="movie-grid">
        {movies.map((movie, index) => (
          <MovieCard key={index} filmType='tv' movie={movie} id={movie.id} />
        ))}
      </section>

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={(newPage) => loadMovies(newPage)}
      />

      <div>{status}</div>
    </div>
  );
};

export default TV;
