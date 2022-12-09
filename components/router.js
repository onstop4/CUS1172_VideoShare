const express = require("express")
const router = express.Router()

router.use(require("./routes/index"))
router.use(require("./routes/login"))
router.use(require("./routes/registration"))
router.use(require("./routes/dashboard"))
router.use(require("./routes/new_video"))

module.exports = router
