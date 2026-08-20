```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true; //assume the operation succeeded

    if (success) {
      resolve("done");
    } else {
      reject("failed");
    }
  }, 1000);
})
  .then((result) => {
    console.log("Resolved:", result);
  })
  .catch((error) => {
    console.log("Rejected:", error);
  });
```

`const success = true` was only there to simulate whether the async operation succeeds or fails.

```js
const success = true;
```

means:

```text
assume the operation succeeded
```

So this runs:

```js
resolve("done");
```

If you change it to:

```js
const success = false;
```

then this runs:

```js
reject("failed");
```

You do not need `success` in a real Promise. Real code usually decides based on the actual result:

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("done");
  }, 100);
})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
```

Or to test rejection:

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("failed");
  }, 100);
})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
```

So `success = true` was just a teaching switch between `resolve()` and `reject()`.

1. You create the promise:

```js
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello");
  }, 1000);
});
```

2. `new MyPromise(...)` calls the `constructor`.

3. The function you passed is received as `executor`.

```js
constructor(executor);
```

4. The Promise starts with:

```js
state = "pending";
value = undefined;
reason = undefined;
```

5. The constructor creates its own internal functions:

```js
resolve;
reject;
```

6. Then it calls your executor:

```js
executor(resolve, reject);
```

7. Your executor runs immediately.

8. `setTimeout(...)` is registered.

9. The Promise is still:

```js
state = "pending";
```

10. Then you call:

```js
promise.then((value) => {
  console.log(value);
});
```

11. `.then()` checks the Promise state.

12. State is still:

```js
"pending";
```

13. So `.then()` stores the callback inside:

```js
fulfilledCallbacks;
```

14. After 1 second, `setTimeout` runs.

15. It calls:

```js
resolve("Hello");
```

16. `resolve()` checks that the Promise is still pending.

17. It changes:

```js
state = "fulfilled";
```

18. It stores:

```js
value = "Hello";
```

19. It runs the callbacks stored in:

```js
fulfilledCallbacks;
```

20. Your `.then()` callback receives:

```js
"Hello";
```

21. So this runs:

```js
console.log("Hello");
```

22. If instead this happened:

```js
reject("Error");
```

the Promise would change to:

```js
state = "rejected";
reason = "Error";
```

23. Then rejection callbacks from `.catch()` or the second argument of `.then()` would run.

24. If a `.then()` callback returns something:

```js
return "Hello World";
```

`.then()` creates a **new Promise** and resolves that new Promise with:

```js
"Hello World";
```

25. That is why chaining works:

```js
promise
  .then(() => "A")
  .then((value) => value + "B")
  .then(console.log);
```

Flow:

```text
Promise 1
pending
↓
resolve("Hello")
↓
fulfilled
↓
first .then()
↓
returns "A"
↓
Promise 2 fulfilled with "A"
↓
second .then()
↓
returns "AB"
↓
Promise 3 fulfilled with "AB"
↓
console.log("AB")
```

The simplest mental model is:

```text
1. new Promise(executor)
2. state = pending
3. create resolve/reject
4. run executor(resolve, reject)
5. .then() stores callbacks if still pending
6. resolve(value) -> fulfilled
7. reject(error) -> rejected
8. stored callback runs
9. .then() returns a new Promise
10. returned value becomes the next Promise's value
```

## Promise Constructor

Yes — this is the exact distinction:

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;

    this.status = "active";
  }
}
```

Here:

```js
name;
age;
```

come from constructor parameters.

But:

```js
status;
```

does not.

We create it ourselves with a default value:

```js
this.status = "active";
```

So:

```js
const person = new Person("Ram", 25);
```

becomes roughly:

```js
{
  name: "Ram",
  age: 25,
  status: "active"
}
```

Now Promise is the same idea:

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
  }
}
```

Only this comes from outside:

```js
executor;
```

For example:

```js
const promise = new MyPromise((resolve, reject) => {
  // this function is executor
});
```

But these:

