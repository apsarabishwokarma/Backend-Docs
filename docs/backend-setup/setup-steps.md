# Express.js Setup Guide for Beginners

## What is Express.js?

Express.js is a lightweight and popular web framework for Node.js that helps you build backend applications and APIs more easily.

### Without Express

```js
const http = require("http");

http
  .createServer((req, res) => {
    res.end("Hello");
  })
  .listen(3000);
```

### With Express

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000);
```

### Why Express?

Express provides:

- Easier routing
- Middleware support
- Better code organization
- Faster API development
- Large ecosystem and community support

---

# Prerequisites

Before starting Express.js, install Node.js.

Download from:

https://nodejs.org

Verify installation:

```bash
node -v
npm -v
```

Example output:

```bash
v24.2.0
10.15.0
```

---

# Step 1: Create a New Project

Create a project folder:

```bash
mkdir express-learning
```

Move into the folder:

```bash
cd express-learning
```

Initialize Node.js:

```bash
npm init -y
```

This creates a `package.json` file.

Example:

```json
{
  "name": "express-learning",
  "version": "1.0.0"
}
```

---

# Step 2: Install Express

Install Express:

```bash
npm install express
```

After installation:

```text
express-learning/
│
├── node_modules/
├── package.json
└── package-lock.json
```

---

# Step 3: Create the Server File

Create:

```bash
touch server.js
```

Project structure:

```text
express-learning/
│
├── node_modules/
├── package.json
└── server.js
```

---

# Step 4: Create Your First Express Server

Open `server.js`:

```js
const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# Understanding the Code

## Import Express

```js
const express = require("express");
```

Loads the Express package.

---

## Create Application

```js
const app = express();
```

Creates an Express application instance.

---

## Define Port

```js
const PORT = 3000;
```

Server will run on port 3000.

---

## Create Route

```js
app.get("/", (req, res) => {
  res.send("Hello Express!");
});
```

When someone visits `/`, Express sends a response.

---

## Start Server

```js
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Starts the server.

---

# Step 5: Run the Server

Start:

```bash
node server.js
```

Output:

```bash
Server running on port 3000
```

Open:

```text
http://localhost:3000
```

Response:

```text
Hello Express!
```

---

# Step 6: Install Nodemon

Nodemon automatically restarts the server when files change.

Install:

```bash
npm install -D nodemon
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Run:

```bash
npm run dev
```

---

# Step 7: Understanding Routes

A route consists of:

```text
HTTP Method + URL
```

Examples:

```text
GET    /users
POST   /users
PUT    /users/1
DELETE /users/1
```

---

# Step 8: Create a GET Route

```js
app.get("/users", (req, res) => {
  res.send("All Users");
});
```

Visit:

```text
http://localhost:3000/users
```

Response:

```text
All Users
```

---

# Step 9: Parse JSON Data

Enable JSON middleware:

```js
app.use(express.json());
```

This allows Express to read JSON request bodies.

---

# Step 10: Create a POST Route

```js
app.post("/users", (req, res) => {
  const user = req.body;

  res.json({
    message: "User Created",
    user,
  });
});
```

Request:

```json
{
  "name": "John"
}
```

Response:

```json
{
  "message": "User Created",
  "user": {
    "name": "John"
  }
}
```

---

# Step 11: Route Parameters

Example:

```js
app.get("/users/:id", (req, res) => {
  res.json({
    id: req.params.id,
  });
});
```

Request:

```text
/users/10
```

Response:

```json
{
  "id": "10"
}
```

---

# Step 12: Query Parameters

Example:

```js
app.get("/search", (req, res) => {
  res.json(req.query);
});
```

Request:

```text
/serach?name=John&age=20
```

Response:

```json
{
  "name": "John",
  "age": "20"
}
```

---

# Step 13: Recommended Project Structure

```text
project/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   └── app.js
│
├── server.js
├── package.json
└── .env
```

---

# Step 14: Create Route Files

## routes/userRoutes.js

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users Route");
});

module.exports = router;
```

---

# Step 15: Register Routes

## server.js

```js
const express = require("express");
const userRoutes = require("./src/routes/userRoutes");

const app = express();

app.use("/users", userRoutes);

app.listen(3000);
```

Now:

```text
GET /users
```

will use the router.

---

# Step 16: Environment Variables

Install dotenv:

```bash
npm install dotenv
```

Create `.env`:

```env
PORT=5000
```

Use:

```js
require("dotenv").config();

const PORT = process.env.PORT;
```

Benefits:

- Hide configuration values
- Easily change environments
- Store secrets safely

---

# Learning Flow

```text
Node.js Basics
      ↓
Express Basics
      ↓
Routing
      ↓
Middleware
      ↓
REST APIs
      ↓
MVC Pattern
      ↓
MongoDB
      ↓
Authentication (JWT)
      ↓
Swagger
      ↓
Role-Based Access Control
      ↓
Production Backend Projects
```
