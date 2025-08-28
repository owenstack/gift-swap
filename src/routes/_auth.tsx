import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen w-full bg-background relative">
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
				}}
			/>
			<div className="relative z-10">
				<Outlet />
			</div>
		</div>
	);
}
