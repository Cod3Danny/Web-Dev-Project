import { useEffect, useState } from "react";
import CastCard from "./CastCard";
import "./MovieModal.css";

const MovieModal = ({ filmType, movieId, onClose }) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  function getTrailer () {
    const query = encodeURIComponent(`${movie.title} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  function addToWatchList () {
    alert('added to watchlist'); 
  }

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");
        const [movieResp, creditsResp] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/${filmType}/${movieId}?api_key=${apiKey}`
          ),
          fetch(
            `https://api.themoviedb.org/3/${filmType}/${movieId}/credits?api_key=${apiKey}`
          ),
        ]);

        if (!movieResp.ok || !creditsResp.ok)
          throw new Error("Failed to fetch data");

        const movieData = await movieResp.json();
        const creditsData = await creditsResp.json();
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, apiKey]);

  if (!movieId) return null;

  const posterSrc = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "https://via.placeholder.com/500x750/2a2a2a/ffffff?text=No+Poster+Available";

  const topCast = credits?.cast?.slice(0, 8) || [];
  const runtime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";
  const releaseYear = movie?.release_date //release date is for move
    ? movie.release_date.split("-")[0] 
    : movie?.first_air_date               //first air date is for tv
    ? movie.first_air_date.split("-")[0]
    : "N/A";

  return (
    <div className="modal">
      <div id="modalBody">
        <div className="modal-content">
          <span className="close-modal" onClick={onClose}>
            <p>&times;</p>
          </span>
          <div>
            {loading ? (
              <div className="modal-loading">Loading movie details...</div>
            ) : error ? (
              <div className="modal-error">{error}</div>
            ) : (
              <div className="movie-info">
                <div className="row">
                  <img
                    className="movie-poster"
                    src={posterSrc}
                    alt={movie.title}
                  />

                  <div className="movie-content">
                    {filmType =='movie' && <h1 className="movie-title">{movie.title}</h1>}
                    {filmType =='tv' && <h1 className="movie-title">{movie.name}</h1>}
                    <div className="movie-meta">
                      <p className="meta-item">{releaseYear}</p>
                      {filmType =='movie' && <p className="meta-item">{runtime}</p>}
                      {filmType =='tv' && <p className="meta-item">{movie.number_of_episodes} Episodes</p>}
                      <p className="meta-item">
                        ⭐️ {movie.vote_average?.toFixed(1)}/10
                      </p>
                    </div>
                    <div className="movie-genres">
                      {movie.genres?.length
                        ? movie.genres.map((g, index) => (
                          <p className="meta-item" key={index}>
                            {g.name}
                          </p>
                        ))
                        : "Genre N/A"}
                    </div>

                    <div className="overview-section">
                      <h3>Overview:</h3>
                      <p className="overview-text">
                        {movie.overview || "No overview available."}
                      </p>
                    </div>
                    <div className="movie-actions">
                      <button className="watchlist-btn" onClick={() => addToWatchList()}>Add to Watchlist</button>
                      <button className='trailer-btn' onClick={() => getTrailer()}>Watch Trailer</button>
                    </div>
                  </div>


                </div>
                {topCast.length > 0 && (
                  <div className="cast-section">
                    <h2>Top Cast</h2>
                    <div className="cast-grid">
                      {topCast.map((actor, index) => (
                        <CastCard
                          key={index}
                          name={actor.name}
                          imgSrc={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                              : "https://via.placeholder.com/200x200/404040/ffffff?text=No+Photo"
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
