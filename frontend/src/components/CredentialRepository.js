import React, { useEffect, useState } from "react";
import axios from "axios";

import "./CredentialRepository.css";

// CredentialRepository component
const CredentialRepository = () => {
  const [credentials, setCredentials] = useState([]);
  const [newCredential, setNewCredential] = useState({
    name: "",
    username: "",
    password: "",
    divId: "",
  });

  // Fetch the credentials from the backend API
  const fetchCredentials = async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get("/api/credentials");
      setCredentials(response.data.credentials);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  useEffect(() => {
    // Fetch credentials on component mount
    fetchCredentials();
  }, []);

  // Add a new credential
  const handleAddCredential = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend API to add a new credential
      await axios.post("/api/credentials/add", newCredential);

      // Refresh the list of credentials
      fetchCredentials();

      // Clear the form
      setNewCredential({
        name: "",
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Error adding credential: ", error);
    }
  };

  // State variables for credential update & update form visibility
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);

  // Update a credential
  const handleUpdateCredential = async (e) => {
    e.preventDefault();

    try {
      // Send request to backend API to update credential
      await axios.put(
        `/api/credentials/${selectedCredential._id}`,
        newCredential
      );

      // Reset selection & hide update form
      setSelectedCredential(null);
      setUpdateFormVisible(false);
      // Refresh the list of credentials
      fetchCredentials();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Insufficient permissions to perform this action.");
      } else {
        console.error("Error updating credential: ", error);
      }
    }
  };

  // Update form visibility
  const showUpdateForm = (credential) => {
    setSelectedCredential(credential);
    setUpdateFormVisible(true);

    // Prefill the form with existing data
    setNewCredential({
      name: credential.name,
      username: credential.username,
      password: credential.password,
    });
  };

  return (
    <div className="credential-container">
      <h2>Credential Repository</h2>
      <ul className="credential-list">
        {credentials.map((credential) => (
          <li key={credential._id}>
            <p>Name: {credential.name}</p>
            <p>Username: {credential.username}</p>
            <p>Password: {credential.password}</p>
            <button onClick={() => showUpdateForm(credential)}>Update</button>
          </li>
        ))}
      </ul>
      {/* Update form only shows when an entry's 'update' button is clicked */}
      {isUpdateFormVisible && (
        <div className="update-form">
          <h4>Update the entry:</h4>
          <form onSubmit={handleUpdateCredential}>
            <label>
              Name:
              <input
                type="text"
                value={newCredential.name}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, name: e.target.value })
                }
              />
            </label>
            <br />
            <label>
              Username:
              <input
                type="text"
                value={newCredential.username}
                onChange={(e) =>
                  setNewCredential({
                    ...newCredential,
                    username: e.target.value,
                  })
                }
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={newCredential.password}
                onChange={(e) =>
                  setNewCredential({
                    ...newCredential,
                    password: e.target.value,
                  })
                }
              />
            </label>
            <br />
            <button type="submit">Update Credential</button>
          </form>
        </div>
      )}
      <h4>Add an entry:</h4>
      <form onSubmit={handleAddCredential}>
        <label>
          Name:
          <input
            type="text"
            value={newCredential.name}
            onChange={(e) =>
              setNewCredential({ ...newCredential, name: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            value={newCredential.username}
            onChange={(e) =>
              setNewCredential({ ...newCredential, username: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={newCredential.password}
            onChange={(e) =>
              setNewCredential({ ...newCredential, password: e.target.value })
            }
          />
        </label>
        <br />
        <button type="submit">Add Credential</button>
      </form>
    </div>
  );
};

export default CredentialRepository;
