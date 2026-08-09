//using axios to make HTTP requests and return a promise
const request = require("./native-http-client");

const nativeAxios = {
  get(url) {
    return request("GET", url);
  },
  post(url, data) {
    return request("POST", url, data);
  },
  put(url, data) {
    return request("PUT", url, data);
  },
  patch(url, data) {
    return request("PATCH", url, data);
  },
  delete(url) {
    return request("DELETE", url);
  },
};

module.exports = nativeAxios;
