import { createWatchlist } from "./watchlistServices";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function logoutUser() {
    localStorage.removeItem("token");
}

export async function loginUser(userData) {
  try {
    const res = await fetch(`${backendUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (!res.ok) {
      return (data.message || "Login failed");
    }

    // save token
    localStorage.setItem("token", data.token);

    return "Login successful!";
  } catch (error) {
    return "Server error";
  }
}

export async function registerUser(userData) {
  try {
    const res_register = await fetch(`${backendUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (res_register.ok) {
        return "User registered successfully!";
    } else {
      const data = await res.json();
      return (data.message || "Registration failed");
    }
  } catch (error) {
    return "Server error";
  }
}

export async function loadUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${backendUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}
