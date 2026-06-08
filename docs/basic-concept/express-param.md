Yes — in **Express routes/controllers**, you normally do **not pass your own arguments manually** like in normal functions.

Instead, Express always gives you:

```js
(req, res);
```

---

# 1. Why Express uses only `req, res`

Because Express is built like this:

```text
Client Request → Express → Your Function
```

So Express automatically calls your function:

```js
userLogin(req, res);
```

You don’t call it yourself.

---

# 2. This is WRONG in Express controllers

```js
const UserLogin = async (email, password) => {
```

❌ Problem:

- Express will NOT pass email/password directly
- You will get `undefined`

---

# 3. This is CORRECT

```js
const UserLogin = async (req, res) => {
```

Then you extract data from request:

```js
const { email, password } = req.body;
```

---

# 4. Think of it like this

## Normal function (you control arguments)

```js
function add(a, b) {
  return a + b;
}

add(2, 3);
```

---

## Express function (Express controls arguments)

```js
app.post("/login", UserLogin);
```

Express internally does:

```js
UserLogin(req, res);
```

You DON'T call it manually.

---

# 5. Where do your custom values come from?

Instead of function parameters, you use:

## 1. Body (POST data)

```js
req.body.email;
req.body.password;
```

---

## 2. URL params

```js
req.params.id;
```

Example:

```js
app.get("/user/:id", (req, res) => {
  console.log(req.params.id);
});
```

---

## 3. Query params

```js
req.query.page;
```

Example:

```js
/users?page=2
```

---

# 6. Real login flow

```js
const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  // use them here
};
```

Flow:

```text
Frontend sends request
   ↓
req.body contains data
   ↓
Express passes req, res
   ↓
You extract email/password
```

---

# 7. Why NOT use function arguments like normal JS?

Because Express needs:

✔ request data
✔ headers
✔ cookies
✔ params
✔ query
✔ response methods

So everything is packed into:

```js
req;
res;
```

---

# 8. Advanced idea (important for later)

You CAN create helper functions with custom arguments:

```js
const checkUser = async (email, password) => {
  // pure function
};
```

Then call it inside controller:

```js
const UserLogin = async (req, res) => {
  const result = await checkUser(email, password);
};
```

✔ This is GOOD design (service layer pattern)

---

# 9. Final summary

| Type               | Function style                           |
| ------------------ | ---------------------------------------- |
| Express controller | `(req, res)` only                        |
| Normal JS function | your own arguments                       |
| Service function   | custom arguments (email, password, etc.) |

---

# 10. Simple rule to remember

👉 Express = framework controls inputs
👉 You only read from `req`
👉 You respond using `res`

---

If you want next step, I can teach you:

🔥 how to properly split controllers + services + repositories (real backend architecture used in companies)

Just say 👍
