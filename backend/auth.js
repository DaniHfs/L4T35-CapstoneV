// JWT authorization middleware

const jwt = require("jsonwebtoken");
const { secretKey } = require("./secretKey");

// Middleware function to authenticate the JWT token
function authenticateToken(req, res, next) {
  // Retrieve the Authorization header and extract the token
  const authorizationHeader = req.headers["authorization"];

  // If no token is provided, return an authentication required error
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authorizationHeader.split(" ")[1];

  // Verify the token with the secret key
  jwt.verify(token, secretKey, (error) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const decodedToken = jwt.decode(token);

    // Attach the user information to the request object
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.userRole;
    req.userDiv = decodedToken.userDiv;

    next();
  });
}

// Export the middleware function
module.exports = { authenticateToken };
