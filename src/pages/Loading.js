import React from 'react';
import Image from "next/image";


export default function Loading() {
  return (
		<div className="text-gray-600 text-[30px] flex items-center justify-center h-screen w-screen">
			<div className="">
				<Image
					src="/loading.gif"
					width={100}
					height={80}
					alt="loading"
					style={{ objectFit: "contain" }}
				/>
			</div>
			<p className="text-gray-300 text-[20px]">Loading...</p>
		</div>
	);
}

