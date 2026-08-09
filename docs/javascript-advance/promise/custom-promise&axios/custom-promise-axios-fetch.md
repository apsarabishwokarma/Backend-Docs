Yes — if you want the **same custom `myAxios` idea on the client side**, you can implement it with either **Fetch API** or **XMLHttpRequest (XHR)**.

The main difference is:

```text
Node.js
myAxios → https module → server

Browser
myAxios → fetch() / XMLHttpRequest → server
```

## 1. Client-side version using `fetch`

This is the modern approach.

```js
const myAxios = {
  get(url) {
    return new MyPromise((resolve, reject) => {
      fetch(url)
        .then((res) => {
          return res.json().then((data) => {
            resolve({
              data: data,
              status: res.status,
              url: res.url,
            });
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

myAxios
  .get("https://jsonplaceholder.typicode.com/users")
  .then((response) => {
    console.log("Status:", response.status);
    console.log("Users:", response.data);
  })
  .catch((error) => {
    console.error("Something went wrong:", error.message);
  });
```

### Flow

```text
myAxios.get(url)
       ↓
new MyPromise()
       ↓
fetch(url)
       ↓
HTTP response
       ↓
res.json()
       ↓
resolve({
   data,
   status,
   url
})
       ↓
.then(response)
```

---
