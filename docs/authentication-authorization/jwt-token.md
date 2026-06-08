## JWT TOKEN

- It stands for json(javascript object notation) web token.
- JWTs are often used in token-based authentication systems, where after a user successfully logs in, the server generates a JWT and sends it back to the client.
- The client then includes this token in the Authorization header of subsequent requests to access protected resources. - The server validates the token on each request to ensure the user is authenticated and authorized to access the requested resource.

## JWT Structure

- It consists of three parts: header, payload, and signature.
- The `header` typically consists of the type of token (JWT) and the signing algorithm used (e.g., HMAC SHA256).
  For example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

---

- The `payload` contains the claims, which are statements about an entity (typically, the user) and additional data. Claims can be registered (predefined), public, or private.
- For example:

```json
{
  "sub": "1234567890",
  "name": "Apsara",
  "iat": 1516171111
}
```

- `sub`: user identifier, which is a unique identifier for the user (e.g., user ID).
- `name`: user name, which is a human-readable name for the user.
- `iat`: stands for issued at, which is a timestamp indicating when the token was issued or created.

---

- The `signature` is used for verifying the integrity of the token and ensuring that it has not been tampered with. It is created by taking the encoded header, encoded payload, a secret key, and the specified algorithm.
- For example, if using HMAC SHA256, the signature would be generated as follows:
  `  HMACSHA256(
base64UrlEncode(header) + "." +
base64UrlEncode(payload),
secret)`

`secret` is a string that is used to sign the token and should be kept secure on the server.It is used to verify the authenticity of the token when it is received in subsequent requests.

- Example of a complete JWT token:

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFwc2FyYSIsImlhdCI6MTUxNjE3MTE1fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

### How to work with JWT Token Authentication

Steps:

#### 1. install jsonwebtoken package

`npm install jsonwebtoken`

#### 2. To use JWT for authentication, you typically follow these steps:

`const jwt = require('jsonwebtoken');`

#### 3. create a secret key that will be used to sign the JWT token.

`const SECRET_KEY = 'your_secret_key';`

#### 4. ..Login code comes here and Generate JWT Token after successful login.

`sign()` method is used to create a JWT token. It takes three parameters:

- The first parameter is the payload, which contains the claims (e.g., userId).
- The second parameter is the secret key used to sign the token.
- The third parameter is an options object where you can specify additional settings, such as the token's expiration time (e.g., `expiresIn: '1h'` means the token will expire in 1 hour). or 7 days `expiresIn: '7d'` means the token will expire in 7 days.

- syntax: `jwt.sign(payload, SECRET_KEY, options)`
- `payload={key:value}`

```js
if(Login Matches){
  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  // Send the token back to the client
  return res.status(200).json({ token });
}
```

- token is stored in client side and send in header of each request to access protected resources.
- It is stored either in local storage, session storage, or as a cookie on the client side.

#### 5. Include JWT Token in Authorization Header

- When the client makes a request to a protected resource, it includes the JWT token in the Authorization header of the HTTP request.

```js
const token = req.headers.authorization.split(" ")[1]; // Assuming the token is sent in the Authorization
```

breakdown of the above code:

- `req.headers.authorization` retrieves the value of the Authorization header from the incoming HTTP request.
- The `split(" ")` method is used to split the string into an array based on the space character. This is because the Authorization header typically follows the format "Bearer <token>".[0] would be "Bearer" and [1] would be the actual token.
- The `[1]` index is used to access the second element of the resulting array, which is the actual JWT token.

#### 6. Verify JWT Token on server side

- The server then verifies the token using the secret key and grants access to the requested resource if the token is valid and has not expired.
- To verify the JWT token on the server side, you can use the `verify()` method provided by the `jsonwebtoken` package. This method takes the token and the secret key as parameters and returns the decoded payload if the token is valid.
- `syntax : jwt.verify(token, SECRET_KEY)`
- SECRET_KEY is the same secret key that was used to sign the token during the login process.which is saved on server side. Only server can access this secret key to verify the token.

### Example of verifying a JWT token

```js
try {
  const decoded = jwt.verify(token, SECRET_KEY);
  // Token is valid, you can access the decoded payload (e.g., userId)
  console.log(decoded.userId);
  // Proceed with granting access to the protected resource
} catch (err) {
  // Token is invalid or has expired
  return res.status(401).json({ message: "Unauthorized" });
}
```

- In this example, if the token is valid, the decoded payload (which contains the userId) is logged to the console, and you can proceed with granting access to the protected resource. If the token is invalid or has expired, a 401 Unauthorized response is sent back to the client.
- This process ensures that only authenticated users with valid tokens can access protected resources on the server.

#### Verify JWT Token in Middleware

- We keep verification logic in a middleware function to ensure that it is executed for every request to protected routes. This way, we can centralize the authentication logic and easily manage access control across different parts of the application.We don't have to repeat the token verification code in every route handler, which promotes code reusability and maintainability.
- To verify the JWT token in a middleware function, you can create a custom middleware that checks for the presence of the token in the Authorization header and verifies it before allowing access to protected routes.

