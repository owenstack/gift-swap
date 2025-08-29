import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { db, ID } from "@/lib/appwrite";
import { readCategorySchema } from "@/lib/constants";
import { useNameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { categoryKeys } from "@/queries/keys";

export function CategorySelect({
	onSelect,
	disabled = false,
}: {
	onSelect: (opt: { id: string; name: string }) => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("");
	const { data, isPending } = useQuery({
		queryKey: categoryKeys.all,
		queryFn: async () => {
			const res = await db.listRows({
				databaseId: env.VITE_APPWRITE_DATABASE_ID,
				tableId: "category",
			});
			return readCategorySchema.safeParse(res);
		},
		staleTime: Infinity,
	});
	const categories = data?.data?.rows;
	const { addName, clear } = useNameStore();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className={buttonVariants({
					variant: "outline",
					className: "w-fit justify-between",
				})}
				onClick={clear}
				disabled={disabled || (open && isPending)}
			>
				{selectedCategory || "Select category..."}
				<ChevronsUpDown className="opacity-50" />
			</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandInput
						onValueChange={(value) => addName(value)}
						placeholder="Search category..."
					/>
					<CommandList>
						<CommandEmpty className="grid gap-2">
							<p>No categories found.</p>
							<CreateCategoryDialog />
						</CommandEmpty>
						<CommandGroup>
							{isPending && (
								<div className="p-2 space-y-2">
									<Skeleton className="h-8 w-full rounded" />
									<Skeleton className="h-8 w-full rounded" />
									<Skeleton className="h-8 w-full rounded" />
								</div>
							)}
							{categories?.map((category) => (
								<CommandItem
									key={category.$id}
									value={category.name}
									onSelect={(currentValue) => {
										setSelectedCategory(
											currentValue === selectedCategory ? "" : currentValue,
										);
										onSelect({ id: category.$id, name: category.name });
										setOpen(false);
									}}
								>
									{category.name}
									<Check
										className={cn(
											"ml-auto",
											selectedCategory.toLowerCase() ===
												category.name.toLowerCase()
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
							<CreateCategoryDialog />
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function CreateCategoryDialog() {
	const queryClient = useQueryClient();
	const formSchema = z.object({
		name: z.string(),
		description: z.string().optional(),
	});
	const [open, setOpen] = useState(false);
	const { name, clear } = useNameStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name,
			description: "",
		},
	});
	const { mutateAsync, isPending } = useMutation({
		mutationFn: (values: z.infer<typeof formSchema>) => {
			return db.createRow({
				databaseId: env.VITE_APPWRITE_DATABASE_ID,
				tableId: "category",
				data: values,
				rowId: ID.unique(),
			});
		},
	});

	const submit = async (data: z.infer<typeof formSchema>) => {
		toast.promise(mutateAsync(data), {
			loading: "Creating category...",
			success: () => {
				clear();
				setOpen(false);
				queryClient.invalidateQueries({ queryKey: categoryKeys.all });
				return "Category created successfully!";
			},
			error: (err) =>
				err instanceof Error ? err.message : "Failed to create category",
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={buttonVariants({ variant: "outline" })}>
				Create Category
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Category</DialogTitle>
					<DialogDescription>Create a new category.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={isPending}>
							{isPending ? <Loader2 className="animate-spin" /> : "Create"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
