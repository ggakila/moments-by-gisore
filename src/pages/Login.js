"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [usererror, setUsererror] = useState("");
	const [passerror, setPasserror] = useState("");


	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();

		setUsererror("");
		setPasserror("");

		if (!email) {
			setUsererror("Please enter an email!");
		}

		if (!password) {
			setPasserror("Please enter a password!");
		}

		if (email && password) {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});
			
			if (!result.error) {
				console.log("Auth succeeded: ");
				router.push("/Gallery");
			} else {
				setUsererror("Invalid email or password");
			}
		}
	};


	return (
		<div className="h-screen  flex flex-col items-center justify-center relative px-[10px] md:px-[40px] ">
			{/* header section */}
			<div className="w-full  absolute top-0 flex justify-between  px-[20px] md:px-[100px] py-[40px] items-center">
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
			{/* form section */}
			<div className="flex flex-col sm:flex-row w-full md:w-3/4 lg:w-2/3 sm:h-1/2 items-center gap-[30px] sm:gap-[0px] justify-center  h-full">
				<div className="w-5/6 sm:w-1/2 p-[10px] sm:p-[30px] flex flex-col items-center sm:items-start  text-center sm:text-start gap-[10px] sm:gap-[30px]">
					<h1 className="hidden text-4xl sm:flex items-center text-center  ">
						m
						<span className="px-1">
							<Image
								className=""
								src="/logo.svg"
								width={30}
								height={30}
								alt="logo"
								style={{ fill: "white" }}
							/>
						</span>
						ments
					</h1>
					<div className="flex flex-col gap-[5px] sm:gap-[10px] ">
						<p className="text-4xl sm:text-5xl">Where Every Photo</p>
						<p className="text-4xl sm:text-5xl">Becomes a Timeless Memory</p>
						<p className="text-xl sm:text-2xl mt-[20px] text-neutral-400">
							"Preserve Life's Stories, One Snap at a Time"
						</p>
					</div>
				</div>
				<div className="bg-neutral-700 hidden sm:block w-[2px] h-4/5"></div>
				<form
					onSubmit={handleLogin}
					className="flex flex-col items-center w-5/6 sm:w-1/2"
				>
					{/* inputs */}
					<div className="w-full sm:w-4/5 flex flex-col gap-[15px]">
							{usererror && <p className="text-red-500">{usererror}</p>}
						<div className="flex flex-col px-[0px] sm:px-[10px]">
							<label className="text-neutral-500 my-2">Email:</label>
							<input
								className="bg-neutral-700 focus:bg-white focus:text-black py-[10px] border-transparent focus:border-transparent rounded-md px-5 text-white placeholder-neutral-400"
								placeholder="Enter username..."
								id="email"
								type="text"
								name="email"
								value={email}
								autoComplete="email"
								required
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="flex flex-col px-[0px] sm:p-[10px]">
							<label className="text-neutral-500 my-2">Password:</label>
							<input
								className="bg-neutral-700 focus:bg-white focus:text-black py-[10px] border-transparent focus:border-transparent rounded-md px-5 text-white placeholder-neutral-400"
								placeholder="Enter password..."
								id="password"
								type="password"
								name="password"
								value={password}
								required
								onChange={(e) => setPassword(e.target.value)}
							/>
							{passerror && <p className="text-red-500">{passerror}</p>}
						</div>
						<p className="text-neutral-500 px-[0px] sm:p-[10px]">
							By signing in you agree to the{" "}
							<span className="underline">Privacy Policy</span> and{" "}
							<span className="underline">Terms of Service</span>.
						</p>
						<button
							className="bg-white w-1/2 mx-auto py-[10px] px-[5px] cursor-pointer text-black font-semibold border rounded-md hover:bg-neutral-300"
							type="submit"
							onClick={() =>
								signIn("credentials", {
									email,
									password,
									redirect: true,
									callbackUrl: "/Gallery",
								})
							}
							
						>
							Login
						</button>
					</div>
					<p className="m-5 text-neutral-500">
						Don't have an account?{" "}
						<span
							className="text-neutral-300 cursor-pointer hover:text-blue-400 text-lg"
							onClick={() => router.push("/Register")}
						>
							Register
						</span>
					</p>
				</form>
			</div>
		</div>
	);
}
