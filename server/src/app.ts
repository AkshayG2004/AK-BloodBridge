import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("AK BloodBridge API Running");
});

// User Routes
app.use("/api/users", userRoutes);

export default app;