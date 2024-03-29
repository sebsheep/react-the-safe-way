# 08 Routing & SPA

## What's an SPA?

In a "classical" application, when the user clicks on a link or submit
a form, the browser asks for a totally new HTML page to the server. We'll call this
a "Multi Page Application" (MPA) in this document.

In a Single Page Application (SPA), all the navigation is handled on Javascript side.
Only the first request loads a complete HTML page. Subsequent requests only load data from
the server (most of the time in JSON, but it can be in any format!), data which are
processed by the JS code to be displayed on the screen via React components.

### Pros of a SPA

1. Speed and Responsiveness

One of the most significant advantages of SPAs is their speed and responsiveness. SPAs load content dynamically, which means that when a user interacts with the application, only the required resources are fetched from the server. This reduces loading times and results in a smoother, more fluid user experience.

2. Enhanced User Experience

The seamless and uninterrupted user experience provided by SPAs can be a game-changer. Users no longer experience the jarring page reloads and interruptions that are common in traditional websites. This enhanced experience leads to higher user engagement and satisfaction.

3. Clear separation of concerns

In a MPA, since the server is responsible for business logic and rendering, it's easy to
intricate the two, leading to code base which is hard to navigate in..

In a SPA, separation of concerns is clear: the frontend code deals with rendering
whereas the backend is responsible for the business logic. Hence it's possible
having 2 teams working almost "independently". The two teams have to agree
on the API exposed by the backend.

4. Cross-Platform Compatibility

SPAs are well-suited for cross-platform development. By using JavaScript frameworks like React, Angular, or Vue.js, you can create a single codebase that runs on various platforms, including web browsers, mobile devices, and even desktop applications.

5. Offline Functionality

Service workers and caching techniques can be implemented in SPAs to enable offline functionality. This is a significant advantage for users who may not always have a stable internet connection, such as mobile users.

### Cons of a SPA

1. SEO Challenges

SPAs have traditionally faced challenges with Search Engine Optimization (SEO). Since most of the content is loaded dynamically via JavaScript, search engines may have difficulty indexing the content, potentially affecting your site’s search engine ranking. However, there are workarounds and techniques to improve SEO for SPAs.

2. Initial Loading Time

While SPAs excel in providing a fast and responsive user experience once they are loaded, their initial loading time can be longer than that of traditional websites. This is because the entire application, along with its resources, must be loaded initially. This can be a drawback for users on slower internet connections.

3. Complex Development

Developing SPAs can be more complex than creating traditional websites. You need to manage client-side routing, state management, and asynchronous data fetching. This complexity can lead to longer development times and potentially more challenging debugging.

This also forces the server to expose a clear and well defined API (regardless you're working
with one "fullstack" team or with a "frontend" and a "backend" team).

