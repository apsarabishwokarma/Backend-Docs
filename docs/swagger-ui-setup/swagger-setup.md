# Swagger UI with Express.js

## What is Swagger?

Swagger is a tool that automatically generates interactive API documentation for your backend.

Instead of manually documenting your APIs in a text file, Swagger creates a webpage where developers can:

- See all API endpoints
- Read endpoint descriptions
- View request parameters
- View request body schemas
- View response schemas
- Test APIs directly from the browser

---

# Why Use Swagger?

Imagine your API has:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

Without Swagger:

- Developers must ask for documentation
- Documentation gets outdated
- Testing APIs becomes difficult

With Swagger:

- Documentation updates automatically
- APIs are easy to test
- Frontend developers can understand APIs quickly

---

# What We Will Build

We will create:

```text
GET /users
```

and document it using Swagger.

After setup:

```text
http://localhost:3000/api-docs
```

will display Swagger UI.

---

# Step 1: Install Required Packages

Install:

```bash
npm install swagger-ui-express swagger-jsdoc
```

---

# Understanding the Packages

## swagger-ui-express

Provides the Swagger webpage.

Example:

```text
/api-docs
```

---

## swagger-jsdoc

Reads special comments in your code and converts them into Swagger documentation.

---

# Project Structure

```text
express-learning/
│
├── src/
│   ├── routes/
│   │   └── userRoutes.js
│   │
│   └── swagger.js
│
├── server.js
├── package.json
└── node_modules/
```

---

# Step 2: Create Swagger Configuration

Create:

```text
src/swagger.js
```

---

# Step 3: Write Swagger Configuration

```js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Learning Express API",
      version: "1.0.0",
      description: "My First Swagger Documentation",
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

---

# Understanding the Configuration

## OpenAPI Version

```js
openapi: "3.0.0";
```

Tells Swagger which specification version to use.

---

## API Information

```js
info: {
  title: "Learning Express API",
  version: "1.0.0",
  description: "My First Swagger Documentation"
}
```

This information appears at the top of Swagger UI.

---

## APIs Path

```js
apis: ["./src/routes/*.js"];
```

Swagger scans route files for documentation comments.

---

# Step 4: Configure Swagger UI

Open:

```text
server.js
```

---

# Add Imports

```js
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger");
```

---

# Register Swagger Route

```js
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

# Complete Example

```js
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log("Server running");
});
```

---

# Step 5: Create Route File

Create:

```text
src/routes/userRoutes.js
```

---

# Add Route

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "All Users",
  });
});

module.exports = router;
```

---

# Step 6: Register Route

Inside:

```js
server.js;
```

Add:

```js
const userRoutes = require("./src/routes/userRoutes");

app.use("/users", userRoutes);
```

---

# Step 7: Add Swagger Documentation

Above the route:

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: Successful response
 */
```

Complete file:

```js
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/", (req, res) => {
  res.json({
    message: "All Users",
  });
});

module.exports = router;
```

---

# Understanding Swagger Comments

## Endpoint

```js
/users
```

Defines API path.

---

## Method

```js
get:
```

Defines HTTP method.

---

## Summary

```js
summary: Get all users
```

Short description.

---

## Description

```js
description: Returns a list of users
```

Detailed explanation.

---

## Responses

```js
responses:
```

Documents possible responses.

---

## Status Code

```js
200:
```

Success response.

---

# Step 8: Run Server

Start server:

```bash
npm run dev
```

or

```bash
node server.js
```

---

# Step 9: Open Swagger UI

Visit:

```text
http://localhost:3000/api-docs
```

You should see:

```text
Learning Express API
GET /users
```

---

# Step 10: Test API from Swagger

Click:

```text
GET /users
```

Then:

```text
Try it out
```

Then:

```text
Execute
```

Swagger sends the request automatically.

Response:

```json
{
  "message": "All Users"
}
```

---

# Example POST Endpoint

```js
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User Created
 */
```

---

# Example Route

```js
router.post("/", (req, res) => {
  res.status(201).json({
    message: "User Created",
  });
});
```

---

# Common Beginner Mistakes

## Wrong File Path

Incorrect:

```js
apis: ["routes/*.js"];
```

Correct:

```js
apis: ["./src/routes/*.js"];
```

---

## Missing Comment Block

Swagger only reads routes with:

```js
/**
 * @swagger
 */
```

comments.

---

## Forgetting to Register Swagger Route

Must include:

```js
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

# Production Structure

```text
src/
│
├── controllers/
│
├── routes/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── middlewares/
│
├── services/
│
└── swagger.js
```

---

# Quick Swagger Setup Checklist

```text
1. npm install swagger-ui-express swagger-jsdoc

2. Create swagger.js

3. Configure swagger-jsdoc

4. Register Swagger route

5. Add Swagger comments

6. Start server

7. Open /api-docs

8. Test APIs
```

# Swagger UI with Express.js (Using pnpm)

## Step 1: Install Swagger Packages

Instead of npm:

```bash
npm install swagger-ui-express swagger-jsdoc
```

Use:

```bash
pnpm add swagger-ui-express swagger-jsdoc
```

---

## Step 2: Project Structure

```text
express-learning/
│
├── src/
│   ├── routes/
│   │   └── userRoutes.js
│   │
│   └── swagger.js
│
├── server.js
├── package.json
├── pnpm-lock.yaml
└── node_modules/
```

Notice:

```text
pnpm-lock.yaml
```

is created instead of:

```text
package-lock.json
```

---

## Step 3: Create Swagger Configuration

### src/swagger.js

```js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Express API",
      version: "1.0.0",
      description: "Swagger Documentation",
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

---

## Step 4: Configure Swagger in Express

### server.js

```js
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

## Step 5: Create Route

### src/routes/userRoutes.js

```js
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", (req, res) => {
  res.json({
    message: "All Users",
  });
});

module.exports = router;
```

---

## Step 6: Register Route

### server.js

```js
const userRoutes = require("./src/routes/userRoutes");

app.use("/users", userRoutes);
```

---

## Step 7: Start the Server

Using Node:

```bash
node server.js
```

Or with pnpm scripts:

### package.json

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Run:

```bash
pnpm dev
```

or

```bash
pnpm start
```

---

## Step 8: Open Swagger UI

Visit:

```text
http://localhost:3000/api-docs
```

Swagger UI should appear.

---

# Common pnpm Commands

## Install Dependency

```bash
pnpm add express
```

```bash
pnpm add swagger-ui-express swagger-jsdoc
```

```bash
pnpm add dotenv
```

---

## Install Dev Dependency

```bash
pnpm add -D nodemon
```

---

## Start Project

```bash
pnpm dev
```

---

## Remove Package

```bash
pnpm remove swagger-ui-express
```

---

## Update Package

```bash
pnpm update
```

---

# Recommended Express + pnpm Setup

Create project:

```bash
mkdir express-learning
cd express-learning
pnpm init
```

Install Express:

```bash
pnpm add express
```

Install Dev Tools:

```bash
pnpm add -D nodemon
```

Install Swagger:

```bash
pnpm add swagger-ui-express swagger-jsdoc
```

Install Environment Variables:

```bash
pnpm add dotenv
```

Start Development:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000/api-docs
```

and your API documentation will be available.
