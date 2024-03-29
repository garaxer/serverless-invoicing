import { PropsWithChildren, useState, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AppThemeProvider from "./AppThemeProvider";
import Head from "next/head";
import Link from "next/link";
import styled from "@emotion/styled";
import ProtectedAuth from "./ProtectedAuth";
import LoginAvatar from "./LoginAvatar";

const pages = ["Create"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
const siteTitle = "Real Estate Invoicing";

type AppBarProps = { title: string; useAuth: boolean };

const ResponsiveAppBar = ({
  children,
  title = "Real Estate Invoicing",
  useAuth,
}: PropsWithChildren<AppBarProps>) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const ContainerLayout = styled.div(
    ({ theme }) =>
      `display: flex;
flex-direction: column;
min-height: 100vh;
background-color: ${theme.palette.background.paper};
color: ${theme.palette.text.primary}
`
  );

  return (
    <AppThemeProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Real estate invoicing" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ContainerLayout>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Link href="/">{title}</Link>
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <Link href={page.toLowerCase()} key={page}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}22</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </Box>

              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {title}
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Link href={page.toLowerCase()} key={page}>
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  </Link>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>{useAuth && <LoginAvatar />}</Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="lg" sx={{ paddingTop: 5, flexGrow: 1 }}>
          {useAuth ? <ProtectedAuth>{children}</ProtectedAuth> : children}
        </Container>
        <div>
          <AppThemeProvider.ToggleDarkMode />
        </div>
      </ContainerLayout>
    </AppThemeProvider>
  );
};
export default ResponsiveAppBar;
