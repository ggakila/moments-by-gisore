// pages/index.js
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import Router from "next/router";

export default function Home() {
	const { data: session } = useSession();

	useEffect(() => {
		// Redirect to the login page if the user is not authenticated
		if (!session) {
			Router.push("/Login");
		}
	}, [session]);

	return <main className="">{session ? <Gallery /> : null}</main>;
}