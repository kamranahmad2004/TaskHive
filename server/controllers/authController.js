import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign(
      {
        name,
        email,
        password: hashedPassword,
        purpose: "email-verify",
      },
      process.env.JWT_SECRET_VERIFY,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(email, token);
    return res.status(200).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔐 Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyUser = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      console.log("No token received.");
      return res.status(400).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_VERIFY);
    console.log("Decoded token:", decoded);

    if (decoded.purpose !== "email-verify") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const email = decoded.email.toLowerCase();

    const result = await User.updateOne(
      { email },
      {
        $set: { verified: true },
        $setOnInsert: {
          name: decoded.name,
          email,
          password: decoded.password, // already hashed when signed
        },
      },
      { upsert: true }
    );

    console.log("Mongo update result:", result);

    if (result.upsertedCount > 0) {
      return res.status(201).json({
        message: "Email verified and user created. You can log in now.",
      });
    } else {
      return res
        .status(200)
        .json({ message: "Email already verified. You can log in now." });
    }
  } catch (err) {
    console.error("Verification failed:", err.message);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
