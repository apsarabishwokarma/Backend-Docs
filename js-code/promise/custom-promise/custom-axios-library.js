const https = require("https"); // built-in Node.js module for making HTTPS requests
const MyPromise = require("./custompromise");

const myAxios = {
  get(url) {
    return new MyPromise((resolve, reject) => {
      https
        .get(url, (res) => {
          console.log("Status Code:", res.statusCode);
          let rawData = "";

          // data comes in chunks — collect them
          res.on("data", (chunk) => {
            console.log("Received chunk:", chunk.toString());
            rawData += chunk;
          });

          // all chunks received — now we can finish
          res.on("end", () => {
            try {
              const parsed = JSON.parse(rawData);
              // axios-style response object:
              resolve({
                data: parsed,
                status: res.statusCode,
                url: url,
              });
            } catch (err) {
              reject(err); // bad JSON -> your .catch
            }
          });
        })
        .on("error", (err) => {
          reject(err); // network failure -> your .catch
        });
    });
  },
};
//===================implementation=========================
myAxios
  .get("https://jsonplaceholder.typicode.com/users")
  .then((response) => {
    console.log("Status:", response.status);
    console.log("First user:", response.data[0]); // note: response.data
  })
  .catch((error) => {
    console.error("Something went wrong:", error.message);
  });
