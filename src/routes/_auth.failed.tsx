import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/failed")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_auth/failed"!</div>;
}
