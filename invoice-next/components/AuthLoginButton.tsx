import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const AuthLoginButton = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        {/* disable @next/next/no-html-link-for-pages */}
        Welcome {user.name}!{" "}
        <Link href={"/api/auth/logout"}>
          <a >Logout</a>
        </Link>
      </div>
    );
  }
  //disable @next/next/no-html-link-for-pages
  return (
    <Link href={"/api/auth/login"}>
      <a >Login</a>;
    </Link>
  );
};

export default AuthLoginButton;
