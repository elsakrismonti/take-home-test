const { INTERNAL_SERVER_ERROR, response, OK } = require("../../../../helpers");
const axios = require("axios");

module.exports = async (req, res) => {
    try {
        const { id } = req.params;

         const get = await axios.get(
             `http://dev3.dansmultipro.co.id/api/recruitment/positions/${id}`
         );

         if (get.status == 200) {
             console.log(get.data);
             return response(
                 res,
                 OK,
                 get.data
             );
         } 

         } catch (error) {
        console.log(error);
        return response(res, INTERNAL_SERVER_ERROR, error?.message);
    }
};
