import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import CredentialRepository from "./components/CredentialRepository";
import UserManagement from "./components/UserManagement";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="home-container">
        <Navigation />
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/credential-repository"
            element={<CredentialRepository />}
          ></Route>
          <Route
            exact
            path="/user-management"
            element={<UserManagement />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
