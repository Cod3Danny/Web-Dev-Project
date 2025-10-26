(() => {
  const API = "https://api.themoviedb.org/3";

  const grid = document.getElementById("tvGrid");
  const statusEl = document.getElementById("loadStatus");
  const categorySel = document.getElementById("categorySelect");
  const categoryTitle = document.getElementById("categoryTitle");
  const sentinel = document.getElementById("sentinel");

  async function tmdb(path, params = {}) {
    const hasV4 = !!window.TMDB_V4_TOKEN;
    const hasV3 = !!window.TMDB_KEY;
    const url = new URL(API + path);

    if (!hasV4) {
      if (!hasV3) throw new Error("Please inject TMDB_V4_TOKEN or TMDB_KEY before tv.js");
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

  function fetchRoute(cat, p) {
    switch (cat) {
      case "trending_day": return tmdb("/trending/tv/day", { page: p });
      case "trending_week": return tmdb("/trending/tv/week", { page: p });
      case "top_rated": return tmdb("/tv/top_rated", { page: p });
      case "on_the_air": return tmdb("/tv/on_the_air", { page: p });
      case "airing_today": return tmdb("/tv/airing_today", { page: p });
      default: return tmdb("/tv/popular", { page: p });
    }
  }

  function render(items = []) {
    const frag = document.createDocumentFragment();
    items.forEach((it) => {
      const title = it.name || "Untitled";
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

  let io;
  function setupObserver() {
    if (!sentinel) return;
    if (io) io.disconnect();

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) load(false);
        });
      },
      { root: null, rootMargin: "1000px 0px", threshold: 0 }
    );
    io.observe(sentinel);
  }

  if (categorySel) {
    categorySel.addEventListener("change", () => {
      category = categorySel.value || "popular";
      if (categoryTitle)
        categoryTitle.textContent = categorySel.options[categorySel.selectedIndex].text + " Shows";
      load(true);
    });
  }

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

  setupObserver();
  load(true);
})();
