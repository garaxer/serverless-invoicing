import { handleLogin } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await handleLogin(req, res, {
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
};

export default signupHandler;
