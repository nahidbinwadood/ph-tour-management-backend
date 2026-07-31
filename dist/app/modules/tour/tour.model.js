"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../users/user.model");
const tourTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: user_model_1.schemaTransform,
    toObject: user_model_1.schemaTransform,
});
exports.TourType = (0, mongoose_1.model)('TourType', tourTypeSchema);
const tourSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String] },
    excluded: { type: [String] },
    amenities: { type: [String] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Division',
        required: true,
    },
    tourType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TourType',
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: user_model_1.schemaTransform,
    toObject: user_model_1.schemaTransform,
});
tourSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().split(' ').join('-');
    }
});
tourSchema.pre('findOneAndUpdate', function () {
    const tour = this.getUpdate();
    if (tour.title) {
        tour.slug = tour.title.toLowerCase().split(' ').join('-');
        this.setUpdate(Object.assign({}, tour));
    }
});
exports.Tour = (0, mongoose_1.model)('Tour', tourSchema);
