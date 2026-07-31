"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../users/user.model");
const divisionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: user_model_1.schemaTransform,
    toObject: user_model_1.schemaTransform,
});
// make slug based on the name while create==>
divisionSchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug =
            this.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '') + `-division`;
    }
});
// make slug based on the name while update==>
divisionSchema.pre('findOneAndUpdate', function () {
    const division = this.getUpdate();
    const name = division === null || division === void 0 ? void 0 : division.name;
    if (name) {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '') + `-division`;
        this.setUpdate(Object.assign(Object.assign({}, division), { slug }));
    }
});
exports.Division = (0, mongoose_1.model)('Division', divisionSchema);
