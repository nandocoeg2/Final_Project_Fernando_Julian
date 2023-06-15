import prisma from "../db/index.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "You are not authenticated" });
    }
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "You are not authenticated" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(403).json({ error: "Invalid refresh token" });

        const userId = decoded.userId;
        const name = decoded.name;
        const email = decoded.email;
        const accessToken = jwt.sign(
          { userId, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30s",
          }
        );
        const refreshToken = jwt.sign(
          { userId, name, email },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        });
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
