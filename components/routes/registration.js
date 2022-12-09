const express = require("express")
const { ignoreIfAuthenticated } = require("./utils")
const router = express.Router()

router.get("/auth/login", ignoreIfAuthenticated((req, res) => {
    res.render("login", { needLogin: req.query.needLogin })
}))

router.post("/auth/login", ignoreIfAuthenticated((req, res) => {
    const potentialUser = db.model.users.find(user => user.userId === req.body.userId)
    if (potentialUser !== undefined && potentialUser.password === req.body.password) {
        req.session.userId = potentialUser.userId
        req.session.isAuthenticated = true
        res.redirect("/video/dashboard/all")
    } else {
        res.render("login", { error: "Incorrect username or password." })
    }
}))

router.get("/auth/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            res.redirect("/auth/login")
        }
    })
})

router.get("/auth/register", ignoreIfAuthenticated((req, res) => {
    res.render("register")
}))

router.post("/auth/register", ignoreIfAuthenticated((req, res) => {
    const missing = []
    const existing = []

    if (!req.body.email) {
        missing.push("email address")
    } else if (db.model.users.find(user => user.email === req.body.email)) {
        existing.push("email address")
    }

    if (!req.body.userId) {
        missing.push("username")
    } else if (db.model.users.find(user => user.userId === req.body.userId)) {
        existing.push("username")
    }

    if (!req.body.password) {
        missing.push("password")
    }

    if (missing.length) {
        res.render("register", { error: "You are missing the following values:", errorList: missing })
    } else if (existing.length) {
        res.render("register", { error: "Accounts with the following values already exist:", errorList: existing })
    } else {
        db.model.users.push({ email: req.body.email, userId: req.body.userId, password: req.body.password })
        db.update()
        res.render("account_created")
    }
}))

module.exports = router
