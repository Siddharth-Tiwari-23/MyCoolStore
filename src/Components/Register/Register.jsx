import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const timer = setTimeout(() => {
      setStatusNote("Connecting to backend (Render may take up to 45s on first visit to wake up)...");
    }, 2500);

    try {
      const response = await registerUser(formData);

      if (response.success) {
        alert("Registration Successful 🎉 Please login.");
        navigate("/login");
      } else {
        setError(response.message || "Registration Failed");
      }
    } catch {
      setError("Registration Failed. Please try again.");
    } finally {
      clearTimeout(timer);
      setStatusNote("");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <form
        className="register-card"
        onSubmit={handleSubmit}
      >
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && (
          <p className="error" style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {statusNote && (
          <p className="status-notice">{statusNote}</p>
        )}

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;