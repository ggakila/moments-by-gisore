/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		NEXTAUTH_URL: "https://moments-by-gisore.vercel.app",
		NEXTAUTH_SECRET: "74e125a7056045afa58d65fbbbba8fc5",
	},
};

module.exports = nextConfig
