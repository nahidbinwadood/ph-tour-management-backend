import { model, Schema } from 'mongoose';
import { IDivision } from './division.interface';
import { schemaTransform } from '../users/user.model';

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: schemaTransform,
    toObject: schemaTransform,
  }
);

export const Division = model<IDivision>('Division', divisionSchema);
