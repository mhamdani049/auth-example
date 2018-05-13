/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var os = require('os'); os.tmpDir = os.tmpdir;

module.exports = {

    orm: function(req, res) {
        var sort = req.param("sort");
        var skip = req.param("skip");
        var limit = req.param("limit");

        sails.log("sort:"+sort+", skip:"+skip+", limit:"+limit);
        // sort
        // skip
        // limit

        // var conditions = {active: true};
        // PaginationService.paginate(res, User, conditions, currentPage, perPage, [{name: 'AssociatedModel', query: {isDeleted: false}}], 'createdAt DESC');
        var conditions = {};
        PaginationService.paginate(res, User, conditions, limit, skip, [], 'createdAt DESC');
    },

    create: function (req, res) {
        if (req.body.password !== req.body.confirmPassword) {
            return ResponseService.json(401, res, "Password doesn't match")
        }

        var allowedParameters = [
            "email", "password"
        ]

        var data = _.pick(req.body, allowedParameters);
        console.log(data);

        User.create(data).then(function (user) {
            var responseData = {
                user: user,
                token: JwtService.issue({id: user.id})
            }
            return ResponseService.json(200, res, "User created successfully", responseData)
        }).catch(function (error) {
                if (error.invalidAttributes){
                    return ResponseService.json(400, res, "User could not be created", error.Errors)
                }
            }
        )

    },

    me: function (req, res) {
        return ResponseService.json(200, res, "Current User", req.user)
    },
};