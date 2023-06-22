import dotenv from "dotenv";
import Express from "express";
import cors from "cors";
import prisma from "./db/index.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

dotenv.config();

const app = Express();

app.use(
  cors({ credentials: true, origin: `http://localhost:${process.env.PORT_FE}` })
);
app.use(cookieParser());
app.use(Express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
