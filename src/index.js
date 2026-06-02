const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
const userRoutes = require("./routes/user.routes");
const swaggerDocument = require("./swagger-with-objectts");

const app = express();

const PORT = 5000;

app.use(express.json());

// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