```js
this.state = "pending";
this.value = undefined;
this.reason = undefined;
```

are properties we create ourselves with initial/default values.

Think of this exact comparison:

```js
class Person {
  constructor(name) {
    this.name = name; // from parameter
    this.age = undefined; // created by us
    this.status = "active"; // created by us
  }
}
```

Promise:

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending"; // created by us
    this.value = undefined; // created by us
    this.reason = undefined; // created by us
  }
}
```

So constructor parameters are **not a list of properties you are allowed to create**.

You can create any property inside:

```js
class Test {
  constructor(x) {
    this.x = x;

    this.a = 10;
    this.b = 20;
    this.c = "hello";
    this.d = [];
  }
}
```

Even though constructor only has:

```js
constructor(x);
```

the resulting object has:

```js
{
  x: ...,
  a: 10,
  b: 20,
  c: "hello",
  d: []
}
```

So in `MyPromise`:

```js
constructor(executor);
```

means:

> "The only argument the user passes into the constructor is `executor`."

It does **not** mean:

> "The object can only have an `executor` property."

And actually we don't even do:

```js
this.executor = executor;
```

because we only need to **run** it:

```js
executor(resolve, reject);
```

We don't need to store it.

Yes. When you create a Promise using `new Promise(...)`, the Promise constructor receives an **executor function**.

```js
const promise = new Promise((resolve, reject) => {
  // executor function
});
```

Here:

```js
(resolve, reject) => {
  // ...
};
```

is the **executor function**.

`resolve` and `reject` are **parameters of that executor function**. JavaScript's Promise implementation passes the actual `resolve` and `reject` functions into those parameters.

Conceptually:

```js
function Promise(executor) {
  function resolve(value) {
    // change promise state to fulfilled
  }

  function reject(reason) {
    // change promise state to rejected
  }

  executor(resolve, reject);
}
```

So when you write:

```js
new Promise((resolve, reject) => {
  resolve("Done");
});
```

you can think of it like:

```js
function executor(resolve, reject) {
  resolve("Done");
}

new Promise(executor);
```

The important terminology is:

```text
new Promise(executor)
            ↑
            executor function

executor(resolve, reject)
         ↑        ↑
      parameter parameter

resolve() and reject()
↑
functions provided internally by Promise
```

So **`resolve` and `reject` are not the executor function themselves**. They are functions passed **into** the executor function as arguments.

## Execution Function

The **executor function** is simply the function you give to `new Promise()`.

```js
new Promise((resolve, reject) => {
  console.log("I am the executor function");
});
```

This whole part:

```js
(resolve, reject) => {
  console.log("I am the executor function");
};
```

is the **executor function**.

You can write the exact same thing like this:

```js
function executor(resolve, reject) {
  console.log("I am the executor function");
}

new Promise(executor);
```

So when we say:

```js
new Promise(executor);
```

it means:

> `Promise` receives a function as an argument.

Think of a normal function:

```js
function run(fn) {
  fn();
}

run(() => {
  console.log("hello");
});
```

Here:

```js
() => {
  console.log("hello");
};
```

is a function passed into `run`.

Promise works similarly:

```js
new Promise((resolve, reject) => {
  resolve("done");
});
```

Internally, you can imagine:

```js
function Promise(executor) {
  function resolve(value) {
    console.log("fulfilled:", value);
  }

  function reject(error) {
    console.log("rejected:", error);
  }

  executor(resolve, reject);
}
```

Then:

```js
new Promise((resolve, reject) => {
  resolve("done");
});
```

basically becomes:

```js
executor(resolve, reject);
```

So the flow is:

```text
you write executor function
        ↓

new Promise(executor)
        ↓

Promise receives that function
        ↓

Promise creates resolve and reject
        ↓

Promise calls your function

executor(resolve, reject)
```

The word **executor** just means:

> "the function that Promise immediately executes."

It is not special JavaScript syntax. It is just the name used to describe that callback function.
The key correction is:

**`.then()` itself runs immediately, but its callback does NOT run immediately.**

For your code:

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("done");
  }, 1000);
});

promise.then((result) => {
  console.log(result);
});
```

