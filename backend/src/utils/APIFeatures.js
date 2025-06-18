class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filterQuery = {}; // Para el conteo y filtros
    this.pagina = 1;
    this.limite = 10;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'pagina', 'sort', 'limit', 'limite', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 🔍 Búsqueda por texto (search) - funcionalidad mejorada
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      queryObj.$or = [
        { idEquipo: searchRegex },
        { serial: searchRegex },
        { marca: searchRegex },
        { modelo: searchRegex },
        { tipoEquipo: searchRegex },
        { estado: searchRegex }
      ];
    }

    // 🔍 Búsqueda específica por idEquipo
    if (this.queryString.idEquipo) {
      queryObj.idEquipo = new RegExp(this.queryString.idEquipo, 'i');
    }

    // Filtrado avanzado con operadores MongoDB
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
    // Soporte para ambos nombres de parámetros: page/pagina y limit/limite
    const page = this.queryString.page * 1 || this.queryString.pagina * 1 || this.pagina;
    const limit = this.queryString.limit * 1 || this.queryString.limite * 1 || this.limite;
    const skip = (page - 1) * limit;

    this.pagina = page;
    this.limite = limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // Método adicional para obtener información de paginación
  getPaginationInfo() {
    return {
      pagina: this.pagina,
      limite: this.limite,
      filterQuery: this.filterQuery
    };
  }
}

module.exports = APIFeatures;