(those pros and cons are freely adapted from https://medium.com/@VAISHAK_CP/the-pros-and-cons-of-single-page-applications-spas-06d8a662a149)

### When to use a SPA?

Nowdays, it's tempting to implement all new websites in a SPA way. However, this kind
of architecture has a non negligible cost and you should carefully consider alternatives.

If you're targeting a publicly avaible commercial website, like an e-shop, SEO and initial
loading time are really important so having server side-generated pages is a plus (indexation
algorithms are maybe doing good job at interpreting Javascript but it will always simpler
for them to just parse raw HTML rather than "parse Javascript which generates HTML and then
parse the generated HTML").

If you're developing a complex dashboard behind authentication, SEO is not an issue at all
and initial loading is not critical. So opting for a SPA for such applications make sense.

That said, world is complex! And now there are frameworks mixing Backend and Frontend, like
Next.js or Remix. Those techonologies are able to run React code on the server
to directly serve the page to the user and also having interactive behavior like in a SPA.
Best of two worlds! Those technologies are beyond the scope of this course.

## Routing with TanStack

We'll use [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
for this course. Multiple other solutions exist, we chose this essentially because it provides
a type safe way to reference the URL.

Install the dependencies and start the development server:

```
npm install
npm run dev
```

Note you should see the following:

```
♻️  Generating routes...
✅ Processed routes in 263ms
```

This should have created the `routesTree.gen.ts` file (which is ignored by git due to the
`.gitignore` file). This `routesTree.gen.ts` file is generated from the `routes/` folder.
Take a look at this `routes/` folder (you can safely ignore the generated file for now)
and browse the project at http://localhost:5173/ to answer the following questions.

**Questions/Instructions:**

1. What are the three routes declared in this `routes/` folder?
2. What is the purpose of the `__root.tsx` file?
3. In this `__root.tsx` file, there are a `<a>` and a `<Link>` tags. In what are there  
   different?

   Open the developer tools of your browser on the "network" tag. Check the "Preserve log"
   option. Click on the `<a>` and on the `<Link>` and observe the difference.

4. In this `__root.tsx` file, what is the purpose of the `<Outlet>` component?
5. Add a footer displayed on all the pages: it should consist of an horizontal rule
   (`<hr>` tag) and a text like "React, the (type) safe way ©".
6. In the `compute.$a.$b.lazy.tsx` file, what is the purpose of `$` in the file name?
7. In the `compute.$a.$b.lazy.tsx` file, how do we get the value of the parameters `a` and
   `b`?
8. Create a `greeting` page with two parameters `name` and `adjective`. Make it display
   ```
   Welcome <name>, you're a <adjective> person!
   ```
9. In the `index` page, create a list of link to this `greeting` page. This should look like:
   ```
   Welcome Mary ->
   Welcome John ->
   Welcome Alice ->
   Welcome James ->
   ```
   Use this following array of people (do you remember `.map`?):
   ```ts
   const PEOPLE = [
     { name: "Mary", age: 34, adjective: "delightful" },
     { name: "John", age: 28, adjective: "wonderful" },
     { name: "Alice", age: 48, adjective: "marvellous" },
     { name: "James", age: 73, adjective: "fantastic" },
   ];
   ```

## A simple weather app

We'll build a simple historical weather application: browsing to
`/historical-temp/<city>/<year>` will display the average annual temperature
of the given city for the given year.

10. In the current project, add a `historical-temp` page with `city` and `year` as parameters.
    Fill the file with:

    ```tsx
    import { createFileRoute } from "@tanstack/react-router";

    export const Route = createFileRoute("/historical-temp/$city/$year")({
      component: AverageTemp,
      loader: loadTempData,
    });

    async function loadTempData(arg: {
      params: { city: string; year: string };
    }): Promise<any> {
      const response = await fetch(
        "https://archive-api.open-meteo.com/v1/era5?latitude=48.8566&longitude=2.3522&start_date=2023-01-01&end_date=2023-12-31&daily=temperature_2m_max,temperature_2m_min"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return await response.json();
    }

    function AverageTemp() {
      const data = Route.useLoaderData();
      return <div>{JSON.stringify(data)}</div>;
    }
    ```

    You can see we're using a `loader`. Its role is to load data before we can actually
    navigate to a page. Note you can retreive the value loaded in the `AverageTemp` component
    using the `Route.useLoaderData` hook.

    For now we're just displaying the same raw JSON, regardless of the params.

11. Note the URL in fetch contains `start_date=2023-01-01&end_date=2023-12-31`. Manually change
    the `start_date`/`end_date` in the code and observe the modification on the page.
12. Create a `wheatherApiUrl({year: number}): string` function which returns the URL
    parametrized such that the start date is January 1st and end date is Decembre 31th of
    the given year.

    _HINT_: string interpolation within `` ` `` is really handfull for
    this!

    > **Note:** this `wheatherApiUrl` is a really simple _pure_ function, easy to test
    > and compose. We can use `fetch` or any other library (like `axios`) to actually
    > perform the request.

13. Note the argument of `loadTempData` is `{city: string; year: string}` and `year`
    can be any string, since it comes from the URL (the user could type anything he
    wants in it).

    Hence we need to _validate_ this object.

    Install Zod in the project:

    ```
    npm install zod@3.22.4
    ```

    Read again the **Safe conversion from JSON** part in `06-http/README.md` if you
    forgot how Zod works.

    Write a `PARAMS_SCHEMA` Zod validator to validate that `year` actually is an integer greater than 1940
    (check out [the Zod doc](https://zod.dev/?id=numbers) -- you'll need
    to use `z.coerce` instead of `z` since `year` contains a string
    which contains an integer).

    If the schema validation fails then throw an error, otherwise just
    call `wheatherApiUrl`inside `fetch`.

    Test out in the browser by manually change the year.

14. Modify `weatherApiUrl` to have the following signature:

    ```ts
    function wheatherApiUrl(args: {
      year: number;
      longitude: number;
      latitude: number;
    }): string;
    ```

    and use longitude and latitude in the returned string.

15. Add the following dictionary in your code:

    ```ts
    const CITY_COORDINATES = new Map([
      ["London", { latitude: 51.5074, longitude: -0.1278 }],
      ["Paris", { latitude: 48.8566, longitude: 2.3522 }],
      ["Berlin", { latitude: 52.52, longitude: 13.405 }],
      ["Madrid", { latitude: 40.4168, longitude: -3.7038 }],
      ["Rome", { latitude: 41.9028, longitude: 12.4964 }],
      ["Amsterdam", { latitude: 52.3676, longitude: 4.9041 }],
      ["Vienna", { latitude: 48.2082, longitude: 16.3738 }],
      ["Athens", { latitude: 37.9838, longitude: 23.7275 }],
      ["Brussels", { latitude: 50.8503, longitude: 4.3517 }],
      ["Oslo", { latitude: 59.9139, longitude: 10.7522 }],
      ["Stockholm", { latitude: 59.3293, longitude: 18.0686 }],
      ["Copenhagen", { latitude: 55.6761, longitude: 12.5683 }],
      ["Dublin", { latitude: 53.3498, longitude: -6.2603 }],
      ["Lisbon", { latitude: 38.7223, longitude: -9.1393 }],
      ["Warsaw", { latitude: 52.2297, longitude: 21.0122 }],
      ["Budapest", { latitude: 47.4979, longitude: 19.0402 }],
      ["Prague", { latitude: 50.0755, longitude: 14.4378 }],
      ["Helsinki", { latitude: 60.1695, longitude: 24.9354 }],
      ["Zurich", { latitude: 47.3769, longitude: 8.5417 }],
    ]);
    ```

    Add a `city` field in the Zod schema. Use
    [`.refine`](https://zod.dev/?id=refine) to check the city actually
    is in the keys of `CITY_COORDINATES`.

    _Hint_: to check if a `s` string is a key of an `m` map, you can
    `m.has(s)`.

    Use this city to retreive the coordinates in the above dictionary.

    Test in the browser that changing the city in the URL actually
    change the response.

    > **Note**: checking if the city and year are in a correct format
    > may seem like a lot of work, but keep in mind those data come
    > from the "outside" of the program (the URL, which can be typed
    > by the user or a malicious person).
    >
    > The more you validate those external data, the more you can catch
    > errors soon and be able to debug quickly. Or even prevent a
    > malicious user to forge a dangerous URL.
    >
    > _Validate user input_. Always!

16. Great, input parameters of the HTTP query are now entirely safe!

    Let's do the same for the output parameters: write a `WEATHER_SCHEMA`
    Zod schema for the output of `await response.json()`. You are only
    interested in the `temperature_2m_max` and `temperature_2m_min`
    fields. They represent respectively the maximum and minimum
    temperature per day.

    Throw an error if the response doesn't match the schema, otherwise
    just return the parsed data.

17. Modify `loadTempData` to have the following signature (only the ouput
    type changes):

    ```ts
    async function loadTempData(arg: {
      params: { city: string; year: string };
    }): Promise<{
      city: string;
      year: number;
      averageMinTemperature: number;
      averageMaxTemperature: number;
    }>;
    ```

    You can use the following function:

    ```ts
    function average(numbers: Array<number>): number {
      return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }
    ```

    Test everything is working in the browser!

18. In the `AverageTemp` component, display the data in a "nice"
    way. It could look like:

    ```
    Paris in 2020
    ________
    Average maximum temperature: 13.96°C
    Average minimum temperature: 6.62°C
    ```

    Note the temperatures are rounded up to 2 decimal digits.

19. Add "Next year"/"Previous year" links at the bottom, making
    sure the year is between 1940 and 2023.

    This can look like:

    ```
    Paris in 2020
    ________
    Average maximum temperature: 13.96°C
    Average minimum temperature: 6.62°C

    < Previous year      Next year >
    ```

20. On the top bar, add a link to every city in `CITY_COORDINATES`.
    You should modify the `__root.tsx` file for this purpose.
    Fix the year you want (your birth date maybe?).

    Don't forget adding a `key` argument since you'll build
    an array of components.

21. We handled the error in `loadTempData` by throwing an error.
    TanStack provides a way to deal with it, you can read the
    [**Handling Errors** part in the doc](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#handling-errors).
    It's quite common in Javascript world.

    I really don't like it since it is based on the exception mechanism
    which is totally uncorrelated with the type system: we don't know
    if the expected errors in `onError` or in `errorComponent` are the
    same than what is actually raised in our `loader` (and in practice in
    a big code base, this will eventually trigger a sneaky bug at some
    point).

    Good news is we don't actually _need_ those `onError` or
    `errorComponent`. The key idea is to consider an _error_ like
    a "normal" data, not a special `throw/try/catch` construct in the
    language.

    Concretly, you can modify the return type of `loadTempData`:

    ```ts
    async function loadTempData(arg: {
      params: { city: string; year: string };
    }): Promise<
      | {
          kind: "success";
          city: string;
          year: number;
          averageMinTemperature: number;
          averageMaxTemperature: number;
        }
      | { kind: "error"; errorMsg: string }
    >;
    ```

    That is, this function will either return valid data or an error
    message.

    That means that instead of `throw new Error("blahblah");`
    you can `return { kind: "error", errorMsg: "blahblah"};`.

    Up to the `AverageTemp` component to display it properly.

    Do it! Use a `switch(data.kind)` to determine what to display

22. You can even be more precise in your return type:

    ```ts
    async function loadTempData(arg: {
      params: { city: string; year: string };
    }): Promise<
      | {
          kind: "success";
          city: string;
          year: number;
          averageMinTemperature: number;
          averageMaxTemperature: number;
        }
      | {
          kind: "badParamsError";
          field: "year" | "city";
        }
      | {
          kind: "fetchFailed";
          statusCode: number;
          errorMsg: string;
        }
      | { kind: "decodingFailed" }
    >;
    ```

    This way you can display specific error for a particular situation.
    We could imagine to only have a "yellow warning" for the first error
    and a "red error" for the other two. Also note each error has its
    own set of data.

    Such approach can also be useful if you want to provide your app
    in multiple languages (English, French, Spanish...). Your
    `loadTempData` only deals with _data_ which is decoupled from the
    rendering handled only in the component.

    Do this modification!

> **Note**: we only scratched the surface of the TanStack Route lib.
> It should be enough for the present course and a bit beyond, but you'll
> probably need more control in real code. Feel free to explore the
> documentation.
>
> That said, be precautionous, as this lib heavily uses impures functions
> which can lead to hard to catch errors if not handled properly. Always
> balance shiny features (like e.g. caching) with potential uncaught bugs
> due to using impure code.
>
> Also, keep in mind to always validate user input as soon as possible,
> whatever the technology you're using.

## What did we learn?

- Single Page Application vs Multi Pages Application
- With TanStack Route:
  - routes can be specified with filenames, the dev
    server generating a file based on those filenames.
  - the params are prefixed with `$` in the filename.
  - the routes and their params can be built in a
    typesafe way with `<Link to=... params=...>`.
  - to retreive the params from the route, we can use `Route.useParams`
  - we can specify data to load before navigating to the page and retreive
    it with `Route.useLoaderData`.
  - TanStack has a mechnamism to handle errors that has been raised.
  - ... even if there are other simple and more type safe solution to
    address this issue!
- Params in URLs are "user input" and should be validated.
- Using a function to build an URL for an API allows to abstract over
  details.
