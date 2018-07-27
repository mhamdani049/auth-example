var _ = require('lodash');

module.exports = {
    paginate: function (res, model, criteria, skip, limit, populate_data, sort) {
        skip: parseInt(skip) || 0;
        limit: parseInt(limit) || 25;
        var page = calculatePage(skip, limit);

        var pagination = {
            page: parseInt(page) || 0,
            limit: parseInt(limit) || 25
        };

        var contains = {};
        for (var key in criteria) {
		   console.log("key:"+key+", value:"+criteria[key]);
		   if (typeof criteria[key].contains !== 'undefined') {
			   contains[key] = {};
			   contains[key]['contains'] = criteria[key]
		   } else {
			   contains[key] = criteria[key];
		   }
        }

        model.count(contains).then(function (count) {
            var findQuery = model.find(contains);
            if (sort) {
                findQuery = findQuery.sort(sort);
            }
            if (_.isArray(populate_data) && !_.isEmpty(populate_data)) {
                _(populate_data).forEach(function (populate) {
                    if (_.isObject(populate)) {
                        findQuery = findQuery.populate(populate.name, populate.query);
                    } else {
                        findQuery = findQuery.populate(populate);
                    }
                });
            }
            findQuery = findQuery.paginate(pagination);
            return [count, findQuery];
        }).spread(function (count, data) {
            var numberOfPages = Math.ceil(count / pagination.limit);
            var nextPage = parseInt(pagination.page) + 1;
            var meta = {
                skip: skip,
                limit: pagination.limit,
                page: numberOfPages,
                numrows: count
            }
            return ResponseService.json(200, res, 'Data retrieved successfully', data, meta);
        }).catch(function (err) {
            return res.ok(err);
            //return ResponseService.jsonResolveError(err, res);
        });

        function calculatePage(skip, limit) {
            var page = 1;
            var _page = skip/limit;
            if (_page > 0) {
                if(_page == 1) {
                    page = _page+1;
                } else {
                    page = _page+1;
                }
            }
            return page;
        }
    }
}