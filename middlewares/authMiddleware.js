const jwt = require('jsonwebtoken')
const authentication = (req, res, next) => {
    const { token } = req.cookies
    try {
        if (!token) return res.send("please log-in first")
        jwt.verify(token, process.env.JWT_SECRET, () => {
            if (err) {
                console.log("error encountered when logging in")
                return res.status(401).send('Invalid or expired token');
            }
            req.user = { id: payload.id, admin: payload.isAdmin };
            next()

        })
    } catch (error) {
        res.json({ error: error.message })
    }
}
module.exports = authentication