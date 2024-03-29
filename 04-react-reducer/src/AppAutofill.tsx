import { useReducer } from "react";

type State = { label: string; shortLabel: string };

type Action =
  | { type: "LabelUpdated"; value: string }
  | { type: "ShortLabelUpdated"; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LabelUpdated":
      return { ...state, label: action.value };
    case "ShortLabelUpdated":
      return { ...state, shortLabel: action.value };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { label: "", shortLabel: "" });

  return (
    <>
      <h1>Autofill</h1>
      <label>
        Label
        <input
          value={state.label}
          onInput={(event) =>
            dispatch({ type: "LabelUpdated", value: event.currentTarget.value })
          }
        />
      </label>
      <label>
        Label short
        <input
          value={state.shortLabel}
          onInput={(event) =>
            dispatch({
              type: "ShortLabelUpdated",
              value: event.currentTarget.value,
            })
          }
        />
      </label>
      <hr />
      <p>Label</p>
      <strong>{state.label}</strong>
      <p>Short Label</p>
      <strong>{state.shortLabel}</strong>
    </>
  );
}

export default App;
