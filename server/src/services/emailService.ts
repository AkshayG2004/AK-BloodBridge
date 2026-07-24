import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  logger: true,
  debug: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP VERIFY SUCCESS");
  }
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

export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  try {
    console.log("========== CONTACT EMAIL DEBUG ==========");
    console.log("FROM (user):", email);
    console.log("NAME:", name);
    console.log("SUBJECT:", subject);

    const info = await transporter.sendMail({
      from: `"AK BloodBridge Contact" <${process.env.EMAIL_USER}>`,

      to: process.env.EMAIL_USER, // sends to your own admin inbox

      replyTo: email, // lets you hit "Reply" and respond directly to the user

      subject: `[Contact Us] ${subject}`,

      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2 style="color:#dc2626;">
            New Contact Us Message
          </h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <hr>

          <p style="white-space:pre-line;">${message}</p>

          <hr>

          <small>
            Sent via AK BloodBridge Contact Us form.
          </small>
        </div>
      `,
    });

    console.log("========== CONTACT EMAIL SENT ==========");
    console.log(info);

  } catch (error) {
    console.error("========== NODEMAILER ERROR (CONTACT) ==========");
    console.error(error);
    throw error;
  }
};