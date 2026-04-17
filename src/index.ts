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


app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Profile Enrichment API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


app.use("/api/profiles", profileRoutes);


app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;