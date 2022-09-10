import type { NextPage } from "next";
import Layout from "../components/layout/Layout";
import AuthLoginButton from "components/AuthLoginButton";
import Link from "next/link";
import { Box, Button, CircularProgress, styled } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

const HeroContent = styled("div")(
  ({ theme }) =>
    `align-items: center;
    border: 1px solid pink;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 3.5rem;
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    font-family: ${theme.typography.fontFamily}
`
);

const CenteredContainer = styled("div")(
  ({ theme }) =>
    `
    margin-left: auto;
    margin-right: auto;
    max-width: 768px;
    padding-bottom: 3rem;
    width: 100%;
`
);

const HeroText = styled("div")(
  ({ theme }) =>
    `
    font-size: 1.5rem;
    line-height: 2rem;
`
);
const UnderlineA = styled("a")(
  ({ theme }) =>
    `
    text-decoration: underline;
    cursor: pointer;
`
);

const Hero = () => {
  const user = useUser();
  return (
    <CenteredContainer>
      <HeroContent>
        {user.isLoading ? (
          <CircularProgress />
        ) : (
          <HeroText>
            <Box>
              <Button variant="contained" color="secondary">
                <AuthLoginButton />
              </Button>
            </Box>
            <br />
            <Link href="/invoice">
              <UnderlineA>
                Click here to and login with the email the invoice was sent to
                to view the latest invoice
              </UnderlineA>
            </Link>
          </HeroText>
        )}
      </HeroContent>
    </CenteredContainer>
  );
};
const Home: NextPage = () => {
  return (
    <Layout title={"Login"} useAuth={false}>
      <Hero />
    </Layout>
  );
};

export default Home;
