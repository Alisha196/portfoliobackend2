const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable all CORS
app.use(cors());

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
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email, // Use environment variable
    pass: password, // Use environment variable
  },
});

// Handle form submission
app.post("/submit", (req, res) => {
  const { name, email: bemail, message } = req.body;

  // Validate input
  if (!name || !bemail || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Received form data:", { name, email: bemail, message });

  const mailOptions = {
    from: bemail,
    to: email, // Correct recipient
    subject: `New message from ${name}`,
    text: message,
  };

  // Send email
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
  console.log(`Server is running on http://localhost:${PORT}`);
});
