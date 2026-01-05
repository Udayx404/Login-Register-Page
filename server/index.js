require("dotenv").config();
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const UserModel = require("./models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const {PASSWORD} = process.env

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"]
}))
app.use(cookieParser())

mongoose.connect(`mongodb+srv://kudayk186_db_user:${process.env.PASSWORD}@cluster0.ko0wvtj.mongodb.net/`)

const verifyUser = (req,res,next) =>{
    const token = req.cookies.token
    if(!token){
        return res.json("Token not available!")
    }
    else{
        jwt.verify(token, "jwt-secret-key", (err, decoded)=>{
            if(err) return res.json("Invalid token!")
            next()
        })
    }
}

app.get("/home", verifyUser, (req,res)=>{
    return res.json("Success!")
})

app.post("/login", (req,res)=>{
    const {email, password} = req.body
    UserModel.findOne({email: email})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, (err, response)=>{
                if(response){
                    const token = jwt.sign({email: user.email}, "jwt-secret-key", {expiresIn:"1d"})
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax"
                    })
                    res.json("Success!")
                }
                else{
                    res.json("Incorrect password!")
                }
            })
        }
        else{
            res.json("No record exists! Please register!")
        }
    })
})

app.post("/register", (req,res)=>{
    const {name, email, password} = req.body
    bcrypt.hash(password, 10)
    .then(hash => {
        UserModel.create({name: name, email: email, password: hash})
        .then(user => res.json(user))
        .catch(err => res.json(err))
    })
    .catch(err => console.log(err.message))
})

app.listen(3001, ()=>{
    console.log("server is running");
})