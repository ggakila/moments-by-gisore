'use client'
import ImagesDropZone from '../components/ImagesDropZone';
import {useState, useEffect} from 'react';
import Loading from './Loading';

export default function Gallery(){

	const [isLoading, setIsLoading] = useState(true);	

	

	useEffect(() => {
		setTimeout(function () {
			setIsLoading(false);
		}, 1000);
	}, []);

  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full flex justify-center">
        {isLoading ? <Loading/> : <ImagesDropZone  />}
      </div>
    </div>
  );
}
