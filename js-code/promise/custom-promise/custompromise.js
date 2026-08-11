const PromiseState = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class MyPromise {
  _state = PromiseState.PENDING;

  _successCallbackHandlers = [];
  _failureCallbackHandlers = [];

  _value = undefined;
  _reason = undefined;

  constructor(executor) {
    try {
      executor(
        this._promiseResolver.bind(this),
        this._promiseRejector.bind(this),
      );
    } catch (error) {
      this._promiseRejector(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    return new MyPromise((resolve, reject) => {
      const run = (handler, arg) => {
        queueMicrotask(() => {
          try {
            resolve(handler(arg));
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this._state === PromiseState.FULFILLED) run(onFulfilled, this._value);
      if (this._state === PromiseState.REJECTED) run(onRejected, this._reason);

      if (this._state === PromiseState.PENDING) {
        this._successCallbackHandlers.push((value) => run(onFulfilled, value));
        this._failureCallbackHandlers.push((reason) => run(onRejected, reason));
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      },
    );
  }

  _promiseResolver(value) {
    if (this._state !== PromiseState.PENDING) return;

    if (value instanceof MyPromise) {
      value.then(
        this._promiseResolver.bind(this),
        this._promiseRejector.bind(this),
      );
      return;
    }

    this._state = PromiseState.FULFILLED;
    this._value = value;
    console.log("MyPromise: PENDING -> FULFILLED", value);

    this._successCallbackHandlers.forEach((callback) => {
      callback(value);
    });
  }

  _promiseRejector(reason) {
    if (this._state !== PromiseState.PENDING) return;

    this._state = PromiseState.REJECTED;
    this._reason = reason;
    console.log("MyPromise: PENDING -> REJECTED", reason);

    this._failureCallbackHandlers.forEach((callback) => {
      callback(reason);
    });
  }
}

module.exports = MyPromise;

// The examples below only run when this file is executed directly
// (`node custompromise.js`) — not when another file `require`s it.
if (require.main === module) {
  // =============================================
  // Example 1: resolves after N seconds
  // =============================================

  const wait = (seconds) =>
    new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve(seconds);
      }, seconds * 1000);
    });

  // =============================================
  // Example 2: resolves immediately
  // =============================================

  function customPromise() {
    return new MyPromise((resolve, reject) => {
      resolve("resolved value");
    });
  }

  customPromise()
    .then((value) => {
      console.log("custom promise resolved:", value);
    })
    .catch((reason) => {
      console.log("custom promise rejected:", reason);
    });

  // =============================================
  // Example 3: rejects immediately
  // =============================================

  function rejectedPromise() {
    return new MyPromise((resolve, reject) => {
      reject("something failed");
    });
  }

  rejectedPromise()
    .then((value) => {
      console.log("resolved:", value);
    })
    .catch((reason) => {
      console.log("rejected:", reason);
    })
    .finally(() => {
      console.log("rejected promise finished");
    });

  // =============================================
  // Example 4: chaining propagates return values now
  // =============================================

  wait(5)
    .then((value) => {
      console.log("promise resolved:", value);
      return value * 2;
    })
    .then((value) => {
      console.log("promise resolved again:", value);
    })
    .catch((reason) => {
      console.log("promise rejected:", reason);
    })
    .finally(() => {
      console.log("All Good");
    });
}
