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

module.exports = { authRequired, ignoreIfAuthenticated }
