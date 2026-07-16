import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import bloodRequestRoutes from "./routes/bloodRequestRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("AK BloodBridge API Running");
});

// User Routes
app.use("/api/users", userRoutes);

// Blood Request Routes
app.use("/api/requests", bloodRequestRoutes);

// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/admin", adminRoutes);

export default app;