"use client";

import { Auth0Provider } from "@auth0/auth0-react";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
    >
      {children}
    </Auth0Provider>
  );
}
