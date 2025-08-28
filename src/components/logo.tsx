import { Link } from "@tanstack/react-router";
import { SwatchBook } from "lucide-react";

export function Logo() {
	return (
		<Link to="/" className="flex flex-col items-center gap-2 font-medium">
			<div className="flex size-8 items-center justify-center rounded-md">
				<SwatchBook className="size-6" />
			</div>
			<span className="sr-only">Acme Inc.</span>
		</Link>
	);
}
