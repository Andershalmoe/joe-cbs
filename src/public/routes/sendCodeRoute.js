import express from "express";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const client = twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
});

router.post("/", async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    try {
        const code = Math.floor(1000 + Math.random() * 9000);

        const tempToken = jwt.sign(
            { phone, code },
            process.env.JWT_SECRET,
            { expiresIn: "2m" }
        );

        res.cookie("temp_token", tempToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 120000, 
        });

        await client.messages.create({
            body: `Welcome to JOE!\n\Your verification code is: ${code}.\n\This code expires in 2 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        res.status(200).json({ message: "Verification code sent" });
    } catch (error) {
        console.error("Error sending SMS:", error);
        res.status(500).json({ message: "Failed to send verification code" });
    }
});

export default router;
