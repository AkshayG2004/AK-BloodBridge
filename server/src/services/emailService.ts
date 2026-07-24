import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendOTPEmail = async (
  email: string,
  otp: string
) => {
  try {
    console.log("========== EMAIL DEBUG ==========");
    console.log("FROM:", process.env.SENDER_EMAIL);
    console.log("TO:", email);
    console.log("OTP:", otp);

    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: "AK BloodBridge",
          email: process.env.SENDER_EMAIL,
        },

        to: [
          {
            email,
          },
        ],

        subject: "BloodBridge Email Verification OTP",

        htmlContent: `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#dc2626;">
              Verify your Email
            </h2>

            <p>
              Thank you for registering with
              <strong>AK BloodBridge</strong>.
            </p>

            <p>Your OTP is:</p>

            <h1 style="letter-spacing:6px;color:#dc2626;">
              ${otp}
            </h1>

            <p>
              This OTP expires in
              <strong>5 minutes</strong>.
            </p>

            <hr>

            <small>
              Ignore this email if you didn't request it.
            </small>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
      }
    );

    console.log("========== EMAIL SENT ==========");
    console.log(response.data);

  } catch (error: any) {
    console.error("========== BREVO EMAIL ERROR ==========");
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  try {
    console.log("========== CONTACT EMAIL DEBUG ==========");
    console.log("NAME:", name);
    console.log("EMAIL:", email);
    console.log("SUBJECT:", subject);

    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          name: "AK BloodBridge",
          email: process.env.SENDER_EMAIL,
        },

        to: [
          {
            email: process.env.SENDER_EMAIL,
          },
        ],

        replyTo: {
          email,
          name,
        },

        subject: `[Contact Us] ${subject}`,

        htmlContent: `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#dc2626;">
              New Contact Us Message
            </h2>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>

            <hr>

            <p style="white-space:pre-line;">
              ${message}
            </p>

            <hr>

            <small>
              Sent via AK BloodBridge Contact Us form.
            </small>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
      }
    );

    console.log("========== CONTACT EMAIL SENT ==========");
    console.log(response.data);

  } catch (error: any) {
    console.error("========== BREVO CONTACT ERROR ==========");
    console.error(error.response?.data || error.message);
    throw error;
  }
};