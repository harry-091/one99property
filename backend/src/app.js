import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.clientUrls.includes("*") || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
