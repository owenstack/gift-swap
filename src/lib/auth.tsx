import { ID, type Models, OAuthProvider } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { env } from "@/env";
import { account } from "@/lib/appwrite";

type AuthState = {
	user: Models.User<Models.Preferences> | null;
	session: Models.Session | null;
	isLoading: boolean;
};

class AuthService {
	private state: AuthState = {
		user: null,
		session: null,
		isLoading: true,
	};
	private listeners = new Set<() => void>();

	constructor() {
		this.init();
	}

	private async init() {
		try {
			const session = await account.getSession("current");
			const user = await account.get();
			this.state = { user, session, isLoading: false };
		} catch (error) {
			console.error("Authentication error:", error);
			this.state = { user: null, session: null, isLoading: false };
		}
		this.emitChange();
	}

	public getSnapshot = () => {
		return this.state;
	};

	public subscribe = (listener: () => void) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	private emitChange() {
		for (const listener of this.listeners) {
			listener();
		}
	}

	public loginWithEmail = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		await account.createEmailPasswordSession({ email, password });
		await this.init();
	};

	public signUpWithEmail = async (values: {
		email: string;
		password: string;
		name: string;
	}) => {
		await account.create({ userId: ID.unique(), ...values });
		await this.init();
	};

	public signInWithGoogle = async () => {
		account.createOAuth2Session({
			provider: OAuthProvider.Google,
			success: import.meta.env.DEV
				? "http://localhost:3000"
				: `${env.VITE_APP_URL}`,
			failure: import.meta.env.DEV
				? "http://localhost:3000/failed"
				: `${env.VITE_APP_URL}/failed`,
		});
		await this.init();
	};

	public logout = async () => {
		await account.deleteSession({
			sessionId: "current",
		});
		this.state = { user: null, session: null, isLoading: false };
		this.emitChange();
	};
}

export const authService = new AuthService();

const AuthContext = createContext<AuthState>({
	user: null,
	session: null,
	isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [authState, setAuthState] = useState(authService.getSnapshot());

	useEffect(() => {
		const unsubscribe = authService.subscribe(() => {
			setAuthState(authService.getSnapshot());
		});
		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => {
	return useContext(AuthContext);
};

export function useUser() {
	const { user } = useAuth();
	return user;
}

export function useSession() {
	const { session, isLoading } = useAuth();
	return { session, isLoading };
}
