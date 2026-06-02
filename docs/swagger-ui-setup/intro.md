# Swagger UI with Express.js

---

# What is Swagger?

Swagger is a tool that helps you:

- Document APIs
- Test APIs in browser
- Understand backend routes easily
- Swagger automatically creates documentation for our APIs.Instead of manually writing API documentation, Swagger generates it automatically.

Think about a real application:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

Without Swagger:

```text
Frontend Developer:
"How do I use your API?"

Backend Developer:2
"Wait, let me explain..."
```

With Swagger:

```text
Frontend Developer:
"I'll open /api-docs"
```

Everything is documented automatically.

---

# How Swagger Works

Swagger is actually three things working together.

```text
Your Routes
     +
Swagger Comments
     ↓
swagger-jsdoc
     ↓
OpenAPI JSON
     ↓
swagger-ui-express
     ↓
Beautiful Documentation Page
```

# The Big Picture

Swagger works using **two main tools**:

```text id="flow-1"
Swagger Comments
        ↓
swagger-jsdoc
        ↓
OpenAPI JSON
        ↓
swagger-ui-express
        ↓
Swagger UI (Browser Page)
```

---

# Step 1: Install Swagger

Using pnpm:

```bash
pnpm add swagger-ui-express swagger-jsdoc
```

---

# 1. What is swagger-jsdoc?

## Simple Definition

```text id="def-jsdoc"
swagger-jsdoc = Converts Swagger comments into OpenAPI JSON
```

---

## What it does

It reads your route comments like this:

```js id="example-jsdoc"
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 */
```

and converts them into:

```json id="output-json"
{
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users"
      }
    }
  }
}
```

---

## Think of it like this

```text id="analogy-jsdoc"
You write notes in code
        ↓
swagger-jsdoc reads notes
        ↓
Creates structured JSON (OpenAPI)
```

---

## Key Responsibility

- Reads `@swagger` comments
- Generates OpenAPI JSON
- Does NOT show UI
- Does NOT run Express

---

## Code Example

```js id="jsdoc-code"
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation",
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

---

## Important Line

```js id="important-line"
apis: ["./src/routes/*.js"];
```

This tells Swagger:

```text id="scan-rule"
Go inside routes folder
Find all .js files
Read @swagger comments
```

---

# 2. What is swagger-ui-express?

## Simple Definition

```text id="def-ui"
swagger-ui-express = Displays OpenAPI JSON as a web page
```

---

## What it does

It takes this:

```json id="input-json"
{
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users"
      }
    }
  }
}
```

and converts it into:

```text id="output-ui"
GET /users

Summary: Get all users

[Try it out]
[Execute]
```

inside the browser.

---

## Think of it like this

```text id="analogy-ui"
OpenAPI JSON (raw data)
        ↓
swagger-ui-express
        ↓
API documentation page
```

---

## Key Responsibility

- Displays API docs in browser
- Provides "Try it out" feature
- Makes API interactive
- Does NOT generate JSON
- Does NOT read comments

---

## Code Example

```js id="ui-code"
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000);
```

---

## Important Line

```js id="ui-line"
swaggerUi.setup(swaggerSpec);
```

This means:

```text id="setup-meaning"
Take OpenAPI JSON
Render it as UI
```

---

# 3. Full Flow (Very Important)

```text id="full-flow"
1. You write route + Swagger comment
        ↓
2. swagger-jsdoc reads comments
        ↓
3. Converts to OpenAPI JSON
        ↓
4. swagger-ui-express reads JSON
        ↓
5. Shows Swagger UI in browser
```

---

# 4. Mental Model

```text id="mental-model"
swagger-jsdoc:
    "I read comments and create API data"

swagger-ui-express:
    "I take API data and show it in browser"
```

---

# 5. Real Example Together

## Route File

```js id="route-example"
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/users", (req, res) => {
  res.json({ message: "All Users" });
});

module.exports = router;
```

---

## swagger-jsdoc Output

```json id="openapi-output"
{
  "openapi": "3.0.0",
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users",
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  }
}
```

---

## Swagger UI Output

```text id="ui-output"
GET /users

Summary: Get all users

Responses:
200 - Success

[Try it out]
```

---

# 6. Why We Need Both

## Only swagger-jsdoc

```text id="only-jsdoc"
You get JSON only (no UI)
```

---

## Only swagger-ui-express

```text id="only-ui"
No data → No documentation
```

---

## Together

```text id="together"
Full API documentation system
```

---

# 7. One-Line Summary

```text id="summary"
swagger-jsdoc = Builds API documentation data (OpenAPI JSON)

swagger-ui-express = Shows that data in browser UI
```

---

# 8. Final Mental Picture

```text id="final-picture"
Your Code + Swagger Comments
           ↓
     swagger-jsdoc
           ↓
     OpenAPI JSON
           ↓
 swagger-ui-express
           ↓
   Swagger Documentation Website
```

---

# What Did We Install?

## swagger-jsdoc

Job:

```text
Read Swagger comments
     ↓
Generate OpenAPI JSON
```

Example:

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 */
```

swagger-jsdoc reads this.

---

## swagger-ui-express

Job:

```text
Take OpenAPI JSON
      ↓
Show a beautiful webpage
```

Instead of ugly JSON:

```json
{
  "paths": {
    "/users": {}
  }
}
```

you get:

```text
GET /users
Try it out
Execute
```

inside your browser.

---

# Project Structure

```text
project/
│
├── src/
│   ├── routes/
│   │   └── userRoutes.js
│   │
│   └── swagger.js
│
├── server.js
├── package.json
└── pnpm-lock.yaml
```

