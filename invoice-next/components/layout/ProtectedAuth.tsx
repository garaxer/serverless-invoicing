import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const ProtectedAuth = ({children}: {children:React.ReactNode}) => {
    const auth = useAuth0();
    if (!auth.isAuthenticated) {
      return <h1>Please login</h1>
    }
    
    return <>{children}</>
}

export default ProtectedAuth