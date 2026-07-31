"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    //filter==>
    filter() {
        const filter = Object.fromEntries(Object.entries(this.query).filter(([key]) => !constants_1.excludeFields.includes(key)));
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    //search==>
    search(searchableFields) {
        const search = {
            $or: searchableFields.map((field) => ({
                [field]: { $regex: this.query.search || '', $options: 'i' },
            })),
        };
        this.modelQuery = this.modelQuery.find(search);
        return this;
    }
    //fields==>
    fields() {
        var _a, _b;
        const fields = ((_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',').join(' ')) || '';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    //sort==>
    sort() {
        const sort = this.query.sort;
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    //paginate==>
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = Number(page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    //build==>
    build() {
        return this.modelQuery;
    }
    //get meta data==>
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = this.modelQuery.getFilter();
            const totalDocs = yield this.modelQuery.model.countDocuments(filter);
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPages = Math.ceil(Number(totalDocs) / limit);
            return {
                page,
                limit,
                totalPages,
                totalDocs,
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
