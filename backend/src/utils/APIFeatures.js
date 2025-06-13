class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
      this.filterQuery = {};
      this.pagina = 1;
      this.limite = 10;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['pagina', 'limite', 'sort', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // Filtrado avanzado con operadores
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.filterQuery = JSON.parse(queryStr);
      this.query = this.query.find(this.filterQuery);
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    paginate() {
      const pagina = this.queryString.pagina * 1 || this.pagina;
      const limite = this.queryString.limite * 1 || this.limite;
      const skip = (pagina - 1) * limite;
  
      this.pagina = pagina;
      this.limite = limite;
      this.query = this.query.skip(skip).limit(limite);
  
      return this;
    }
  }
  
  module.exports = APIFeatures;