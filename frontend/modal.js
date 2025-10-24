// Create and show modal with movie details
async function showMovieModal(movieId) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('movieModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'movieModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div id="modalBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking X
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Show loading state
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '<div class="modal-loading">Loading movie details...</div>';
  modal.style.display = 'block';
  
  try {
    // Fetch movie details and credits
    const [movieResp, creditsResp] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
    ]);
    
    const movie = await movieResp.json();
    const credits = await creditsResp.json();
    
    // Display the movie details
    displayMovieDetails(movie, credits, modalBody);
  } catch (err) {
    console.error('Error fetching movie details:', err);
    modalBody.innerHTML = '<div class="modal-loading">Error loading movie details. Please try again.</div>';
  }
}

// Display movie details in modal
function displayMovieDetails(movie, credits, container) {
  const imgSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "https://via.placeholder.com/500x750/2a2a2a/ffffff?text=No+Poster+Available";
  
  // Get top 8 cast members
  const topCast = credits.cast.slice(0, 8);
  
  // Format runtime
  const runtime = movie.runtime ? 
    `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 
    'N/A';
  
  // Format release year
  const releaseYear = movie.release_date ? 
    movie.release_date.split('-')[0] : 
    'N/A';

  container.innerHTML = `
    <div class="movie-hero">
      <div class="movie-info">
        <img src="${imgSrc}" alt="${movie.title}" class="movie-poster">
        
        <div class="movie-content">
          <h1>${movie.title}</h1>
          
          <div class="movie-meta">
            <span class="meta-item">${releaseYear}</span>
            <span class="meta-item">${runtime}</span>
            <span class="meta-item">⭐ ${movie.vote_average?.toFixed(1)}/10</span>
            <span class="meta-item">${movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
          </div>
          
          <div class="overview-section">
            <h3>Overview</h3>
            <p class="overview-text">${movie.overview || 'No overview available.'}</p>
          </div>
          
          <div class="movie-actions">
            <button class="action-btn watchlist-btn" onclick="addToWatchlist(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.poster_path || ''}', '${movie.release_date || ''}', ${movie.vote_average || 0})">
              ★ Add to Watchlist
            </button>
            <button class="action-btn trailer-btn" onclick="searchTrailer('${movie.title.replace(/'/g, "\\'")}')">
              ▶ Watch Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    ${topCast.length > 0 ? `
    <div class="cast-section">
      <h2>Top Cast</h2>
      <div class="cast-grid">
        ${topCast.map(actor => `
          <div class="cast-card">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : 'https://via.placeholder.com/200x200/404040/ffffff?text=No+Photo'}" 
                 alt="${actor.name}"
                 class="cast-image">
            <h4>${actor.name}</h4>
            <p class="character-name">${actor.character}</p>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
  `;
}

// Add to watchlist function
function addToWatchlist(movieId, title, posterPath, releaseDate, rating) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  
  // Check if movie already in watchlist
  if (watchlist.some(movie => movie.id === movieId)) {
    alert('This movie is already in your watchlist!');
    return;
  }
  
  const movie = {
    id: movieId,
    title: title,
    poster_path: posterPath,
    release_date: releaseDate,
    vote_average: rating
  };
  
  watchlist.push(movie);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  alert('Added to watchlist!');
}

// Search trailer on YouTube
function searchTrailer(movieTitle) {
  const query = encodeURIComponent(`${movieTitle} official trailer`);
  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
}