import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div>
      Hello from About!
      <Link to="/compute/$a/$b" params={{ a: "hello", b: "world" }}>
        Click me
      </Link>
    </div>
  );
}
