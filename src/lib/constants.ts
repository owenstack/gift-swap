import { z } from "zod";

export interface ButtonProps {
	variant?:
		| "primary"
		| "mono"
		| "destructive"
		| "secondary"
		| "outline"
		| "dashed"
		| "ghost"
		| "dim"
		| "foreground"
		| "inverse";
	size?: "icon" | "lg" | "md" | "sm";
	children: React.ReactNode;
	className?: string;
}

const coreDbSchema = z.object({
	$permissions: z.array(z.string()),
	$createdAt: z.iso.datetime(),
	$updatedAt: z.iso.datetime(),
	$databaseId: z.string(),
	$tableId: z.string(),
	$id: z.string(),
});

export const addOrEditGiftSchema = z.object({
	$id: z.string().optional(),
	title: z.string().min(2).max(100),
	description: z.string().max(1000).optional(),
	condition: z.enum(["new", "like-new", "good", "fair", "poor"]),
	swap_type: z.enum(["giveaway", "swap", "trade"]),
	category: z.string(),
	image_urls: z.array(z.url()).optional(),
	user_id: z.string().optional(),
	status: z.enum(["available", "pending", "completed", "expired"]),
	state: z.string(),
});

export const listGiftSchema = z.object({
	rows: z.array(addOrEditGiftSchema.extend({ ...coreDbSchema.shape })),
});

export const readGiftSchema = addOrEditGiftSchema.extend({
	...coreDbSchema.shape,
});

export const addCategorySchema = z.object({
	name: z.string().min(2).max(50),
	slug: z.string().min(2).max(50),
});

export const readCategorySchema = z.object({
	rows: z.array(
		addCategorySchema.extend({
			...coreDbSchema.shape,
			$sequence: z.number(),
		}),
	),
	total: z.number(),
});
