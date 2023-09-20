import React from 'react'
import ImagesDropZone from '../components/ImagesDropZone';
import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import Router from "next/router";


export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: "/Login",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}

export default function Gallery() {
  const { data: session } = useSession();

  useEffect(() => {
    // Redirect to the login page if the user is not authenticated
    if (!session) {
      Router.push("/Login");
    }
  }, [session]);

  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full flex justify-center">
        <ImagesDropZone  />
      </div>
    </div>
  );
}
