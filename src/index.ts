import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profile.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/profiles", profileRoutes);


app.use(errorHandler);

export default app;