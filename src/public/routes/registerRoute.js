import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
    const { username, password, email, birthdate, phone } = req.body;

    if (!username || !password || !email || !birthdate || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 10) {
        return res.status(400).json({ message: "Password must be at least 10 characters long" });
    }

    // Tjek at telefonnummeret er verificeret via HTTP-Only cookie
    const verifiedPhone = req.cookies.verified_phone;
    if (!verifiedPhone || verifiedPhone !== phone) {
        return res.status(400).json({ message: "Phone number not verified or does not match" });
    }

    try {
        const db = req.db;
        const [existingUser] = await db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (username, password, email, birthdate, phone) VALUES (?, ?, ?, ?, ?)",
            [username, hashedPassword, email, birthdate, phone]
        );

        const newUserId = result.insertId;

        const token = jwt.sign(
            {
                id: newUserId,
                username,
                phone,
                ip: req.ip,
                ua: req.headers['user-agent'],
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 time
        });

        res.status(201).json({ message: "User registered and logged in successfully", redirectUrl: "/menu" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;