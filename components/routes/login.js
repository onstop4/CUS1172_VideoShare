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

module.exports = router
