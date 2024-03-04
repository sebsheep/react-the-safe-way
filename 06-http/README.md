# 06 HTTP

This lesson will focus on how to perform HTTP requests. We'll build a simple page
with a button that loads a new cat image from Giphy.

## Understand the code

Look at the `src/App.tsx` file.

1. By only looking at the `State` and `Action` types, try to understand what can
   happen in this app.
2. Look at the `handleCatClick` function inside `App`.
   - What does the `async`/`await` keywords mean?
   - What function does actually trigger the HTTP request?
   - Note how the `dispatch` calls occur at different moments.
3. In the following code:
   ```tsx
   <button onClick={handleCatClick} disabled={state.isLoading}>
   ```
   what is the role of `disabled`?
4. Test the program (launch `npm start dev` and browse to
   http://localhost:5173/).

## Make impossible states impossible

1. Test out the error handling by switching off the network and clicking on
   "Load a new cat".

   You shouldn't be able to click on "Load new cat" to retry... Which is
   not really nice.

   By modifying the `reducer` function, make it possible to click again on
   the button when we an error occured.

2. Take a look at the `DisplayCat` component. Do we handle all the possible
   states of the application? NO! We don't handle the case where `isLoading` and
   `isError` are `false` and `cat` is `null` (which happens when the application
   starts).

   (the `<h2>` tag is not displaying, we'll fix that in the next part).

   - Add `JSX.Element` as type annotation for the return type of `DisplayCat`.
     It should make the compiler angry because some code paths does not return
     anything.
   - Add a final `else` block returning a JSX template saying something like:
     > Welcome to our Cat gallery! Click the button to have some fun!

3. The previous two items are actually bugs that can be quite hard to solve
   in any "real world" application.

   > "That's life, developers have to be rigorous and think about all the
   > possible combinations."

   Hmpf. You can think like that... Here with only 3 variables having 2 states
   (`isLoading: true | false`, `isError: true | false`, `cat: Cat | null`), we
   have 2x2x2 = 8 possible combinations. If we add 3 others tiny booleans,
   it raises up 64 possible combinations. 3 more and you reach 512 combinations.

   I really hope I have your brain to be able to think to all of those
   combinations!

   > "..."

   Don't wory, there _is_ a way to easily handle this situation. Thing is here
   that each state is represented by a boolean, leading to states that represent
   **nothing** in the application.

   E.g. the following state:

   ```ts
   { isError: true, isLoading: true }
   ```

   doesn't have any sense. _Either_ we are loading, _or_ we are in an error
   state, _or_ we have a cat. Based on this "_Either/or_" statement, we'll use
   the following state type instead:

   ```ts
   type State =
     | { type: "Start" }
     | { type: "Loading" }
     | { type: "Error" }
     | { type: "Loaded"; cat: Cat };
   ```

   Note that now the `cat` field is not a `Cat | null` but simply `Cat`.

   Which makes 4 possibles states which exactly matches our "business logic"
   (to be compared with the previous 8 possibles combinations).

   Let's go:

   - Change the `State` type in `App.tsx` to match the one above.
   - Fix the `reducer` function. You should only return fresh new values,
     so you shouldn't need the `{...state}` syntax anymore.
   - Fix the `DisplayCat` function by using a `switch(state.type)` statement.
   - Fix any remaining type error.... It should be working now!

## Safe conversion from JSON

Let's tackle the issue with the `<h2>{state.cat.title}</h2>` which doesn't
display anything.

Actually, the error comes from the `catFromGiphy` function:

```ts
function catFromGiphy(json: any): Cat {
  return { title: json.title, url: json.data.images.original.url };
}
```

The actual received JSON looks like:

```json
{
  "data": {
    "title": "Tired cat",
    "images" : { "original": { "url" : "http://...", ...}, ...},
    ...,
  },
  ...,
}
```

so we should use `json.data.title` instead of `json.title`.

Note how distant was the manifestation of the bug (in the `DisplayCat` component)
from where the bug actually lies (in the `catFromGiphy` function).

> **The danger of `any`**. In `catFromGiphy`, the `json` argument has type
> `any`, which means the compiler will accept anything on call sites and also
> will accept any method/attribute on `json`.
>
> So the compiler is happy with `json.title` as well as `json.data.title`
> and even `json.data.tilte` (note the typo for `tilte`). And again,
> `json.title` is of type `any`, implying that the compiler will be happy
> to pretend this is a `string` even it is something completely different.
> Of course, when we'll run the code, we'll be in trouble quite quickly!
>
> This behavior easily leads to bug so I recommend to avoid `any` as much as
> possible.
>
> A more suitable type is `unknown`: turn this `json` argument into `unknown`,
> you still can call `catFromGiphy` with anything, but inside the function, you
> have to prove to the compiler.

We cannot solve this situation with typing only: when we type check the code, we
have no idea of what JSON will be sent over the wire. So we have to check at
_runtime_ that what we receive matches our expectation. If it doesn't, we should
fail as soon as possible.

We could perform this check as follow:

```ts
  if (
    // check that json is a non null object
    json !== null &&
    typeof json === "object" &&
    // check that json has a `data` field which also is an object
    "data" in json &&
    json.data !== null &&
    typeof json.data == "object"&&
    // check that `data` contains a strig field name `title`
    "title" in json.data &&
    typeof json.data.title === "string" &&
    ...

  ) {
    return { title: json.data.title, url: json.data.images.original.url  };
  }
```

It works but, _yikes_, we don't want to do that! (Actually, a good question
would be "What does human being really want?", but it would dive too deep
into philosophy).

So we'll use a **validation library**: [Zod](https://zod.dev/). We could have
chose [Joi](https://joi.dev/) as well, this choice doesn't relate to any strong
argument.

Install it (to be run in the `06-http` folder):

```
npm install zod@3.22.4
```

(note we fix the version so the code we propose in this lesson will always
be "correct" -- the versions in the JS ecosystem tend to move quite quickly)

1. Let's write a schema describing what we _thought_ was correct for Giphy
   response in `catFromGiphy`. Insert this snippet at the beginning of the file:

   ```ts
   import { z } from "zod";

   const GIPHY_SCHEMA = z.object({
     title: z.string(),
     data: z.object({
       images: z.object({ original: z.object({ url: z.string() }) }),
     }),
   });
   ```

2. Now we can rewrite `catFromGiphy`:

   ```ts
   function catFromGiphy(json: unknown): Cat | null {
     const parsed = GIPHY_SCHEMA.safeParse(json);
     if (parsed.success) {
       // if the parsing succeeded, `data` will contain
       // an object of the shape described in the schema
       return {
         title: parsed.data.title,
         url: parsed.data.data.images.original.url,
       };
     } else {
       console.error(parsed.error);
       return null;
     }
   }
   ```

   Note that the return type has changed, so you should handle this in the
   `handleCatClick` function by dispatching an error message if we got a
   `null` (use something like `if(cat === null) { ...} else {...}`).

3. Run in your browser, and open the console (F12) you should see the following
   error:

   ```
   ZodError: [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": [
          "title"
        ],
        "message": "Required"
      }
   ]
   ```

   which clearly indicates that at the path `"title"`, we found nothing (`undefined`) whereas we expected a `"string"`.

   Fix `GIPHY_SCHEMA` to match the actual received JSON:

   ```json
   {
     "data": {
       "title": "Tired cat",
       "images" : { "original": { "url" : "http://...", ...}, ...},
       ...,
     },
     ...
   }
   ```

4. You should now have a robust application, correctly displaying the image's
   title!

> **Note:** we only performed a `GET` http request with `fetch`. This is quite
> simple because we just have to provide the URL.
>
> For other HTTP verbs like `POST`, we often need to provide a JSON payload.
> Here is an example:
>
> ```ts
> const rawResponse = await fetch("https://mysite.com/setAge", {
>   // You can change this to any method like DELETE/PUT/...
>   method: "POST",
>   headers: {
>     Accept: "application/json",
>     "Content-Type": "application/json",
>   },
>   // Your the payload you have to provide:
>   body: JSON.stringify({ userId: "a2ef63e", age: 42 }),
> });
> const content = await rawResponse.json();
> ```
>
> All what we've seen about ensuring `content` has the expected shape
> also apply in the same way.

## What did we learn?

- Use `fetch` to retreive data from an API.
- Make impossible states impossible, that is, precisely represent the business
  logic into the types used. This sometimes implies to use "union types" instead
  of a collection of booleans or nullable values.
- Validate data coming from "the outside" of the program.
