const states = [];
let currentIndex = 0;

function createUseState(initialValue) {
  const index = currentIndex;

  // Initialize state only the first time
  if (states[index] === undefined) {
    states[index] = initialValue;
  }

  function setState(newValue) {
    states[index] = newValue;
    render();
  }

  currentIndex++;

  return [states[index], setState];
}

function App() {
  currentIndex = 0;

  const [count, setCount] = createUseState(0);
  const [name, setName] = createUseState("Apsara");

  console.log(count);
  console.log(name);

  return {
    count,
    name,
    setCount,
    setName,
  };
}

function render() {
  const app = App();

  console.log("Rendered:", app.count, app.name);
}

const app = App();

app.setCount(10);
app.setName("John");
