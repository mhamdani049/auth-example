/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var os = require('os'); os.tmpDir = os.tmpdir;
var bcrypt = require("bcryptjs");

module.exports = {

    orm: function(req, res) {
        var sort = req.param("sort");
        var skip = req.param("skip");
        var limit = req.param("limit");
        var where = req.param("where") ? JSON.parse(req.param("where")) : {};
        
        var conditions = where;
        PaginationService.paginate(res, User, conditions, skip, limit, [], 'createdAt DESC');
    },

    create: function (req, res) {
        if (req.body.password !== req.body.confirmPassword) {
            return ResponseService.json(400, res, "Password doesn't match")
        }

        var allowedParameters = [
            "email", "password", "firstName", "lastName"
        ];

        var data = _.pick(req.body, allowedParameters);
        User.create(data).then(function (user) {
            var responseData = {
                user: user,
                token: JwtService.issue({id: user.id})
            };
            return ResponseService.json(200, res, "User created successfully", responseData)
        }).catch(function (error) {
                if (error.invalidAttributes){
                    return ResponseService.json(400, res, "User could not be created", error.Errors)
                }
            }
        )

    },

    update: function (req, res) {
        var allowedParameters = [
            "id", "email", "password", "firstName", "lastName"
        ];
        var data = _.pick(req.body, allowedParameters);
        User.update({id: data.id}).set(data).then(function (user) {
            return ResponseService.json(200, res, "User change password successfully", user);
        }).catch(function (error) {
            if (error.invalidAttributes){
                return ResponseService.json(400, res, "User could not be updated", error.Errors)
            }
        });
    },

    delete: function (req, res) {
        var id = req.param("id");
        if (id) {
            User.destroy({ id: id}, function (error, destroyed) {
                if (error) { return ResponseService.json(400, res, "error");  }
                return ResponseService.json(200, res, "User deleted successfully")
            });
        }
        return ResponseService.json(400, res, "error");
    },

    deleteMany: function(req, res) {
        var ids = JSON.parse(req.param("ids"));
        if (ids.length > 0) {
            ids.forEach(function (id) {
                User.destroy({ id: id}, function (error, destroyed) {
                    if (error) { return ResponseService.json(400, res, "error");  }
                });
            })
            return ResponseService.json(200, res, "User deleted successfully")
        }
        return ResponseService.json(400, res, "error");
    },

    changePassword: function (req, res) {
        if (req.body.password !== req.body.confirmPassword) {
            return ResponseService.json(401, res, "Password doesn't match")
        }
        var allowedParameters = [ "password", "id" ];
        var data = _.pick(req.body, allowedParameters);

        function hashPassword(cb1) {
            bcrypt.hash(data.password, 10, function (err, hash) {
                if (err) return ResponseService.json(400, res, "error");
                cb1(null, hash);
            });
        }

        function update(hashPassword, cb2) {
            data.password = hashPassword;
            User.update({id: data.id}).set(data).then(function (user) {
                cb2(null, user);
            }).catch(function (error) {
                cb2(error);
            });
        }

        async.waterfall([
            hashPassword,
            update
        ], function(err, success) {
            if (err) return ResponseService.json(400, res, "User could not be updated", err)
            return ResponseService.json(200, res, "User change password successfully", success)
        });
    },

    me: function (req, res) {
        return ResponseService.json(200, res, "Current User", req.user)
    },

    rolePermission: function (req, res) {
        var id = req.param("id");

        function getByUsername(cb1) {
            console.log("getByUsername loaded")
            User.findOne({id: id}).exec(function(err, dataUser) {
                if (err) cb1(err);

                console.log("getByUsername:", dataUser);
                cb1(null, dataUser);
            })
        }

        function initRoles(dataUser, cb2) {
            console.log("initRoles loaded")
            $sql = "SELECT t1.role_id, t2.role_name FROM user_role as t1 JOIN roles as t2 ON t1.role_id = t2.role_id WHERE t1.user_id='"+dataUser.id+"'";
            User.query($sql, function(err, datas) {
                if (err) cb2(err);
                
                if (datas.length > 0) {
                    dataUser['PrivilegedUser'] = [];

                    var i = 0;
                    async.forEach(datas, function(item, callback) {
                        dataUser['PrivilegedUser'][i] = {};
                        dataUser['PrivilegedUser'][i][item.role_name] = {};

                        $sqlPermission = "SELECT t2.perm_desc FROM role_perm as t1 JOIN permissions as t2 ON t1.perm_id = t2.perm_id WHERE t1.role_id="+item.role_id;
                        console.log("$sqlPermission", $sqlPermission)
                        User.query($sqlPermission, function(errPermission, datasPermission) {
                            if (errPermission) cbb2(errPermission);
                            dataUser['PrivilegedUser'][i][item.role_name]['permissions'] = "aa";
                            console.log("datasPermission:",datasPermission)
                            callback(null, datasPermission);
                        });

                    }, function(err) {
                        console.log('iterating done')
                    });

                    // dataUser['roles']['id'] = datas[0].role_id;
                    // dataUser['roles']['name'] = datas[0].role_name;
                    cb2(null, dataUser);
                } else {
                    cb2("Get Roles Errors");
                } 
                
            })
        }

        // function getRolePerms(dataUser, cb3) {
        //     console.log("getRolePerms loaded")
        //     $sql = "SELECT t2.perm_desc FROM role_perm as t1 JOIN permissions as t2 ON t1.perm_id = t2.perm_id WHERE t1.role_id="+dataUser['roles']['id'];
        //     User.query($sql, function(err, datas) {
        //         if (err) cb3(err);

        //         if (datas.length) {
        //             dataUser['roles']['permissions'] = [];
        //             dataUser['roles']['permissions'] = datas;
        //             console.log("getRolePerms:", datas, dataUser);
        //             cb3(null, dataUser);     
        //         } else {
        //             cb3("Get Permissions Errors");
        //         }
                
        //     })
        // }

        async.waterfall([
            getByUsername,
            initRoles,
            // getRolePerms
        ], function (err, success) {
            if (err) res.badRequest(err)
            res.ok(success)
        });
    }
};