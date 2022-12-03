const express = require("express")
const router = require("./components/router")
const session = require("express-session")

global.db = require("./components/fsdb")(__dirname + "/data/db.json", { "users": [], "videos": [] });

const app = express()

app.set("views", "./views")
app.set("view engine", "pug")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 3600000 }
}))
app.use("/", router)
app.use('/static', express.static('resources'))

app.listen(8000, () => {
    console.log("Server running in port 8000!")
});
