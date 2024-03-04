import { useReducer } from "react";

const GET_CAT_URL =
  "https://api.giphy.com/v1/gifs/random?api_key=kOZdCy0KDR2n8Y83kawP0zdqUMqpHYRj&tag=cat";

type State = { cat: Cat | null; isError: boolean; isLoading: boolean };

type Cat = { title: string; url: string };

function catFromGiphy(json: any): Cat {
  return {
    title: json.title,
    url: json.data.images.original.url,
  };
}

type Action =
  | { type: "CatReceived"; cat: Cat }
  | { type: "NewCatClicked" }
  | { type: "CatFetchingFailed" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NewCatClicked":
      return { ...state, isLoading: true };
    case "CatReceived":
      return { ...state, cat: action.cat, isLoading: false };
    case "CatFetchingFailed":
      return { ...state, isError: true };
  }
}

function App(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, {
    cat: null,
    isError: false,
    isLoading: false,
  });

  async function handleCatClick() {
    // This first dispatch occurs immediately after
    // the button is clicked
    dispatch({ type: "NewCatClicked" });
    try {
      const response = await fetch(GET_CAT_URL);
      const json = await response.json();
      const cat = catFromGiphy(json);
      // This dispatch occurs after the data has been fetched
      dispatch({ type: "CatReceived", cat });
    } catch {
      dispatch({ type: "CatFetchingFailed" });
    }
  }

  return (
    <>
      <h1>A world of cats</h1>
      <div>
        <button onClick={handleCatClick} disabled={state.isLoading}>
          Load a new cat
        </button>
        <div>
          <DisplayCat state={state} />
        </div>
      </div>
    </>
  );
}

function DisplayCat({ state }: { state: State }) {
  if (state.isError) {
    return <strong>Oups, something went wrong, try again</strong>;
  } else if (state.isLoading) {
    return <i>Wait a minute, I'm loading!</i>;
  } else if (state.cat !== null) {
    return (
      <>
        <h2>{state.cat.title}</h2>
        <img src={state.cat.url} />
      </>
    );
  }
}

export default App;
