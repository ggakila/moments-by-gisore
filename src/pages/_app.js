import SessionProvider from "./SessionProvider";
import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Moments by Gisore</title>
			</Head>
			<SessionProvider>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}
