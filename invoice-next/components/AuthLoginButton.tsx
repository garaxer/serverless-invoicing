import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from "@mui/material";
import Link from "next/link";

const AuthLoginButton = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <Link href={"/api/auth/logout"}>
        <Button variant="contained" color="secondary">
          Welcome {user.name}! Logout
        </Button>
      </Link>
    );
  }
  //disable @next/next/no-html-link-for-pages
  return (
    <Link href={"/api/auth/login"}>
      <Button variant="contained" color="secondary">
        Login
      </Button>
    </Link>
  );
};

export default AuthLoginButton;
