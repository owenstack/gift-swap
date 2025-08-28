import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Google } from "@/assets/icons";
import { authService } from "@/lib/auth";
import type { ButtonProps } from "@/lib/constants";
import { Button } from "./ui/button";

export function GoogleButton({
	variant = "inverse",
	size = "md",
	className,
}: Omit<ButtonProps, "children">) {
	const [loading, setLoading] = useState(false);
	const submit = async () => {
		const promise = authService.signInWithGoogle();
		toast.promise(promise, {
			loading: "Logging in...",
			success: "Logged in successfully!",
			error: (err) =>
				err instanceof Error ? err.message : "Failed to log in.",
		});
		try {
			await promise;
		} finally {
			setLoading(false);
		}
	};
	return (
		<Button
			variant={variant}
			onClick={submit}
			size={size}
			className={className}
			disabled={loading}
		>
			{loading ? <Loader2 className="animate-spin" /> : <Google />}
			Continue with Google
		</Button>
	);
}
