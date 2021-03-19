const jwt = require('jsonwebtoken');
const { jwtsecret } = require('../../utils/config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, jwtsecret);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Auth Failed"});
    }
};