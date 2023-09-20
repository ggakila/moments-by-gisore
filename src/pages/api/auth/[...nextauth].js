// pages/api/auth.js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { sign } from "jsonwebtoken";

export default NextAuth({
	providers: [
		Providers.Credentials({
			// The name to display on the sign-in form
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				// Custom authentication logic here
				if (
					credentials.username === "ggakila" &&
					credentials.password === "mandazimoto123"
				) {
					// Generate a JWT token
					const user = { username: "ggakila" };
					const token = sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

					// Return user and token
					return Promise.resolve({ user, token });
				} else {
					return Promise.resolve(null); // Return null if authentication fails
				}
			},
		}),
	],
	callbacks: {
		async jwt(token, user) {
			if (user) {
				// Attach the user to the token
				token.id = user.id;
				token.username = user.username;
			}
			return token;
		},
		async session(session, token) {
			// Attach the token to the session
			session.user = token;
			return session;
		},
	},
	// Add other configuration options as needed.
});
