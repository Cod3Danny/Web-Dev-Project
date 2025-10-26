(() => {
  const API = "https://api.themoviedb.org/3";

  const grid = document.getElementById("movieGrid");
  const statusEl = document.getElementById("loadStatus");
  const categorySel = document.getElementById("categorySelect");
  const genreSel = document.getElementById("genreSelect");
  const categoryTitle = document.getElementById("categoryTitle");
  const sentinel = document.getElementById("sentinel");

  async function tmdb(path, params = {}) {
    const hasV4 = !!window.TMDB_V4_TOKEN;
    const hasV3 = !!window.TMDB_KEY;
    const url = new URL(API + path);

    if (!hasV4) {
      if (!hasV3) throw new Error("Please inject TMDB_V4_TOKEN or TMDB_KEY before movie.js");
      url.searchParams.set("api_key", window.TMDB_KEY);
    }

    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }

    const res = await fetch(url, {
      headers: hasV4
        ? { Authorization: `Bearer ${window.TMDB_V4_TOKEN}`, Accept: "application/json" }
        : { Accept: "application/json" },
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`TMDB ${res.status}: ${text || res.statusText}`);
    return text ? JSON.parse(text) : {};
  }

  const img = (p, w = 300) => (p ? `https://image.tmdb.org/t/p/w${w}/${p}` : "placeholder.jpg");
  const esc = (s = "") =>
    s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const setStatus = (t) => (statusEl ? (statusEl.textContent = t || "") : null);

  let category = categorySel ? categorySel.value : "popular";
  let page = 1;
  let totalPages = Infinity;
  let loading = false;

  // --- Load genres from TMDB ---
  async function loadGenres() {
    try {
      const data = await tmdb("/genre/movie/list");
      if (!genreSel) return;
      data.genres.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.id;
        opt.textContent = g.name;
        genreSel.appendChild(opt);
      });
    } catch (err) {
      console.error("Failed to load genres:", err);
    }
  }

  // --- Fetch movies based on category and/or genre ---
  function fetchRoute(cat, p) {
    const genreId = genreSel ? genreSel.value : "";

    // Map categories to discover sorting
    const sortMap = {
      popular: "popularity.desc",
      top_rated: "vote_average.desc",
      now_playing: "primary_release_date.desc",
      upcoming: "primary_release_date.asc"
    };

    if (genreId) {
      // Use discover endpoint if a genre is selected
      const params = { page: p, with_genres: genreId };
      params.sort_by = sortMap[cat] || "popularity.desc";
      return tmdb("/discover/movie", params);
    }

    // Otherwise use normal category endpoints
    switch (cat) {
      case "trending_day": return tmdb("/trending/movie/day", { page: p });
      case "trending_week": return tmdb("/trending/movie/week", { page: p });
      case "top_rated": return tmdb("/movie/top_rated", { page: p });
      case "now_playing": return tmdb("/movie/now_playing", { page: p });
      case "upcoming": return tmdb("/movie/upcoming", { page: p });
      default: return tmdb("/movie/popular", { page: p });
    }
  }

  // --- Render movie cards ---
  function render(items = []) {
    const frag = document.createDocumentFragment();
    items.forEach(it => {
      const title = it.title || "Untitled";
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${img(it.poster_path)}" alt="${esc(title)}">
        <h3>${esc(title)}</h3>
      `;
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        showMovieModal(it.id);
      });
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  function nearBottom(offset = 900) {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    return scrollTop + clientHeight >= scrollHeight - offset;
  }

  async function load(reset = false) {
    if (loading) return;
    if (!reset && page > totalPages) return;
    loading = true;

    try {
      if (reset) {
        grid.innerHTML = "";
        page = 1;
        totalPages = Infinity;
      }

      setStatus("Loading…");
      const data = await fetchRoute(category, page);
      totalPages = data.total_pages || 1;
      render(data.results || []);
      page++;

      setStatus(page <= totalPages ? "Scroll down to see more…" : "All caught up.");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    } finally {
      loading = false;
    }
  }

  // --- Infinite scroll observer ---
  let io;
  function setupObserver() {
    if (!sentinel) return;
    if (io) io.disconnect();

    io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) load(false);
        });
      },
      { root: null, rootMargin: "1000px 0px", threshold: 0 }
    );
    io.observe(sentinel);
  }

  // --- Event listeners for category and genre ---
  if (categorySel) {
    categorySel.addEventListener("change", () => {
      category = categorySel.value || "popular";
      if (categoryTitle)
        categoryTitle.textContent =
          categorySel.options[categorySel.selectedIndex].text + " Movies";
      load(true);
    });
  }

  if (genreSel) {
    genreSel.addEventListener("change", () => {
      load(true);
    });
  }

  // --- Scroll/resize infinite load ---
  let ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (nearBottom() && !loading && page <= totalPages) load(false);
    });
  }
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);

  // --- Initialize ---
  setupObserver();
  loadGenres();
  load(true);

})();