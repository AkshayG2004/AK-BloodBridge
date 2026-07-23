import express from "express";
import { getRandomFact } from "../controllers/factController";

const router = express.Router();

router.get("/random", getRandomFact);

export default router;