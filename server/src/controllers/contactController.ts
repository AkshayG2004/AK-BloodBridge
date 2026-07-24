import { Request, Response } from "express";
import { sendContactEmail } from "../services/emailService";

export const submitContactForm = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    await sendContactEmail(name, email, subject, message);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });

  } catch (error) {
    console.error("========== CONTACT CONTROLLER ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again later.",
    });
  }
};