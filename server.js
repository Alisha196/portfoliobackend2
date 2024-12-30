const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
const password = process.env.EP.toString();
const email= process.env.EM.toString();

// Serve frontend files


// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the main HTML file
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
  const { name, email:bemail, message } = req.body;

  console.log("Received form data:", { name, email, message });

  const mailOptions = {
    from: bemail,
    to: env, 
    subject: `New message from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      res.status(500).send({passoword:password, email:email, error:error, info:info});
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