```js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); // No token provided
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" }); // Invalid token
  }
}

// Example of using the authenticateToken middleware in a protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
```

- In this example, the `authenticateToken` middleware function checks for the presence of the JWT token in the Authorization header, verifies it using the secret key, and attaches the decoded payload to the request object (`req.user`) if the token is valid. If the token is missing or invalid, it sends an appropriate response (401 Unauthorized or 403 Forbidden). The protected route (`/protected`) can then access the decoded user information from `req.user` and respond accordingly.
- By using this middleware, you can ensure that all requests to protected routes are authenticated and authorized based on the validity of the JWT token.

### Advantages of JWT Token Authentication

- Stateless: JWT tokens are self-contained and do not require server-side sessions, making them scalable and suitable for distributed systems.
- Cross-platform: JWT tokens can be used across different platforms and programming languages, making them versatile for various applications.
- Security: JWT tokens can be signed and encrypted, providing a secure way to transmit information between parties. They can also include expiration times to enhance security.
- Flexibility: JWT tokens can carry custom claims, allowing you to include additional information about the user or the context of the authentication.
- Performance: Since JWT tokens are self-contained, they can reduce the need for database lookups on each request, improving performance in certain scenarios.

### Disadvantages of JWT Token Authentication

- Token Size: JWT tokens can be larger than traditional session IDs, which may lead to increased bandwidth usage, especially if the payload contains a lot of information.
- Token Revocation: Since JWT tokens are stateless, it can be challenging to revoke a token before its expiration time. If a token is compromised, it can be used until it expires unless additional mechanisms are implemented to handle revocation.
- Security Risks: If not implemented correctly, JWT tokens can be vulnerable to security risks such as token tampering, token theft, and replay attacks. It is crucial to use secure practices when handling JWT tokens, such as using strong secret keys, implementing proper token expiration, and using secure transmission methods (e.g., HTTPS).
- Complexity: Implementing JWT token authentication can be more complex than traditional session-based authentication, especially for developers who are new to the concept. It requires a good understanding of JWT structure, signing, and verification processes to ensure a secure implementation.

### Types of JWT Tokens

#### 1. Access Token

- An access token is a short-lived token that is used to access protected resources and are typically issued after a user successfully logs in or authenticates with the server.
- It typically has a short expiration time (e.g., 15 minutes to 1 hour) .
- They contain information about the user's identity and permissions, allowing the server to determine whether the user is authorized to access a particular resource.
- Access tokens are usually stored on the client side (e.g., in local storage or as a cookie) and are sent with each request to the server to authenticate the user and authorize access to protected resources.
- They are designed to be short-lived for security reasons, reducing the risk of token theft and misuse.

#### 2. Refresh Token

- A refresh token is a long-lived token that is used to obtain a new access token when the current access token expires.
- It typically has a longer expiration time (e.g., several days or weeks) compared to access tokens.
- Refresh tokens are securely stored on the client side such as in an HTTP-only cookie or secure storage, to prevent unauthorized access and mitigate the risk of token theft.and are not sent with every request to the server. Instead, they are used to request a new access token when the current access token expires.
- When the access token expires, the client can send a request to the server with the refresh token to obtain a new access token without requiring the user to log in again. This allows for a seamless user experience while maintaining security by keeping access tokens short-lived.
- Refresh tokens should be stored securely and should not be exposed to potential attackers, as they can be used to obtain new access tokens if compromised. It is important to implement proper security measures, such as using secure storage and implementing token revocation mechanisms, to protect refresh tokens from unauthorized access.

## Access Token vs Refresh Token

| Aspect          | Access Token                                             | Refresh Token                                                                                     |
| --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Purpose         | Used to access protected resources                       | Used to obtain a new access token                                                                 |
| Lifespan        | Short-lived (e.g., 15 minutes to 1 hour)                 | Long-lived (e.g., several days or weeks)                                                          |
| Storage         | Stored on the client side (e.g., local storage, cookies) | Stored securely on the client side (e.g., HTTP-only cookies)                                      |
| Transmission    | Sent with each request to the server                     | Not sent with every request; used to request a new access token when the current one expires      |
| Security        | Short lifespan reduces risk of token theft and misuse    | Longer lifespan requires secure storage and token revocation mechanisms to mitigate risks         |
| User Experience | May require re-authentication when access token expires  | Allows for seamless user experience by enabling token refresh without requiring re-authentication |

### Why Jwt Token is Stateless?

- JWT tokens are considered stateless because they do not require the server to maintain any session information about the user. The token itself contains all the necessary information (claims) about the user and their permissions, allowing the server to authenticate and authorize requests without needing to store any session data on the server side. This means that the server does not need to keep track of user sessions or store any information about the user between requests, making JWT tokens a stateless authentication mechanism.
