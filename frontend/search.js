// TMBID API Key (Replace with your own key)
const apiKey = "06ccaa57f140ada11e68d82ac66e5b65"; 
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsContainer = document.getElementById("resultsContainer");

async function searchMovies(query) {
  try {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await resp.json();
    displayMovies(data.results);
  } catch (err) {
    console.error("Error searching movies:", err);
  }
}

function displayMovies(movies) {
  resultsContainer.innerHTML = "";
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
    resultsContainer.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) searchMovies(query);
});