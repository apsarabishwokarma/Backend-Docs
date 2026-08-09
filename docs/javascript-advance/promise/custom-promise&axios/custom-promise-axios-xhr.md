# 2. Client-side version using XMLHttpRequest

XHR is the **older browser API** that existed before `fetch()`.

You can build your `myAxios` like this:

```js
const myAxios = {
  get(url) {
    return new MyPromise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);

      xhr.onload = () => {
        try {
          const parsed = JSON.parse(xhr.responseText);

          resolve({
            data: parsed,
            status: xhr.status,
            url: url,
          });
        } catch (error) {
          reject(error);
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error"));
      };

      xhr.send();
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

---

# 3. Node vs Browser

Your original Node code:

```js
https.get(url, ...)
```

is replaced in the browser by either:

```js
fetch(url);
```

or:

```js
const xhr = new XMLHttpRequest();
```

So conceptually:

```text
              myAxios.get()
                   │
          ┌────────┴────────┐
          ↓                 ↓
       Node.js           Browser
          │                 │
      https.get()       fetch() / XHR
          │                 │
          └────────┬────────┘
                   ↓
             HTTP response
                   ↓
              resolve()
                   ↓
                .then()
```

### Which should you learn?

I'd recommend **Fetch first**:

```js
fetch(url);
```

because it's the modern browser API and is much more commonly used today.

Then learn **XHR** because understanding it helps you understand how older libraries and abstractions worked.

And your overall learning path is actually good:

**HTTP → XHR → Fetch → Promise → custom Promise → Axios → build your own Axios-like library.**
