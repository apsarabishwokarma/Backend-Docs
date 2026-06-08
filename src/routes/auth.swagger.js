const userSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      example: "123",
    },
    name: {
      type: "string",
      example: "John Doe",
    },
    email: {
      type: "string",
      format: "email",
      example: "john@gmail.com",
    },
  },
};

const createUserSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      example: "Jane Doe",
    },
    email: {
      type: "string",
      format: "email",
      example: "jane@gmail.com",
    },
  },
};

const usersRoutesDocs = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users",
      description: "Retrieves a list of all users from the database.",
      operationId: "getUsers",
      responses: {
        200: {
          description: "Users retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        400: { description: "Bad Request" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
        404: { description: "Users not found" },
        500: { description: "Internal Server Error" },
        503: { description: "Service Unavailable" },
      },
    },
    post: {
      tags: ["Users"],
      summary: "Create user",
      description: "Creates a new user",
      operationId: "createUser",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            $ref: "#/components/schemas/CreateUser",
          },
        },
      },
      responses: {
        200: {
          description: "User created successfully",
        },
        400: { description: "Bad Request" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
        500: { description: "Internal Server Error" },
        503: { description: "Service Unavailable" },
      },
    },
  },
  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID",
      description: "Retrieves a specific user by their ID",
      operationId: "getUserById",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          example: "123",
        },
      ],
      responses: {
        200: {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              $ref: "#/components/schemas/User",
            },
          },
        },
        400: { description: "Bad Request" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
        404: { description: "User not found" },
        500: { description: "Internal Server Error" },
      },
    },
  },
};

module.exports = { usersRoutesDocs, userSchema, createUserSchema };
