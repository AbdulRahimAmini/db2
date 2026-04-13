
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API RUNNING");
});

app.get("/api/test", (req, res) => {
  res.json({status:"ok"});
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("MongoDB Connected");
  app.listen(process.env.PORT || 10000, ()=>{
    console.log("Server running");
  });
})
.catch(err=>console.log(err));
