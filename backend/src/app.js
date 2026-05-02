import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import electionRoutes from "./routes/election.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import pollingRoutes from "./routes/polling.routes.js";

// Import middleware
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging
app.use(morgan("combined"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/polling", pollingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
