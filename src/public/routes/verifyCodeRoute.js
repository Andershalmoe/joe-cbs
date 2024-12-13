import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
    const { verificationCode } = req.body;
    const tempToken = req.cookies.temp_token;

    if (!tempToken) {
        return res.status(401).json({ message: "No verification token provided" });
    }

    try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

        if (decoded.code !== parseInt(verificationCode, 10)) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        const codeIssuedAt = new Date(decoded.iat * 1000);
        const now = new Date();
        const diffMinutes = Math.floor((now - codeIssuedAt) / (1000 * 60)); // Beregn forskel i minutter

        if (diffMinutes > 10) {
            return res.status(400).json({ message: "Verification code expired" });
        }

        // Slet den midlertidige cookie
        res.clearCookie("temp_token");

        return res.status(200).json({
            message: "Verification code verified successfully",
            redirectUrl: `/register.html?phone=${encodeURIComponent(decoded.phone)}`,
        });
    } catch (error) {
        console.error("Error verifying code:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
