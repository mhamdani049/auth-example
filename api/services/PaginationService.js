var _ = require('lodash');

module.exports = {
    paginate: function (res, model, criteria, skip, limit, populate_data, sort) {

        skip: parseInt(skip) || 0;
        limit: parseInt(limit) || 2;
        var page = calculatePage(skip, limit);

        var pagination = {
            page: parseInt(page) || 0,
            limit: parseInt(limit) || 2
        };

        var conditions = criteria || {};
        model.count(conditions).then(function (count) {
            var findQuery = model.find(conditions);
            if (sort) {
                findQuery = findQuery.sort(sort);
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
            return ResponseService.jsonResolveError(err, res);
        });

        function calculatePage(skip, limit) {
            var page = 1;
            var _page = skip/limit;
            if (_page > 0) {
                if(_page == 1) {
                    page = _page+1;
                } else {
                    page = _page;
                }
            }
            return page;
        }
    }
}