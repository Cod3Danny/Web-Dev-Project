import { useState } from "react";
import { loginUser } from "../services/userServices";
import "./Login.css"

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        const userData = { "username": username, "password": password };
        const responseMessage = await loginUser(userData);
        setMessage(responseMessage);
        //pause for 1 second to show message
        setTimeout(() => {
            if (responseMessage === "Login successful!") {
                window.location.href = "/";
            }
        }, 1000);
    }

    return (
        <div id="login-page">


            {message && <p>{message}</p>}

            <form onSubmit={handleLogin} className="form">
                <h2>Login</h2>
                <div className="input">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="input">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Login</button>

                <div>
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </div>
            </form>
        </div>
    );
}
