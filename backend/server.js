require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDb = require("./config/db");
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const reportRoutes = require('./routes/reportRoutes')
const aiRoutes = require('./routes/aiRoutes')
const app = express();


//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


// connect database 
connectDb();

//Middleware
app.use(express.json())



//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes)

// server upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Start server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("EMS Backend Running Successfully");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
