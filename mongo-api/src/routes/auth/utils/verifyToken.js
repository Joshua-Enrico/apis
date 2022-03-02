const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authToken = req.headers.token;
    if (authToken){
        const token = authToken.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err){
                return res.status(401).json({
                    error: "Invalid token"
                });
            } else {
                next();
            }
            // pass
        })
    } else {
        return res.status(401).json({
            error: "No authenticated"
        });
    }
}

module.exports = { verifyToken };