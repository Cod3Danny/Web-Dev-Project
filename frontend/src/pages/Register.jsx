import { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../services/userServices";
import "./Login.css";
export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const validateInputs = () => {
    let isValid = true;

    if (!username) {
      setUsernameError("Username is required.");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);

    try {
      await createUser(email, username, password);
      alert("Registration successful! Please log in.");

      // reset fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRegistrationError("");
    } catch (err) {
      setRegistrationError("Registration failed.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Register</h2>

      {registrationError && <p>{registrationError}</p>}

      <form onSubmit={handleRegister} className="form">
        <div className="input">
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p>{usernameError}</p>}
        </div>

        <div className="input">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p>{emailError}</p>}
        </div>

        <div className="input">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p>{passwordError}</p>}
        </div>

        <div className="input">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && <p>{confirmPasswordError}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
