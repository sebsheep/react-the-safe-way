import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        <a href="/">Home</a>
        <Link to="/about">About</Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
