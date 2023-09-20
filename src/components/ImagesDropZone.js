import React, { useCallback, useState, useEffect } from "react";
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
	const [imagez, setImagez] = useState([
		{
			id: "africa",
			name: "africa.jpg",
			preview: "/imagezz/africa.jpg",
		},
		{
			id: "sculpture",
			name: "sculpture.jpg",
			preview: "/imagezz/sculpture.jpg",
		},
		{
			id: "woman",
			name: "woman.jpg",
			preview: "/imagezz/woman.jpg",
		},
		{
			id: "children",
			name: "children.jpg",
			preview: "/imagezz/children.jpg",
		},
		{
			id: "modernization",
			name: "modernization.jpg",
			preview: "/imagezz/modernization.jpg",
		},
		{
			id: "nairobi",
			name: "nairobi.jpg",
			preview: "/imagezz/nairobi.jpg",
		},
	]);

const [imagesPerRow, setImagesPerRow] = useState(1); // Initialize with one image per row

  useEffect(() => {
    const calculateImagesPerRow = () => {
      const containerWidth = document.querySelector('.preview').clientWidth; // Get container width
      const imageWidth = 300; // Adjust this based on your image size

      const newImagesPerRow = Math.floor(containerWidth / imageWidth);

      // Ensure there's at least one image per row
      setImagesPerRow(Math.max(newImagesPerRow, 1));
    };

    // Call the function when the window is resized
    window.addEventListener('resize', calculateImagesPerRow);
    calculateImagesPerRow(); // Calculate initially

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener('resize', calculateImagesPerRow);
    };
  }, [imagez]);


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

	

   const reorderImages = (imagez, startIndex, endIndex) => {
			// Determine the row of the source and destination indices
			const startRow = Math.floor(startIndex / imagesPerRow);
			const endRow = Math.floor(endIndex / imagesPerRow);

			// If the image is moved to a different row, don't reorder the images
			if (startRow !== endRow) {
				return imagez;
			}

			// Calculate the new indices within the row
			const adjustedStartIndex = startIndex % imagesPerRow;
			const adjustedEndIndex = endIndex % imagesPerRow;

			const updatedImages = [...imagez];
			const [movedImage] = updatedImages.splice(adjustedStartIndex, 1);
			updatedImages.splice(adjustedEndIndex, 0, movedImage);

			return updatedImages;
		};



    const onDragEnd = (result) => {
			if (!result.destination) {
				return;
			}

			const updatedImages = reorderImages(
				imagez,
				result.source.index,
				result.destination.index
			);
			setImagez(updatedImages); 
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
				<h1 className="text-[10px] sm:text-xl">by haggai gisore</h1>
			</div>
			<div
				{...getRootProps({
					className: className,
				})}
				className="w-full sm:w-4/5 items-center flex flex-col gap-[8px]  justify-center mt-[0px] text-black"
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p className="text-neutral-400 w-5/6 text-center py-[89px] bg-black border border-neutral-700 border-dashed">
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

			{/* preview */}

			<div className=" flex flex-wrap gap-[40px] sm:gap-[20px] justify-center preview w-full h-full px-[20px]">
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
									backgroundColor: snapshot.isDraggingOver ? "lightblue" : "",
								}}
								className=" w-4/5 flex flex-wrap justify-center gap-[20px]"
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
												className="w-[200px] h-[300px] relative "
											>
												<Image
													className="border rounded-lg"
													src={image.preview}
													fill={true}
													alt=""
													style={{ objectFit: "cover" }}
													priority={true}
												/>
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

