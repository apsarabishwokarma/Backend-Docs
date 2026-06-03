# JWT (JSON Web Token) Interview Questions and Answers

## What is JWT?

JWT (JSON Web Token) is a compact, URL-safe token format used for securely transmitting information between parties as a JSON object.

Common uses:

- Authentication
- Authorization
- Information exchange

Example:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJ1c2VySWQiOjEyMywicm9sZSI6ImFkbWluIn0
.
abcxyz123signature
```

---

## How does it differ from a session-based cookie?

- JWT is stateless and does not require server-side storage, while session-based authentication relies on server-side sessions to manage user state.
- Session-based authentication uses a session ID stored in a cookie and relies on server-side session storage.
- JWT is self-contained and includes all necessary information within the token, while session-based authentication requires server-side storage to maintain user state.

### Differences

| JWT                       | Session Cookie               |
| ------------------------- | ---------------------------- |
| Stateless                 | Stateful                     |
| No server storage needed  | Requires server-side storage |
| Easier horizontal scaling | More difficult to scale      |
| Harder to revoke          | Easy to revoke               |
| Payload contains claims   | Session ID only              |

---

## Why do we use JWT? How would you use a JWT in a web application for authentication?

JWT enables stateless authentication.

```text
Server
  ↓
Creates JWT
  ↓
Sends JWT to Client
  ↓
Client Stores JWT
  ↓
Client Sends JWT on Requests
```

### Flow

```text
User Login
     ↓
Validate Credentials
     ↓
Generate JWT
     ↓
Send JWT to Client
     ↓
Client Stores JWT
     ↓
Client Sends JWT on Requests
     ↓
Server Verifies JWT
     ↓
Access Granted
```

## Example

```js
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: "15m",
});
```

Benefits:

- Stateless
- Scalable
- API Friendly
- Microservice Friendly

---

## What are the three parts of JWT? How does the structure of a JWT support its functionality?

```text
Header.Payload.Signature
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

### Header

Contains metadata.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

Contains claims.

```json
{
  "sub": "123",
  "role": "admin"
}
```

### Signature

Ensures integrity and authenticity.

```text
HMACSHA256(
  base64Url(header)
  +
  "."
  +
  base64Url(payload),
  secret
)
```

---

## What is the Header?

Contains metadata.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Meaning:

```text
alg = Signing Algorithm
typ = JWT
```

---

## What is the Payload?

Contains claims (data).

Example:

```json
{
  "userId": 1,
  "email": "john@gmail.com",
  "role": "admin"
}
```

---

## What is the Signature?

Used to verify integrity.

Generated using:

```text
Header
+
Payload
+
Secret Key
```

Example:

```js
HMACSHA256(base64Url(header) + "." + base64Url(payload), secret);
```

---

## Can JWT Payload be read?

Yes.

JWT is encoded, not encrypted.

Anyone can decode:

```text
Header
Payload
```

But they cannot modify it without breaking the signature.

---

## Is JWT encrypted? How do you ensure a JWT stored in a cookie is secure?

No.

```text
Encoded ✓
Encrypted ✗
```

Never store sensitive information in JWT payloads.

### Best Practices

- Use HttpOnly flag
- Use Secure flag
- Use SameSite attribute
- Use HTTPS
- Use short expiration times

Example:

```js
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});
```

### What are the potential risks of using JWTs, and how can you mitigate them?

### Token Leakage

Risk:

```text
Token stolen through XSS
```

Mitigation:

```text
HttpOnly Cookies
Input Sanitization
Content Security Policy
```

### Replay Attacks

Risk:

```text
Attacker reuses valid token
```

Mitigation:

```text
jti Claim
Refresh Token Rotation
Token Blacklisting
```

### Long-Lived Tokens

Risk:

```text
Compromised token remains valid
```

Mitigation:

```text
Short Expiry
Refresh Tokens
```

---

---

## What is a Claim?

Claims are pieces of information stored in the payload.

Example:

```json
{
  "userId": 123
}
```

`userId` is a claim.

---

## Types of Claims

### Registered Claims

```text
iss
sub
aud
exp
nbf
iat
jti
```

### Public Claims

```text
name
email
role
```

### Private Claims

Custom application-specific claims.

```json
{
  "department": "IT"
}
```

---

## What is exp?

Expiration time.

```json
{
  "exp": 1710000000
}
```

After expiry:

```text
Token Invalid
```

---

## What is iat?

Issued At time.

```json
{
  "iat": 1710000000
}
```

Indicates when the token was created.

---

## What is nbf?

Not Before.

```json
{
  "nbf": 1710000000
}
```

Token becomes valid only after this time.

---

# 15. What is iss?

Issuer.

```json
{
  "iss": "my-api"
}
```

Identifies who created the token.

---

# 16. What is aud?

Audience.

```json
{
  "aud": "mobile-app"
}
```

Identifies intended recipient.

---

# 17. What is sub?

Subject.

Usually user ID.

```json
{
  "sub": "123"
}
```

---

# 18. What is jti?

JWT ID.

```json
{
  "jti": "token123"
}
```

Unique identifier used for revocation and tracking.

---

