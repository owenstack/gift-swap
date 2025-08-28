import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div>
			Hello
			<Link to="/app" className={buttonVariants()}>
				Click me
			</Link>
		</div>
	);
}
