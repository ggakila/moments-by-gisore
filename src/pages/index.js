// pages/index.
'use client';
import Gallery from "./Gallery";
import {useSession} from 'next-auth/react';
import { useRouter } from "next/router";


export default function Home() {
	const router = useRouter();


	const session = useSession({
		required: true,
		onUnauthenticated(){
			router.push("/Login");
		}
	})
	return (
	<main className="">
		<Gallery />
	</main>
)};
