# Typescript & setup

This project aims to demonstrate how to use typescript and to get familiar
with the tools we'll use in the rest of the class.

We're using simple `alert`/`prompt` modals for IO which is not what's
recommended today, but it's really simple and enough for this example.

1. First, look at the code in `src/main.ts`, ensure you understand all what you
   see.
2. More precisely, look at the `play_question` function:
   - `` `${index + 1}. ${answer}` `` is JS syntax for string interpolation.
     Rewrite it with simple string concatenation (`+`).
   - `` (answer, index) => `${index + 1}. ${answer}` `` is an anonymous
     function with 2 arguments. Rewrite it with a function defined with the
     `function` keyword.
   - what does the `.map` function? Rewrite it using a `for` loop (you might
     need to use a new variable initialized at an empty array `[]` and the
     `.push` method).
3. Then run in a terminal (maybe you'll have to install NPM):
   ```
   cd ts-example
   npm install
   npm run dev
   ```
4. This should start a development server, using
   [Vite](https://vitejs.dev/guide/). This server will watch for changes in your
   code, and automatically recompile TS files into JS files (because the
   browsers can only read JS files).
5. Go to [http://localhost:5173](http://localhost:5173) (or the address displayed
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

6. Look at the `tsconfig.json` file now. It configures how Typescript
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

   This should raise a warning for the actual error at the call site of this
   function.

   > **Note:** when no annotation is provided, TS will decide that an argument
   > has the type `any` which is a kind of "hack" and should be avoided as most
   > as possible.

7. There should be another error on `parseInt(user_answer_string)` because
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

8. Take a look at the `package.json` file. The important parts for now are:
   - `"scripts"` contains all the commands you can run with `npm run ...`.
     E.g. you used the `dev` command previously to launch the dev server.
     Also notice the `build` command which is intended to produce as small
     as possible bundle files for production.
   - `"devDependencies"` contains all the dependencies for the developpement
     (like typescript).
     Later we'll also see a `"dependencies"` part for dependencies for the
     app it self (like React).

## What did we learn?

- Typescript is able to catch error before execution.
- Strict mode is highly recommended!
- Type annotation for functions: typing the arguments and the returned value.
- Basic types: `number`, `string`, `null`, objects, `Array<...>`.
- Union type: `A | B`.
- Writing a type alias (e.g. the `Question` type).
- String interpolation wrapped with `` ` ``.
- Anonymous functions: ` (x,y) => x+1-y`.
- `.map` method on arrays.

> ⚠️⚠️⚠️⚠️ Typescript can lie! ⚠️⚠️⚠️⚠️⚠️
> It is really easy to make Typescript "lie" about the type of a variable,
> there are multiple escape hatches to do this really easily. It is explained
> by the fact Typescript was added on top of existing Javascript code and
> it is somehow easier to say "oh, I'm sure this function returns this type"
> than to properly modify the code to have correct and complete type checking.
>
> So it is possible (and actually happens in real code bases) that the
> execution leads to type errors dispite a succesful compilation.
