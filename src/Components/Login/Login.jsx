import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      });

      if (response.success) {
        localStorage.setItem("token", response.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        window.location.href = "/profile";
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage("Login Failed");
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
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

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