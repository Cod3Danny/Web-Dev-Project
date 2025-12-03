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

    useEffect(() => {
        async function fetchUser() {
            const data = await loadUser();
            setUser(data);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchWatchlist() {
            if (user && user.username) {
                const watchlistData = await getWatchlist(user.username);
                setWatchlist(watchlistData);
            }
        }
        fetchWatchlist();
    }, [user]);

    useEffect(() => {
        async function fetchMovies() {
            if (!watchlist || !watchlist.movies) return;

            const movieData = await Promise.all(
                watchlist.movies.map(async (link) => {
                    const res = await fetch(
                        `${link}?api_key=${apiKey}`
                    );
                    return await res.json();
                })
            );
            setMovies(movieData);
        }

        fetchMovies();
    }, [watchlist]);

    return (
        <>
            {
                watchlist && (
                    <div className="movies-page">
                        <Masthead title={`${watchlist.username}'s Watchlist`} />
                        <section className="movie-grid">
                            {watchlist.movies.length > 0 && movies.map((m, index) => (
                                <MovieCard key={index} filmType='movie' movie={m} id={m.id} />
                            ))}
                            {watchlist.movies.length === 0 && (
                                <p>no movies currently in watchlist</p>
                            )}
                        </section>

                    </div>
                )
            }
            {
                !watchlist && (
                    <Masthead title={`Please Login First.`} />
                )
            }

        </>
    )
}

export default Watchlist; 