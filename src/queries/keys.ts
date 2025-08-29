export const categoryKeys = {
	all: ["categories"] as const,
	lists: () => [...categoryKeys.all, "list"] as const,
	list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
	details: () => [...categoryKeys.all, "detail"] as const,
	detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const giftKeys = {
	all: ["gifts"] as const,
	lists: () => [...giftKeys.all, "list"] as const,
	list: (filters: string) => [...giftKeys.lists(), { filters }] as const,
	details: () => [...giftKeys.all, "detail"] as const,
	detail: (id: string) => [...giftKeys.details(), id] as const,
};
