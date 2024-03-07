# React View

This chapter will focus on how to render things with react.

The "apps" will be a bit boring since we'll only display static data
with no interaction.

1. Look at the `App.tsx` file. The extension is `.tsx` meaning it mixes
   Typescript and some kind of (x)Html language (actually this is not true HTML,
   e.g. `class` is written `className`).

   It defines 2 components: `Post` and `App`. A component is just a function
   returning some JSX. Observe how we build the `Post` component inside the
   `App` one.

   `title` and `body` are the **props** of the `Post` component.

   - How do we pass arguments to the `Post` component?
   - How do we insert javascript value in JSX template?

2. Install the dependencies and run the dev server:

   ```
   npm install
   npm run dev
   ```

   Go to [http://localhost:5173](http://localhost:5173), you should
   see a post with a title.

3. Modify the text of the title and/or the body and observe them in the browser.
   Then try to remove the `title`... You should see an error!

   Similarly, try to assign an integer to the title (you'll need to use
   the `{...}` syntax). This should also raise an error!

   > **Note:** without Typescript, we wouldn't see those errors before execution
   > which can be reaaaaaly long to debug on a bigger app.

4. Add a new post below the exisiting one.
5. Add a `deleted : boolean` property to the `Post` component.

   We want to wrap the body with `<del>` tag (which strikes the words) if
   `deleted` is true. You have multiple options:

   - Use a big `if` statement:
     ```tsx
     if (deleted) {
       return (
         <div>
           <h2>{title}</h2>
           <p>
             <del>{body}</del>
           </p>
         </div>
       );
     } else {
       return (
         <div>
           <h2>{title}</h2>
           <p>{body}</p>
         </div>
       );
     }
     ```
   - Yet, there is a lot of code duplication this could easily lead
     to errors. So we could use a variable instead:

     ```tsx
     let displayedBody = <>{body}</>;
     if (deleted) {
       displayedBody = <del>{body}</del>;
     }
     return (
       <div>
         <h2>{title}</h2>
         <p>{displayedBody}</p>
       </div>
     );
     ```

     Note how we can assign JSX value to a variable and use it inside `{...}`.

   - You might want to "inline" everything inside the `<p>` tag.
     However, you can only use **expression** inside thos `{...}`.

     > **What's an expression**
     >
     > Expressions produce values and can be standalone or part of a larger
     > statement. They can contain variables, operators, and function calls.
     > E.g. `5+6`, `myPrettyFun()`, `f(g(5)/6).h().length` are **expressions**.
     >
     > **What's a statement?**
     >
     > Statements perform actions and do not necessarily return a value.
     > E.g. `if(condition){ ... }`, `function myPrettyFun(){}`, `for(...){}`
     > are **statements**.
     >
     > Expressions can be embedded within statements, but statements cannot be
     > embedded within expressions.

     So we cannot use `if/else` construct inside the `{...}` in JSX. But!
     We can use the ternary operator `cond ? valueIfTrue : valueIfFalse`
     which is an expression!

     To get familiar with this operator, predict the output of:

     ```js
     5 > 2 ? 42 : 87;
     ```

     and check in the browser JS console.

     Finally, use this syntax to inline the condition in the template
     instead of using a variable.

6. Copy paste this list of posts in your code:

   ```ts
   const POSTS_RECEIVED = [
     { id: "RTY459", title: "Hello", body: "I'm John", deleted: false },
     {
       id: "PLM862",
       title: "Guten Tag",
       body: "Ich heisse Hans",
       deleted: false,
     },
     {
       id: "QWE217",
       title: "Bonjour",
       body: "Je m'appelle Henry",
       deleted: false,
     },
     { id: "UIO394", title: "Ciao", body: "Mi chiamo Luigi", deleted: false },
     { id: "ZXC576", title: "Hola", body: "Me llamo Juan", deleted: false },
     { id: "VBN981", title: "Olá", body: "Meu nome é João", deleted: false },
     { id: "POI632", title: "Привет", body: "Меня зовут Иван", deleted: false },
     { id: "MNB514", title: "नमस्ते", body: "मेरो नाम जॉन हो", deleted: false },
     {
       id: "WER287",
       title: "こんにちは",
       body: "私はジョンです",
       deleted: false,
     },
     {
       id: "ASD905",
       title: "안녕하세요",
       body: "내 이름은 존입니다",
       deleted: false,
     },
     { id: "FGH741", title: "你好", body: "我叫约翰", deleted: false },
     { id: "CVB268", title: "مرحبا", body: "أنا جون", deleted: false },
     { id: "TGB763", title: "سلام", body: "من جان هستم", deleted: false },
     {
       id: "XCV129",
       title: "Selamat pagi",
       body: "Nama saya John",
       deleted: false,
     },
     {
       id: "QAZ386",
       title: "გამარჯობა",
       body: "მე მქვია ჯონი",
       deleted: false,
     },
   ];
   ```

   We would like to display all of this (imagine this list comes from an API).

   We'll explore 2 methods:

   - Just after the `function App(){` line, create an empty array
     `const postComponents = []`. Then, add `Post` components to it with a `for` loop
     and the `posts.push` method which adds an element to an array.

     Then include `{postComponents}` inside the `<div>` in the `App` component.

     Check everything is ok in the browser!

   - Now, we'll do this "inline", without adding any new variable. The `for`
     loop is not an expression, so we cannot use it in JSX template. Use the
     `POSTS_RECEIVED.map(post => ...)` function to transform every element
     in `POSTS_RECEIVED` into a `Post` component.

7. Alright, we displayed a bunch of posts but... Look at the developer console
   of your browser (F12 in most browsers). You have to add a `key` prop to every
   component in an array of components, every key being unique. Use the post id
   to provide a unique value.

   You can [read more](https://react.dev/learn/rendering-lists#rules-of-keys) about [keys](https://react.dev/learn/rendering-lists#rules-of-keys).

8. Let's try to number the posts. We'd want something like:

   ```
   1 - Hello
   2 - Guten Tag
   3 - Bonjour
   ...
   ```

   Let's define a global variable `let postCount = 0;` at the top of file,
   increment this counter at every call of the `Post` function and display this
   counter before the title.

   You should see something like 😱:

   ```
   2 - Hello
   4 - Guten Tag
   6 - Bonjour
   ...
   ```

   Actually, React expects all your components are **pure**, that is:

   - **It minds its own business.** It does not change any objects or variables
     that existed before it was called (including the one passed in parameters).
   - **Same inputs, same output.** Given the same inputs, a pure function should
     always return the same result.

   By strictly only writing your components as pure functions, you can avoid an
   entire class of baffling bugs and unpredictable behavior as your codebase
   grows.

   Here, our `Post` function is _not_ pure as it modifies the `postCount`
   variable.

   To help you figure out what components are not pure, React runs the components
   twice in developement mode, so you can spot weird behaviors (unfortunately,
   there no reliable way to ensure a function is pure at the type level or with
   tools like ESlint without removing a lot of JS features).

   To solve the problem, just remove the global `postCount` variable and
   add a `postCount : number` prop to your `Post` component. You can have
   the index in the map function: `.map((element, index) => ...)`.

   > **Note**: a pure function can _internally_ use mutation, if the mutated
   > variable is created ("owned") by this function. E.g. the following function
   > is pure, despite the use of `.push` which is not pure.
   >
   > ```ts
   > function range(n: number): Array<number> {
   >   const t = [];
   >   for (let i = 0; i < n; i++) {
   >     t.push(i);
   >   }
   >   return t;
   > }
   > ```
   >
   > However, the following is _not_ pure as it modifies its argument:
   >
   > ```ts
   > function add42(t: Array<number>): Array<number> {
   >   t.push(42);
   >   return t;
   > }
   > ```

9. To end up this chapter, let's take a look at the project's structure.
   - Initially, the `index.html` file is loaded by the browser. This file
     contains a
     ```html
     <div id="root"></div>
     ```
     node.
   - When this line is reached:
     ```html
     <script type="module" src="/src/main.tsx"></script>
     ```
     the browser will load (the compiled version in pure JS) of `src/main.tsx`.
   - This `main.tsx` file gets the root node and wraps our entire app in a
     [`React.StrictMode`](https://react.dev/reference/react/StrictMode)
     component. This component lets you find common bugs in your components
     early during development.
   - Finally, the `App.tsx` is called (the file we worked on during this
     chapter).

## What did we learn?

- A React component is just a function.
- React TSX template syntax to build component.
- The `{...}` syntax to insert Typescript inside TSX template.
- Espression vs Statement.
- Ternary operator: `cond ? valueIfTrue : valueIfFalse`.
- Use `if/else` statement or ternary expression to conditionnally display
  components.
- Transforming a `for` loop into a `.map` call.
- Component inside an array should have a unique `key`.
- What a pure function is.
- A React component has to pure.
