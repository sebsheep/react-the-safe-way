import { useReducer } from "react";

type State = { count: number };

type Action = { type: "Increment" } | { type: "Decrement" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "Decrement":
      return { ...state, count: state.count - 1 };
    case "Increment":
      return { ...state, count: state.count + 1 };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <h1>Counter with reducer</h1>
      <div>
        <button onClick={() => dispatch({ type: "Increment" })}>+</button>
      </div>
      <div>{state.count}</div>
      <div>
        <button onClick={() => dispatch({ type: "Decrement" })}>-</button>
      </div>
    </>
  );
}

export default App;
