//using fetch API to make HTTP requests and return a promise
const MyPromise = require("./custompromise");

function request(method, url, body) {
  return new MyPromise((resolve, reject) => {
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
          return;
        }

        resolve({
          data,
          status: response.status,
          statusText: response.statusText,
        });
      })
      .catch((error) => reject(error));
  });
}

module.exports = request;
