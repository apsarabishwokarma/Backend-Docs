const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== PENDING) return;

      if (value instanceof MyPromise) {
        value.then(resolve, reject);
        return;
      }

      this.state = FULFILLED;
      this.value = value;

      queueMicrotask(() => {
        this.fulfilledCallbacks.forEach((callback) => callback(value));
      });
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;

      this.state = REJECTED;
      this.reason = reason;

      queueMicrotask(() => {
        this.rejectedCallbacks.forEach((callback) => callback(reason));
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;

    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const nextPromise = new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.value);

            resolvePromiseResult(nextPromise, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const result = onRejected(this.reason);

            resolvePromiseResult(nextPromise, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.state === FULFILLED) {
        handleFulfilled();
      }

      if (this.state === REJECTED) {
        handleRejected();
      }

      if (this.state === PENDING) {
        this.fulfilledCallbacks.push(handleFulfilled);
        this.rejectedCallbacks.push(handleRejected);
      }
    });

    return nextPromise;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),

      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        }),
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(values) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(values);
      const results = new Array(items.length);

      if (items.length === 0) {
        resolve([]);
        return;
      }

      let completed = 0;

      items.forEach((item, index) => {
        MyPromise.resolve(item).then((value) => {
          results[index] = value;
          completed++;

          if (completed === items.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }

  static race(values) {
    return new MyPromise((resolve, reject) => {
      for (const value of values) {
        MyPromise.resolve(value).then(resolve, reject);
      }
    });
  }

  static allSettled(values) {
    return new MyPromise((resolve) => {
      const items = Array.from(values);
      const results = new Array(items.length);

      if (items.length === 0) {
        resolve([]);
        return;
      }

      let completed = 0;

      const finish = () => {
        completed++;

        if (completed === items.length) {
          resolve(results);
        }
      };

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(
          (value) => {
            results[index] = {
              status: "fulfilled",
              value,
            };

            finish();
          },

          (reason) => {
            results[index] = {
              status: "rejected",
              reason,
            };

            finish();
          },
        );
      });
    });
  }

  static any(values) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(values);
      const errors = new Array(items.length);

      if (items.length === 0) {
        reject(new AggregateError([], "All promises were rejected"));

        return;
      }

      let rejectedCount = 0;

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(
          resolve,

          (error) => {
            errors[index] = error;
            rejectedCount++;

            if (rejectedCount === items.length) {
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          },
        );
      });
    });
  }
}

function resolvePromiseResult(promise, result, resolve, reject) {
  if (promise === result) {
    reject(new TypeError("Chaining cycle detected for promise"));

    return;
  }

  if (result instanceof MyPromise) {
    result.then(resolve, reject);
    return;
  }

  if (
    result !== null &&
    (typeof result === "object" || typeof result === "function")
  ) {
    let then;

    try {
      then = result.then;
    } catch (error) {
      reject(error);
      return;
    }

    if (typeof then === "function") {
      let called = false;

      try {
        then.call(
          result,

          (value) => {
            if (called) return;

            called = true;

            resolvePromiseResult(promise, value, resolve, reject);
          },

          (reason) => {
            if (called) return;

            called = true;
            reject(reason);
          },
        );
      } catch (error) {
        if (called) return;

        called = true;
        reject(error);
      }

      return;
    }
  }

  resolve(result);
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello");
  }, 1000);
});

promise
  .then((value) => {
    console.log(value);

    return value + " World";
  })
  .then((value) => {
    console.log(value);

    return new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(value + "!");
      }, 500);
    });
  })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Finished");
  });

MyPromise.all([
  MyPromise.resolve(1),
  MyPromise.resolve(2),
  MyPromise.resolve(3),
]).then(console.log);
