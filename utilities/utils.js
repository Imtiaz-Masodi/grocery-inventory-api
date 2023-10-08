const ApiResponse = require("../pojo/ApiResponse");

function handleCommonError(res, ex) {
    try {
        if (!res || res.headersSent) return;
        res.status(500).send(
            new ApiResponse(false, `Internal server error. Please try again later.\n${ex.message}`)
        );
    } catch(ex) {
        console.log(ex);
    }
}

function handleCors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");

    if ("OPTIONS" === req.method) {
        res.status(200).send(200);
    } else {
        next();
    }
}

module.exports = {
    handleCommonError,
    handleCors
};
