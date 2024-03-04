import { useReducer } from "react";
import { Lang } from "./Lang";
import { Item } from "./Item";
import { ItemList } from "./ItemList";

type State = {
  lang: Lang;
};

type Action = { type: "LangUpdated"; lang: Lang };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LangUpdated":
      return { ...state, lang: action.lang };
  }
}

const ITEMS: Array<Item> = [
  { kind: "shoes", price: 54, name: "Abibas", id: "a5ed41" },
  { kind: "shoes", price: 62, name: "Nyke", id: "b6gf28" },
  { kind: "bike", price: 200, name: "Traik", id: "c7ht32" },
  { kind: "scooter", price: 120, name: "Rezor", id: "d8ju45" },
  { kind: "bike", price: 300, name: "Unspecialized", id: "e9ol36" },
  { kind: "scooter", price: 80, name: "Xaiomi", id: "f0pl79" },
  { kind: "shoes", price: 45, name: "Mupa", id: "g1vb82" },
  { kind: "bike", price: 150, name: "Gian", id: "h2cn73" },
  { kind: "scooter", price: 95, name: "Sigway", id: "i3xd64" },
  { kind: "bike", price: 180, name: "Connandole", id: "j4zk55" },
  { kind: "shoes", price: 60, name: "Old Balance", id: "k5hy46" },
  { kind: "scooter", price: 110, name: "Mocri", id: "l6af37" },
];

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, {
    lang: "FR",
  });

  return (
    <>
      <h1>A world of cats</h1>
      <div>
        <button onClick={() => dispatch({ type: "LangUpdated", lang: "FR" })}>
          FR
        </button>
        <button onClick={() => dispatch({ type: "LangUpdated", lang: "EN" })}>
          EN
        </button>
        <div>
          <ItemList items={ITEMS} />
        </div>
      </div>
    </>
  );
}

export default App;
