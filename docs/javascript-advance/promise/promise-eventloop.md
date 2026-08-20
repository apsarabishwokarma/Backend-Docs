For this exact code:

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;

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

### Step by step

1. JavaScript starts executing the script.

2. This goes into the **Call Stack**:

```js
new Promise(...)
```

3. The Promise constructor runs immediately.

4. The Promise is created with internal state roughly like:

```js
{
  state: "pending",
  value: undefined,
  reason: undefined
}
```

5. The Promise constructor creates internal functions:

```js
resolve;
reject;
```

6. The executor runs immediately:

```js
(resolve, reject) => {
  setTimeout(...);
}
```

So the executor itself runs in the **Call Stack**.

7. JavaScript reaches:

```js
setTimeout(() => {
  // ...
}, 1000);
```

8. `setTimeout` is handled by the browser environment, not by the JavaScript engine itself.

So the timer is registered in **Web APIs**.

```text
CALL STACK
----------
setTimeout(...)

        ↓

WEB APIs
--------
Timer: 1000ms
```

9. The `setTimeout` call finishes and leaves the Call Stack.

10. The Promise executor finishes.

The Promise is still:

```js
state = "pending";
```

because `resolve()` or `reject()` has not been called yet.

11. Now:

```js
.then((result) => {
  console.log("Resolved:", result);
})
```

runs.

12. Since the Promise is still pending, `.then()` does not run the callback yet.

The Promise stores the callback internally.

Roughly:

```js
fulfilledCallbacks = [
  (result) => {
    console.log("Resolved:", result);
  },
];
```

13. `.then()` returns a new Promise.

So conceptually:

```js
const promise2 = promise1.then(...);
```

14. Then:

```js
.catch((error) => {
  console.log("Rejected:", error);
});
```

is attached to that new Promise.

`.catch()` is basically:

```js
.then(undefined, onRejected);
```

15. The main synchronous code is now finished.

The **Call Stack is empty**.

At this moment:

```text
CALL STACK
----------
empty


WEB APIs
--------
setTimeout timer running


MICROTASK QUEUE
---------------
empty


TASK QUEUE
----------
empty
```

16. After about 1000ms, the timer finishes in Web APIs.

The callback:

```js
() => {
  const success = true;

  if (success) {
    resolve("done");
  } else {
    reject("failed");
  }
};
```

is moved to the **Task Queue** / **Macrotask Queue**.

```text
WEB APIs
--------
timer finished

        ↓

TASK QUEUE
----------
setTimeout callback
```

17. The Event Loop checks:

```text
Is Call Stack empty?
```

Yes.

So it moves the timer callback into the Call Stack.

```text
CALL STACK
----------
setTimeout callback
```

18. This executes:

```js
const success = true;
```

19. Then:

```js
if (success)
```

is true.

So this runs:

```js
resolve("done");
```

20. `resolve("done")` changes the original Promise:

```js
state = "fulfilled";
value = "done";
```

So now:

```js
{
  state: "fulfilled",
  value: "done"
}
```

21. But `.then()` does **not** run immediately inside `resolve()`.

Promise callbacks are scheduled in the **Microtask Queue**.

So this callback:

```js
(result) => {
  console.log("Resolved:", result);
};
```

gets queued as a microtask.

```text
MICROTASK QUEUE
---------------
then callback
```

22. The `setTimeout` callback finishes.

It leaves the Call Stack.

```text
CALL STACK
----------
empty


MICROTASK QUEUE
---------------
then callback
```

23. The Event Loop sees that the Call Stack is empty.

Before taking another macrotask, JavaScript processes the **Microtask Queue**.

So the `.then()` callback goes into the Call Stack.

```js
(result) => {
  console.log("Resolved:", result);
};
```

`result` is:

```js
"done";
```

24. This runs:

```js
console.log("Resolved:", "done");
```

Output:

```text
Resolved: done
```

25. The `.then()` callback returns:

```js
undefined;
```

because you did not explicitly return anything.

So the Promise returned by `.then()` becomes fulfilled with:

```js
undefined;
```

26. Because that Promise succeeded, `.catch()` does not run.

Final output:

```text
Resolved: done
```

---

### Full flow

```text
1. Script starts
        ↓

2. new Promise(...)
   goes to Call Stack
        ↓

3. Promise created
   state = pending
        ↓

4. executor(resolve, reject)
   runs immediately
        ↓

5. setTimeout(...)
   registered in Web APIs
        ↓

6. executor finishes
        ↓

7. .then(...)
   callback stored
        ↓

8. .catch(...)
   rejection callback stored
        ↓

9. Call Stack empty
        ↓

10. Timer completes after 1 second
        ↓

11. Timer callback goes to Task Queue
        ↓

12. Event Loop moves it to Call Stack
        ↓

13. success = true
        ↓

14. resolve("done")
        ↓

15. Promise:
    pending -> fulfilled
    value = "done"
        ↓

16. .then() callback goes to Microtask Queue
        ↓

17. Timer callback finishes
        ↓

18. Call Stack empty
        ↓

19. Event Loop checks Microtask Queue
        ↓

20. .then() callback enters Call Stack
        ↓

21. console.log("Resolved:", "done")
        ↓

22. Output:
    Resolved: done
```

### The four important places

```text
┌─────────────────────────┐
│       CALL STACK        │
│                         │
│ Executes JavaScript     │
└────────────┬────────────┘
             │
             │ setTimeout
             ▼
┌─────────────────────────┐
│        WEB APIs         │
│                         │
│ timers                  │
│ fetch                   │
│ DOM events              │
└────────────┬────────────┘
             │
             │ timer finished
             ▼
┌─────────────────────────┐
│       TASK QUEUE        │
│                         │
│ setTimeout callbacks    │
│ DOM event callbacks     │
└────────────┬────────────┘
             │
             │ Event Loop
             ▼
┌─────────────────────────┐
│       CALL STACK        │
└─────────────────────────┘
```

Promises have a separate higher-priority queue:

```text
resolve()
   ↓
.then() callback
   ↓
MICROTASK QUEUE
   ↓
CALL STACK
```

So remember:

```text
setTimeout callback
    -> Task Queue

Promise .then()
    -> Microtask Queue
```

And JavaScript processes them in this order:

```text
1. Call Stack
2. Microtask Queue
3. Task / Macrotask Queue
```

For your example, the exact important flow is:

```text
Call Stack
   ↓
new Promise
   ↓
executor
   ↓
setTimeout
   ↓
Web APIs
   ↓
1 second
   ↓
Task Queue
   ↓
Call Stack
   ↓
resolve("done")
   ↓
Microtask Queue
   ↓
.then()
   ↓
Call Stack
   ↓
console.log("Resolved: done")
```
