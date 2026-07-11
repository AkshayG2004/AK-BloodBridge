import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("AK BloodBridge API Running 🚑");
});

export default app;