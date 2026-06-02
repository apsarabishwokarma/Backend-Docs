const express = require("express");
const userCreate = require("../controllers/userCreate.controller");

const router = express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieves a list of all users from the database.
 *     operationId: getUsers
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john@gmail.com"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Users not found
 *       500:
 *         description: Internal Server Error
 *       503:
 *         description: Service Unavailable
 */
router.get("/", (req, res) => {
  // res.json([
  //   {
  //     id: "123",
  //     name: "John Doe",
  //     email: "john@gmail.com",
  //   },
  // ]);

  res.send("All Users");
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user
 *     description: Creates a new user
 *     operationId: createUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@gmail.com"
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *       503:
 *         description: Service Unavailable
 */
router.post("/", userCreate);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieves a specific user by their ID
 *     operationId: getUserById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "123"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", (req, res) => {
  res.json({
    id: req.params.id,
  });
});

module.exports = router;
