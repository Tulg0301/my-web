const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes/index')


const app = express()
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000", // Đổi thành origin của frontend
    credentials: true
}));
app.use(express.json())
app.use("/api",router)

const PORT = 8080 || process.env.PORT


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is running")
    })
})
