import { handleLogout } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await handleLogout(req, res);
  } catch (error: any) {
    res.status(error.status || 400).end(error.message);
  }
};

export default logoutHandler;
