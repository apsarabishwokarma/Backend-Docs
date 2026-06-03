## Authentication Basics

- Authentication is the process of verifying the identity of a user or system.
- It ensures that only authorized users can access certain resources or perform specific actions.
- In web applications, authentication is typically implemented using various methods such as passwords, tokens, or biometric data.

## Common Authentication Methods

- **Password-Based Authentication**: Users provide a username and password to verify their identity.
- **Token-Based Authentication**: Users receive a token after successful login, which they can use for subsequent requests to access protected resources.
- **Biometric Authentication**: Users verify their identity using unique biological traits such as fingerprints or facial recognition.
- **Multi-Factor Authentication (MFA)**: Combines two or more authentication methods to enhance security, such as a password and a one-time code sent to the user's phone.
- **OAuth**: A protocol that allows users to grant third-party applications access to their resources without sharing their credentials.

---

- **JWT (JSON Web Tokens)**: A compact, URL-safe token format used for securely transmitting information between parties as a JSON object, often used in token-based authentication systems.
- **SAML (Security Assertion Markup Language)**: An XML-based framework for exchanging authentication and authorization data between parties, commonly used in enterprise environments for single sign-on (SSO) solutions.

### Session-Based Authentication

- In session-based authentication, after a user successfully logs in, the server creates a session and stores session data on the server side. The client receives a session ID (often stored in a cookie) that is sent with each subsequent request to identify the session and authenticate the user.

## Token-Based Authentication and JWT

- In token-based authentication, after a user successfully logs in, the server generates a token (often a JWT) and sends it back to the client.
- The client stores this token (e.g., in local storage or a cookie) and includes it in the Authorization header of subsequent requests to access protected resources.
- The server validates the token on each request to ensure the user is authenticated and authorized to access the requested resource.

## User Registration and Login and JWT

- During user registration, the server creates a new user account and stores the user's credentials securely (e.g., by hashing passwords).
- During login, the server verifies the user's credentials. If valid, it generates a JWT containing user information and sends it back to the client.

## For registration,

- the server typically requires the user to provide a username, email, and password.
- The server then creates a new user account and stores the credentials securely (e.g., by hashing passwords).
- For Hashing passwords, libraries like `bcrypt` are commonly used to ensure that stored passwords are not easily compromised in case of a data breach.
- `bcrypt` applies a hashing algorithm to the password along with a unique salt, making it computationally expensive for attackers to reverse-engineer the original password from the hash. This enhances security by protecting user credentials even if the database is compromised.
- syntax for hashing a password using `bcrypt` in Node.js:

```javascript
const bcrypt = require("bcrypt");
const saltRounds = 10;
const password = "userPassword123";
bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  // Store the hash in the database
  console.log("Hashed password:", hash);
});
```

- During login, the server verifies the user's credentials by comparing the provided password with the stored hashed password using `bcrypt.compare()` method. If the credentials are valid, the server generates a JWT containing user information and sends it back to the client for authentication in subsequent requests.
- syntax for verifying a password using `bcrypt` in Node.js:

```javascript
const bcrypt = require("bcrypt");
const password = "userPassword123";
const storedHash = "$2b$10$EixZaYVK1fsbw1uY9s0.5uJ8rFjQeY5Z6b8a9Hj5K1e5u"; // Example stored hash from the database
bcrypt.compare(password, storedHash, function (err, result) {
  if (err) {
    console.error("Error comparing password:", err);
    return;
  }
  if (result) {
    console.log("Password is valid. User authenticated.");
    // Generate JWT and send to client
  } else {
    console.log("Invalid password. Authentication failed.");
  }
});
```

- we don't store the actual password in the database for security reasons. Instead, we store the hashed version of the password. - When a user attempts to log in, we hash the provided password and compare it to the stored hash to verify if they match. This way, even if the database is compromised, attackers cannot easily retrieve the original passwords.
