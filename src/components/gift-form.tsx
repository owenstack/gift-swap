import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera, Gift, Tag, FileText, MapPin } from "lucide-react";
import { addOrEditGiftSchema } from "@/lib/constants";
import { useUser } from "@/lib/auth";
import { conditionConfig, swapTypeConfig } from "./config";
import GalleryUpload from "./file-upload/gallery-upload";
import { CategorySelect } from "./category-select";
import { giftKeys } from "@/queries/keys";
import { db, ID, storage } from "@/lib/appwrite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@/env";
import { toast } from "sonner";

export function GiftForm({
	data,
}: {
	data?: z.infer<typeof addOrEditGiftSchema>;
}) {
	const queryClient = useQueryClient();
	const user = useUser();
	const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

	const form = useForm({
		resolver: zodResolver(addOrEditGiftSchema),
		defaultValues: data
			? {
					...data,
					user_id: user?.$id, // Mock user ID
				}
			: {
					title: "",
					description: "",
					condition: "good",
					swap_type: "giveaway",
					image_urls: [],
					user_id: user?.$id, // Mock user ID
					status: "available",
					state: "",
					category: "",
				},
	});

	const { mutateAsync, isPending } = useMutation({
		mutationFn: (values: z.infer<typeof addOrEditGiftSchema>) =>
			db.upsertRow({
				databaseId: env.VITE_APPWRITE_DATABASE_ID,
				tableId: "gift-table",
				rowId: values.$id ?? ID.unique(),
				data: values,
			}),
		mutationKey: giftKeys.lists(),
		onSuccess: () => {
			form.reset();
			queryClient.invalidateQueries({
				queryKey: giftKeys.lists(),
			});
		},
	});

	const submit = async (values: z.infer<typeof addOrEditGiftSchema>) => {
		const promise = async () => {
			const initialFiles = await Promise.all(
				filesToUpload.map(async (f) => {
					const res = await storage.createFile({
						file: f,
						bucketId: env.VITE_APPWRITE_BUCKET_ID,
						fileId: ID.unique(),
					});
					return res.$id;
				}),
			);
			const fileUrls = await Promise.all(
				initialFiles.map(async (fileId) => {
					const url = storage.getFileView({
						bucketId: env.VITE_APPWRITE_BUCKET_ID,
						fileId,
					});
					return url;
				}),
			);
			form.setValue("image_urls", fileUrls);
			return mutateAsync(values);
		};
		toast.promise(promise(), {
			loading: values.$id ? "Updating gift..." : "Creating gift...",
			success: values.$id
				? "Gift updated successfully!"
				: "Gift created successfully!",
			error: (err) =>
				err instanceof Error ? err.message : "Error creating gift.",
		});
	};

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-primary">
					{data ? "Edit Gift" : "Share a Gift"}
				</h1>
				<p className="text-secondary-foreground">
					Help build your community by sharing items you no longer need
				</p>
			</div>

			<div className="space-y-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(submit)}
						className="grid grid-cols-1 lg:grid-cols-3 gap-8"
					>
						<div className="lg:col-span-2 space-y-6">
							{/* Basic Information */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										Basic Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor={field.name}>Gift Title *</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="What are you giving away?"
														className="text-lg"
													/>
												</FormControl>
												<FormDescription>
													Give your item a clear, descriptive title
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor={field.name}>Description</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Tell us more about this item - its history, why you're giving it away, any special features..."
														rows={4}
													/>
												</FormControl>
												<FormDescription>
													Help others understand what makes this item special
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Category and Location */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Tag className="h-5 w-5" />
										Category & Location
									</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor={field.name}>Category</FormLabel>
												<FormControl>
													<CategorySelect
														onSelect={(opt) => {
															field.onChange(opt.id);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="state"
										render={({ field }) => (
											<FormItem>
												<FormLabel
													htmlFor={field.name}
													className="flex items-center gap-1"
												>
													<MapPin className="h-4 w-4" />
													Location *
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="City, State" />
												</FormControl>
												<FormDescription>
													Help others find local items
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Condition */}
							<Card>
								<CardHeader>
									<CardTitle>Item Condition</CardTitle>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="condition"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className="grid grid-cols-2 md:grid-cols-5 gap-3"
													>
														{Object.entries(conditionConfig).map(
															([value, config]) => (
																<FormItem key={value}>
																	<FormControl>
																		<RadioGroupItem
																			value={value}
																			className="sr-only"
																		/>
																	</FormControl>
																	<FormLabel
																		className={`
                                    flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                                    hover:shadow-md
                                    ${field.value === value ? config.color : "border-gray-200 hover:border-gray-300"}
                                  `}
																	>
																		<config.icon className="h-5 w-5 mb-2" />
																		<span className="text-sm font-medium">
																			{config.label}
																		</span>
																	</FormLabel>
																</FormItem>
															),
														)}
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Swap Type */}
							<Card>
								<CardHeader>
									<CardTitle>What are you looking for?</CardTitle>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="swap_type"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className="grid grid-cols-1 md:grid-cols-3 gap-4"
													>
														{Object.entries(swapTypeConfig).map(
															([value, config]) => (
																<FormItem key={value}>
																	<FormControl>
																		<RadioGroupItem
																			value={value}
																			className="sr-only"
																		/>
																	</FormControl>
																	<FormLabel
																		className={`
                                    flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all
                                    hover:shadow-md
                                    ${field.value === value ? config.color : "border-gray-200 hover:border-gray-300"}
                                  `}
																	>
																		<config.icon className="h-8 w-8 mb-3" />
																		<span className="font-semibold">
																			{config.label}
																		</span>
																		<span className="text-xs text-center mt-1 text-gray-600">
																			{value === "giveaway" &&
																				"Give it away for free"}
																			{value === "swap" &&
																				"Exchange for something similar"}
																			{value === "trade" &&
																				"Trade for something different"}
																		</span>
																	</FormLabel>
																</FormItem>
															),
														)}
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>

						{/* Image Upload Sidebar */}
						<div className="space-y-6">
							<Card className="sticky top-6">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Camera className="h-5 w-5" />
										Photos
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<GalleryUpload
										onFilesChange={(data) => {
											const files = data.map((f) => f.file as File);
											setFilesToUpload(files);
											form.setValue("image_urls", []);
										}}
										initialFiles={data?.image_urls?.map((url) => ({
											id: url,
											name: url.split("/").pop() ?? "image",
											url,
											type: "image/*",
											size: 0,
										}))}
									/>
								</CardContent>
							</Card>

							{/* Submit Button */}
							<Button
								className="w-full h-12 text-lg font-semibold"
								disabled={isPending}
							>
								{isPending ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Creating Gift...
									</>
								) : (
									<>
										<Gift className="h-5 w-5 mr-2" />
										{data ? "Update Gift" : "Create Gift"}
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
