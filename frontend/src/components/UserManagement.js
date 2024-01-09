import React, { useState, useEffect } from "react";
import axios from "axios";

import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newDivision, setNewDivision] = useState("");
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setNewDivision(user.divisions.join(", "));
  };

  const handleRoleChange = async () => {
    try {
      await axios.put(`/api/users/${selectedUser._id}`, {
        role: newRole,
        divisions: selectedUser.divisions,
      });
      // Refresh the user list after successful update
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user role: ", error);
    }
  };

  const handleDivisionChange = async () => {
    try {
      await axios.put(`/api/users/${selectedUser._id}`, {
        role: selectedUser.role,
        divisions: newDivision.split(", "),
      });
      // Refresh the user list after successful update
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user division: ", error);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">User Management</h1>
      <div>
        <h2>Users:</h2>
        <ul className="users-list">
          {users.map((user) => (
            <li key={user._id} onClick={() => handleUserSelect(user)}>
              {user.username} - Role: {user.role} - Divisions:{" "}
              {user.divisions.join(", ")}
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div className="edit-user-form">
          <h2>Edit User</h2>
          <p>Selected User: {selectedUser.username}</p>
          <label>
            Role:
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
          </label>
          <button onClick={handleRoleChange}>Change Role</button>
          <br />
          <label>
            Division:
            <input
              type="text"
              value={newDivision}
              onChange={(e) => setNewDivision(e.target.value)}
            />
          </label>
          <button onClick={handleDivisionChange}>Change Division</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
