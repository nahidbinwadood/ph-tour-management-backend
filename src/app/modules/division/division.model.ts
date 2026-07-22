import { model, Schema } from 'mongoose';
import { IDivision } from './division.interface';
import { schemaTransform } from '../users/user.model';

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
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

divisionSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});

export const Division = model<IDivision>('Division', divisionSchema);
