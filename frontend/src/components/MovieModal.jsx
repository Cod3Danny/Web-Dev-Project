import { useEffect, useState } from "react";
import CastCard from "./CastCard";
import { addItemToWatchlist, getWatchlist, removeItemFromWatchlist } from "../services/watchlistServices";
import { loadUser } from "../services/userServices";
import "./MovieModal.css";

const MovieModal = ({ filmType, movieId, onClose, onRemoved }) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const link = movieLink || `https://api.themoviedb.org/3/${filmType}/${movieId}`;

  const [userLoading, setUserLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  function getTrailer() {
    const filmTitle = movie.title ? movie.title : movie.name ? movie.name : 'N/A';
    const query = encodeURIComponent(`${filmTitle} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      try{
        setUserLoading(true);
        const data = await loadUser();
        if (!ignore) setUser(data); 
      } finally {
        if (!ignore) setUserLoading(false);
      }
    }

    fetchUser();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function checkWatchlist() {
      if (user && user.username) {
        const watchlistData = await getWatchlist(user.username);
        if (!ignore && watchlistData && watchlistData.movies.includes(link)) {
          setInWatchlist(true);
        }
      }
    }

    checkWatchlist();
    return () => {
      ignore = true;
    };
  }, [user, link]);

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

  async function addToWatchList() {
    if (user && user.username) {
      if (inWatchlist) {
        setActionMsg("Already in watchlist.");
        return;
      }

      try {
        setIsAdding(true);
        setActionMsg("");

        const res = await addItemToWatchlist(user.username, link);

        setInWatchlist(true);
        setActionMsg(res || "Added to watchlist.");
      } catch (e) {
        setActionMsg("Failed to add to watchlist.");
      } finally {
        setIsAdding(false);
      }
    } else {
      navigate("/login");
    }
  }

  async function removeFromWatchlist() {
    if (user && user.username) {
      try {
        setIsRemoving(true);
        setActionMsg("");

        const res = await removeItemFromWatchlist(user.username, link);

        setInWatchlist(false);
        onRemoved?.(movieId, link);
        setActionMsg(res || "Removed from watchlist.");
      } catch (e) {
        setActionMsg("Failed to remove from watchlist.");
      } finally {
        setIsRemoving(false);
      }
    } else {
      navigate("/login");
    }
  }

  const watchlistBtnDisabled = userLoading || isAdding || isRemoving;

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
                    {filmType == 'movie' && <h1 className="movie-title">{movie.title}</h1>}
                    {filmType == 'tv' && <h1 className="movie-title">{movie.name}</h1>}
                    <div className="movie-meta">
                      <p className="meta-item">{releaseYear}</p>
                      {filmType == 'movie' && <p className="meta-item">{runtime}</p>}
                      {filmType == 'tv' && <p className="meta-item">{movie.number_of_episodes} Episodes</p>}
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
                    {actionMsg && <div className="action-msg">{actionMsg}</div>}
                    <div className="movie-actions">
                      <button
                        className="watchlist-btn"
                        onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
                        disabled={watchlistBtnDisabled}
                      >
                        {userLoading
                          ? "Loading..."
                          : inWatchlist
                            ? (isRemoving ? "Removing..." : "Remove From Watchlist")
                            : (isAdding ? "Adding..." : "Add to Watchlist")}
                      </button>

                      <button className="trailer-btn" onClick={() => getTrailer()}>
                        ▶️ Watch Trailer
                      </button>
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
