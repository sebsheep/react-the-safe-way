import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compute/$a/$b")({
  component: Compute,
});

function Compute() {
  const { a, b } = Route.useParams();
  return <div>{a + b}</div>;
}
