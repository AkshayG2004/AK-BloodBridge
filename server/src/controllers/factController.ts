import { Request, Response } from "express";
import Fact from "../models/factModel";

export const getRandomFact = async (
  req: Request,
  res: Response
) => {
  try {
    const facts = await Fact.aggregate([
      {
        $match: {
          active: true,
        },
      },
      {
        $sample: {
          size: 1,
        },
      },
    ]);

    if (!facts.length) {
      return res.status(404).json({
        success: false,
        message: "No facts available",
      });
    }

    res.json({
      success: true,
      fact: facts[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};