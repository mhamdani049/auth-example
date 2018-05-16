/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var os = require('os'); os.tmpDir = os.tmpdir;
var bcrypt = require("bcryptjs");
var sid = require('shortid');
var formidable = require('formidable');
const { parse } = require('querystring');

// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);
function safeFilename(name) {
    name = name.replace(/ /g, '-');
    name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
    name = name.replace(/\.+/g, '.');
    name = name.replace(/-+/g, '-');
    name = name.replace(/_+/g, '_');
    return name;
}
function fileMinusExt(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
}
function fileExtension(fileName) {
    return fileName.split('.').slice(-1);
}

module.exports = {

    orm: function(req, res) {
        var sort = req.param("sort");
        var skip = req.param("skip");
        var limit = req.param("limit");
        var where = req.param("where") ? JSON.parse(req.param("where")) : {};

        // var conditions = {active: true};
        // PaginationService.paginate(res, User, conditions, currentPage, perPage, [{name: 'AssociatedModel', query: {isDeleted: false}}], 'createdAt DESC');
        var conditions = where;
        PaginationService.paginate(res, User, conditions, skip, limit, [], 'createdAt DESC');
    },

    create: function (req, res) {
        console.log(req);
        console.log("===========================");
        console.log(req.body);
        if (req.body.password !== req.body.confirmPassword) {
            return ResponseService.json(401, res, "Password doesn't match")
        }
		
		// parse a file upload
		//var form = new formidable.IncomingForm();
		//form.parse(req);
		//form.on('fileBegin', function (name, file){
		//	file.path = __dirname + '/uploads/' + file.name;
		//});
		//form.on('file', function (name, file){
		//	console.log('Uploaded ' + file.name);
		//});

        var allowedParameters = [
            "email", "password", "firstName", "lastName"
        ];

        var data = _.pick(req.body, allowedParameters);
        console.log(data);

        User.create(data).then(function (user) {
            var responseData = {
                user: user,
                token: JwtService.issue({id: user.id})
            };

            //config upload
            var uploadFile = req.file("avatar");
            var fileName = '';
            uploadFile.upload({
                dirname: require('path').resolve(sails.config.appPath, 'public/images/avatar'),
                maxBytes: 10000000, // don't allow the total upload size exceed ~10mb
                saveAs: function (file, cb) {
                    var id = sid.generate();
                    fileName = id + "." + fileExtension(safeFilename(file.filename));
                    cb(null, fileName);
                }
            }, function onUploadComplete (err, uploadedFiles) {
                if (err) return ResponseService.json(400, res, "error");

                // if no files where uploaded, response with an error
                if (uploadedFiles.length === 0) {
                    console.log("No file was uploaded");
                } else {
                    // Get the base URL for our deployed application from our custom config
                    // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
                    var baseUrl = "http://localhost:1337";

                    // Save the "fd" and the url where the avatar for a user can be accessed
                    User.update({id: user.id}, {
                        // Generate a unique URL where the avatar can be downloaded.
                        avatarUrl: require('util').format('%s/public/images/avatar/%s', baseUrl, fileName),
                        // Grab the first file and use it's `fd` (file descriptor)
                        avatarFd: uploadedFiles[0].fd
                    }).exec(function (err) {
                        if (err) return ResponseService.json(400, res, "error");
                    });
                };
            });

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

    deleteMany: function(req, res) {
        var ids = JSON.parse(req.param("ids"));
        if (ids.length > 0) {
            ids.forEach(function (id) {
                User.destroy({ id: id}, function (error, destroyedComments) {
                    if (error) { return ResponseService.json(400, res, "error");  }
                    console.log("destroyedComments:", destroyedComments)
                })
            })
            return ResponseService.json(200, res, "User deleted successfully")
        }
        return ResponseService.json(400, res, "error");
    },
    
    changePassword: function (req, res) {
        if (req.body.password !== req.body.confirmPassword) {
            return ResponseService.json(401, res, "Password doesn't match")
        }

        var allowedParameters = [
            "password","id"
        ];

        var data = _.pick(req.body, allowedParameters);
        bcrypt.hash(data.password, 10, function (err, hash) {
            if (err) return ResponseService.json(400, res, "error");
            data.password = hash;
        });

        User.update({id: data.id}).set(data).then(function (user) {
            return ResponseService.json(200, res, "User change password successfully", user)
        }).catch(function (error) {
                if (error.invalidAttributes){
                    return ResponseService.json(400, res, "User could not be created", error.Errors)
                }
            }
        )
    }
};