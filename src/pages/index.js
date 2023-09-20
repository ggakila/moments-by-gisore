// pages/index.js
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import {getSession} from "next-auth/react";
import Router from "next/router";

export async function getServerSideProps(context) {
	const session = await getSession(context);

	return {
		props: {
			session: session || null,
		},
	};
}

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