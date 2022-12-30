const { Op } = require("sequelize");
const axios = require("axios");
const {
    response,
    INTERNAL_SERVER_ERROR,
    OK,
    paginate,
    arrayPaginate,
} = require("../../../helpers");
const { count } = require("console");
const { NOTFOUND } = require("dns");
module.exports = async (req, res) => {
    try {
        const description = req.query.description;
        const location = req.query.location;
        const page = req.query.page || 1;
        const full_time = req.query.full_time || true;

        const get = await axios.get(
            "http://dev3.dansmultipro.co.id/api/recruitment/positions.json"
        );

        console.log(full_time == "false");

        if (get.status == 200) {
            datas = get.data.filter((data) =>
                description
                    ? data.description
                          ?.toLowerCase()
                          .includes(description.toLowerCase())
                    : true && location
                    ? data.location
                          ?.toLowerCase()
                          .includes(location.toLowerCase())
                    : true && full_time == "true"
                        ? data.type
                              ?.toLowerCase()
                              .includes("Full Time".toLowerCase())
                        : true
            );
            return response(
                res,
                OK,
                arrayPaginate(datas, datas.length, 10, page)
            );
        } else {
            return response(res, NOTFOUND);
        }
    } catch (error) {
        console.log(error);
        return response(res, INTERNAL_SERVER_ERROR, error?.message);
    }
};
