const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500"], // Add your frontend URLs
  credentials: true
}));

// Safely retrieve environment variables
const password = process.env.EP || "default_password";
const email = process.env.EM || "default_email@example.com";

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Base route for testing server availability
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: email, // Use environment variable
    pass: password, // Use environment variable (should be App Password for Gmail)
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const { name, email: userEmail, message } = req.body;

  // Validate input
  if (!name || !userEmail || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  console.log("Received form data:", { name, email: userEmail, message });

  const mailOptions = {
    from: email, // Your email (the one configured in transporter)
    to: email, // Send to yourself
    replyTo: userEmail, // User's email for replies
    subject: New message from ${name},
    text: Name: ${name}\nEmail: ${userEmail}\nMessage: ${message},
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});