# 19. How to Generate JWT in Node.js?

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign({ userId: 1 }, "secret", { expiresIn: "1h" });
```

---

# 20. How to Verify JWT?

```js
jwt.verify(token, "secret");
```

Checks:

- Signature
- Expiry
- Validity

---

# 21. decode() vs verify()

## decode()

```js
jwt.decode(token);
```

- No signature verification
- Unsafe

## verify()

```js
jwt.verify(token, secret);
```

- Validates signature
- Secure

---

# 22. What Happens if JWT is Modified?

Signature validation fails.

```text
401 Unauthorized
```

---

# 23. Where Should JWT Be Stored? Compare storing JWT in Cookies vs Local Storage

### HttpOnly Cookie

Most secure.

### Memory

Good for SPAs.

### LocalStorage

Common but vulnerable to XSS.

| Cookie                            | Local Storage          |
| --------------------------------- | ---------------------- |
| Supports HttpOnly                 | No HttpOnly            |
| More secure against XSS           | Vulnerable to XSS      |
| Can be protected with Secure flag | No built-in protection |
| Vulnerable to CSRF                | Not vulnerable to CSRF |
| Recommended for auth              | Less recommended       |

### Interview Answer

Cookies are generally safer because HttpOnly prevents JavaScript access.

LocalStorage can be read by malicious scripts during XSS attacks.

---

# 24. Why is LocalStorage Risky?

XSS attacks can access it.

```js
localStorage.getItem("token");
```

---

# 25. Why Are HttpOnly Cookies Safer?

JavaScript cannot access them.

```text
document.cookie ❌
```

Reduces XSS attacks.

---

# 26. JWT vs Session Authentication

| JWT               | Session                   |
| ----------------- | ------------------------- |
| Stateless         | Stateful                  |
| Client-side token | Server-side session       |
| Scalable          | Less scalable             |
| Good for APIs     | Good for traditional apps |

---

# 27. What is Stateless Authentication?

Server stores no session.

Each request contains:

```text
Request + JWT
```

---

# 28. Common JWT Algorithms

```text
HS256
HS384
HS512
RS256
ES256
```

Most common:

```text
HS256
```

---

# 29. HS256 vs RS256

## HS256

```text
One Secret Key
```

Used for:

```text
Sign
Verify
```

## RS256

```text
Private Key → Sign
Public Key → Verify
```

Better for distributed systems.

---

# 30. What is Refresh Token?

Long-lived token used to obtain new access tokens.

```text
Login
 ↓
Access Token (15m)
Refresh Token (7d)
```

---

# 31. Why Use Refresh Tokens?

Without refresh tokens:

```text
Long-lived Access Token
```

Risky if stolen.

Instead:

```text
Short Access Token
+
Long Refresh Token
```

---

# 32. Access Token vs Refresh Token

| Access Token    | Refresh Token          |
| --------------- | ---------------------- |
| Short-lived     | Long-lived             |
| API Calls       | Generate Access Tokens |
| Sent Frequently | Sent Occasionally      |

---

# 33. How Do You Logout JWT Users?

JWT itself cannot be destroyed.

Approaches:

- Token Blacklist
- Refresh Token Deletion
- Secret Rotation

---

# 34. Can JWT Be Revoked?

Not directly.

Common methods:

- Blacklisting
- Refresh Token Rotation
- Token Versioning

---

# 35. What is Refresh Token Rotation?

```text
Old Refresh Token
      ↓
Invalidate
      ↓
Issue New Refresh Token
```

Prevents replay attacks.

---

# 36. What is Token Blacklisting?

Store revoked token IDs.

Example:

```text
jti
```

Store in:

```text
Redis
Database
```

---

# 37. JWT Security Risks

### XSS

Stealing tokens.

### Token Theft

Using stolen access tokens.

### Weak Secrets

Easy brute-force attacks.

### Long Expiry

Longer exposure if compromised.

---

# 38. JWT Best Practices

- Use HTTPS
- Use short access token expiry
- Use HttpOnly cookies
- Use refresh tokens
- Use strong secrets
- Validate issuer and audience
- Validate signatures

---

# 39. Why Should Secrets Be Strong?

Weak:

```text
secret123
```

Strong:

```text
a8f#K2!mP9@xQ7zR
```

Prevents brute-force attacks.

---

# 40. JWT Authentication Flow

```text
User Login
     ↓
Validate Credentials
     ↓
Generate JWT
     ↓
Send JWT
     ↓
Client Stores JWT
     ↓
Client Sends JWT
     ↓
Server Verifies JWT
     ↓
Allow Access
```

---

# Advanced Interview Questions

### How can you prevent CSRF attacks when using JWTs in cookies?

### SameSite

```text
SameSite=Strict
SameSite=Lax
```

### CSRF Tokens

Generate a unique CSRF token and validate it on requests.

### Anti-CSRF Middleware

Examples:

```text
csurf
Spring Security CSRF
ASP.NET AntiForgery
```

---

## Q8: How do you handle JWT expiration in long-lived sessions?

### Recommended Architecture

```text
Access Token (15 minutes)
+
Refresh Token (7 days)
```

### Flow

```text
Login
 ↓
