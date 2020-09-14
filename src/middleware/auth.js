const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const noAuthPaths = ['/login', '/register'];

    if (noAuthPaths.includes(req.path)) {
        next();
        return;
    }

    const authHeader = req.headers['authorization'];
    const reqToken = authHeader && authHeader.split(' ')[1];

    if (reqToken == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(reqToken, process.env.SECRET, (err) => {
        if (err != null) {
            console.error(err);
            res.sendStatus(401);
            return;
        }

        next();
    });
};
