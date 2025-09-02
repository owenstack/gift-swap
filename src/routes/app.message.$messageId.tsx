import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/message/$messageId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/app/message/$messageId"!</div>;
}
