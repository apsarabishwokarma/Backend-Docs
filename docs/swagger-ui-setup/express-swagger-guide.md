# Express.js + Swagger: Parameters vs Request Body (Complete Guide)

---

# 1. Core Concept

In APIs, data is sent in only two ways:

```
1. URL (Parameters)
2. Request Body
```

---

# 2. Parameters (URL Data)

## What is a parameter?

Data passed inside the URL.

### Example:

```
GET /users/123
```

Here:

```
123 = parameter (id)
```

---

## Where are parameters used?

- GET by ID
- PUT (update by ID)
- DELETE (delete by ID)

---

## Swagger Format (Parameters)

```js
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
```

---

## Meaning

| Field    | Meaning              |
| -------- | -------------------- |
| in: path | Value comes from URL |
| name     | Parameter name       |
| required | Must be provided     |
| type     | Data type            |

---

## Example URL

```
/users/123
```

becomes:

```
/users/{id}
```

---

# 3. Request Body (Body Data)

## What is request body?

Data sent inside HTTP request.

### Example:

```json
{
  "name": "John",
  "email": "john@gmail.com"
}
```

---

## Where is request body used?

- POST (create)
- PUT (update)

---

## Swagger Format (Request Body)

```js
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          name:
            type: string
          email:
            type: string
```

---

# 4. API Methods Explained

---

# A. GET (All Users)

## Purpose

Fetch all users.

## Example

```
GET /users
```

## Uses

- No parameters
- No request body

## Swagger

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
```

---

# B. GET by ID

## Purpose

Fetch single user.

## Example

```
GET /users/123
```

## Uses

- Parameter only
- No request body

## Swagger

```js
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
```

---

# C. POST (Create User)

## Purpose

Create a new user.

## Example

```
POST /users
```

## Uses

- Request body only
- No parameters

## Example Body

```json
{
  "name": "John",
  "email": "john@gmail.com"
}
```

## Swagger

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
 *       400:
 *         description: Bad Request
 */
```

---

# D. PUT (Update User)

## Purpose

Update existing user.

## Example

```
PUT /users/123
```

## Uses

- Parameter (id)
- Request body (updated data)

## Example Body

```json
{
  "name": "Updated Name",
  "email": "updated@gmail.com"
}
```

## Swagger

```js
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
```

---

# E. DELETE User

## Purpose

Delete user.

## Example

```
DELETE /users/123
```

## Uses

- Parameter only
- No request body

## Swagger

```js
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
```

---

# 5. Quick Summary Table

| Method      | Parameter | Request Body |
| ----------- | --------- | ------------ |
| GET (all)   | No        | No           |
| GET (by id) | Yes       | No           |
| POST        | No        | Yes          |
| PUT         | Yes       | Yes          |
| DELETE      | Yes       | No           |

---

# 6. Simple Rule to Remember

```
URL  = WHERE (resource location)
Body = WHAT (data you send)
GET    → Read data (URL only)
POST   → Create data (Body only)
PUT    → Update data (URL + Body)
DELETE → Remove data (URL only)
```

```
GET /users/:id     → parameter only
POST /users        → request body only
PUT /users/:id     → parameter + body
DELETE /users/:id  → parameter only
```
