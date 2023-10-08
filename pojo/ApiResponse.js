class ApiResponse {
    constructor(status, message, payload = null) {
        this.status = status ? "success" : "failed";
        this.message = message;
        if (payload) this.payload = payload;
    }
}

module.exports = ApiResponse;
