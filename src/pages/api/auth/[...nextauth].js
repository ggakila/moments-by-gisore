import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

export const authOptions = {
	pages: {
		signIn: "/Login",
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {},
			async authorize(credentials) {
				return await signInWithEmailAndPassword(
					auth,
					credentials.email || "",
					credentials.password || ""
				)
					.then((userCredential) => {
						if (userCredential.user) {
							return userCredential.user;
						}
						return null;
					})
					.catch((error) => console.log(error));
			},
		}),
	],
};

export default NextAuth(authOptions);
