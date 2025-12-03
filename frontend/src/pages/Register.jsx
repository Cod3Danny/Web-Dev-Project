import { useState } from "react";
import { registerUser } from "../services/userServices";
import "./Login.css"

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        const newUser = { username, email, password };

        const responseMessage = await registerUser(newUser);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMessage(responseMessage);
        
    }

    return (
        <div id="login-page">

            {message && <p>{message}</p>}

            <form onSubmit={handleRegister} className="form">
                <h2>Register</h2>
                <div className="input">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="input">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <div className="input">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Register</button>

                <div>
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </form>
        </div>
    );
}
