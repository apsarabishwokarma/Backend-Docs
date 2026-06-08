require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const swaggerDocument = require("./swagger-with-objects");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerUrl: "/swagger.json",
  }),
);
app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

app.get("/", (req, res) => {
  res.send(swaggerDocument);
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
