import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/validate", async (req, res) => {
    const { voucher_code } = req.body;

    if (!voucher_code) {
        return res.status(400).json({ message: "Voucher code is required" });
    }

    try {
        const db = req.db;

        const [vouchers] = await db.query("SELECT * FROM advent_calendar");

        let voucherDetails;
        for (const voucher of vouchers) {
            const isMatch = await bcrypt.compare(voucher_code, voucher.voucher_code);
            if (isMatch) {
                voucherDetails = voucher;
                break;
            }
        }

        if (!voucherDetails) {
            return res.status(404).json({ message: "Invalid voucher code" });
        }

        if (voucherDetails.voucher_used) {
            return res.status(400).json({ message: "Voucher has already been used" });
        }

        const currentDate = new Date();
        const expirationDate = new Date(Date.UTC(2025, 0, 31, 23, 59, 59));

        if (currentDate > expirationDate) {
            return res.status(400).json({ message: "Voucher has expired" });
        }

        await db.query("UPDATE advent_calendar SET voucher_used = TRUE WHERE voucher_code = ?", [voucherDetails.voucher_code]);

        res.status(200).json({ message: "Voucher validated successfully" });
    } catch (error) {
        console.error("Error validating voucher:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
