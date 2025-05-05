const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { initDB } = require("./utils/initDB.js");
const { logger } = require("./middleware/logger.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes.js");
const taskRouter = require("./routes/taskRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const boardRoutes = require("./routes/boardRoutes.js");
const repositoryRoutes = require("./routes/repositoryRoutes.js");

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(logger);
app.use(cors({
    origin: ['https://codeflow-frontend-eight.vercel.app'], // Your React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE) // 24 hours
    }
}));

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/repositories", repositoryRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
        initDB();

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

startServer();