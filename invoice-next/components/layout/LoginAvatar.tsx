import { Avatar, IconButton, Tooltip } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const LoginAvatar = () => {
  // TODO figure out why loginWithRedirect is not workings
  const { loginWithPopup } = useAuth0();

  return (
    <Tooltip title="Open settings">
      <IconButton onClick={() => loginWithPopup()} sx={{ p: 0 }}>
        <Avatar alt="avatar" />
      </IconButton>
    </Tooltip>
  );
};

export default LoginAvatar;
