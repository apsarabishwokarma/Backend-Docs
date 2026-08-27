const PromiseState = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class MyPromise {
  _state = PromiseState.PENDING;

  _successCallbackHandlers = [];
  _failureCallbackHandlers = [];
  _finallyCallbackHandlers = [];

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

  then(handlerFn) {
    if (this._state === PromiseState.FULFILLED) {
      handlerFn(this._value);
    } else if (this._state === PromiseState.PENDING) {
      this._successCallbackHandlers.push(handlerFn);
    }

    return this;
  }

  catch(handlerFn) {
    if (this._state === PromiseState.REJECTED) {
      handlerFn(this._reason);
    } else if (this._state === PromiseState.PENDING) {
      this._failureCallbackHandlers.push(handlerFn);
    }

    return this;
  }

  finally(handlerFn) {
    if (this._state !== PromiseState.PENDING) {
      handlerFn();
    } else {
      this._finallyCallbackHandlers.push(handlerFn);
    }

    return this;
  }

  _promiseResolver(value) {
    if (this._state !== PromiseState.PENDING) return;

    this._state = PromiseState.FULFILLED;
    this._value = value;

    this._successCallbackHandlers.forEach((callback) => {
      callback(value);
    });

    this._finallyCallbackHandlers.forEach((callback) => {
      callback();
    });
  }

  _promiseRejector(reason) {
    if (this._state !== PromiseState.PENDING) return;

    this._state = PromiseState.REJECTED;
    this._reason = reason;

    this._failureCallbackHandlers.forEach((callback) => {
      callback(reason);
    });

    this._finallyCallbackHandlers.forEach((callback) => {
      callback();
    });
  }
}

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
// Example 4
// =============================================

wait(5)
  .then((value) => {
    console.log("promise resolved:", value);
  })
  .then((value) => {
    console.log("promise resolved again:", value);
  })
  .catch((reason) => {
    console.log("promise rejected:", reason);
  })
  .then((value) => {
    console.log("promise resolved again-3:", value);
  })
  .catch((reason) => {
    console.log("promise rejected again:", reason);
  })
  .finally(() => {
    console.log("All Good");
  });
