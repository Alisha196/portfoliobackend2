const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable all CORS (or restrict it later)
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load environment variables
const email = process.env.EM || "default_email@example.com";
const password = process.env.EP || "default_password";

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

// Contact form route (NOTE: Changed to /api/contact to match frontend)
app.post("/api/contact", (req, res) => {
  const { name, email: senderEmail, message } = req.body;

  if (!name || !senderEmail || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Received form data:", { name, email: senderEmail, message });

  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: New message from ${name},
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: error.message });
    } else {
      console.log("Email sent:", info.response);
      return res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});
