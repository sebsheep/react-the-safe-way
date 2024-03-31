# `useEffect` and websockets

The goal of this lesson is to build a minimalist chat application.

We'll need websockets which is an "external system" to React.
The way to deal with such external systems in React is to use
the `useEffect`.

## Pass a function to `setState`

Before we dive into `useEffect`, let's explore `useState` again.

Remember we had this component in lesson 3:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>count is {count}</button>;
}
```

What does happen if we do:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => {
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
      }}
    >
      count is {count}
    </button>
  );
}
```

Is `count` incremented by `3` at every click? Try it out in the `03-react-state` folder

No! Because `count` here is not mutated during the rendering. So those
calls are equivalent to

```ts
setCount(0 + 1);
setCount(0 + 1);
setCount(0 + 1);
```

which finally sets the `count` at `1`.

That said, we can pass a function to `setCount` to _update_ the value.
So we could rewrite our initial component as:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
  );
}
```

Now if we have:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => {
        setCount((c) => c + 1);
        setCount((c) => c + 1);
        setCount((c) => c + 1);
      }}
    >
      count is {count}
    </button>
  );
}
```

The `setCount` calls will be stacked and all the functions will be called, incrementing
the counter by 3 at every click.

> I personally consider `useState` as low level code when interacting outside
> the "React world", as you'll see in the next section with the timer stuff.
>
> For "normal" state management inside React, I prefer using `useReducer` as it forces
> you to have a unique function to update the state with all the possible actions
> clearly defined.
>
> Most of the time, we can build a wrapper around these `useState` and other low level
> details. In the "Websocekts" section, we'll use a library providing this wrapper.

## `useEffect`

After having read the following, look the video of the course linked below.
Try to do the exercise without looking at the correction (create a new project with
`npm create vite@latest useEffect -- --template react-ts` if needed). Ask the teacher
if you are in troubles and only look the correction in the video when your program is
working.

> **Warning** the first comment of the lesson gives a correction which is not entirely
> correct!

You might need the following Javascript functions:

```js
// the function given in the first parameter will be called every 1000 ms, that is 1s
const timer = setInterval(() => console.log("hello"), 1000);

// Some time passes ...

// Delete the timer
clearInterval(timer);
```

