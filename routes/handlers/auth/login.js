const { User } = require("../../../models");
const { compareSync } = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env;
const {
    isValid,
    BAD_REQUEST,
    arrayToObject,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
    response,
    OK,
} = require("../../../helpers");

module.exports = async (req, res) => {
    try {
        const schema = {
            username: "string|empty:false",
            password: "string|min:6",
        };

        const validate = isValid(req.body, schema);
        if (validate.length)
            return response(
                res,
                BAD_REQUEST,
                arrayToObject(validate, "field", "message")
            );

        const { username, password } = req.body;
        const user = await User.findOne({
            where: { username, password: { [Op.ne]: null } },
        });

        if (!user)
            return response(res, NOT_FOUND, {
                email: "The username you entered did not match our records. Please double check and try again.",
            });

        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid)
            return response(res, NOT_FOUND, {
                password:
                    "The password you entered is incorrect. Please double check and try again.",
            });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            {
                expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
            }
        );

        return response(res, OK, {token });

    } catch (error) {
        console.log(error);
        return response(res, INTERNAL_SERVER_ERROR, error?.message);
    }
};