Access Token
 ↓
Expires
 ↓
Refresh Token
 ↓
Generate New Access Token
```

Benefits:

- Better security
- Better user experience

---

## Q9: What are the trade-offs between stateless JWT authentication and stateful sessions?

### JWT

Advantages:

- Highly scalable
- No session store
- Works well with microservices

Disadvantages:

- Hard to revoke
- Logout is difficult

### Sessions

Advantages:

- Easy revocation
- Easy logout

Disadvantages:

- Requires session storage
- Scaling complexity

---

## Q10: How can you revoke a compromised JWT?

### Method 1: Blacklist

Store:

```text
jti
```

in:

```text
Redis
Database
```

### Method 2: Short Expiry

```text
15-minute Access Token
```

### Method 3: Refresh Token Revocation

Delete refresh token from storage.

### Method 4: Secret Rotation

Rotate JWT signing key.

---

# Debugging and Troubleshooting

## Q11: What tools would you use to debug JWTs?

### jwt.io

Inspect:

- Header
- Payload
- Signature

### Server Logs

Common errors:

```text
TokenExpiredError
JsonWebTokenError
NotBeforeError
```

### Middleware Logging

Log validation failures.

Example:

```js
try {
  jwt.verify(token, secret);
} catch (err) {
  console.log(err);
}
```

---

## Q12: A user reports being logged out frequently. What could be the issue?

### Possible Causes

#### Short Token Expiry

```text
Access Token expires too quickly
```

#### No Refresh Token

```text
User must login again
```

#### Server Clock Drift

```text
exp validation fails
```

#### Cookie Misconfiguration

```text
Wrong Domain
Wrong Path
Missing Secure
```

#### Secret Rotation

```text
Previously issued tokens become invalid
```

---

# Additional Frequently Asked Senior-Level Questions

## Q13: Why should you not store sensitive data inside JWT payloads?

Because JWT payloads are Base64 encoded, not encrypted.

Anyone can decode them.

Never store:

- Passwords
- Credit card numbers
- Secrets
- API keys

---

## Q14: What is Refresh Token Rotation?

Every refresh request:

```text
Old Refresh Token
      ↓
Invalidate
      ↓
Issue New Refresh Token
```

Prevents replay attacks.

---

## Q15: What is the difference between Authentication and Authorization?

### Authentication

```text
Who are you?
```

Example:

```text
Login
JWT Generation
```

### Authorization

```text
What are you allowed to do?
```

Example:

```text
Role Checking
Permissions
```

---

## Q16: Why is RS256 often preferred in enterprise systems?

HS256:

```text
Same secret for signing and verification
```

RS256:

```text
Private Key → Sign
Public Key → Verify
```

Benefits:

- Better key management
- Safer microservices architecture
- Public key can be shared safely

---

## Q17: How would you implement logout with JWT?

JWT is stateless.

Common approaches:

- Blacklist token
- Revoke refresh token
- Rotate secrets
- Token versioning

---

## Q18: How does JWT work in Microservices?

```text
Auth Service
      ↓
Issue JWT
      ↓
Service A verifies JWT
Service B verifies JWT
Service C verifies JWT
```

No shared session store required.

---

## Q19: What is Token Versioning?

Store version in DB.

```json
{
  "userId": 1,
  "tokenVersion": 3
}
```

If user logs out:

```text
Increment tokenVersion
```

Old tokens become invalid.

---

## Q20: Explain JWT Authentication End-to-End.

```text
User Login
     ↓
Credentials Verified
     ↓
JWT Generated
     ↓
JWT Sent to Client
     ↓
JWT Stored
     ↓
JWT Sent with Requests
     ↓
Middleware Verifies JWT
     ↓
User Authorized
     ↓
Response Returned
```

---

## What is a JWT Replay Attack?

Using a stolen but still valid token.

---

## How Do You Prevent Replay Attacks?

- HTTPS
- Short expiry
- Refresh token rotation
- jti tracking

---

## Why is JWT Good for Microservices?

Each service can verify tokens independently without shared session storage.

---

## When Should You NOT Use JWT?

- Immediate logout required
- Heavy session management needed
- Traditional monolithic applications

---

## Top Frequently Asked JWT Interview Questions

- What is JWT?
- Explain JWT structure.
- What are Header, Payload, and Signature?
- JWT vs Session Authentication?
- decode() vs verify()?
- Access Token vs Refresh Token?
- HS256 vs RS256?
- Explain JWT Authentication Flow.
- Can JWT be revoked?
- Where should JWT be stored and why?

---

# Quick Interview Revision Sheet

```text
JWT = Header.Payload.Signature

Header:
- Algorithm
- Token Type

Payload:
- Claims
- User Data

Signature:
- Validates Integrity

JWT:
- Stateless
- Encoded, not Encrypted

Common Claims:
- exp
- iat
- nbf
- iss
- aud
- sub
- jti

Storage:
✓ HttpOnly Cookie
✓ Memory
✗ LocalStorage (XSS Risk)

Common Algorithms:
- HS256
- RS256

Security:
- HTTPS
- Short Expiry
- Refresh Tokens
- Strong Secrets
```
