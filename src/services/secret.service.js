const crypto = require("node:crypto");
// generate JWT secret simple way
// const secret = crypto.randomBytes(64).toString("base64url");
// console.log("JWT SECRET:", secret);

const generateEnvSecret = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("base64url");
};

const generateJwtSecret = () => {
  return generateEnvSecret(64);
};

module.exports = {
  generateEnvSecret,
  generateJwtSecret,
};
