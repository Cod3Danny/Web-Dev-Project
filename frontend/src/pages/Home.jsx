import { useEffect, useRef, useState } from "react";

const Home = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);

  const trendingRef = useRef(null);
  const popularRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async (url, setter) => {
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        setter(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    if (apiKey) {
      fetchMovies(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`,
        setTrending
      );
      fetchMovies(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
        setPopular
      );
    } else {
      console.error("TMDB API key not found. Check your .env file.");
    }
  }, [apiKey]);

  const scrollMovies = (ref, offset) => {
    if (ref.current) ref.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const renderMovies = (movies) =>
    movies.map((movie) => (
      <div key={movie.id} className="movie-card">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
              : "placeholder.jpg"
          }
          alt={movie.title || movie.name}
        />
        <h3>{movie.title || movie.name}</h3>
      </div>
    ));

  return (
    <>
      <section className="hero">
        <h1>Welcome.</h1>
        <p>Millions of movies are available to you. Explore now.</p>
      </section>

      <section className="section trending">
        <h2>Trending</h2>
        <div
          className="scroll-btn left"
          onClick={() => scrollMovies(trendingRef, -400)}
        >
          &#10094;
        </div>
        <div id="trendingContainer" ref={trendingRef} className="movies">
          {renderMovies(trending)}
        </div>
        <div
          className="scroll-btn right"
          onClick={() => scrollMovies(trendingRef, 400)}
        >
          &#10095;
        </div>
      </section>

      <section className="section popular">
        <h2>Popular</h2>
        <div
          className="scroll-btn left"
          onClick={() => scrollMovies(popularRef, -400)}
        >

        </div>
        <div id="popularContainer" ref={popularRef} className="movies">
          {renderMovies(popular)}
        </div>
        <div
          className="scroll-btn right"
          onClick={() => scrollMovies(popularRef, 400)}
        >
          &#10095;
        </div>
      </section>
    </>
  );
};

export default Home;
