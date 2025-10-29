import './MovieCard.css'
const MovieCard = ({ movie }) => {
  const imgSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    : "placeholder.jpg";

  return (
    <div className="movie-card">
      <img src={imgSrc} alt={movie.title || movie.name} />
      <h3>{movie.title || movie.name}</h3>
    </div>
  );
};

export default MovieCard;