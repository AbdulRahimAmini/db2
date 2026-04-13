
import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = new mongoose.Schema({
 name:String, age:Number, gender:String, guardian:String
});
const Orphan = mongoose.model("Orphan", schema);

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

app.use(express.static(path.join(__dirname,"client")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"client/index.html")));

mongoose.connect(process.env.MONGO_URI)
.then(()=>app.listen(process.env.PORT||10000))
.catch(err=>console.log(err));
