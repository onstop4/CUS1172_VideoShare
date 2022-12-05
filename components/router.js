const express = require("express")
const router = express.Router()

function authRequired(func) {
    return (req, res) => {
        if (req.session.isAuthenticated) {
            res.locals.userId = req.session.userId
            func(req, res)
        } else {
            res.redirect("/auth/login?needLogin=1")
        }
    }
}

function ignoreIfAuthenticated(func) {
    return (req, res) => {
        if (!req.session.isAuthenticated) {
            func(req, res)
        } else {
            res.redirect("/video/dashboard/all")
        }
    }
}

function isValidVideoId(id) {
    const regex = /^[\w\-]+$/i
    return regex.test(id)
}

router.get("/", (req, res) => {
    if (req.session.isAuthenticated) {
        res.redirect("/video/dashboard/all")
    } else {
        res.render("index")
    }
})

router.get("/auth/login", ignoreIfAuthenticated((req, res) => {
    res.render("login", { needLogin: req.query.needLogin })
}))

router.post("/auth/login", ignoreIfAuthenticated((req, res) => {
    const potentialUser = db.model.users.find(user => user.userId === req.body.user)
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
    } else if (db.models.users.find(user => user.email === req.body.email)) {
        existing.push("email address")
    }

    if (!req.body.user) {
        missing.push("username")
    } else if (db.models.users.find(user => user.userId === req.body.user)) {
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
        db.model.users.push({ email: req.body.email, userId: req.body.user, password: req.body.password })
        db.update()
        res.render("account_created")
    }
}))

router.get("/video/dashboard/:videofilter", authRequired((req, res) => {
    const currentUser = req.session.userId
    switch (req.params.videofilter) {
        case "all":
            res.render("dashboard", { showing: "all", videos: db.model.videos })
            break
        case "mine":
            res.render("dashboard", { showing: "mine", videos: db.model.videos.filter(video => video.user === currentUser) })
            break
        default:
            res.redirect("/video/dashboard/all")
    }
}))

router.get("/video/new_video", authRequired((req, res) => {
    res.render("new_video")
}))

router.post("/video/new_video", authRequired((req, res) => {
    const missing = []
    if (!req.body.title) {
        missing.push("title of video")
    }
    if (!req.body.description) {
        missing.push("description of video")
    }
    if (!req.body.videoId) {
        missing.push("video ID")
    }

    if (missing.length) {
        res.render("new_video", { error: "You are missing the following values:", errorList: missing })
    } else if (!isValidVideoId(req.body.videoId)) {
        res.render("new_video", { error: "Invalid video ID." })
    } else {
        db.model.videos.push({ user: req.session.userId, title: req.body.title, description: req.body.description, url: "https://www.youtube-nocookie.com/embed/" + req.body.videoId })
        db.update()
        res.render("new_video", { success: true })
    }
}))

module.exports = router
