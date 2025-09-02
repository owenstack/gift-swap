import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Calendar,
	Clock,
	Edit,
	Eye,
	Gift,
	Heart,
	MapPin,
	MessageCircle,
	Package,
	Search,
	Share,
	Star,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import type z from "zod";
import { conditionConfig, swapTypeConfig } from "@/components/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { db } from "@/lib/appwrite";
import { useUser } from "@/lib/auth";
import { readGiftSchema } from "@/lib/constants";
import { formatDate, getInitials } from "@/lib/helpers";
import { giftKeys } from "@/queries/keys";

export const Route = createFileRoute("/_app/$itemId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { itemId } = Route.useParams();
	const { data, isLoading } = useQuery({
		queryKey: giftKeys.detail(itemId),
		queryFn: async () => {
			const res = await db.getRow({
				databaseId: env.VITE_APPWRITE_DATABASE_ID,
				tableId: "gift-table",
				rowId: itemId,
			});
			return readGiftSchema.parse(res);
		},
	});
	return (
		<div>
			{isLoading ? (
				<GiftDetailSkeleton />
			) : data ? (
				<GiftDetail data={data} />
			) : (
				<GiftNotFound />
			)}
		</div>
	);
}

const GiftDetailSkeleton = () => (
	<div className="max-w-6xl mx-auto p-6">
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Images skeleton */}
			<div className="lg:col-span-2">
				<Card>
					<CardContent className="p-0">
						<Skeleton className="w-full h-96 rounded-t-lg" />
						<div className="p-4">
							<div className="flex gap-2">
								{[...Array(4)].map((_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <index used for iteration>
									<Skeleton key={i} className="w-16 h-16 rounded" />
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Details skeleton */}
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-3/4" />
						<div className="flex gap-2">
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-6 w-20" />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
						<Separator />
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-24" />
							</div>
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-32" />
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex gap-2">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-10" />
						<Skeleton className="h-10 w-10" />
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-24" />
					</CardHeader>
					<CardContent className="flex items-center gap-3">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-32" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	</div>
);

const GiftNotFound = () => (
	<div className="flex items-center justify-center min-h-[70vh] p-6">
		<Card className="max-w-lg w-full">
			<CardHeader className="text-center">
				<div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mb-6 relative">
					<div className="absolute inset-0 rounded-full bg-red-100 animate-pulse"></div>
					<Package className="h-10 w-10 text-red-500 relative z-10" />
				</div>
				<CardTitle className="text-2xl">Gift Not Found</CardTitle>
				<CardDescription className="text-base leading-relaxed">
					This gift might have been removed, claimed, or the link you used is
					incorrect.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Alert>
					<Gift className="h-4 w-4" />
					<AlertDescription>
						Don't worry! There are plenty of other amazing gifts available in
						our community.
					</AlertDescription>
				</Alert>
			</CardContent>
			<div className="px-6 pb-6">
				<div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
					<Link
						to="/"
						className={buttonVariants({ variant: "ghost", size: "sm" })}
					>
						<Search className="h-4 w-4" />
						Browse Gifts
					</Link>
					<Link
						to="/new"
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

const GiftDetail = ({ data }: { data: z.infer<typeof readGiftSchema> }) => {
	const [api, setApi] = useState<CarouselApi>();
	const [count, setCount] = useState(0);
	const [current, setCurrent] = useState(0);
	const user = useUser();
	const images = data.image_urls || ["/api/placeholder/400/300"];
	const SwapIcon = swapTypeConfig[data.swap_type]?.icon;
	const isOwner = data.user_id === user?.$id;

	useEffect(() => {
		if (!api) return;
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<div className="max-w-6xl mx-auto p-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<Card className="overflow-hidden">
						<CardContent className="p-0">
							<div className="relative">
								<Carousel setApi={setApi}>
									<CarouselContent>
										{images.map((image) => (
											<CarouselItem key={image}>
												<img
													src={image}
													alt={data.title}
													className="w-full h-96 object-cover"
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
								<div className="absolute bottom-4 right-4  px-3 py-1 rounded-full text-sm">
									{current} / {count}
								</div>
							</div>

							{/* Thumbnail Gallery */}
							{images.length > 1 && (
								<div className="p-4 ">
									<div className="flex gap-3 overflow-x-auto">
										{images.map((image) => (
											<Button
												key={image}
												className="flex shrink-0 size-16 overflow-hidden transition-colors"
												variant={current === count ? "outline" : "dashed"}
											>
												<img
													src={image}
													alt={`${data.title} thumbnail`}
													className="w-full h-full object-cover"
												/>
											</Button>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
									<div className="flex flex-wrap gap-2 mb-3">
										<Badge className={conditionConfig[data.condition]?.color}>
											<Star className="h-3 w-3 mr-1" />
											{conditionConfig[data.condition]?.label}
										</Badge>
										<Badge className={swapTypeConfig[data.swap_type]?.color}>
											<SwapIcon className="h-3 w-3 mr-1" />
											{swapTypeConfig[data.swap_type]?.label}
										</Badge>
										<Badge variant="outline">{data.category}</Badge>
									</div>
								</div>
								{isOwner && (
									<Link
										className={buttonVariants({
											variant: "outline",
											size: "sm",
										})}
										to="/$itemId/edit"
										params={{
											itemId: data.$id,
										}}
									>
										<Edit />
									</Link>
								)}
							</div>
							{data.description && (
								<CardDescription className="text-base leading-relaxed">
									{data.description}
								</CardDescription>
							)}
						</CardHeader>
						<CardContent className="space-y-4">
							<Separator />
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="flex items-center gap-2 text-gray-600">
									<MapPin className="h-4 w-4" />
									<span>{data.state || "Location not specified"}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600">
									<Calendar className="h-4 w-4" />
									<span>Posted {formatDate(data.$createdAt)}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600">
									<Clock className="h-4 w-4" />
									<span className="capitalize">{data.status}</span>
								</div>
								<div className="flex items-center gap-2 text-gray-600">
									<Eye className="h-4 w-4" />
									<span>{Math.floor(Math.random() * 100) + 10} views</span>
								</div>
							</div>
						</CardContent>

						{!isOwner && (
							<CardFooter className="flex gap-2">
								<Link
									to="/message"
									className={buttonVariants({ variant: "outline" })}
								>
									<MessageCircle className="h-4 w-4 mr-2" />
									Contact Owner
								</Link>
								<Button variant="outline" size="icon">
									<Heart className="h-4 w-4" />
								</Button>
								<Button variant="outline" size="icon">
									<Share className="h-4 w-4" />
								</Button>
							</CardFooter>
						)}
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<User className="h-5 w-5" />
								Gift Owner
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={`/api/placeholder/48/48`} />
									<AvatarFallback>
										{getInitials("Anonymous User")}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-semibold">{"Anonymous User"}</p>
									<div className="flex items-center gap-1 mt-1">
										{[...Array(5)].map((_, i) => (
											<Star
												// biome-ignore lint/suspicious/noArrayIndexKey: <index used for iteration>
												key={i}
												className={`h-3 w-3 ${
													i < 4
														? "fill-yellow-400 text-yellow-400"
														: "text-gray-300"
												}`}
											/>
										))}
										<span className="text-xs text-gray-600 ml-1">4.8</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg text-blue-900">
								Safety First
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-blue-800 space-y-2">
							<p>• Meet in public places for exchanges</p>
							<p>• Bring a friend if possible</p>
							<p>• Trust your instincts</p>
							<p>• Report suspicious activity</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
