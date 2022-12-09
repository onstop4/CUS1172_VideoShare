const express = require("express")
const { authRequired } = require("./utils")
const router = express.Router()

router.get("/video/dashboard/:videofilter", authRequired((req, res) => {
    const currentUser = req.session.userId
    switch (req.params.videofilter) {
        case "all":
            res.render("dashboard", { showing: "all", videos: db.model.videos })
            break
        case "mine":
            res.render("dashboard", { showing: "mine", videos: db.model.videos.filter(video => video.userId === currentUser) })
            break
        default:
            res.redirect("/video/dashboard/all")
    }
}))

module.exports = router
