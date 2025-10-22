const apiKey = "06ccaa57f140ada11e68d82ac66e5b65";
const trendingContainer = document.getElementById("trendingContainer");
const popularContainer = document.getElementById("popularContainer");

// Fetch Trending Movies
async function getTrendingMovies() {
  try {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
    const data = await resp.json();
    displayMovies(data.results, trendingContainer);
  } catch (err) {
    console.error("Error fetching trending movies:", err);
  }
}

// Fetch Popular Movies
async function getPopularMovies() {
  try {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const data = await resp.json();
    displayMovies(data.results, popularContainer);
  } catch (err) {
    console.error("Error fetching popular movies:", err);
  }
}

// Display Movie Cards
function displayMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach(movie => {
    const imgSrc = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
      : "placeholder.jpg";

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <img src="${imgSrc}" alt="${movie.title}">
      <h3>${movie.title || movie.name}</h3>
    `;
    container.appendChild(card);
  });
}

// Buttons to scroll
function scrollMovies(containerId, scrollOffset) {
  const container = document.getElementById(containerId);
  container.scrollBy({
    left: scrollOffset,
    behavior: "smooth"
  });
}

// Load movies on page load
getTrendingMovies();
getPopularMovies();