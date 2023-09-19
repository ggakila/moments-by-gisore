import React from 'react'
import ImagesDropZone from '../components/ImagesDropZone'

export default function Gallery() {
  return (
		<div className=" h-screen w-screen">
			<div className="h-full w-full flex justify-center">
				<ImagesDropZone  />
			</div>
		</div>
	);
}

