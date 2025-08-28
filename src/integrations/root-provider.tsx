import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "./theme-provider";

export function getContext() {
	const queryClient = new QueryClient();
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider defaultTheme="dark" storageKey="gift-swap-theme">
					{children}
					<Toaster richColors />
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
