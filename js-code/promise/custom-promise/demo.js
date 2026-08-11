const myAxios = require("./my-axios");

myAxios
  .get("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => {
    console.log("GET success:", response.data);

    return myAxios.post("https://jsonplaceholder.typicode.com/posts", {
      title: "hello",
      body: "using myAxios + MyPromise",
      userId: 1,
    });
  })
  .then((response) => {
    console.log("POST success:", response.data);
  })
  .catch((error) => {
    console.log("request failed:", error.message);
  })
  .finally(() => {
    console.log("done");
  });
