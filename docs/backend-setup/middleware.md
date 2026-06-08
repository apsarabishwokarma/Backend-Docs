# What is Middleware in Express.js?

Middleware is a function that runs **between the request and the response**.

When a request comes to your server, it does not go directly to the final route. It passes through middleware first.

---

## Request Flow

```text
Client Request
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
Route Handler
   ↓
Response
```

---

# Middleware Function Structure

Every middleware has this format:

```js
(req, res, next) => {
  // logic here
  next();
};
```

### Parameters:

- `req` → request data (body, params, headers)
- `res` → response object
- `next` → function that moves request to next step

---

# Why Middleware is Important

Middleware is used for:

- Authentication (JWT verification)
- Logging requests
- Error handling
- Input validation
- Authorization (role checks)
- Modifying request/response

---

# Types of Middleware

## 1. Application-level middleware

Runs for every request or specific routes.

```js
app.use((req, res, next) => {
  console.log("Request received");
  next();
});
```

---

## 2. Route-level middleware

Applied to specific routes:

```js
app.get("/profile", authMiddleware, (req, res) => {
  res.send("Profile");
});
```

---

## 3. Built-in middleware

Provided by Express:

```js
app.use(express.json());
```

---

## 4. Error-handling middleware

Has 4 parameters:

```js
(err, req, res, next) => {
  res.status(500).json({ message: "Error occurred" });
};
```

---

## 5. Custom middleware (most important for you)

Example: JWT authentication

```js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
```

---

# How Middleware Works Internally

1. Request enters Express
2. Middleware runs
3. If `next()` is called → move forward
4. If response is sent → request stops
5. If error occurs → error middleware handles it

---

# Important Rule

If you forget `next()`:

```js
(req, res, next) => {
  console.log("Hello");
  // request will hang here
};
```

Request will never reach route.

---

# Middleware in JWT Authentication Flow

```text
Login → Token created
Request → Middleware checks token
Valid token → allow access
Invalid token → block request
```

---

# Practical Example

```js
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome",
    user: req.user,
  });
});
```

---

# Common Mistakes

### 1. Forgetting next()

```js
(req, res, next) => {
  console.log("test");
  next(); // required
};
```

---

### 2. Sending response + calling next()

Wrong:

```js
res.send("Hello");
next(); //  not needed
```

---

### 3. Not handling missing token

Always check:

```js
if (!token) return res.status(401);
```

---

# Tips to Remember Middleware

## 1. Think of it like a pipeline

Request flows step by step.

---

## 2. Middleware = gatekeeper

It decides:

- allow request
- block request
- modify request

---

## 3. Always ask:

Before writing middleware:

- Do I need to check something?
- Do I need to modify request?
- Do I need to stop request?

---

## 4. Order matters

```js
app.use(express.json());
app.use(authMiddleware);
app.use(routes);
```

Wrong order breaks app.

---

# Middleware Summary

- Middleware runs between request and response
- It controls request flow
- Uses `next()` to continue
- Used for auth, logging, validation, errors

---

## Important Rules

- Always call next()
- Do not send response and call next together
- Middleware order matters

---

## JWT Flow

Login → Token Created → Client Stores Token → Middleware Verifies Token → Protected Route Access

---

## Tips

- Middleware is a gatekeeper
- Think of it as a pipeline
- It decides whether request continues or stops
