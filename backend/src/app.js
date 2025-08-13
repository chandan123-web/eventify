// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import messageRoutes from "./routes/message.route.js";
// import http from "http";
// import { Server } from "socket.io";
// import userRouter from "./routes/user.route.js";
// import eventRouter from "./routes/event.route.js";
// import mediaRouter from "./routes/media.router.js";



// const app = express()









// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

// app.use(express.json({limit: "16kb"}))
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))
// app.use(cookieParser())

// app.use("/api/v1/user", userRouter)
// app.use("/api/v1/events", eventRouter)
//  app.use("/api/v1/media", mediaRouter)
// app.use("/api/v1/guestmessage", messageRoutes);


// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CORS_ORIGIN,
//   },
// });

// // Attach io to req object
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Join rooms for each event
// io.on("connection", (socket) => {
//   console.log("New user connected:", socket.id);

//   socket.on("join_event", (eventId) => {
//     console.log("User joined event room:", eventId);
//     socket.join(eventId);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });



// app.use(express.json());



// export { app };



import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Routes
import messageRoutes from "./routes/message.route.js";
import userRouter from "./routes/user.route.js";
import eventRouter from "./routes/event.route.js";
import mediaRouter from "./routes/media.router.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// REST API routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/messages", messageRoutes);

export default app;




