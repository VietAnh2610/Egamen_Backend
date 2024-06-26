const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    if (req.headers.hasOwnProperty('token')) {
        const token = req.headers.token.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
            if (err) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The authentication',
                });
            }
            if (user?.isAdmin) {
                next();
            } else {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The authentication'
                });
            }
        });
    } else {
        return res.status(400).json({
            status: 'ERR',
            message: 'No token provided'
        });
    }
};

const authUserMiddleware = (req, res, next) => {
    if (req.headers.hasOwnProperty('token')) {
        const token = req.headers.token.split(' ')[1];
        const userId = req.params.id
        jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
            if (err) {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The authentication',
                });
            }
            if (user?.isAdmin || user?.id === userId) {
                next();
            } else {
                return res.status(400).json({
                    status: 'ERR',
                    message: 'The authentication'
                });
            }
        });
    } else {
        return res.status(400).json({
            status: 'ERR',
            message: 'No token provided'
        });
    }
};

module.exports = {
    authMiddleware,
    authUserMiddleware
};
