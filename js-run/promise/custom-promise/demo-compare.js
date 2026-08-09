const myAxios = require("./my-axios"); // CUSTOM: built on your own MyPromise (custompromise.js)
const nativeAxios = require("./native-axios"); // INBUILT: built on the real, built-in Promise

const url = "https://jsonplaceholder.typicode.com/todos/1";

// ================= INBUILT (built-in Promise) =================
console.log("--- nativeAxios (built-in Promise) ---");
console.log("nativeAxios.get() returned:", nativeAxios.get(url));

nativeAxios.get(url).then((response) => {
  console.log("nativeAxios result:", response.data);

  // ================= CUSTOM (your MyPromise) =================
  console.log("\n--- myAxios (MyPromise) ---");
  const result = myAxios.get(url);
  console.log("myAxios.get() returned:", result);

  result.then((response) => {
    console.log("myAxios result:", response.data);
  });
});
