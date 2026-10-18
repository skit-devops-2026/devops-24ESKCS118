
const express = require("express");
const cors = require("cors");
const client = require("prom-client");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Prometheus default Node.js metrics
client.collectDefaultMetrics();

// Count HTTP requests
const requestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
});

// Measure request duration
const requestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"]
});

// Collect request metrics
app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const route = req.route?.path || req.path || "unknown";
        const labels = {
            method: req.method,
            route,
            status_code: String(res.statusCode)
        };

        requestCounter.inc(labels);
        requestDuration.observe(labels, (Date.now() - start) / 1000);
    });

    next();
});

// Existing test route
app.get("/", (req, res) => {
    res.json({
        message: "DevOps backend is running"
    });
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

// Start server
const PORT = process.env.PORT || 5000;

const register = new client.Registry();

client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
