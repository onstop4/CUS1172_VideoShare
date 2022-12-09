const express = require("express")
const { authRequired } = require("./utils")
const router = express.Router()

function isValidVideoId(id) {
    const regex = /^[\w\-]+$/i
    return regex.test(id)
}

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
        db.model.videos.push({ userId: req.session.userId, title: req.body.title, description: req.body.description, videoId: req.body.videoId })
        db.update()
        res.render("new_video", { success: true })
    }
}))

module.exports = router
