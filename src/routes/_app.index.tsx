import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>What do we have here?</div>;
}
