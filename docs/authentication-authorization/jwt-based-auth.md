Your code has a few structural issues before we even get to JWT.

---

# Fixing Your Registration Controller

The biggest problem is that this code is **outside** the function:

```js
const { password } = await prisma.user.create(...)
res.status(201).json(...)
```

It must be inside `userRegistration`.

Correct version:

```js
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check existing user
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        message: "Account with this email already exists.",
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = userRegistration;
```

---

# Login Flow

Login should be:

```text
Email + Password
       ↓
Find User
       ↓
Compare Password
       ↓
Generate JWT
       ↓
Return Token
```

Example:

```js
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      message: "Account doesn't exist",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Generate token here

  return res.status(200).json({
    message: "Login successful",
  });
};
```

---

# Why Create a Separate Token Service?

Good practice:

```text
controllers/
│
├── auth.controller.js

services/
│
└── token.service.js
```

Controller handles:

```text
Request
Validation
Database
Response
```

Token service handles:

```text
Create Token
Verify Token
Decode Token
```

---

# token.service.js

Install JWT package:

```bash
pnpm add jsonwebtoken
```

Create:

```js
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

module.exports = {
  generateAccessToken,
};
```

---

# Use Token Service

```js
const { generateAccessToken } = require("../services/token.service");
```

After password verification:

```js
const token = generateAccessToken(user);
```

Return:

```js
return res.status(200).json({
  message: "Login successful",
  token,
});
```

---

# Complete JWT Flow

```text
User Login
     ↓
Email + Password
     ↓
Find User
     ↓
Compare Password
     ↓
Generate JWT
     ↓
Send JWT to Client
     ↓
Client Stores JWT
     ↓
Client Sends JWT
Authorization: Bearer TOKEN
     ↓
Server Verifies JWT
     ↓
Access Protected Route
```

---

# How JWT Is Created Internally

A JWT has 3 parts:

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

---

## Step 1: Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Base64 encoded:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

---

## Step 2: Payload

```json
{
  "userId": 1,
  "email": "john@gmail.com",
  "exp": 123456789
}
```

Base64 encoded.

---

## Step 3: Signature

Create:

```text
HMACSHA256(
 header.payload,
 secret
)
```

Example:

```js
crypto.createHmac("sha256", secret).update(data).digest("base64");
```

Result:

```text
signature
```

---

# Final JWT Structure

```text
header.payload.signature
```

Example:

```text
eyJhbGciOiJIUzI1NiIs...
.
eyJ1c2VySWQiOjEs...
.
Y8H3L9F...
```

---

# Where Crypto Comes In

JWT uses Node's crypto internally.

When you write:

```js
jwt.sign(payload, secret);
```

jsonwebtoken internally does something similar to:

```js
const crypto = require("crypto");

const signature = crypto
  .createHmac("sha256", secret)
  .update(data)
  .digest("base64");
```

The secret is never sent to the client.

---

# Verifying a JWT

Middleware:

```js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;
```

---

# Typical Folder Structure

```text
src/
├── controllers/
│   └── auth.controller.js
│
├── services/
│   └── token.service.js
│
├── middleware/
│   └── verifyToken.js
│
├── routes/
│   └── auth.routes.js
│
├── config/
│   └── prisma.js
│
└── index.js
```

---

# Industry Login Flow

```text
Register
   ↓
Hash Password (bcrypt)
   ↓
Store User

Login
   ↓
Find User
   ↓
Compare Password
   ↓
Generate Access Token
   ↓
Return Token

Protected Route
   ↓
Verify Token
   ↓
Allow Access
```

Once you're comfortable with this, the next topics are:

1. Access Token vs Refresh Token
2. JWT Blacklisting
3. HTTP-only Cookies vs Local Storage
4. Role-Based Access Control (RBAC)
5. Refresh Token Rotation

Those are the pieces used in most production authentication systems.

## This one = JWT BASED AUTH

```js
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../services/token.service");

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account doesn't exist",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateAccessToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = UserLogin;
```

---

```js
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};
```

### Key point:

Server does NOT store token in DB

current architecture (JWT version)

```text
User Login
   ↓
Password check
   ↓
JWT generated
   ↓
Token sent to client
   ↓
Client sends token in headers
   ↓
Server verifies JWT
```
