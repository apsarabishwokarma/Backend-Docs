# Express.js + Prisma + JWT Authentication Complete Guide

## Goal

Build an authentication system with:

- Register
- Login
- JWT Token Generation
- Protected Routes
- Prisma ORM
- PostgreSQL (or MySQL)
- Password Hashing using bcrypt

---

# Architecture

```text
Client
   ↓
Express Route
   ↓
Controller
   ↓
Prisma
   ↓
Database

Authentication Flow

Register
   ↓
Hash Password
   ↓
Store User

Login
   ↓
Verify Password
   ↓
Generate JWT
   ↓
Return Token

Protected Route
   ↓
Verify JWT
   ↓
Access Resource
```

---

# Step 1: Create Project

```bash
mkdir express-prisma-auth

cd express-prisma-auth

npm init -y
```

---

# Step 2: Install Packages

### Production Dependencies

```bash
npm install express prisma @prisma/client bcrypt jsonwebtoken dotenv
```

### Development Dependencies

```bash
npm install -D nodemon
```

---

# Step 3: Initialize Prisma

```bash
npx prisma init
```

Creates:

```text
prisma/
  schema.prisma

.env
```

---

# Step 4: Configure Database

Example PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/authdb"
```

Example MySQL:

```env
DATABASE_URL="mysql://root:password@localhost:3306/authdb"
```

---

# Step 5: Create User Model

schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

---

# Step 6: Run Migration

```bash
npx prisma migrate dev --name init
```

Prisma will:

```text
Create Table
Generate SQL
Update Database
Generate Prisma Client
```

---

# Step 7: Generate Prisma Client

```bash
npx prisma generate
```

---

# Step 8: Create Folder Structure

```text
src/

├── app.js

├── prisma/
│   └── prisma.js

├── controllers/
│   └── auth.controller.js

├── routes/
│   └── auth.routes.js

├── middleware/
│   └── auth.middleware.js
```

---

# Step 9: Create Prisma Client

src/prisma/prisma.js

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
```

---

# Step 10: Create Express App

app.js

```js
require("dotenv").config();

const express = require("express");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server Running");
});
```

---

# Step 11: Add JWT Secret

.env

```env
JWT_SECRET=mySuperSecretKey
```

Never commit secrets to Git.

---

# Step 12: Register Flow

```text
User submits:
  name
  email
  password

       ↓

Check Email Exists

       ↓

Hash Password

       ↓

Store User

       ↓

Return Success
```

---

# Step 13: Register Controller

```js
const prisma = require("../prisma/prisma");

const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    message: "User created",
  });
};
```

---

# Why Hash Password?

Never store:

```text
password123
```

Store:

```text
$2b$10$7jk4K...
```

Benefits:

- Protects users
- Prevents database leaks exposing passwords

---

# Step 14: Login Flow

```text
User Login

      ↓

Find User

      ↓

Compare Password

      ↓

Generate JWT

      ↓

Return JWT
```

---

# Step 15: Login Controller

```js
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    token,
  });
};
```

---

# JWT Creation

```js
jwt.sign(payload, secret, options);
```

Example:

```js
jwt.sign(
  {
    userId: 1,
  },
  "secret",
  {
    expiresIn: "1h",
  },
);
```

---

# Step 16: Create Routes

auth.routes.js

```js
const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);

module.exports = router;
```

---

# Step 17: Test APIs

Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "123456"
}
```

---

Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "eyJhb..."
}
```

---

# Step 18: Protected Routes

Goal:

```text
Only logged-in users
can access route
```

---

# Step 19: JWT Middleware

auth.middleware.js

```js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token",
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
```

---

# Authorization Header

```http
Authorization: Bearer eyJhb...
```

---

# Step 20: Create Protected Route

```js
const authMiddleware = require("../middleware/auth.middleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    user: req.user,
  });
});
```

---

# Protected Route Flow

```text
Request

    ↓

JWT Middleware

    ↓

Verify Token

    ↓

Attach User

    ↓

Controller

    ↓

Response
```

---

# Example Payload

```json
{
  "userId": 1,
  "email": "john@gmail.com"
}
```

After verification:

```js
req.user = {
  userId: 1,
  email: "john@gmail.com",
};
```

---

# Full Authentication Lifecycle

```text
Register
   ↓
Hash Password
   ↓
Save User
   ↓
Login
   ↓
Verify Password
   ↓
Generate JWT
   ↓
Return Token
   ↓
Store Token
   ↓
Send Token in Requests
   ↓
Verify JWT
   ↓
Access Protected Routes
```

---

# Common Interview Questions

## Why use bcrypt?

Passwords should never be stored as plain text.

---

## Why use JWT?

Stateless authentication.

---

## Why use Prisma?

Type-safe ORM with migrations and schema management.

---

## Why use Middleware?

To centralize authentication logic.

---

## Why verify JWT on every request?

Because JWT authentication is stateless.

---

## What should be stored in JWT?

Store:

```json
{
  "userId": 1,
  "email": "john@gmail.com"
}
```

Avoid:

- Passwords
- API Keys
- Sensitive Data

---

# Next Features to Learn

After this project:

1. Refresh Tokens
2. HttpOnly Cookies
3. Role-Based Authorization
4. Email Verification
5. Password Reset
6. Logout
7. Token Blacklisting
8. Refresh Token Rotation
9. Swagger Documentation
10. Prisma Transactions

```

```
