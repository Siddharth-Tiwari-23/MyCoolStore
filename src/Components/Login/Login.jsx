import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const timer = setTimeout(() => {
      setStatusNote("Connecting to backend (Render may take up to 45s on first visit to wake up)...");
    }, 2500);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      if (response.success) {
        localStorage.setItem("token", response.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        window.location.href = "/";
      } else {
        setMessage(response.message || "Invalid credentials");
      }
    } catch {
      setMessage("Login Failed. Please try again.");
    } finally {
      clearTimeout(timer);
      setStatusNote("");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>MyCoolStore Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {statusNote && (
          <p className="status-notice">{statusNote}</p>
        )}

        {message && (
          <p className="error">{message}</p>
        )}

        <div className="auth-link">
          New User? <Link to="/register">Register</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;