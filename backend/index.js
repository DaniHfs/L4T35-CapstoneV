const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { authenticateToken } = require("./auth");
const { secretKey } = require("./secretKey");

const User = require("./models/User.model");
const Role = require("./models/Role.model");
const Division = require("./models/Division.model");
const Credential = require("./models/Credential.model");

app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO =
  "mongodb+srv://dhmongoadmin:admin@dhmongohyp.8v4evxt.mongodb.net/ctCreds";

mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT || 5000;

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
  });
/*-           --           --           --           --           - */
// User registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "Standard",
    });

    // Save the new user to the database
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({ message: "Error registering user" });
  }
});
/*-           --           --           --           --           - */
// User login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    // Verify user's password
    if (!bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // JWT payload
    const payload = {
      userId: user._id,
      username,
      userRole: user.role,
      userDiv: user.divisions,
    };

    // Generate token
    const token = jwt.sign(JSON.stringify(payload), secretKey, {
      algorithm: "HS256",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Login error" });
  }
});
/*-           --           --           --           --           - */
// PROTECTED ROUTES, REQUIRE AUTH MIDDLEWARE

// JWT token auth middleware
app.use(authenticateToken);
/*-           --           --           --           --           - */
// Role retrieval endpoint
app.get("/api/user/roles", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch the user data from the database based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Extract the user's role from the fetched data
    const userRole = user.userRole;

    // Send the user role as a response
    res.json({ role: userRole });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Server error" });
  }
});
/*-           --           --           --           --           - */
// Credential retrieval endpoint
app.get("/api/credentials", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user and populate the 'Role' field
    const user = await User.findById(userId).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has permission to read credentials
    const role = await Role.findOne({ role: req.userRole }).populate(
      "permissions"
    );
    const permissions = role.permissions;

    if (!permissions.includes("read")) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Retrieve divisions associated with the user
    const divisions = await Division.find({ name: { $in: user.divisions } });

    // Retrieve credentials based on divisions
    const credentials = await Credential.find({ divId: { $in: divisions } });

    res.json({ credentials });
  } catch (error) {
    console.error("Error retrieving credentials: ", error);
    res.status(500).json({ message: "Error retrieving credentials" });
  }
});
/*-           --           --           --           --           - */
// Add new credential endpoint
app.post("/api/credentials/add", authenticateToken, async (req, res) => {
  try {
    // Get user's division id
    const div = await Division.findOne({ name: req.userDiv });
    const divId = div._id;

    // Create new credential
    const newCredential = new Credential({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      divId: divId,
    });

    // Save the new credential to the database
    await newCredential.save();

    res.json({ message: "Credential added successfully" });
  } catch (error) {
    console.error("Error adding credential: ", error);
    res.status(500).json({ message: "Error adding credential" });
  }
});
/*-           --           --           --           --           - */
// Update credential endpoint
app.put(
  "/api/credentials/:credentialId",
  authenticateToken,
  async (req, res) => {
    try {
      const userRole = req.userRole;

      const credentialId = req.params.credentialId;
      const updatedCredentialData = req.body;

      // Find existing credential
      const existingCredential = await Credential.findById(credentialId);

      // Check that the credential exists / user has correct role
      if (!existingCredential) {
        return res.status(404).json({ message: "Credential not found" });
      } else if (userRole === "Standard") {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      // Update existing credential with new data
      existingCredential.name = updatedCredentialData.name;
      existingCredential.username = updatedCredentialData.username;
      existingCredential.password = updatedCredentialData.password;

      await existingCredential.save();

      res.status(200).json({ message: "Credential updated successfully" });
    } catch (error) {
      console.error("Error updating credential: ", error);
      res.status(500).json({ message: "Error updating credential" });
    }
  }
);
/*-           --           --           --           --           - */
// User info fetch endpoint
app.get("/api/users", async (req, res) => {
  try {
    // Fetch the list of users from the database
    const users = await User.find({}, { password: 0 }); // Exclude the password field from the response

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
/*-           --           --           --           --           - */
// User info update endpoint
app.put("/api/users/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, divisions } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role and divisions
    user.role = role;
    user.divisions = divisions;

    // Save the updated user info to the database
    await user.save();

    res.json({ message: "User info updated successfully" });
  } catch (error) {
    console.error("Error updating user info: ", error);
    res.status(500).json({ message: "Error updating user info" });
  }
});
/*-           --           --           --           --           - */
// Check admin endpoint
app.get("/checkAdmin", authenticateToken, (req, res) => {
  try {
    const userRole = req.userRole;

    if (userRole !== "Admin") {
      return res.status(403).json({ message: "Admin role required" });
    } else {
      return res.status(200).json({ message: "Admin role confirmed" });
    }
  } catch (error) {
    console.error("Admin check error: ", error);
    res.status(500).json({ message: "Admin check error" });
  }
});
