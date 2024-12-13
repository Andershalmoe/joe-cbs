import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
    res.clearCookie("auth_token");
    console.log("User logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
});

export default router;

