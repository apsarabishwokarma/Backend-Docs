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
