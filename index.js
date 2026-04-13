
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Models
const User = mongoose.model("User", new mongoose.Schema({
  username:String,
  password:String
}));

const Orphan = mongoose.model("Orphan", new mongoose.Schema({
  name:String, age:Number, gender:String
}));

// Seed admin user
async function seed(){
  const exists = await User.findOne({username:"admin"});
  if(!exists){
    const hash = await bcrypt.hash("1234", 10);
    await User.create({username:"admin", password:hash});
    console.log("Admin created");
  }
}

// Auth
app.post("/api/auth/login", async (req,res)=>{
  const {username,password} = req.body;
  const user = await User.findOne({username});
  if(!user) return res.status(401).json({});

  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({});

  const token = jwt.sign({id:user._id}, "SECRET");
  res.json({token});
});

// CRUD
app.get("/api/orphans", async (req,res)=>res.json(await Orphan.find()));
app.post("/api/orphans", async (req,res)=>{
  const d=new Orphan(req.body);
  await d.save();
  res.json(d);
});

// Serve client
app.use(express.static(path.join(__dirname,"client")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"client/index.html")));

// Start
mongoose.connect(process.env.MONGO_URI).then(async ()=>{
  await seed();
  app.listen(process.env.PORT||10000);
});
