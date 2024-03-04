# React with reducer

This section introduces a new way of dealing with state.

## Part 1: counter again, but with some fancy!

1. Look at `AppCounter.tsx`. Try to understand all what's going on,
   including the type annotations.
2. What does `{...state, counter: 4}`?
3. Add a new button "Reset" which resets the counter to 0.
4. - Add a field `fancy: null | "red" | "blue"` to the state. Also add a  
     `{ type: "FancyUpdated", fancy: null | "red" | "blue" }` action.
   - Add 3 buttons: "no fancy", "fancy in blue!", "fancy in red!", each one
     emitting the corresponding action.
   - Add the corresponding case in the `reducer` function.
   - Add the following function:

     ```ts
     function fancyToStyle(
       fancy: null | "red" | "blue"
     ): CSSProperties | undefined {
       switch (fancy) {
         case null:
           return undefined;
         case "red":
           return {
             color: "red",
             fontWeight: "bold",
             border: "2px red solid",
             width: "20px",
             textAlign: "center",
           };
         case "blue":
           return { color: "blue", fontWeight: "bold" };
       }
     }
     ```

   - Add the styling to the counter display with:

     ```tsx
     <div style={fancyToStyle(state.fancy)}>{state.count}</div>
     ```

Note that the `reducer` has to be **pure**: especially it shouldn't modify
the `state` in the argument, that's why we prefer use `{...state, count: 42}`
syntax.

The `useReducer` version is more verbose than the `useState` but it has
strong advantages:

- `useState` is very easy to read when the state updates are simple. When
  they get more complex, they can bloat your component’s code and make it
  difficult to scan. In this case, `useReducer` lets you cleanly separate
  the how of update logic from the what happened of event handlers.
- A reducer is a pure function that doesn’t depend on your component. This
  means that you can export and test it separately in isolation. While
  generally it’s best to test components in a more realistic environment, for
  complex state update logic it can be useful to assert that your reducer
  returns a particular state for a particular initial state and action.

## Part2: autofill

For the second part, in the `main.tsx` file change the import in order to
import `AppAutoFill` instead of `AppCounter`.

This component is a tiny part of an app where user can fill a label
and a short label. This is already working.

Note that in the `onInput`, we use the arguement `event` describing the event
which just happened. We can extract the value we just typed with
`event.currentTarget.value`.

We'd like automagically fill the second field when typing in the first one
up to 3 characters in uppercase. E.g. if the label is "Bicycle", the short
label should be "BIC".

As soon as the user directly changed the short label field, the short label
field shouldn't be automagically updated.

1. Change the `"LabelUpdated"` case in the reducer to automagically fill the
   the short label field.

   _Hints:_ look at [`substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)
   and the [`toUpperCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
   methods.

2. Add a `alreadyTypedInShort: boolean` field in the state, initialize it
   correctly, and change the `"LabelShortUpdated"` to update this field in a
   sensitive manner.
3. Modify the `"LabelUpdated"` case to only update the short label if
   `alreadyTypedInShort` is `true`.
4. The functions in the `onInput` props tend to be a bit long and hard to read.
   Additionnaly, we'll see pretty soon that we'll do non trivial stuff in those
   functions. So, it is customary to extract them and name them `handleActionName`; we call them **event handlers**. Do it! Create a `handleLabelUpdated` and a `handleShortLabelUpdated` in the `App` component.

   > **Note**: the `reducer` function is pure.
   > However, the _event handlers_ are not pure at all: they call
   > `dispatch` which will update the state using the `reducer` function.
   > We'll see later that we can also perform side effects in those event
   > handlers.

## What did we learn?

- Spread operator: `{...state, field: 42}`.
- Using `useReducer` which is an alternative to `useState` to manage the state.
- `useReducer` needs a `reducer(s: State, a: Action): State` function which
  describe how to react to actions hapening.
- This reducer has to be _pure_.
- We can use the `style` attribute of a component to use computed style.
- Writing **event handlers**, which are _not_ pure.
- Dealing with `onInput` event handlers to get text typed by the user.
