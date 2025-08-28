import { Link } from "@tanstack/react-router";
import { useUser } from "@/lib/auth";
import { getInitials } from "@/lib/helpers";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { ListMinus, ArrowLeftRight } from "lucide-react";

export function NavBar() {
	const user = useUser();
	const handleSignOut = async () => {
		toast.promise(authService.logout(), {
			loading: "Signing out...",
			success: "Signed out successfully!",
			error: (err) =>
				err instanceof Error ? err.message : "Error signing out.",
		});
	};
	return (
		<header className="sticky top-0 w-full h-16 border-b flex items-center justify-between px-4">
			<Logo />
			<nav className="flex items-center gap-2">
				<Link className={buttonVariants({ variant: "link" })} to="/app">
					<ListMinus /> Feed
				</Link>
				<Link className={buttonVariants({ variant: "link" })} to="/app/new">
					<ArrowLeftRight /> Swap
				</Link>
			</nav>
			{user ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className="size-10">
							<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/app/settings">Settings</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Button
								variant={"destructive"}
								onClick={handleSignOut}
								className="w-full"
							>
								Sign out
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Link className={buttonVariants()} to="/login">
					Log in
				</Link>
			)}
		</header>
	);
}
