const { generateJwtSecret } = require("../src/services/secret.service");

const secret = generateJwtSecret();

console.log(secret);
