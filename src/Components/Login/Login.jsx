import { useState } from "react";
import { loginUser } from "../../services/authService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Login button clicked");

        try {
            const response = await loginUser({
                email,
                password,
            });

            console.log("Login Response:", response);

            if (response.success) {

                // Save token
                localStorage.setItem("token", response.token);

                // Save user details
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.user)
                );

                // Redirect
                window.location.href = "/profile";
            }
            else {
                setMessage(response.message || "Login Failed");
            }

        } catch (error) {
            console.error("Login Error:", error);
            setMessage("Something went wrong");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

            <br />

            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;