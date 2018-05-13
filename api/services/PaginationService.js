var _ = require('lodash');

module.exports = {
    paginate: function (res, model, criteria, skip, limit, populate_data, sort) {

        var pagination = {
            skip: parseInt(skip) || 0,
            limit: parseInt(limit) || 2
        };

        var conditions = criteria || {};
        model.count(conditions).then(function (count) {
            var findQuery = model.find(conditions);
            if (sort) {
                findQuery = findQuery.sort(sort);
            }

            findQuery.skip(skip);
            findQuery.limit(limit);

            findQuery = findQuery.paginate(pagination);
            return [count, findQuery];
        }).spread(function (count, data) {
            // sails.log(data);
            // sails.log(count);
            // var v = {
            //     data: data,
            //     numrows: count,
            //     skip: pagination.skip
            // }
            // return res.ok(v);

            var numberOfPages = Math.ceil(count / pagination.limit);
            var nextPage = parseInt(pagination.skip) + 1;
            var meta = {
                data: data,
                skip: 0,
                limit: pagination.limit,
                // previousPage: (pagination.skip > 1) ? parseInt(pagination.skip) - 1 : false,
                // nextPage: (numberOfPages >= nextPage) ? nextPage : false,
                page: numberOfPages,
                numrows: count
            }
            return res.ok(meta);

        });

        // var thirdPageOfRecentPeopleNamedMary = await model.find({
        //     skip: skip,
        //     limit: limit,
        //     sort: 'createdAt DESC'
        // });

        // var pagination = {
        //     skip: parseInt(skip) || 1,
        //     limit: parseInt(limit) || 2
        // };

        // var conditions = criteria || {};
        // var populate_data = populate_data || [];
        // model.count(conditions).then(function (count) {
        //     var findQuery = model.find(conditions);
        //     if (sort) {
        //         findQuery = findQuery.sort(sort);
        //     }
        //     if (_.isArray(populate_data) && !_.isEmpty(populate_data)) {
        //         _(populate_data).forEach(function (populate) {
        //             if (_.isObject(populate)) {
        //                 findQuery = findQuery.populate(populate.name, populate.query);
        //             } else {
        //                 findQuery = findQuery.populate(populate);
        //             }
        //         });
        //     }
        //     findQuery = findQuery.paginate(pagination);
        //     return [count, findQuery];
        // }).spread(function (count, data) {
        //     var numberOfPages = Math.ceil(count / pagination.limit);
        //     var nextPage = parseInt(pagination.skip) + 1;
        //     var meta = {
        //         skip: pagination.skip,
        //         perPage: pagination.limit,
        //         previousPage: (pagination.skip > 1) ? parseInt(pagination.skip) - 1 : false,
        //         nextPage: (numberOfPages >= nextPage) ? nextPage : false,
        //         pageCount: numberOfPages,
        //         total: count
        //     }
        //     return ResponseService.json(200, res, 'Data retrieved successfully', data, meta);
        // }).catch(function (err) {
        //     return ResponseService.jsonResolveError(err, res);
        // })
    }
}