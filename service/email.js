import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // MUST be false for port 587
  auth: {
    user: "9f1035001@smtp-brevo.com",
    pass: process.env.BREVO_SMTP_KEY, // Brevo SMTP key
  },
});

async function mail(name, link, toEmail) {
  try {
    await transporter.sendMail({
      from: '"BookReseller Support" <batman11login@gmail.com>',
      to: toEmail,
      subject: "Verify Your Email - BookReseller",

      text: `Hello ${name},

Thank you for registering with BookReseller!

To complete your registration, please verify your email by clicking the link below:

${link}

If you did not sign up for BookReseller, please ignore this email.

Best regards,
BookReseller Team
`,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
  <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;">
    <h2 style="text-align:center;">Welcome to BookReseller, ${name}!</h2>

    <p>
      Thank you for signing up. Please verify your email address by clicking the button below.
    </p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${link}" 
         style="background:#4CAF50;color:#fff;padding:12px 25px;
                text-decoration:none;border-radius:5px;display:inline-block;">
        Verify Email Address
      </a>
    </div>

    <p>If you didn’t create a BookReseller account, you can safely ignore this email.</p>

    <p style="margin-top:30px;font-size:12px;color:#777;text-align:center;">
      © BookReseller Team
    </p>
  </div>
</body>
</html>
`,
    });
  } catch (error) {
    return error;
  }
}

async function mailForgotPassword(name, link, toEmail) {
  try {
    await transporter.sendMail({
      from: '"BookReseller Support" <batman11login@gmail.com>',
      to: toEmail,
      subject: "Reset Your Password - ReBook",

      text: `Hello ${name},

We received a request to reset the password for your ReBook account.

You can reset your password using the link below:
${link}

This link is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Best regards,
ReBook Team
`,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
  <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;">
    <h2 style="text-align:center;">Password Reset Request</h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      We received a request to reset your ReBook account password.
      Click the button below to proceed.
    </p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${link}"
         style="background:#007BFF;color:#fff;padding:12px 25px;
                text-decoration:none;border-radius:5px;display:inline-block;">
        Reset Password
      </a>
    </div>

    <p>This link is valid for <strong>10 minutes</strong>.</p>

    <p>If you did not request this, you can safely ignore this email.</p>

    <p style="margin-top:30px;font-size:12px;color:#777;text-align:center;">
      © ReBook Team
    </p>
  </div>
</body>
</html>
`,
    });
  } catch (error) {
    return error;
  }
}

export default mail;
export { mailForgotPassword };
