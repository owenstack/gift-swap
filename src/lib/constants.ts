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
