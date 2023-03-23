"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var omit_1 = __importDefault(require("lodash/omit"));
var parse_json_1 = __importDefault(require("../../helpers/parse-json"));
function mongoosePaginate(schema) {
    schema.statics.paginate = function paginate(query, options) {
        if (query === void 0) { query = {}; }
        options = __assign({ projection: {}, sort: { created: -1 }, select: '' }, options);
        if (query.lmit)
            options.limit = query.limit;
        if (query.page)
            options.page = query.page;
        if (query.sort)
            options.sort = query.sort;
        if (query.expand)
            options.expand = query.expand.map(function (i) { return (0, parse_json_1["default"])(i); });
        query = (0, omit_1["default"])(query, ['page', 'limit', 'sort', 'expand']);
        var limit = +options.limit > 0 ? (+options.limit <= 100 ? +options.limit : 100) : 20;
        var page = +options.page > 0 ? +options.page : 1;
        var skip = (page - 1) * limit;
        var countPromise = this.countDocuments(query).exec();
        var result = this.find(query, options.projection);
        if (options.expand)
            result.populate(options.expand);
        var docsPromise = result
            .select(options.select)
            .skip(skip)
            .limit(limit)
            .sort(options.sort)
            .exec();
        return Promise.all([countPromise, docsPromise])
            .then(function (values) {
            var total = values[0], data = values[1];
            var meta = { total: total, page: page };
            var pages = limit > 0 ? Math.ceil(total / limit) || 1 : 0;
            meta.has_more = page < pages;
            var value = __assign({ data: data }, meta);
            return Promise.resolve(value);
        })["catch"](function (error) { return Promise.reject(error); });
    };
}
exports["default"] = mongoosePaginate;