1. `new Promise(...)` runs.

2. The executor runs immediately.

3. `setTimeout(...)` is registered with Web APIs.

```text
Web APIs
┌─────────────────┐
│ timer: 1000ms   │
└─────────────────┘
```

4. JavaScript does **not wait** for that 1 second. It continues to the next line immediately.

So it reaches:

```js
promise.then((result) => {
  console.log(result);
});
```

5. `.then()` itself executes now.

But it checks the Promise:

```text
state = pending
```

because `resolve("done")` hasn't happened yet.

6. Since the Promise is still pending, the callback is **stored inside the Promise**.

Conceptually:

```js
promise = {
  state: "pending",
  value: undefined,

  fulfilledCallbacks: [
    (result) => {
      console.log(result);
    },
  ],
};
```

This callback does **NOT** enter the microtask queue yet.

This is the important part.

```text
.then(callback)
      ↓
Promise pending?
      ↓
     YES
      ↓
store callback
```

Not:

```text
.then(callback)
      ↓
Microtask Queue ❌
```

7. Then `.catch()` also runs immediately.

```js
.catch((error) => {
  console.log(error);
});
```

Its handler is also associated with the Promise chain, but it doesn't execute.

8. Now all synchronous JavaScript finishes.

```text
Call Stack
----------
empty

Web APIs
--------
timer: still running

Microtask Queue
---------------
empty
```

Notice:

**the `.then()` callback is still NOT in the microtask queue.**

It's effectively waiting for the Promise to settle.

9. After 1 second, the timer finishes.

The timer callback eventually runs:

```js
() => {
  resolve("done");
};
```

10. Now:

```js
resolve("done");
```

changes the Promise:

```text
pending
   ↓
fulfilled
```

and stores:

```js
value = "done";
```

11. **Now** the Promise knows that the `.then()` success callback should run.

So now it schedules the `.then()` reaction into the **microtask queue**.

```text
Microtask Queue
----------------
(result) => {
  console.log(result);
}
```

12. After the current timer callback finishes and the Call Stack becomes empty, the event loop processes the microtask.

```js
console.log("done");
```

So think of it as:

```text
setTimeout registered in Web APIs
        ↓
JavaScript keeps going
        ↓
.then() runs immediately
        ↓
Promise still pending
        ↓
.then callback STORED
        ↓
.catch() runs
        ↓
synchronous code finishes
        ↓
         ... 1 second ...
        ↓
timer callback runs
        ↓
resolve("done")
        ↓
Promise becomes fulfilled
        ↓
stored .then callback
moves to Microtask Queue
        ↓
current Call Stack finishes
        ↓
microtask runs
        ↓
console.log("done")
```

### The rule to remember

```text
.then() method
= runs immediately

.then() callback
= runs later
```

And:

```text
Promise pending
    ↓
callback is STORED

Promise fulfilled/rejected
    ↓
appropriate callback is scheduled
in Microtask Queue
```

So `.then()` does **not wait before being called**. JavaScript reaches `.then()` immediately after registering `setTimeout`. What waits is the **function you gave to `.then()`**.
`fulfilledCallbacks` simply means:

```js
fulfilledCallbacks;
```

= **a list of functions to run when the Promise becomes fulfilled/successful**

Example:

```js
const fulfilledCallbacks = [
  (result) => {
    console.log(result);
  },
];
```

Meaning:

```text
fulfilled = promise succeeded
callbacks = functions waiting to run
```

So:

```js
fulfilledCallbacks;
```

basically means:

```text
"success callbacks waiting for resolve()"
```

When this happens:

```js
resolve("done");
```

those callbacks are run with:

```js
"done";
```

Example:

```js
fulfilledCallbacks.forEach((callback) => {
  callback("done");
});
```

In real JavaScript internals, the closer concept is:

```text
[[PromiseFulfillReactions]]
```

not literally a property named `fulfilledCallbacks`.