---

# Step 2: Create swagger.js

File:

```text
src/swagger.js
```

Code:

```js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Learning Express API",
      version: "1.0.0",
      description: "My First API Docs",
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

---

# Understanding Every Line

---

## Import Package

```js
const swaggerJsdoc = require("swagger-jsdoc");
```

Loads the package.

Exactly like:

```js
const express = require("express");
```

but for Swagger.

---

## Create Configuration Object

```js
const options = {
```

Creates settings for Swagger.

Think:

```js
const car = {
  color: "red",
  brand: "Toyota",
};
```

Same concept.

---

## OpenAPI Version

```js
openapi: "3.0.0";
```

Tells Swagger:

```text
Use OpenAPI Specification Version 3
```

OpenAPI is the standard format Swagger follows.

---

## API Information

```js
info: {
```

Information shown at the top of Swagger UI.

---

### Title

```js
title: "Learning Express API";
```

Displayed as:

```text
Learning Express API
```

---

### Version

```js
version: "1.0.0";
```

Displayed as:

```text
Version 1.0.0
```

Useful when APIs change.

---

### Description

```js
description: "My First API Docs";
```

Shown under the title.

---

## APIs

```js
apis: ["./src/routes/*.js"];
```

Most important line.

It tells Swagger:

```text
Go to src/routes
Read every .js file
Look for @swagger comments
```

Example:

```text
src/routes/
│
├── userRoutes.js
├── authRoutes.js
└── productRoutes.js
```

Swagger scans all of them.

---

## Generate Documentation

```js
const swaggerSpec = swaggerJsdoc(options);
```

This line:

```text
Reads options
+
Reads route comments
+
Generates OpenAPI JSON
```

Result:

```js
swaggerSpec;
```

contains all API documentation.

---

## Export

```js
module.exports = swaggerSpec;
```

Makes it available to other files.

---

# Step 3: Configure Swagger UI

File:

```text
server.js
```

Code:

```js
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000);
```

---

# Understanding Every Line

---

## Import Express

```js
const express = require("express");
```

Loads Express.

---

## Import Swagger UI

```js
const swaggerUi = require("swagger-ui-express");
```

Loads Swagger UI package.

Its only job:

```text
Show documentation webpage
```

---

## Import Generated Docs

```js
const swaggerSpec = require("./src/swagger");
```

Imports:

```js
module.exports = swaggerSpec;
```

from swagger.js.

---

## Create Express App

```js
const app = express();
```

Creates Express application.

---

# Most Important Part

```js
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

Let's break this into pieces.

---

## /api-docs

```js
"/api-docs";
```

Means:

```text
http://localhost:3000/api-docs
```

When a user visits this URL...

---

## swaggerUi.serve

```js
swaggerUi.serve;
```

Provides:

```text
HTML
CSS
JavaScript
```

required by Swagger UI.

Think:

```text
Creates the page structure
```

---

## swaggerUi.setup(swaggerSpec)

```js
swaggerUi.setup(swaggerSpec);
```

Uses:

```js
swaggerSpec;
```

to fill the page with API information.

Think:

```text
swaggerSpec JSON
       ↓
Swagger UI
       ↓
Pretty Documentation
```

---

## Start Server

```js
app.listen(3000);
```

Starts Express.

Open:

```text
http://localhost:3000/api-docs
```

Swagger page appears.

---

# Step 4: Create Route File

File:

```text
src/routes/userRoutes.js
```

Code:

```js
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
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

# Understanding Every Line

---

## Create Router

```js
const router = express.Router();
```

Creates route container.

---

# Swagger Comment Block

```js
/**
 * @swagger
```

This is NOT JavaScript code.

JavaScript ignores it.

Swagger reads it.

Think:

```text
Message for Swagger
Not for JavaScript
```

---

## Path

```js
/users:
```

Documents:

```text
GET /users
```

endpoint.

---

## Method

```js
get:
```

Means:

```text
HTTP GET Method
```

---

## Summary

```js
summary: Get all users
```

Displayed in Swagger UI.

Example:

```text
GET /users

Get all users
```

---

## Responses

```js
responses:
```

Possible responses.

---

## Status Code

```js
200:
```

Success response.

---

## Description

```js
description: Success;
```

Displayed as:

```text
200 Success
```

inside Swagger.

---

# Actual Route

```js
router.get("/", (req, res) => {
```

Creates route.

---

If registered like:

```js
app.use("/users", router);
```

Then:

```js
router.get("/");
```

becomes:

```text
GET /users
```

---

## Send Response

```js
res.json({
  message: "All Users",
});
```

Response:

```json
{
  "message": "All Users"
}
```

---

# Full Swagger Flow

```text
1. Start Express Server
          ↓

2. swagger-jsdoc reads @swagger comments
          ↓

3. Creates OpenAPI JSON
          ↓

4. swagger-ui-express reads JSON
          ↓

5. Generates Documentation Page
          ↓

6. Open:

   localhost:3000/api-docs

          ↓

7. See:

   GET /users
   Summary: Get all users
   200 Success
```

---

# Mental Model

Whenever you see Swagger code, think:

```text
Swagger Comment
        ↓
swagger-jsdoc
        ↓
OpenAPI JSON
        ↓
swagger-ui-express
        ↓
Beautiful Browser Documentation
```

That is the entire Swagger workflow.

If you understand this flow, you'll be able to document GET, POST, PUT, DELETE, authentication, request bodies, query parameters, and responses without memorizing anything.
