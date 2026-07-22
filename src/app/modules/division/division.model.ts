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
  const division = this.getUpdate() as Partial<IDivision>;
  const name = division?.name;
  if (name) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')+ `-division`;
    this.setUpdate({ ...division, slug });
  }
});

export const Division = model<IDivision>('Division', divisionSchema);
