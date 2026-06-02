Actually, **modern backend development uses `import` a lot.** Both `require()` and `import` are valid in Node.js.

You are seeing `require()` because many Express tutorials and older codebases use **CommonJS**.

---

# 1. CommonJS (Older Style)

This is what you've been seeing:

```js
const express = require("express");

const app = express();
```

Export:

```js
module.exports = router;
```

Import:

```js
const router = require("./routes/userRoutes");
```

This is called **CommonJS**.

---

# 2. ES Modules (Modern Style)

This looks like frontend JavaScript:

```js
import express from "express";

const app = express();
```

Export:

```js
export default router;
```

Import:

```js
import userRoutes from "./routes/userRoutes.js";
```

This is called **ES Modules (ESM)**.

---

# Frontend vs Backend

Frontend:

```js
import React from "react";
import "./App.css";
```

Backend (ESM):

```js
import express from "express";
import dotenv from "dotenv";
```

Very similar.

---

# Why Do Many Express Tutorials Use require()?

Because:

- Express was released long before ES Modules existed.
- Many companies still have older Node.js projects.
- Lots of tutorials were written years ago.

So you'll encounter:

```js
const express = require("express");
```

frequently.

---

# Which Should You Learn?

For a new project in 2026, I recommend:

```js
import express from "express";
```

because:

✅ Modern JavaScript standard

✅ Same syntax as frontend

✅ Used in newer Node.js projects

✅ Easier transition between frontend and backend

---

# How to Enable import in Node.js

In `package.json`:

```json
{
  "type": "module"
}
```

Now Node.js understands:

```js
import express from "express";
```

instead of:

```js
const express = require("express");
```

---

# Example Express Server (Modern Style)

Install:

```bash
pnpm add express
```

package.json:

```json
{
  "name": "express-learning",
  "type": "module"
}
```

server.js:

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# Export/Import Comparison

### CommonJS

userRoutes.js

```js
const router = express.Router();

module.exports = router;
```

server.js

```js
const userRoutes = require("./routes/userRoutes");
```

---

### ES Modules

userRoutes.js

```js
const router = express.Router();

export default router;
```

server.js

```js
import userRoutes from "./routes/userRoutes.js";
```

---

# Recommendation for Learning Express Today

Use:

```json
{
  "type": "module"
}
```

and write:

```js
import express from "express";
import dotenv from "dotenv";

export default something;
```

However, you should still understand `require()` because you'll see it in:

- Older tutorials
- Existing company codebases
- Many Express examples online

A good rule is:

```text
New project → ES Modules (import/export)

Reading older code → CommonJS (require/module.exports)
```

Learning both will make Express documentation and tutorials much easier to follow.
