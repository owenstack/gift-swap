import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { GoogleButton } from "@/components/google";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/auth";

export const Route = createFileRoute("/_auth/signup")({
	component: RouteComponent,
});

const signupSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(100),
	name: z.string().min(2).max(100),
});

function RouteComponent() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	const submit = async (values: z.infer<typeof signupSchema>) => {
		setLoading(true);
		const promise = authService.signUpWithEmail(values);
		toast.promise(promise, {
			loading: "Signing up...",
			success: () => {
				navigate({ to: "/app" });
				return "Signed up successfully!";
			},
			error: (err) =>
				err instanceof Error ? err.message : "Failed to sign up.",
		});

		try {
			await promise;
		} finally {
			setLoading(false);
		}
	};
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<Logo />
						<h1 className="text-xl font-bold">Welcome to Gift Swap</h1>
						<div className="text-center text-sm">
							Already have an account?{" "}
							<Link to="/login" className="underline underline-offset-4">
								Log in
							</Link>
						</div>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(submit)}
							className="flex flex-col gap-6"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												autoComplete="name"
												placeholder="John Doe"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												autoComplete="email"
												placeholder="m@example.com"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="password"
												autoComplete="current-password"
												placeholder="••••••	"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={loading} className="w-full">
								{loading ? "Logging in..." : "Log in"}
							</Button>
						</form>
					</Form>
					<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="text-muted-foreground relative z-10 px-2">Or</span>
					</div>
					<GoogleButton variant="outline" />
				</div>
				<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
					By clicking continue, you agree to our{" "}
					<Link to="/tos">Terms of Service</Link> and{" "}
					<Link to="/tos">Privacy Policy</Link>.
				</div>
			</div>
		</main>
	);
}
