import type { Metadata } from "next";
// import Auth0Provider from "./_context/auth0";
import Header from "./_components/Header";

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
    <div>
      <Header></Header>

      {children}
    </div>
  );
}
