import './MovieCard.css'
import { useState } from 'react';
import MovieModal from './MovieModal';

const MovieCard = ({ movie }) => {
    const [showModal, setShowModal] = useState(false);

    const imgSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
        : "placeholder.jpg";

    const handleShowModal = () => {
        console.log('adsasd')
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="movie-card" onClick={handleShowModal}>
                <img src={imgSrc} alt={movie.title || movie.name} />
                <h3>{movie.title || movie.name}</h3>
            </div>
            {showModal && (
                <MovieModal
                    movieId={movie.id}
                    onClose={handleCloseModal}
                />
            )}
        </>

    );
};

export default MovieCard;