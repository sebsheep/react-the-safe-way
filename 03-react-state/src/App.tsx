import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>count is {count}</button>;
}

function App() {
  return (
    <>
      <h1>Role Play Game</h1>
      <Counter />
    </>
  );
}

export default App;
