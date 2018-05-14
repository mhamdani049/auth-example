/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require("bluebird");
var bcrypt = require("bcryptjs")
var os = require('os'); os.tmpDir = os.tmpdir;
var uuid = require('node-uuid');

module.exports = {
    schema: true,
    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            defaultsTo: function () {
                return uuid.v4();
            },
            unique: true,
            index: true,
            uuidv4: true
        },
        email: {
            type: "email",
            required: true,
            unique: true
        },
        firstName: {
            type: 'string',
            required: true,
        },
        lastName: {
            type: 'string'
        },
        password: {
            type: "string",
            minLength: 6,
            protected: true,
            required: true,
            columnName: "encryptedPassword"
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    autoPK:false,

    beforeCreate: function(values, cb){
        bcrypt.hash(values.password, 10, function (err, hash) {
            if (err) return cb(err);
            values.password = hash;
            values.id = uuid.v4();
            cb();
        });
    },

    comparePassword: function (password, user) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user.password, function (err, match) {
                if (err) reject(err);

                if (match) {
                    resolve(true);
                } else {
                    reject(err);
                }
            })
        });
    }

};