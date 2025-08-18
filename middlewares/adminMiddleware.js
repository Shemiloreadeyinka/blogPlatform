const authorization = (req, res, next) => {
    try {
        if (!req.user) return res.status(400).json({ message: 'please login' })
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
module.exports = authorization