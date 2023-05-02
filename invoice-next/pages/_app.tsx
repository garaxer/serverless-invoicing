import { SWRConfig } from "swr";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRFetcher } from "api";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const AuthedApp = ({ Component, pageProps }: AppProps) => {
  const auth = useAuth0();

  const getFetcher = async (
    resource: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => {
    const idToken = await auth.getIdTokenClaims();
    // console.log({idToken, authed: auth.isAuthenticated})
    if (!idToken?.__raw) {
      return;
    }
    return SWRFetcher(idToken.__raw)(resource, init);
  };
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        revalidateOnFocus: false,
        // revalidateOnMount:false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        fetcher: getFetcher,
        onError: (error, key) => {
          if (error.status !== 403 && error.status !== 404) {
            console.info(error);
            alert("An unknown error accord while fetching");
          }
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
};
function MyApp(props: AppProps) {
  console.log("envs: " + process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL);
  return (
    <UserProvider>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL || ""}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      >
        <AuthedApp {...props} />
      </Auth0Provider>
    </UserProvider>
  );
}

export default MyApp;
