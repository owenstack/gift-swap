import { Star, Heart, Repeat, Gift } from "lucide-react";

export const conditionConfig = {
	new: {
		icon: Star,
		color: "bg-green-100 text-green-800 border-green-200",
		label: "New",
	},
	"like-new": {
		icon: Star,
		color: "bg-blue-100 text-blue-800 border-blue-200",
		label: "Like New",
	},
	good: {
		icon: Star,
		color: "bg-yellow-100 text-yellow-800 border-yellow-200",
		label: "Good",
	},
	fair: {
		icon: Star,
		color: "bg-orange-100 text-orange-800 border-orange-200",
		label: "Fair",
	},
	poor: {
		icon: Star,
		color: "bg-red-100 text-red-800 border-red-200",
		label: "Poor",
	},
};

export const swapTypeConfig = {
	giveaway: {
		icon: Heart,
		color: "bg-pink-100 text-pink-800 border-pink-200",
		label: "Giveaway",
	},
	swap: {
		icon: Repeat,
		color: "bg-purple-100 text-purple-800 border-purple-200",
		label: "Swap",
	},
	trade: {
		icon: Gift,
		color: "bg-indigo-100 text-indigo-800 border-indigo-200",
		label: "Trade",
	},
};
