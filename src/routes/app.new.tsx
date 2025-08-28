import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/app/new"!</div>;
}
