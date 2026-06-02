const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API",
      version: "1.0.0",
      description: "API Docs",
    },
  },

  apis: ["src/routes/*.js"],
  
};
const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
