
import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

const __dirname = new URL('.', import.meta.url).pathname;

// DB Model
const schema = new mongoose.Schema({
 name:String,
 age:Number,
 gender:String,
 guardian:String
});
const Orphan = mongoose.model("Orphan", schema);

// API
app.get("/api/orphans", async(req,res)=>res.json(await Orphan.find()));
app.post("/api/orphans", async(req,res)=>{
 const d=new Orphan(req.body);
 await d.save();
 res.json(d);
});
app.delete("/api/orphans/:id", async(req,res)=>{
 await Orphan.findByIdAndDelete(req.params.id);
 res.json({ok:true});
});

// Serve frontend
app.use(express.static(path.join(__dirname,"client")));

app.get("*",(req,res)=>{
 res.sendFile(path.join(__dirname,"client/index.html"));
});

// Start
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
 app.listen(process.env.PORT||10000,()=>console.log("RUNNING"));
})
.catch(err=>console.log(err));
