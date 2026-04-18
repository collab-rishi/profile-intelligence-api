import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Profile Enrichment API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/kaithheathcheck", (req, res) => {
  res.status(200).send("OK");
});


app.use("/api/profiles", profileRoutes);


app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorHandler);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;