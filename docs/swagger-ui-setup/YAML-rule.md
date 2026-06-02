# Swagger YAML Rules for Beginners

## What is YAML?

Swagger comments use YAML syntax.

YAML stands for:

```text
YAML Ain't Markup Language
```

Swagger reads your comments as YAML and converts them into OpenAPI JSON.

---

# The Most Important Rule

## Indentation Defines Hierarchy

Swagger does NOT use:

```js
{
  users: {
    get: {
    }
  }
}
```

like JavaScript.

Instead it uses spaces.

Example:

```yaml
/users:
  get:
    summary: Get all users
```

Notice:

```text
0 spaces -> /users
2 spaces -> get
4 spaces -> summary
```

This creates:

```json
{
  "/users": {
    "get": {
      "summary": "Get all users"
    }
  }
}
```

---

# Golden Rule

Each level should be indented by 2 spaces.

```yaml
level 1
level 2
level 3
level 4
```

Think:

```text
Parent
  Child
    Grandchild
      Great Grandchild
```

---

# Swagger Structure

Basic structure:

```yaml
/users:
  get:
    summary: Get all users
    responses:
      200:
        description: Success
```

Hierarchy:

```text
/users
 └── get
      ├── summary
      └── responses
            └── 200
                  └── description
```

---

# Wrong Example

```yaml
/users:
get:
summary: Get all users
```

Swagger sees:

```text
/users
get
summary
```

as separate root-level items.

Result:

```text
Swagger Error
Endpoint ignored
```

---

# Correct Example

```yaml
/users:
  get:
    summary: Get all users
```

Swagger understands:

```text
/users
  └── get
        └── summary
```

---

# GET Route Example

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
```

Indentation levels:

```text
/users:             Level 1
  get:              Level 2
    summary:        Level 3
    responses:      Level 3
      200:          Level 4
        description Level 5
```

---

# POST Route Example

```js
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     responses:
 *       201:
 *         description: User created
 */
```

---

# Multiple Response Codes

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Users not found
 *       500:
 *         description: Server error
 */
```

Hierarchy:

```text
/users
 └── get
      └── responses
           ├── 200
           ├── 404
           └── 500
```

---

# Request Body Example

```js
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
```

Hierarchy:

```text
/users
 └── post
      └── requestBody
            └── content
                  └── application/json
                        └── schema
                              └── properties
                                    ├── name
                                    └── email
```

---

# Route Matching Rule

Swagger path must match Express route.

Express:

```js
app.use("/users", userRoutes);
```

and

```js
router.post("/");
```

means:

```text
POST /users
```

Swagger:

```yaml
/users:
  post:
```

Correct.

---

Express:

```js
app.use("/users", userRoutes);
```

and

```js
router.post("/create");
```

means:

```text
POST /users/create
```

Swagger:

```yaml
/users/create:
  post:
```

Correct.

---

# Common Beginner Mistakes

## Mistake 1

Wrong:

```yaml
/users:
post:
summary: Get users
```

Correct:

```yaml
/users:
  get:
    summary: Get users
```

---

## Mistake 2

Wrong:

```yaml
responses:
200:
description: Success
```

Correct:

```yaml
responses:
  200:
    description: Success
```

---

## Mistake 3

Wrong:

```yaml
/users:
  get:
  summary: Get users
```

Correct:

```yaml
/users:
  get:
    summary: Get users
```

---

## Mistake 4

Wrong route path:

Express:

```js
router.post("/create");
```

Swagger:

```yaml
/users:
  post:
```

Actual endpoint:

```text
POST /users/create
```

Swagger endpoint:

```text
POST /users
```

Mismatch.

---

# Visual Indentation Guide

```yaml
/users:
  get:
    summary: Get all users
    description: Returns users
    responses:
      200:
        description: Success
      404:
        description: Not found
```

Visual tree:

```text
/users
│
└── get
    │
    ├── summary
    ├── description
    │
    └── responses
         │
         ├── 200
         │    └── description
         │
         └── 404
              └── description
```

---

# Beginner Memory Trick

Every time you go deeper, add 2 spaces:

```yaml
/users:
  get:
    responses:
      200:
        description:
```

Count spaces:

```text
/users:          0 spaces
get:             2 spaces
responses:       4 spaces
200:             6 spaces
description:     8 spaces
```

If indentation is wrong, Swagger usually ignores the endpoint or throws parsing errors.

---

# Quick Swagger YAML Template

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
```
