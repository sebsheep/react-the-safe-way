# 07 Context

In this example, we showcase a way to handle internationalization of an app
(there are plenty of tools to that, the avantage of this approach is to only use
bare React/TS).

This app is split in several modules. Look at the files
in this order:

- `Lang.tsx` lists all the possible languages usable in the app. Making it
  a module allow us to import it anywhere in the code and to keep the list of
  all the available languages in a single place.

  We'll add more stuff to it later in this lesson.

  **Question:** what is the role of the `export` keyword before `type Lang`?

- `Item.tsx` describes how to display a single item in an online shop.
  It defines an `ItemKind` which describes what are the possible items to
  sell (note this is not very realistic, this list of items being most of the
  time extended over time without modifying the code).

- `ItemList.tsx` describes how to display a list of items. It should have an
  error, don't try to fix it now.

  **Question:** what does the `Array<Item>` type stand for?

- `App.tsx` is the root module of the app. It contains a state which tracks
  what lang is used, defaulting to French.

This module breakdown is not the only one possible. For instance, the
`Item.tsx` and `ItemList.tsx` ones could have been merged in a unique module.
It should also be a classical refactor operation to split a module into multiple
ones as the project grows. All in all, don't be too afraid to choose a module
structure, type checking makes it quite safe to refactor -- as long as you avoid
side effects as much as possible.

1. Look at `ItemList.tsx`. As already seen, there is an error here. Actually,
   the developper started to add this language feature in the app in the most
   nested component by adding a `lang: Lang` argument to it. The idea is then to
   propagate this `Lang` argument to the root of the app.

   - Fix this file by adding a `lang: Lang` argument to `ItemList`.
   - It should raise another error in the `App.tsx` file. Fix it as well!

2. This bug was easily "fixable" since the depth is only 3
   (`App->ItemList->Item`).
   However, note that only the `Item ` component actually needs this `Lang`
   parameter. `ItemList` only "proxies" the language from the `App` to the
   `Item`.

   I can be a bit annoying to do that for really deep components (which actually
   happens in real apps).

   We'll introduce `Context` which brings a solution to this issue.

   In the `Lang.ts` file, add those following lines:

   ```ts
   import { createContext } from "react";

   export const LangContext = createContext<Lang>("FR");
   ```

   **Question:** what is the role of `<Lang>` after the `createContext`?

3. In the `Index.tsx` file, remove the `lang` prop in the `Item` component,  
   retrieve it instead from the "context":

   ```ts
   export function Item(props: { item: Item}) {
       const lang = useContext(LangContext);
   ```

   (you'll need to `import { useContext } from "react";` at the top of the file)

   And fix all the type checking errors in `ItemList.tsx` and `App.tsx`.

   When you've fixed all the errors, try the app! And... Yeah, it doesn't
   work!

   - What is the value used for the `LangContext` in `Item`?
   - Edit the `Lang.ts` file to make it "EN" instead.

4. Actually, we didn't provide any "context" to our components, so when we
   `useContext` in `Item.ts`, it just defaults to the value indicated in the
   `createContext` in `Lang.ts`.

   We can add a context with the `LanguageContext.Provider` component in
   `App.tsx`:

   ```tsx
   return (
     <LanguageContext.Provider value={state.lang}>
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
     </LanguageContext.Provider>
   );
   ```

   Now it should work!

   Note that `Item` does access to the `LangContext` even if we didn't
   explicitly pass `lang` as an argument to the intermediate `ItemList`
   component.

Ok, so we can use a _context_ to **implicitly** pass argument from a root state
to arbitrary nested components. However, this technique comes with a big
drawback:

- by **explicitly** passing arguments to components, it can be teddious but the
  type checker will warn us if we forgot to pass some value somewhere (as in
  step 1.)
- on the contrary, if the context is missing, the compiler cannot help us (as  
  we've seen at the end of step 3: the compiler was happy, initial loading
  looked good, but the feature didn't work at all!).

When using contexts, correctness of your components usage depends on _where_ you
use you component. In other words, if a component is using context, your
copmonent is not _pure_ anymore!

You can easily loose those contexts if you refactor your code, and if it
happens, the type checker cannot help you.

Hence, I recommend using contexts really sparingly, with context providers at the
root of the application (to reduce the risk of not being in the scope of the
context). E.g. language settings and theme (e.g. light/dark) might be good
candidates for contexts.

Explicitly pass arguments (also known as _props drilling_) might look primitive
but brings really strong guarantees and is easy to implement (if repetitive). So
using contexts should be carefully considered, balacing the time spent at
proxying values through all component levels (boring but really easy) against
the time needed to find and fix a bug due to missing context (which can be
stressful, uncomfortable and hard).

More generally speaking, I recommend to evaluate any technical solution considering:

- do I gain "purity"?
- is the type checker able to warn me if I forgot to do something/do something
  wrong?

If the answer is "YES" fot both questions, go on the eyes closed: it often means
you'll can easily and safely refactor your code if you change you mind.
Otherwise... Be really cautious by adopting this solution.

## What did we learn

- We can split React code into modules, and use the `export` keyword to expose
  values, functions or types to other modules.
- Passing arguments down to nested components (a.k.a \_props drilling\_\_ brings
  strong type safety).
- Using _contexts_ allows to sacrifice some type safety for the benefit of  
  "easier" data retrieval for nested components.
