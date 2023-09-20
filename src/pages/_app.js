import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps: {session, ...pageProps} }) {
	return (
		<>
			<SessionProvider session={pageProps.session}>
				<Head>
					<title>Moments by Gisore</title>
				</Head>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}