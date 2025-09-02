import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Check, Plus, Share } from "lucide-react";
import { toast } from "sonner";
import { env } from "@/env";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { db } from "@/lib/appwrite";
import { authService, useUser } from "@/lib/auth";
import { readGiftSchema } from "@/lib/constants";
import { getInitials } from "@/lib/helpers";
import { giftKeys } from "@/queries/keys";
import { Logo } from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function NavBar() {
	const { isCopied, copyToClipboard } = useCopyToClipboard({
		onCopy: () => {
			toast.success("Link copied to clipboard!");
		},
	});
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
		pathParts[1] &&
		pathParts[1] !== "new" &&
		pathParts[1] !== "edit" &&
		pathParts[1] !== "message"
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

	const handleShare = () => {
		const url = window.location.href;
		const title = "Gift Swap - Check out this gift!";
		const text = `Take a look at this gift: ${data?.title || "a gift on Gift Swap"}.`;
		if (navigator.share) {
			toast.promise(
				navigator.share({
					title,
					text,
					url,
				}),
				{
					loading: "Sharing...",
					success: "Gift shared successfully!",
					error: (err) =>
						err instanceof Error ? err.message : "Error sharing gift.",
				},
			);
		}
		copyToClipboard(url);
	};

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
												className="line-clamp-1"
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
					<Button
						size={"icon"}
						variant="secondary"
						onClick={handleShare}
						disabled={isCopied}
					>
						{isCopied ? <Check /> : <Share />}
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
