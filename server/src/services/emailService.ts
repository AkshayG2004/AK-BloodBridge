import nodemailer from "nodemailer";

console.log("========== ENV CHECK ==========");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOTPEmail = async (
  email: string,
  otp: string
) => {
  try {
    console.log("========== EMAIL DEBUG ==========");
    console.log("FROM:", process.env.EMAIL_USER);
    console.log("TO:", email);
    console.log("OTP:", otp);

    const info = await transporter.sendMail({
      from: `"AK BloodBridge" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "BloodBridge Email Verification OTP",

      html: `
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
    });

    console.log("========== EMAIL SENT ==========");
    console.log(info);

  } catch (error) {
    console.error("========== NODEMAILER ERROR ==========");
    console.error(error);
    throw error;
  }
};