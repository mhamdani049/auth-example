module.exports = function (req, res, next) {
    var token;

    if (req.headers && req.headers.authorization) {
        sails.log("token: " + req.headers.authorization);
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];

            sails.log("scheme: " + scheme);
            sails.log("credentials: " + credentials);
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return ResponseService.json(401, res, "Format is Authorization: Baerer [token]");
        }
    } else if (req.param('token')) {
        token = req.param('token');

        delete req.query.token;
    } else {
        return ResponseService.json(401, res, "No authorization header was found");
    }

    sails.log("token: " + token);
    JwtService.verify(token, function (err, decoded) {
       if (err) return ResponseService.json(401, res, "Invalid Token!");
       req.token = token;
       User.findOne({id: decoded.id}).then(function (user) {
           req.user = user;
           next();
       })
    });
}