import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

export default function MyDropzone({ className }) {
	const [imagez, setImagez] = useState([]);
	const onDrop = useCallback((acceptedFiles) => {
		console.log(acceptedFiles);
		if (acceptedFiles.length) {
			setImagez((prevImages) => [
				...prevImages,
				...acceptedFiles.map((image) =>
					Object.assign(image, { preview: URL.createObjectURL(image) })
				),
			]);
		}
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="w-full flex flex-col gap-[30px] items-center">
			<div className="w-full top-0 flex justify-between  px-[20px] md:px-[100px] py-[40px] items-center">
				<h1 className="text-2xl sm:text-3xl md:text-5xl flex items-center text-center">
					m
					<span className="px-1">
						<Image
							className=""
							src="/logo.svg"
							width={40}
							height={40}
							alt="logo"
							style={{ fill: "white" }}
						/>
					</span>
					ments
				</h1>
				<h1 className="text-[10px] sm:text-xl">by haggai gisore</h1>
			</div>
			<div
				{...getRootProps({
					className: className,
				})}
				className="w-4/5 items-center flex flex-col gap-[8px]  justify-center mt-[0px] text-black"
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p className="text-neutral-400 w-5/6 text-center py-[70px] bg-black border border-neutral-700 border-dashed">
						Drop the files here ...
					</p>
				) : (
					<p className="text-neutral-400 w-5/6 text-center py-[70px] bg-black border border-neutral-700 border-dashed flex flex-col ">
						<span className="font-bold text-xl">
							Drag 'n' drop some files here,
						</span>{" "}
						or <span>click to select files</span>
					</p>
				)}
			</div>
			<div className=" flex flex-wrap gap-[10px] justify-center preview w-5/6 h-full  ">
				{imagez.map((image) => (
					<div
						key={image.name}
						className="w-[200px] h-[200px] relative"
					>
						<Image
							className="border overflow-hidden rounded-lg"
							src={image.preview}
							fill={true}
							alt=""
							style={{ objectFit: "cover" }}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
