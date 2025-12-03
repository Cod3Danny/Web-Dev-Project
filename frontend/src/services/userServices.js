const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
      const res = await fetch(`${backendUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        return "User registered successfully!";
      } else {
        const data = await res.json();
        return (data.message || "Registration failed");
      }
    } catch (error) {
      return "Server error";
    }
}