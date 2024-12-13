import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "Phone number and password are required" });
    }

    try {
        const db = req.db;
        const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }

        const token = jwt.sign(
            {
                id: user.userid,
                phone: user.phone,
                ip: req.ip,
                ua: req.headers['user-agent'],
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 time
        });

        res.status(200).json({ message: "Login successful", redirectUrl: "/menu" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
