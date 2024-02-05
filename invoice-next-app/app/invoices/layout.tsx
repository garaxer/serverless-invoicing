import type { Metadata } from "next";
import Header from "./_components/Header";
import { UserProvider } from "@auth0/nextjs-auth0/client";

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
  // can't change the callback from api/auth/callback to */auth0/*. Sticking with next auth for now. can switch back if needed
  return (
    <UserProvider>
      <div>
        <Header></Header>
hey
        {children}
      </div>
    </UserProvider>
  );
}
