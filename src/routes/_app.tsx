import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { NavBar } from "@/components/navbar";

export const Route = createFileRoute("/_app")({
	beforeLoad: ({ context, location }) => {
		const { user, isLoading } = context.auth.getSnapshot();
		if (!isLoading && !user) {
			throw redirect({
				to: "/login",
				search: {
					redirectTo: location.href,
				},
			})
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-2">
			<NavBar />
			<Outlet />
		</div>
	)
}
