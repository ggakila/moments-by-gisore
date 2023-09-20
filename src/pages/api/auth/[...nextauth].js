// Import necessary modules and packages
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sign } from "jsonwebtoken";

// Define and export the NextAuth configuration
export default NextAuth({
	// Define authentication providers
	providers: [
		CredentialsProvider({
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
					credentials.password === "mandazi"
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
	secret: process.env.NEXTAUTH_SECRET,
	// Define callbacks for JWT and session handling
	callbacks: {
		async jwt(token, user) {
			if (user) {
				// Attach the user properties to the token
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

	session: {
		jwt: true,
	}
	// Add other configuration options as needed.
});
