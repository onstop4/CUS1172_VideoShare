const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    if (req.session.isAuthenticated) {
        res.redirect("/video/dashboard/all")
    } else {
        res.render("index")
    }
})

module.exports = router
