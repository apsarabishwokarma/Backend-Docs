const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
const userRoutes = require("./routes/user.routes");

const app = express();

const PORT = 5000;

app.use(express.json());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
