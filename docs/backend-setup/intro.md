## Express Js

### 1. What is Express.js?

- Express.js is a web framework for Node.js.

### Express.js vs Node.js HTTP Module

## Overview

When building a backend server in Node.js, you can either:

1. Use Node.js's built-in **HTTP module**
2. Use **Express.js**, a framework built on top of the HTTP module

Express simplifies many common backend development tasks and is the most popular framework for Node.js applications.

#### 1. Using the Node.js HTTP Module

```js
const http = require("http");

http
  .createServer((req, res) => {
    res.end("Hello");
  })
  .listen(3000);
```

### How It Works?

#### Import HTTP Module

```js
const http = require("http");
```

Loads Node.js's built-in HTTP tools.

### Create Server

```js
http.createServer((req, res) => {
```

Creates a web server.

- `req` = Request object (incoming request)
- `res` = Response object (outgoing response)

### Send Response

```js
res.end("Hello");
```

Sends "Hello" back to the browser and closes the connection.

### Start Server

```js
.listen(3000);
```

Runs the server on port `3000`.

Visit:

```text
http://localhost:3000
```

Output:

```text
Hello
```

---

## Drawback of Pure HTTP Module

For multiple routes, you must handle URLs manually.

```js
const http = require("http");

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.end("Home");
    } else if (req.url === "/about") {
      res.end("About");
    } else if (req.url === "/contact") {
      res.end("Contact");
    }
  })
  .listen(3000);
```

As applications grow, this becomes difficult to maintain.

---

# 2. Using Express.js

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000);
```

---

### How It Works?

#### Import Express

```js
const express = require("express");
```

Loads the Express framework.

### Create Application

```js
const app = express();
```

Creates an Express application instance.

### Create Route

```js
app.get("/", (req, res) => {
  res.send("Hello");
});
```

Meaning:

> When someone sends a GET request to "/", return "Hello".

### Start Server

```js
app.listen(3000);
```

Starts the server on port 3000.

---

# Multiple Routes in Express

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/about", (req, res) => {
  res.send("About");
});

app.get("/contact", (req, res) => {
  res.send("Contact");
});

app.listen(3000);
```

Express automatically handles route matching, making code cleaner and easier to read.

---

# Understanding req and res

## req (Request)

Contains information sent by the client.

Examples:

```js
req.url;
```

Returns:

```text
/about
```

```js
req.method;
```

Returns:

```text
GET
```

---

## res (Response)

Used to send data back to the client.

Example:

```js
res.send("Hello");
```

Returns:

```text
Hello
```

to the browser.

---

# Node HTTP vs Express

| Feature        | Node HTTP Module   | Express.js        |
| -------------- | ------------------ | ----------------- |
| Routing        | Manual             | Automatic         |
| Code Size      | More               | Less              |
| Middleware     | Manual             | Built-in Support  |
| JSON Handling  | Manual             | Easy              |
| Error Handling | Basic              | Easier            |
| Learning Curve | Harder             | Beginner Friendly |
| Popularity     | Low for large apps | Very High         |

---

### Relationship Between Node.js and Express

```text
Your Application
       ↓
     Express
       ↓
 Node.js HTTP Module
       ↓
     Internet
```

Express uses the Node.js HTTP module internally and provides a simpler API for developers.

---

# Why Developers Use Express

Express provides:

- Simple routing
- Middleware support
- JSON request handling
- Better error handling
- Cleaner code organization
- Faster development

---

# Real-World Analogy

## Node.js HTTP Module

Like building a restaurant from scratch:

- Build tables
- Build kitchen
- Build ordering system

More control, but more work.

## Express.js

Like renting a fully equipped restaurant:

- Tables already available
- Kitchen already available
- Ordering system already available

You focus on running the business instead of building everything.

---

# Key Takeaway

**Node.js HTTP Module provides the raw tools to create a web server, while Express.js provides a cleaner, faster, and more developer-friendly way to build backend applications.**
