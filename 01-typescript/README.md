# Typescript & setup

This project aims to demonstrate how to use typescript and to get familiar
with the tools we'll use in the rest of the class.

We're using simple `alert`/`prompt` modals for IO which is not what's
recommended today, but it's really simple and enough for this example.

1. First, look at the code in `src/main.ts`, ensure you understand all what you
   see.
2. Then run in a terminal (maybe you'll have to install NPM):
   ```
   cd ts-example
   npm install
   npm run dev
   ```
3. This should start a development server, using
   [Vite](https://vitejs.dev/guide/). This server will watch for changes in your
   code, and automatically recompile TS files into JS files (because the
   browsers can only read JS files).
4. Go to [http://localhost:5173](http://localhost:5173) (or the address displayed
   by the previous command). The expected display in the browser should be
   something like:

   ```
   What is the velocity of a swallow carrying a coconut?

   1. A swallow cannot hold a coconut
   2. 50 mph
   3. Is it an Asian or African swallow?
   4. I don't know that!

   Choose your answer (1 to 4)
   ```

   You should notice that the text is all messed up. Can you easily spot
   where the code is wrong? Not easy, isn't it? Don't try to fix the
   error for now, it should became obvious in the next question!

5. Look at the `tsconfig.json` file now. It configures how Typescript
   should work. You can see that:

   ```json
   "strict": true
   ```

   is commented out! It is generally a very bad idea, especially if you start a
   new project in TS. This option forces you to:

   - explicitly annotate function arguments,
   - handle null cases,
   - other good stuff

   Uncomment this line and go back to `main.ts`. You should see your editor
   complaining about the `ask_answer` arguments. Add types as follow:

   ```ts
   function ask_answer(message: string, max_answer: number): number;
   ```

   This should warning for the actual error at the call site of this function.

   > **Note:** when no annotation is provided, TS will decide that an argument
   > has the type `any` which is a kind of "hack" and should be avoided as most
   > as possible.

6. There should be another error on `parseInt(user_answer_string)` because
   `user_answer_string` could be `null` if the user clicks `Cancel`.

   You can see that by hovering the `user_answer_string` variable with your
   mouse (at least on VSCode), you should see:

   ```ts
   const user_answer_string: string | null;
   ```

   (we say that TS _inferred_ the type of `user_answer_string`)

   Add this before this `parseInt` call:

   ```ts
   if (user_answer_string === null) {
     alert("Please chose an anwser");
     continue;
   }
   ```

   TS will be smart enough to figure out that after this `if` block,
   the `user_answer_string` variable cannot be null anymore. You can check that
   out by hovering `user_answer_string` in `parseInt(user_answer_string)` to see
   the inferred type.

7. Take a look at the `package.json` file. The important parts for now are:
   - `"scripts"` contains all the commands you can run with `npm run ...`.
     E.g. you used the `dev` command previously to launch the dev server.
     Also notice the `build` command which is intended to produce as small
     as possible bundle files for production.
   - `"devDependencies"` contains all the dependencies for the developpement
     (like typescript).
     Later we'll also see a `"dependencies"` part for dependencies for the
     app it self (like React).
