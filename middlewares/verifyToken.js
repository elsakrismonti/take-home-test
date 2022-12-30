const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN } = process.env;
const { User } = require("../models");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization || req.query.token;

    if (token)
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err)
                return res
                    .status(403)
                    .json({ status: "error", message: err.message });

            req.username = decoded.username;
            req.query.token = undefined;
            return next();
        });
    else {
        return res
            .status(403)
            .json({ status: "error", message: "Unauthorized" });
    }
};
