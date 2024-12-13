import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";

const router = express.Router();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const surprises = {
    1: "20% discount",
    2: "20% discount",
    3: "20% discount",
    4: "20% discount",
    5: "20% discount",
    6: "20% discount",
    7: "20% discount",
    8: "20% discount",
    9: "20% discount",
    10: "20% discount",
    11: "20% discount",
    12: "20% discount",
    13: "20% discount",
    14: "20% discount",
    15: "20% discount",
    16: "20% discount",
    17: "20% discount",
    18: "20% discount",
    19: "20% discount",
    20: "20% discount",
    21: "20% discount",
    22: "20% discount",
    23: "20% discount",
    24: "80% discount on any sandwich",
};



const openDayLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5,
    message: "Too many requests. Please try again later.",
});


router.post("/openDay", openDayLimiter, async (req, res) => {
    const { day } = req.body;
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const db = req.db;

        const currentDate = new Date();
        const currentDay = currentDate.getDate(); // Hent dagens dato (1-31)
        const currentMonth = currentDate.getMonth(); // Hent måneden (0-11, hvor 0 = januar, 11 = december)

        if (currentMonth !== 11 && currentMonth !== 0) { // 11 = december, 0 = januar
            return res.status(400).json({ message: "Advent calendar is only active in December and January." });
        }

        if (parseInt(day, 10) !== currentDay) {
            return res.status(400).json({ message: `You can only open today's door: Day ${currentDay}.` });
        }

        const [existing] = await db.query(
            "SELECT * FROM advent_calendar WHERE user_id = ? AND day = ? AND MONTH(opened_at) = ? AND YEAR(opened_at) = ?",
            [userId, day, currentMonth + 1, currentDate.getFullYear()]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Door already opened." });
        }

        const voucherCode = `JOE-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        const hashedCode = await bcrypt.hash(voucherCode, 10);

        
        await db.query(
            "INSERT INTO advent_calendar (user_id, day, opened_at, voucher_code) VALUES (?, ?, NOW(), ?)",
            [userId, day, hashedCode]
        );


        const [user] = await db.query("SELECT email FROM users WHERE userid = ?", [userId]);
        const userEmail = user[0].email;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `🎄 Your Advent Calendar Voucher for Day ${day}`,
            text: `Congratulations! You opened Day ${day} and received a surprise: ${surprises[day]}.\n\nYour voucher code is: ${voucherCode}, and can only be used once in our physical stores!`,
        });


        res.status(200).json({ message: `Door ${day} opened!`, surprise: surprises[day] });
    } catch (error) {
        console.error("Error opening door:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
