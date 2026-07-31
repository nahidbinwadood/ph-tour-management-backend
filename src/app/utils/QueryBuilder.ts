import { Query } from 'mongoose';
import { excludeFields } from '../constants';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  //filter==>
  filter(): this {
    const filter = Object.fromEntries(
      Object.entries(this.query).filter(([key]) => !excludeFields.includes(key))
    );
    this.modelQuery = this.modelQuery.find(filter);

    return this;
  }

  //search==>
  search(searchableFields: string[]): this {
    const search = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: this.query.search || '', $options: 'i' },
      })),
    };

    this.modelQuery = this.modelQuery.find(search);
    return this;
  }

  //fields==>
  fields(): this {
    const fields = this.query?.fields?.split(',').join(' ') || '';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  //sort==>
  sort(): this {
    const sort = this.query.sort;
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  //paginate==>
  paginate(): this {
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
  async getMeta() {
    const filter = this.modelQuery.getFilter();
    const totalDocs = await this.modelQuery.model.countDocuments(filter);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPages = Math.ceil(Number(totalDocs) / limit);

    return {
      page,
      limit,
      totalPages,
      totalDocs,
    };
  }
}
