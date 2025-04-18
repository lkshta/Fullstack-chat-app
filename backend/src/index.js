import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import { app, server, io } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); //allows to extract json data from body
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); // to parse the cookie

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes); // Authentication route
app.use("/api/messages", messageRoutes); // Message route

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  // });

  app.use((req, res, next) => {
    try {
      const indexPath = path.join(
        __dirname,
        "../frontend",
        "dist",
        "index.html"
      );
      res.sendFile(indexPath);
    } catch (error) {
      console.error("Error serving index.html:", error);
      next(error);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});
