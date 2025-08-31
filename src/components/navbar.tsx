import { Link, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService, useUser } from "@/lib/auth";
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
import { useQuery } from "@tanstack/react-query";
import { giftKeys } from "@/queries/keys";
import { db } from "@/lib/appwrite";
import { readGiftSchema } from "@/lib/constants";
import { env } from "@/env";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Skeleton } from "./ui/skeleton";
import { Plus, Share } from "lucide-react";

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
	const location = useLocation({
		select: (state) => state.pathname,
	});
	const pathParts = location.split("/").filter(Boolean);
	const id =
		pathParts[1] && pathParts[1] !== "new" && pathParts[1] !== "edit"
			? pathParts[1]
			: undefined;
	const { data, isLoading, error } = useQuery({
		queryKey: giftKeys.detail(id ?? ""),
		queryFn: async () => {
			const res = await db.getRow({
				databaseId: env.VITE_APPWRITE_DATABASE_ID,
				tableId: "gift-table",
				rowId: id ?? "",
			});
			return readGiftSchema.parse(res);
		},
		enabled: !!id,
	});
	const isEditRoute = location === `/app/${id}/edit`;

	return (
		<header className="sticky top-0 w-full h-16 border-b flex items-center justify-between px-4 bg-background z-50">
			<div className="flex items-center gap-4">
				<Logo />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/app">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{id && (
							<>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									{isLoading ? (
										<Skeleton className="h-4 w-32" />
									) : error ? (
										<BreadcrumbPage>Item not found</BreadcrumbPage>
									) : isEditRoute ? (
										<BreadcrumbLink asChild>
											<Link
												to="/app/$itemId"
												params={{
													itemId: id,
												}}
											>
												{data?.title}
											</Link>
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{data?.title}</BreadcrumbPage>
									)}
								</BreadcrumbItem>
								{isEditRoute && (
									<>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbPage>Edit</BreadcrumbPage>
										</BreadcrumbItem>
									</>
								)}
							</>
						)}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex items-center gap-2">
				<Link
					to="/app/new"
					className={buttonVariants({ variant: "secondary", size: "icon" })}
				>
					<Plus />
				</Link>
				{id && (
					<Button size={"icon"}>
						<Share />
					</Button>
				)}
				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="relative h-10 w-10 rounded-full"
							>
								<Avatar className="h-10 w-10">
									<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{user.name}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{user.email}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link to="/app/settings">Settings</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Link className={buttonVariants({ variant: "dashed" })} to="/login">
						Log in
					</Link>
				)}
			</div>
		</header>
	);
}
