const {
  usersRoutesDocs,
  userSchema,
  createUserSchema,
} = require("./routes/user.swagger");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Express API",
    version: "1.0.0",
    description: "API Docs",
  },
  paths: {
    ...usersRoutesDocs,
  },
  components: {
    schemas: {
      User: userSchema,
      CreateUser: createUserSchema,
    },
  },
};

module.exports = swaggerDocument;
