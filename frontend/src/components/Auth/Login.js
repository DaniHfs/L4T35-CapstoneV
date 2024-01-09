import React, { useState } from "react";
import axios from "axios";

import "./AuthForm.css";

// Login component
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend API to login the user
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      if (response.data.token) {
        // Store the JWT token in local storage
        localStorage.setItem("token", response.data.token);

        // Clear the form
        setUsername("");
        setPassword("");
        window.location.href = "/credential-repository";
      }
    } catch (error) {
      alert("Login failed");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-heading">Login</h2>
      <form className="auth-form-group" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className="auth-form-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
