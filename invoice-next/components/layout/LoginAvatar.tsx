import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const LoginAvatar = () => {
  // TODO figure out why loginWithRedirect is not workings
  const { loginWithPopup, logout, isAuthenticated } = useAuth0();

  return (
    <Tooltip title={isAuthenticated ? "Logout" : "Login"}>
      <IconButton
        onClick={() =>
          isAuthenticated
            ? logout({ logoutParams: { returnTo: window.location.origin } })
            : loginWithPopup()
        }
        sx={{ p: 0 }}
      >
        <Avatar alt="avatar" />
      </IconButton>
    </Tooltip>
  );
};

export default LoginAvatar;
