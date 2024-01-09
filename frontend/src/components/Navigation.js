import { React, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Navigation.css";

// Navigation component
const Navigation = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    // Clear the JWT token from local storage upon logout
    localStorage.removeItem("token");
    window.location.href = "http://localhost:3006";
  };

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem("token") !== null;

  // Check if user is admin (for user management access)
  const checkAdmin = async () => {
    try {
      const response = await axios.get("/checkAdmin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin role: ", error);
      setIsAdmin(false);
    }
  };

  // Check if a user has the admin role on login
  if (isLoggedIn) {
    checkAdmin();
  }

  return (
    <nav className="nav-container">
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li className="nav-link-item">
              <Link to="/credential-repository">Credential Repository</Link>
            </li>
            {isAdmin && (
              <li className="nav-link-item">
                <Link to="/user-management">User Management</Link>
              </li>
            )}
            <li className="nav-link-item">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-link-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="nav-link-item">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
