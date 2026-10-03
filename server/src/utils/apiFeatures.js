export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      const searchKeyword = String(this.queryString.search)
        .trim()
        .slice(0, 80)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      this.query = this.query.find({
        $or: [
          { title: { $regex: searchKeyword, $options: 'i' } },
          { description: { $regex: searchKeyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  filter() {
    const priceFilter = {};
    const minPrice = Number(this.queryString.minPrice);
    const maxPrice = Number(this.queryString.maxPrice);
    if (this.queryString.minPrice !== undefined && Number.isFinite(minPrice) && minPrice >= 0) {
      priceFilter.$gte = minPrice;
    }
    if (this.queryString.maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice >= 0) {
      priceFilter.$lte = maxPrice;
    }
    const filter = {};
    if (Object.keys(priceFilter).length) filter.price = priceFilter;
    if (/^[0-9a-fA-F]{24}$/.test(String(this.queryString.category || ''))) {
      filter.category = this.queryString.category;
    }
    this.query = this.query.find(filter);
    return this;
  }

  sort() {
    const allowedSorts = new Set(['createdAt', '-createdAt', 'price', '-price', 'ratings', '-ratings']);
    const sortBy = allowedSorts.has(this.queryString.sort)
      ? this.queryString.sort
      : '-createdAt';
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(this.queryString.limit, 10) || 10)
    );
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
