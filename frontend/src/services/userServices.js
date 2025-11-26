const API_URL = "https://project-project-1.onrender.com/api";

// Register a new user
export async function createUser(email, username, password) {
  const res = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
    // no cookies needed for registration
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }

  if (!res.ok) {
    const errMessage = data?.error || "Failed to create user";
    throw new Error(errMessage);
  }

  return {
    username: data.username,
    email: data.email,
    userID: data.id,
  };
}

// Login user
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // include cookies
  });

  if (!res.ok) {
    let errData = { error: "Login failed" };
    try {
      errData = await res.json();
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }
    throw new Error(errData.error || "Login failed, please try again.");
  }

  return res.json();
}

// Get all users (protected)
export async function getUser() {
  const res = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Logout user
export async function logoutUser() {
  const res = await fetch(`${API_URL}/user/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    let errData = { error: "Failed to log out" };
    try {
      errData = await res.json();
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }
    throw new Error(errData.error);
  }

  return res.json();
}

// Check if user is logged in
export async function checkLogin() {
  const res = await fetch(`${API_URL}/user/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    let errData = { error: "Failed to check login" };
    try {
      errData = await res.json();
    } catch (e) {
      console.error("Failed to parse error JSON:", e);
    }
    throw new Error(errData.error);
  }

  return res.json();
}
