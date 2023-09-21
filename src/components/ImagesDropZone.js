"use client";
import { signOut, useSession } from "next-auth/react";
import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";


const DragDropContext = dynamic(
	() =>
		import("react-beautiful-dnd").then((mod) => {
			return mod.DragDropContext;
		}),
	{ ssr: false }
);
const Droppable = dynamic(
	() =>
		import("react-beautiful-dnd").then((mod) => {
			return mod.Droppable;
		}),
	{ ssr: false }
);
const Draggable = dynamic(
	() =>
		import("react-beautiful-dnd").then((mod) => {
			return mod.Draggable;
		}),
	{ ssr: false }
);

export default function MyDropzone({ className }) {

	const router =useRouter();

const session = useSession({
	required: true,
	onUnauthenticated() {
		router.push("/Login");
	},
});

	const [imagez, setImagez] = useState([
		{
			id: "developer",
			name: "developer",
			preview: "/imagezz/developer.jpg",
		},
		{
			id: "sculpture",
			name: "sculpture",
			preview: "/imagezz/sculpture.jpg",
		},
		{
			id: "woman",
			name: "woman",
			preview: "/imagezz/woman.jpg",
		},
		
		{
			id: "modernization",
			name: "modernization",
			preview: "/imagezz/modernization.jpg",
		},
		
	]);

	

	const onDrop = useCallback((acceptedFiles) => {
		console.log(acceptedFiles);
		if (acceptedFiles?.length) {
			setImagez((prevImages) => [
				...prevImages,
				...acceptedFiles.map((image) =>
					Object.assign(image, { preview: URL.createObjectURL(image) })
				),
			]);
		}
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [],
		},
	});

	

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}

		const updatedItems = [...imagez];
		const [reorderedItem] = updatedItems.splice(result.source.index, 1);
		updatedItems.splice(result.destination.index, 0, reorderedItem);

		setImagez(updatedItems);
	};

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
				<h1
					className="text-white"
					onClick={() => signOut()}
				>
					Logout
				</h1>
			</div>
			<div
				{...getRootProps({
					className: className,
				})}
				className=" dnd-place w-full sm:w-4/5 items-center flex flex-col gap-[8px]  justify-center mt-[0px] text-black"
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p className="text-neutral-400 w-5/6 text-center py-[89px] bg-black border border-neutral-700 border-dashed">
						Drop the files here ...
					</p>
				) : (
					<p className="text-neutral-400 w-5/6 text-center py-[20px] sm:py-[70px] bg-black border border-neutral-700 border-dashed flex flex-col ">
						<span className="font-bold text-xl">
							Drag 'n' drop some files here,
						</span>{" "}
						or <span>click to select files</span>
					</p>
				)}
			</div>

			{/* preview */}

			<div className=" flex gap-[10px] sm:gap-[20px] justify-center preview w-screen h-full px-[10px]">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable
						droppableId="droppable1"
						direction="horizontal"
					>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								style={{
									backgroundColor: snapshot.isDraggingOver ? "gray" : "",
								}}
								className=" w-4/5 flex-row flex justify-center gap-[10px] sm:gap-[20px]"
							>
								{imagez.map(({ ...image }, index) => (
									<Draggable
										key={image.preview}
										draggableId={image.preview}
										index={index}
									>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className="w-[100px] sm:w-[200px] h-[140px] sm:h-[300px] relative flex flex-col "
											>
												<Image
													className="border rounded-lg"
													src={image.preview}
													fill={true}
													alt=""
													style={{ objectFit: "cover" }}
													priority={true}
												/>
												<div className="text-sm bg-transparent text-neutral-300 text-center w-full bottom-[-20px] absolute">{image.id}</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</div>
	);
}
