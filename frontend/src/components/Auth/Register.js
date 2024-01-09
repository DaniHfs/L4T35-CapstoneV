import React, { useState } from "react";
import axios from "axios";

import "./AuthForm.css";

// Register component
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend API to register the user
      await axios.post("/api/register", {
        username,
        password,
      });

      // Clear the form
      setUsername("");
      setPassword("");
      alert("Registration successful");
    } catch (error) {
      alert("Registration failed");
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-heading">Register</h2>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
