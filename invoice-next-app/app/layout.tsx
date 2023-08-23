import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { UserProvider } from "@auth0/nextjs-auth0/client";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoicing app",
  description: "Next invoicing app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //https://auth0.com/blog/auth0-stable-support-for-nextjs-app-router/
  //https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protecting-a-server-side-rendered-ssr-page
  return (
    <html lang="en">
      {/* <UserProvider> */}
        <body className={inter.className}>{children}</body>
      {/* </UserProvider> */}
    </html>
  );
}
