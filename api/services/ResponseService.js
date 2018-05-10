/**
 * ResponseService.js
 */
module.exports = {
    json: function (status, res, message, data, meta) {
        var response = {
            response: {
                message: message
            }
        };
        if (typeof data !== 'undefined') {
            response.response.data = data;
        }
        if (typeof meta !== 'undefined') {
            response.response.meta = meta;
        }
        return res.status(status).json(response);
    },
    jsonResolveError: function(err, res, message) {
        var response = {
            message: 'Validation error has occured'
        }

        if (typeof message !== 'undefined') {
            response.message = message;
        }

        if (err.Errors) {
            response.errors = err.Errors;
            return res.status(400).json(response);
        }

        var e = JSON.parse(JSON.stringify(err));
        if (e.raw) {
            if (!_.isUndefined(e.raw[0].err)) {
                response.errors = e.raw[0].err.Errors;
            } else {
                response.errors = e.raw;
            }
            return res.status(400).json(response);
        }

        return res.negotiate(err);
    }
}