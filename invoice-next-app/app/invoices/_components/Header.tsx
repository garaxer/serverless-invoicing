"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header({ children }: { children?: React.ReactNode }) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth0/logout">Logout</a>
        <br />
        {children}
      </div>
    );
  }

  return <a href="/api/auth0/login?returnTo=/api/auth0/callback">Login</a>;
}
