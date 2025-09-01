import "dotenv/config";
import express, { application } from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudnary.js";
import adminRouter from "./routes/adminRoute.js";

import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/usersRoute.js";

import dotenv from "dotenv";
dotenv.config();

//app config

const app = express(); 
// Calling it (express()) returns an object 
// that represents your web application. 
// This object is essentially a server with
//  built-in methods for handling HTTP
//  requests, defining routes, middleware, and settings.
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
// express.json() is built-in middleware in Express.
// It parses incoming requests with JSON payloads and makes the parsed data available in req.body.
// Without it, if you send JSON data in a request (like from Postman or frontend fetch), req.body would be undefined.
app.use(cors());
//cors is a middleware that allows your backend to accept requests from different origins (like your frontend app running on another port or domain).

//api end points
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello I am working Dude 😎");
});
//Assigning it to app gives you a handle to interact with your Express server
//listener

app.listen(port, () => console.log(`\nserver is running on ${port}`));
