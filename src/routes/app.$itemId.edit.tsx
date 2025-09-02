import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Search, XCircle } from "lucide-react";
import { GiftForm } from "@/components/gift-form";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { db, Query } from "@/lib/appwrite";
import { useUser } from "@/lib/auth";
import { readGiftSchema } from "@/lib/constants";
import { giftKeys } from "@/queries/keys";

export const Route = createFileRoute("/app/$itemId/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const user = useUser();
	const { itemId } = Route.useParams();
	const { data, isLoading } = useQuery({
		queryKey: giftKeys.detail(itemId),
		queryFn: async () => {
			const res = await db.getRow({
				databaseId: env.VITE_APPWRITE_DATABASE_ID,
				tableId: "gift-table",
				rowId: itemId,
				queries: [Query.equal("user_id", [user?.$id || ""])],
			});
			return readGiftSchema.parse(res);
		},
	});
	return (
		<div>
			{isLoading ? (
				<EditSkeleton />
			) : data ? (
				<GiftForm data={data} />
			) : (
				<ErrorState />
			)}
		</div>
	);
}

const EditSkeleton = () => (
	<div className="max-w-4xl mx-auto p-6 space-y-8">
		{/* Header skeleton */}
		<div className="text-center space-y-4">
			<Skeleton className="h-8 w-64 mx-auto" />
			<Skeleton className="h-4 w-96 mx-auto" />
		</div>

		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Main form skeleton */}
			<div className="lg:col-span-2 space-y-6">
				{/* Card 1 */}
				<Card>
					<CardHeader>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-5 w-5 rounded" />
							<Skeleton className="h-6 w-32" />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-3 w-48" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-3 w-56" />
						</div>
					</CardContent>
				</Card>

				{/* Card 2 */}
				<Card>
					<CardHeader>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-5 w-5 rounded" />
							<Skeleton className="h-6 w-40" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Card 3 - Condition options */}
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
							{[...Array(5)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <index used for iteration>
								<Skeleton key={i} className="h-20 w-full rounded-lg" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sidebar skeleton */}
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-5 w-5 rounded" />
							<Skeleton className="h-6 w-16" />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-2">
							<Skeleton className="h-24 w-full rounded-lg" />
							<Skeleton className="h-24 w-full rounded-lg" />
						</div>
						<Skeleton className="h-32 w-full rounded-lg" />
					</CardContent>
				</Card>
				<Skeleton className="h-12 w-full rounded-lg" />
			</div>
		</div>
	</div>
);

const ErrorState = () => (
	<div className="min-h-[60vh] flex items-center justify-center p-6">
		<Card className="max-w-lg w-full shadow-lg">
			<CardHeader className="text-center pb-4">
				{/* Animated error icon */}
				<div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mb-6 relative">
					<div className="absolute inset-0 rounded-full bg-red-100 animate-pulse"></div>
					<XCircle className="h-10 w-10 text-red-500 relative z-10" />
				</div>

				<CardTitle className="text-2xl font-bold text-gray-900 mb-2">
					Gift Not Found
				</CardTitle>
				<CardDescription className="text-base text-gray-600 leading-relaxed">
					We couldn't find the gift you're looking for. It might have been
					removed, or the link you used might be incorrect.
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-2">
				{/* Helpful suggestions */}
				<div className="bg-gray-50 rounded-lg p-4 space-y-2">
					<h4 className="font-medium text-gray-900 text-sm">
						What you can do:
					</h4>
					<ul className="text-sm text-gray-600 space-y-1">
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
							Check the URL for any typos
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
							The gift might have been claimed or removed
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
							Try refreshing the page
						</li>
					</ul>
				</div>
			</CardContent>
			<div className="px-6 pb-6">
				<div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
					<Link
						to="/app"
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						<Search className="h-4 w-4" />
						Browse Gifts
					</Link>
					<Link
						to="/app/new"
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						<Gift className="h-4 w-4" />
						Share a Gift
					</Link>
				</div>
			</div>
		</Card>
	</div>
);
