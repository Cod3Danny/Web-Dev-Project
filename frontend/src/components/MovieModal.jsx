import { useEffect, useState } from "react";
import CastCard from "./CastCard";
import "./MovieModal.css";

const MovieModal = ({ movieId, onClose }) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setError("");
                const [movieResp, creditsResp] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`),
                    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
                ]);

                if (!movieResp.ok || !creditsResp.ok) throw new Error("Failed to fetch data");

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
        : "https://via.placeholder.com/500x750/2a2a2a/ffffff?text=No+Poster";

    const topCast = credits?.cast?.slice(0, 8) || [];
    const runtime = movie?.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A";
    const releaseYear = movie?.release_date ? movie.release_date.split("-")[0] : "N/A";

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content">

                {loading ? (
                    <div className="modal-loading">Loading movie details...</div>
                ) : error ? (
                    <div className="modal-error">{error}</div>
                ) : (
                    <div className="movie-details">
                        <img src={posterSrc} alt={movie.title} className="movie-poster" />
                        <div className="movie-info">
                            <h1>{movie.title}</h1>
                            <div className="short-movie-info">
                                <p>{releaseYear}</p>
                                <p>{runtime}</p>
                                <p>{movie.vote_average?.toFixed(1)}/10</p>
                            </div>

                            <div className="movie-genres">
                                {movie.genres?.length
                                    ? movie.genres.map((g) => <p key={movie.title + g.name}>{g.name}</p>)
                                    : "Genre N/A"}
                            </div>
                                

                            <p><strong>Overview:</strong> {movie.overview || "No overview available."}</p>

                            {topCast.length > 0 && (
                                <div className="cast-section">
                                    <h3>Top Cast</h3>
                                    <div className="cast-container">
                                        {topCast.map((actor) => (
                                            <CastCard key={actor.cast_id} name={actor.name} imgSrc={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : 'https://via.placeholder.com/200x200/404040/ffffff?text=No+Photo'} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieModal;
