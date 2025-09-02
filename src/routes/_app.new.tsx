import { createFileRoute } from "@tanstack/react-router";
import { GiftForm } from "@/components/gift-form";

export const Route = createFileRoute("/_app/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<GiftForm />
		</div>
	)
}
