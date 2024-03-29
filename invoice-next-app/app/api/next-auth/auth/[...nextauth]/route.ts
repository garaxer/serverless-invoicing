import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Auth0Provider from "next-auth/providers/auth0";

//https://stackoverflow.com/questions/75155213/i-want-to-send-jwt-token-to-my-backend-in-next-auth
export const authOptions = {
  
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
      issuer: process.env.AUTH0_ISSUER
    })
  ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
