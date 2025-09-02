import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/message/$messageId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/message/$messageId"!</div>;
}
