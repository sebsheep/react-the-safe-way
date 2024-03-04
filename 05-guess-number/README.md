# Guess my number

You're gonna create a simple game consisting in finding a number chosen by
the computer.

The game runs like this:

- The computer randomly choose a number between 1 and 100.
- The user propose a number.
- The computer says if it's more, less or a correct guess. If it's not
  correct, the user can propose a new number. If it's correct, the
  computer displays a congratulation message with the number of trials.

1.  First, create a project with Vite. Look at https://vitejs.dev/guide/ to know
    how to create a react project with Vite and create the `guess-my-number`
    project.

2.  We'll use only one state with all the data in it, created by a `useReducer`
    hook. Don't create any component for now. Create a `State` type that stores:

    - the number to find.
    - the previous proposal (which can not exist when the app is starting, so
      its type has to represent this possibility),
    - the count of previous proposals,
    - the state of the text input for the user entering a number.

    Note that you can just store the list of all previous proposals to match the
    first two criteria. This would also allow to display the history of
    all the moves, which is not mandatory.

    Create an `Action` type as well which models either:

    - typing in the text input,
    - or submitting a number.

3.  Write the `reducer(state:State, action: Action): State` function. Note
    you don't have to bother if the user win or not in this function.
4.  Write a react component that will initialize the state with `useReducer`.
    Make the following working step by step (feel free to introduce new
    component if you think it's appropriate):

    - randomly initalize the number to find with `math.floor(random()*100)`.
    - display a text input where the user can type something in and this
      value is persisted in the state.
    - display a "submit proposal" button.
      _If we cannot parse the input as an integer_ (see below), make the button
      disabled and the `onClick` event undefined.

      _Otherwise_, make the `onClick` dispatch the submit event.

      You can use this function to safely parse a string to an int:

      ```ts
      /**
       * Parses a string into an integer safely.
       *
       * It aims to accurately parse strings into integers, mitigating the common
       * issue where parseInt("12oijva") results in 12 and parseInt("aevoij")
       * returns NaN.
       */
      function safeParseInt(s: string): number | null {
        try {
          let n = BigInt(s);
          if (
            n > BigInt(Number.MIN_SAFE_INTEGER) &&
            n < BigInt(Number.MAX_SAFE_INTEGER)
          ) {
            return Number(n);
          } else {
            return null;
          }
        } catch {
          return null;
        }
      }
      ```

    **Note**: since we modeled our action as "submitting a number"
    instead of "submitting a string", typescript forces us to convert
    the input.

    - Display a message based on the state:

      - if no proposal was made, display "Guess my number!"
      - if the previous proposal was incorrect display something like
        > The number to find is greater than 42!
      - if the previous proposal is correct, display something like

        > Congratulations! You succeeded in only 3 guesses!

        In this case, hide the text input and submit button and
        display a "Restart" button instead.

5.  Add an `onClick` event handler on this "Restart" button which generates a new
    random value and dispatch an action `NewGameClicked` with a payload `numberTofind` (keep in mind that `reducer` should be pure, so the random
    generation has to happen in the event handler).
    This should bother the TS compiler:

    - this `NewGameClicked` action is not defined yet. Define it in your `Action`
      type.
    - now, the compiler should yield about the reducer because there is a case
      where we don't return a `State`!

    **Note**: the compiler guided us for those last features, telling us what
    we have to do. I call this "compiler driven programming". It's a really
    powerful way to program since you cannot forget any place of the code you
    have to change something.

    Like all techniques, it asks for a bit a pratice
    to be effective. The key idea is to ask yourself: "what is the smaller
    code modification I can perform to make the compiler guide me up to the
    final solution?". In our case, we added a button and starting calling the
    action before defining it - all the rest is mechanical.

6.  Now your game is working, transform it in a successful startup and replace
    one or all the GAFAMs.

## What did we learn?

Since it's more a tiny project than a lesson, you shouldn't have see anything
new.

However, I hope you felt how we can use typing as a "guide" to produce correct
software!
