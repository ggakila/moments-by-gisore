import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign-in form (e.g., "Sign in with...")
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				// Hardcoded username and password for authentication
				if (
					credentials.username === "ggakila" &&
					credentials.password === "mandazimoto123"
				) {
					return Promise.resolve({ username: "ggakila" });
				} else {
					return Promise.resolve(null); // Return null if authentication fails
				}
			},
		}),
	],
	callbacks: {
		async signIn(user, account, profile) {
			// Add any custom logic you need when a user signs in.
			return Promise.resolve(true);
		},
	},
	// Add other configuration options as needed.
});
