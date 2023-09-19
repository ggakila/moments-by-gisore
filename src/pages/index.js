// pages/index.js
import Login from "@/pages/Login";
import Gallery from "@/pages/Gallery";
import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	return (
		<main className="">
			<Login />
			{session ? <Gallery /> : null}
		</main>
	);
}
