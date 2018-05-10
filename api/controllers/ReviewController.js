/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var os = require('os'); os.tmpDir = os.tmpdir;

module.exports = {
    resolve: function (req, res) {
        return ResponseService.json(200, res, "done.");
    }
};