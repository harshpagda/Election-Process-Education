import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB
connectDB();

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `✗ Port ${PORT} is already in use. Stop the existing process on this port, then restart backend.`,
      );
      process.exit(0);
      return;
    } else {
      console.error("✗ Server startup error:", error.message);
    }

    process.exit(1);
  });
};

startServer();
