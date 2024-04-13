import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import SessionProvider from "../_components/SessionProvider";
import NavMenu from "../_components/NavMenu";
import Provider from "../_trpc/Provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <SessionProvider session={session} basePath="/api/next-auth/auth">
      <Provider>
        <main className="mx-auto max-w-5xl text-2xl flex gap-2 text-white">
          <NavMenu />
          {children}
        </main>
      </Provider>
    </SessionProvider>
  );
}