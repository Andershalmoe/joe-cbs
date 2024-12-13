import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import loginRoute from "./public/routes/loginRoute.js";
import registerRoute from "./public/routes/registerRoute.js";
import sendCodeRoute from "./public/routes/sendCodeRoute.js";
import verifyCodeRoute from "./public/routes/verifyCodeRoute.js";
import logoutRoute from "./public/routes/logoutRoute.js";
import authMiddleware from "./public/routes/authMiddleware.js";
import adventRoute from "./public/routes/adventRoute.js";
import validateVoucherRoute from "./public/routes/validateVoucherRoute.js";
import menuRoute from "./public/routes/menuRoute.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const voucherLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5,
    message: "Too many requests. Please try again later.",
    standardHeaders: true, 
    legacyHeaders: false, 
});

const loginLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5, 
    message: "Too many login attempts. Please try again later.",
});

const sendCodeLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5,
    message: "Too many verification attempts. Please try again later.",
});
const verifyCodeLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 3, 
    message: "Too many incorrect verification attempts. Please try again later.",
});
const registerLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, 
    max: 5, 
    message: "Too many registration attempts. Please try again later.",
});






const initializeDb = async () => {
    console.log("Connecting to MySQL database with settings:");
    console.log({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DATABASE,
    });
    try {
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000,
        });

        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        console.log("Connected to MySQL database! Test query result:", rows);

        return pool;
    } catch (error) {
        console.error("Failed to initialize database:", error.message);
        throw error;
    }
};

const startServer = async () => {
    try {
        const db = await initializeDb();

        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "public", "login.html"));
        });
       
        app.get("/menu", (req, res) => {
            res.sendFile(path.join(__dirname, "./public/menu.html"));
        });
        app.get("/advCalendar.html", authMiddleware, (req, res) => {
            res.sendFile(path.join(__dirname, "./public/advCalendar.html"));
        });

        // Offentlige ruter
        app.use("/login", loginRoute, loginLimiter);
        app.use("/register", registerRoute, registerLimiter);
        app.use("/api/voucher", validateVoucherRoute);
        app.use("/api/voucher/validate", voucherLimiter);
        app.use("/api/menu", menuRoute);
        app.use("/sendCode", sendCodeRoute, sendCodeLimiter);
        app.use("/verifyCode", verifyCodeRoute, verifyCodeLimiter);
    
        // Middleware til at beskytte alle efterfølgende ruter
        app.use(authMiddleware);

        // Beskyttede ruter
    
        app.use("/logout", logoutRoute);

        app.use("/api/advent", authMiddleware, adventRoute);
        
      
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
