module.exports = {
    orm: function(req, res) {
        var sort = req.param("sort");
        var skip = req.param("skip");
        var limit = req.param("limit");
        var where = req.param("where") ? JSON.parse(req.param("where")) : {};
        
        var conditions = where;
        PaginationService.paginate(res, Driver, conditions, skip, limit, ['employee'], 'createdAt DESC');
    },

    deleteMany: function(req, res) {
        var ids = JSON.parse(req.param("ids"));
        if (ids.length > 0) {
            ids.forEach(function (id) {
                Driver.destroy({id:id}, function(err, destroyed) {
                    if (err) { return ResponseService.json(400, res, "error");  }
                });
                return ResponseService.json(200, res, "User deleted successfully")
            });
        }
    }
};