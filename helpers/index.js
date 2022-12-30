const XLSX = require("xlsx");
const axios = require("axios");
const Validator = require("fastest-validator");
const { REQUEST_TIMEOUT } = process.env;

// Validation
exports.isValid = (data, schema) => {
    const v = new Validator();
    return v.validate(data, schema);
};
exports.isTrue = (p) => p === "true";

// Pagination
exports.paginate = (page, count, list) => {
    return {
        page: Number(page),
        count,
        list,
    };
};

// Array to Object
exports.arrayToObject = (arr, key, val) =>
    arr.reduce((obj, o) => {
        return (obj[o[key]] = o[val]), obj;
    }, {});

exports.arrayPaginate = (array, count, page_size, page_number) => {
    return {page: page_number, count, list: array.slice((page_number - 1) * page_size, page_number * page_size)}
};


// Api
exports.GET = "GET";
exports.POST = "POST";
exports.PUT = "PUT";
exports.DELETE = "DELETE";

exports.adapter = (BASE_URL) => {
    return axios.create({
        baseURL: BASE_URL,
        timeout: parseInt(REQUEST_TIMEOUT),
    });
};

exports.formatApi = async ({
    api,
    url,
    method = this.GET,
    data = {},
    cache = false,
}) => {
    var ret = {
        status_code: 200,
        data: null,
    };

    if (method == this.PUT || method == this.DELETE) {
        for await (const key of await redisClient.keys(
            api.defaults.baseURL + url + "?*"
        )) {
            await redisClient.del(key);
        }
        for await (const key of await redisClient.keys(
            api.defaults.baseURL + url + "/*"
        )) {
            await redisClient.del(key);
        }
        await redisClient.del(api.defaults.baseURL + url);
    }

    if (cache) {
        const cacheData = await redisClient.get(
            objectToParams(data, api.defaults.baseURL + url)
        );
        if (cacheData) {
            ret.data = { ...JSON.parse(cacheData), from_cache: true };
            return ret;
        }
    }

    try {
        var client = null;
        if (method == this.GET) client = await api.get(url, { params: data });
        else if (method == this.POST) client = await api.post(url, data);
        else if (method == this.PUT) client = await api.put(url, data);
        else client = await api.delete(url);
        if (cache) {
            await redisClient.set(
                objectToParams(data, api.defaults.baseURL + url),
                JSON.stringify(client.data)
            );
        }
        ret.data = {
            ...client.data,
            from_cache: false,
        };
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            ret.status_code = status;
            ret.data = data;
        } else {
            ret.status_code = 500;
            ret.data = { status: "error", message: "Service unavailable" };
        }
    }

    return ret;
};

// exports
exports.OK = 200;
exports.CREATED = 201;
exports.BAD_REQUEST = 400;
exports.UNAUTHORIZE = 401;
exports.FORBIDDEN = 403;
exports.NOT_FOUND = 404;
exports.INTERNAL_SERVER_ERROR = 500;
exports.response = (res, status_code, data = "Ok") => {
    res.status(status_code).json({
        status:
            [this.OK, this.CREATED].indexOf(status_code) !== -1
                ? "success"
                : "error",
        data:
            [this.OK, this.CREATED].indexOf(status_code) !== -1
                ? data
                : undefined,
        message:
            [this.OK, this.CREATED].indexOf(status_code) === -1
                ? data
                : undefined,
    });
};

// Excels
exports.excel = (res, header = [], data = [], filename = "download") => {
    const workBook = XLSX.utils.book_new();
    const workSheetData = [header, ...data];
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    XLSX.utils.book_append_sheet(workBook, workSheet, "users");

    const buffer = XLSX.write(workBook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.xlsx";`
    );
    res.end(buffer);
};