import { model, Schema } from 'mongoose';
import { ITour, ITourType } from './tour.interface';
import { schemaTransform } from '../users/user.model';

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: schemaTransform,
    toObject: schemaTransform,
  }
);

export const TourType = model<ITourType>('TourType', tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String] },
    location: { type: [String] },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String] },
    excluded: { type: [String] },
    amenities: { type: [String] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: 'TourType',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: schemaTransform,
    toObject: schemaTransform,
  }
);

export const Tour = model<ITour>('Tour', tourSchema);
