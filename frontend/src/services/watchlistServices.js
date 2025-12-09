const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function createWatchlist(username) {
    try {
        const res = await fetch(`${backendUrl}/api/watchlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });
        if (!res.ok) {
            throw new Error(`Create watchlist failed (HTTP ${res.status})`);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function getWatchlist(username) {
    try {
        const res = await fetch(`${backendUrl}/api/watchlist/${username}`);
        if (!res.ok) {
            throw new Error(`Get watchlist failed (HTTP ${res.status})`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function addItemToWatchlist(username, link) {
    try {
        const res = await fetch(`${backendUrl}/api/watchlist/${username}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ link })
        });
        if (!res.ok) {
            throw new Error(`Add to watchlist failed (HTTP ${res.status})`);
        }
        return "Sucessfully added to watchlist";
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function removeItemFromWatchlist(username, link) {
    try {
        const res = await fetch(`${backendUrl}/api/watchlist/${username}/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ link })
        });
        if (!res.ok) {
            throw new Error(`Remove from watchlist failed (HTTP ${res.status})`);
        }
        return "Successfully removed from watchlist";
    } catch (error) {
        console.log(error);
        throw error;
    }
}