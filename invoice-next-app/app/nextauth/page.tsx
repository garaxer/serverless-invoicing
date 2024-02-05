import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { signIn, signOut, useSession, getSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();
  console.log({ f: getSession() });
  console.log(session);
  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button onClick={() => signOut({ callbackUrl: "/foo" })}>
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default async function ProtectedRoute() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <AuthButton />
      This is a protected route.
      <br />
      You will only see this if you are authenticated.
    </div>
  );
}
