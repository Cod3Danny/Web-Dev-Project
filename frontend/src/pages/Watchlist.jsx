import { useEffect, useState } from "react";
import { loadUser } from "../services/userServices";
import { getWatchlist } from "../services/watchlistServices";
import "./Movies.css"
import Masthead from "../components/Masthead";
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState(null);
    const [movies, setMovies] = useState([]);
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    // NEW: loading states
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
    const [isMoviesLoading, setIsMoviesLoading] = useState(false);

    // NEW: optional error message
    const [error, setError] = useState("");

    useEffect(() => {

        let ignore = false;
        async function fetchUser() {
        try {
            setIsUserLoading(true);
            setError("");
            const data = await loadUser();
            if (!ignore) setUser(data);
        } catch (e) {
            if (!ignore) setError(e?.message || "Failed to load user.");
        } finally {
            if (!ignore) setIsUserLoading(false);
        }
        }

        fetchUser();

        return () => {
        ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        async function fetchWatchlist() {
        if (user && user.username) {
            try {
            setIsWatchlistLoading(true);
            setError("");
            const watchlistData = await getWatchlist(user.username);
            if (!ignore) setWatchlist(watchlistData);
            } catch (e) {
            if (!ignore) setError(e?.message || "Failed to load watchlist.");
            } finally {
            if (!ignore) setIsWatchlistLoading(false);
            }
        }
        }

        fetchWatchlist();

        return () => {
        ignore = true;
        };
    }, [user]);

    useEffect(() => {
        let ignore = false;

        async function fetchMovies() {
        if (!watchlist || !watchlist.movies) return;

        try {
            setIsMoviesLoading(true);
            setError("");

            const movieData = await Promise.all(
            watchlist.movies.map(async (link) => {
                const res = await fetch(`${link}?api_key=${apiKey}`);
                const data = await res.json();
                return { ...data, __link: link };
            })
            );

            if (!ignore) setMovies(movieData);
        } catch (e) {
            if (!ignore) setError(e?.message || "Failed to load movies from TMDB.");
        } finally {
            if (!ignore) setIsMoviesLoading(false);
        }
        }

        fetchMovies();

        return () => {
        ignore = true;
        };
    }, [watchlist, apiKey]);

    // NEW: Masthead loading
    const isMastheadLoading = isUserLoading || (user && isWatchlistLoading);
    function onRemoved(link) {
    setMovies((prev) => prev.filter((m) => m.__link !== link));
    setWatchlist((prev) => {
        if (!prev) return prev;
        return { ...prev, movies: prev.movies.filter((x) => x !== link) };
    });
    }

    return (
        <>
            {isMastheadLoading && (
                <div className="movies-page">
                    <Masthead title="Loading watchlist..." />
                </div>
            )}
            {
                !isMastheadLoading && watchlist && (
                    <div className="movies-page">
                        <Masthead title={`${watchlist.username}'s Watchlist`} />
                        <section className="movie-grid">
                            {error && <p>{error}</p>}
                            {isMoviesLoading && <p>Loading movies...</p>}
                            {!isMoviesLoading && watchlist.movies.length > 0 && movies.map((m, index) => (
                                <MovieCard key={m.__link} filmType={m.__link?.includes("/tv/") ? "tv" : "movie"} movie={m} id={m.id} movieLink={m.__link} onRemoved={onRemoved} />
                            ))}
                            {!isMoviesLoading && watchlist.movies.length === 0 && (
                                <p>no movies currently in watchlist</p>
                            )}
                        </section>

                    </div>
                )
            }
            {
                !isMastheadLoading && !watchlist && (
                    <Masthead title={`Please Login First.`} />
                )
            }

        </>
    )
}

export default Watchlist; 