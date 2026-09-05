const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
    res.json({
        message: "BraddyX backend is running 🚀"
    });
});


// ================= SERVER =================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`BraddyX server running on http://localhost:${PORT}`);
});