[Now go look at the video](https://grafikart.fr/tutoriels/react-hook-useeffect-1328).

I'd like to emphasize some insights given in the video:

- only use `useEffect` to interact with "outside React".
  [You might not need an effect](https://react.dev/learn/you-might-not-need-an-effect).
- every reactive variable used inside the effect handler should be given as dependency
  (the second parameter of `useEffect` which is an array).
- clean your effects by returning function

## Websockets

Finally, we'll build the chat server! Get ready to dethrone WhatsApp!

### Chat Server

Open a new terminal, move to `chatServer` and run:

```
npm install
npm run dev
```

Which should run a websocket server on the port 4242. Keep this terminal open.

You can take a quick look at `chatServer/index.js` to understand how it works
(building a websocket server is not a goal of the course and the proposed implementation
only aims to be as simple as possible and might not be suitable in production).

When a new connection arrives, the server sends a first `Welcome` message to the
new connection indicating its user id and a funny name associated to it. It also broadcast
a `Joined` message with the same data to all others connected users.

When a user sends a message, it is automatically broadcasted to all other users,
including the sender with a `Message` tag.

Finally when a user disconnects (which occurs if they close the tab), a `Left` message
is sent indicating the user id and its funny name.

Note that this server artificially waits 200ms before sending message to emulate
network delay.

### Chat Client

Move now to `chatClient`. To use a handy websocket library, we already performed:

```
npm install --save react-use-websocket@3.0.0
```

1. Look at the code in `App.tsx` and try to predict what will happen. Open
   http://localhost:5173 in your browser.
   Observe the logs in the browser and in the terminal where the Websocket server
   is running.

   Open/close/reload http://localhost:5173 in multiple other tabs, and check out all the
   logs (in browser and in the terminal running the websocekt server).

2. We'll use the following types:

   ```ts
   type WebsocketEvent =
     | { kind: "Welcome"; userId: string; userName: string }
     | LogMessage;

   type LogMessage =
     | { kind: "Joined"; userId: string; userName: string }
     | {
         kind: "Message";
         userId: string;
         userName: string;
         message: string;
       }
     | { kind: "Left"; userId: string; userName: string };
   ```

   This will make sense a bit later: in the state we'll store all the `LogMessage`
   in an array and we will treat the `Welcome` message apart.

   Write a `const WEBSOCKET_EVENT_SCHEMA: z.ZodType<WebsocketEvent>` Zod schema (Zod is
   already installed) and decode the payload in the `useEffect` that handles
   `lastJsonMessage` changes.

3. Here are the `State` and `Action` types we'll use:

   ```tsx
   type State = {
     currentUser: null | { id: string; name: string };
     eventLog: Array<LogMessage>;
   };

   type Action = { kind: "WebsocketEventReceived"; event: WebsocketEvent };
   ```

   **Question**: why did I use `currentUser: null | { id: string; name: string };`
   instead of two fields: `currentUserId: null | string; currentUserName: null | string`?
   What impossible state are we preventing?

   Write an appropriate `reducer(state: State, action: Action): State` function;
   when `Welcome` is received, update `currentUser` accordingly. With all other
   events, just add them to the `eventLog`.

   **Keep in mind**: `reducer` should be _pure_, meaning you _cannot_ use
   `.push` to modify an the `eventLog` array. You can instead use the widespread
   operator to build a new array with additional elements:

   ```tsx
   const t = [1, 2, 3];
   const s = [...t, 4, 5]; // -> s == [1, 2, 3, 4, 5]
   ```

   Add a `useReducer` in the App component and use the `dispatch` in the `useEffect` in
   which you already decoded the websocket message.

   Use the `state` to either display "You don't have user name yet..." or "Logged in as
   **Hairy Giraffe**".

4. Add the following snippet in the view:

   ```jsx
   <input
     value={state.userInput}
     onChange={(e) =>
       dispatch({ kind: "UserInputUpdated", input: e.currentTarget.value })
     }
   />
   ```

   And modify `State`, `Action` and `reducer` to make the whole code compile.

5. Wrap this `<input>` tag in a `<form>` one.
   Test the app in your browser: hit the `Enter` key in the input after having entered
   some text. This should "submit" the form, triggering a page reload.

   You can prevent this page reload by adding an `onSubmit` attribute:

   ```jsx
   <form onSubmit={(e) => {e.preventDefault();} }>
   ```

   - Test the code above, nothing should happen when you hit `Enter`.
   - In the `onSubmit` attribute, add a call to `sendJsonMessage` to actually
     send the message to the server.

     _Tip_: `.trim()` the input and only send a message if the trimmed input is not
     empty.

   - Check you actually see this message on the server logs and in the browser logs
     in other tabs.
   - Currently, the message in the input stays the same when we submit. We'd like it to
     be erased on submission. Add a `UserSubmitted` action, dispatch it in the `onSubmit`
     and use the `reducer` to empty the `userInput` field in the state.

6. Write a `LogMessage(props: { logMessage: LogMessage }): JSX.Element` component.
   Use a `switch` to decide what JSX to return. A dicussion could look like:

   > **Zany Tiger**: Hi there!
   >
   > 🎉 **Happy Penguin** joined the discussion 🎉
   >
   > **Happy Penguin**: it looks like you have a lot of fun here!
   >
   > **Zany Tiger**: Actually... No. Good bye.
   >
   > 😭 **Zany Tiger** left 😭

   Use the `LogMessage` component inside the `App` one to display the messages.

   Try out all the features: joining, sending a message, leaving (close the tab).
   You should see all those events reflects in the page.

7. It's working but the experience is not smooth. When we hit `Enter`, the message
   disapear instantly but is not displayed yet in the conversation. This is to network
   delay simulation (which is 500ms, this huge in order to actually see this delay).

   If you pay attention to the workflow, here are how the events occur:

   - user hit enter,
   - the input is erased and the message is sent to the server,
   - the server receive the message and broadcast it to all the clients,
   - we finally get back the message which is displayed.

   We'll perform an "optimistic update", cutting off the routrip to the server.

   In the `reducer`, change the `UserSubmitted` case to immediately add the corresponding
   message to the event log.

   This should work but you should see messages appearing twice. You have to filter
   the `WebsocketEventReceived` actions in order to ignore the messages where the user id
   is yours.

8. (bonus) We can improve the optimistic update: keep track of the messages directly added
   to the event log by the frontend and mark them as "pending" in the UI (with a clock
   emoji or by using gray instead of black). If we receive back this message from the
   server, mark them as "received". If we didn't received this message back after say
   5 seconds, mark it has "non delivered" (with a red cross emoji or by using red instead
   of black).

   I'll let you implement this the way you want, I'll just give you some guidelines
   and precisions. Sketch out multiple solutions balancing pros/cons for each and
   **speak with the teacher about them**.

   _Be careful_: the last message you received from the server is not necessarily the last
   message you sent (you can send A then B just after, B being sent before you received
   A from the server). You can use a random number or a UUID to identify the messages.

   Note the `message` payload coming from the server exactly is what you sent through
   the websocket. We currently send a simple string, but you can send arbitrary JSON
   (in an actual application having such a server doesn't look like a great idea since any
   client could send garbage data that would crash other clients).

   Also note that for now `LogMessage` is directly part of `WebsocketEventReceived`
   but types might diverge at some point and you could have something like:

   ```ts
   type WebsocketEvent =
     | { kind: "Welcome"; userId: string; userName: string }
     | {
         kind: "Message";
         userId: string;
         userName: string;
         message: string;
       }
     | { kind: "Left"; userId: string; userName: string };

     | { kind: "Joined"; userId: string; userName: string }

   type LogMessage =
      <something entirely different here!>
   ```

   (actually it sounds a good idea to entirely make them two different types since the
   first one is a kind of `Action` and the second one is part of the `State`).

## What did we learn?

- `setState` accept a function as an argument that updates the current state value.
- We use `useEffect` to deal with APIs outside of React.
- `useEffect` takes an array of dependecies that make the effect handler running
  as soon as one of the dependencies is updated.
- Some people post wrong solutions in comments.
- The `reducer` pattern fits well with websockets: every kind of message coming from
  the websocket is a kind of `Action`.
- Always keep in mind "make impossible states impossible" when modelling the `State`.
- Native `<form>` tag has a submit behavior that can be cancelled with `e.preventDefault`
  in the `onSubmit` handler.
- Implementing "optimistic update" makes user experience really smooth.
