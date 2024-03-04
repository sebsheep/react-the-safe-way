# React state

Will add some state management and interactivity in our apps.

1. Look at `App.tsx`, try to understand what is going on and when
   you have an idea, run the app on your browser:
   ```
   npm install
   npm run dev
   ```
   Go to [http://localhost:5173](http://localhost:5173).
2. What is `() => setCount(count + 1)`? Why don't we use
   `onClick={setCount(count + 1)}` instead?
3. Add a second counter next to the first one. They should be independant.
4. We would like the counters display something like:
   ```
   life: 10  | attack: 0
   ```
   instead of:
   ```
   counter is 10  | counter is 0
   ```
   Add a parameter to the counter such as we can build them with
   ```tsx
   <Counter text="life" />
   ```
5. We'd like to be able to hide attack counter.

   - Add a `showAttack/setShowAttack`state in the
     `App` component (in the same way we have a `counter` state in the `Counter`
     component).
   - Then, add and complete this snippet in the template of the `App` component:
     ```tsx
     <label>
       <input type="checkbox" checked={...} onClick={...} />
       Show attack
     </label>
     ```
   - Finally, use a ternary operator to not display the "attack" component
     when `showAttack` is `false` (you can use `null` for this purpose).
   - Try it! increase life and attack, hide the attack, show it back... 😱 The
     attack state is reinitialized!

6. The issue is that if you don't render a component, this component is totally
   removed, then when it appears again, it is initialized at the default value.

   We are touching here the main downside of having the state scattered among
   multiple components: it is difficult to maintain it correctly and can lead to
   sneaky bugs really hard to solve.

   **Quick solution**: add a `key` property to the counters, e.g. like:

   ```tsx
   <Counter key="the-life-counter" text="life" />
   ```

   (you don't have to add this prop to the component definition, `key` is
   defined by React)

   The key can be anything you want, it just has to be unique. It helps React
   to associate a component to a state.
   Add a key to the "life" and the "attack" counters.

   **More robust solution**

   In most cases, the cleanest and most reliable solution is to "lift" the state
   one level up. That is, the state will be carried by the `App` component solely
   instead of having every component defining a state. That way, you components
   will be "pure" and so easier to reason about.

   - Remove the `useState` from the `Counter` component, and add `counter`
     and `setCounter` as props.
   - Add two states in the `App` component: `life/setLife` and
     `attack/setAttack`. Pass them to their corresponding `Counter` component.

# What did we learn?

- How to use `useState`.
- Dealing with _event handler_ like `onClick`.
- Removing a component from the tree destroy its state.
- ... Except if it has a `key` attribue.
- A solid solution to avoid bugs is to lift state in the parent component.
