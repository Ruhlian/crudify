import axios from 'axios';

// Configuración base
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configurar interceptores para manejo de errores
const apiClient = axios.create({
  baseURL: BASE_URL, // ← CAMBIO PRINCIPAL: usar BASE_URL en lugar de API_URL
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación si los tienes
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    
    // Manejo específico de errores
    if (error.response?.status === 401) {
      console.log('🔐 No autorizado - redirigir al login');
      // Aquí puedes redirigir al login o mostrar modal
    }
    
    return Promise.reject(error);
  }
);

const EquipoService = {
  // ========================================
  // OPERACIONES CRUD BÁSICAS
  // ========================================
  
  /**
   * Crear un nuevo equipo
   * @param {Object} datos - Datos del equipo
   * @returns {Promise} Respuesta de la API
   */
  async crearEquipo(datos) {
    try {
      const response = await apiClient.post('/equipos', datos); // ← CAMBIO: ruta completa
      return {
        success: true,
        data: response.data,
        message: 'Equipo creado exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al crear equipo');
    }
  },

  /**
   * Obtener todos los equipos con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Lista de equipos paginada
   */
  async obtenerEquipos(params = {}) {
    try {
      const response = await apiClient.get('/equipos', { params }); // ← CAMBIO: ruta completa
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Equipos obtenidos exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al obtener equipos');
    }
  },

  /**
   * Obtener equipo por ID (acepta _id o idEquipo)
   * @param {string} id - ID del equipo
   * @returns {Promise} Datos del equipo
   */
  async obtenerEquipoPorId(id) {
    try {
      const response = await apiClient.get(`/equipos/${id}`); // ← CAMBIO: ruta completa
      return {
        success: true,
        data: response.data.data,
        message: 'Equipo obtenido exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al obtener equipo');
    }
  },

  /**
   * Actualizar equipo
   * @param {string} id - ID del equipo
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise} Equipo actualizado
   */
  async actualizarEquipo(id, datos) {
    try {
      const response = await apiClient.put(`/equipos/${id}`, datos); // ← CAMBIO: ruta completa
      return {
        success: true,
        data: response.data.data,
        message: 'Equipo actualizado exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al actualizar equipo');
    }
  },

  /**
   * Eliminar equipo (si implementas esta funcionalidad)
   * @param {string} id - ID del equipo
   * @returns {Promise} Confirmación de eliminación
   */
  async eliminarEquipo(id) {
    try {
      const response = await apiClient.delete(`/equipos/${id}`); // ← CAMBIO: ruta completa
      return {
        success: true,
        data: response.data.data,
        message: 'Equipo eliminado exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al eliminar equipo');
    }
  },

  // ========================================
  // OPERACIONES DE BÚSQUEDA Y FILTRADO
  // ========================================

  /**
   * Buscar equipos con término general
   * @param {string} termino - Término de búsqueda
   * @returns {Promise} Equipos encontrados
   */
  async buscarEquipos(termino) {
    try {
      const response = await apiClient.get('/equipos/search', { 
        params: { q: termino } 
      });
      return {
        success: true,
        data: response.data.data,
        message: `Se encontraron ${response.data.data.total} equipos`
      };
    } catch (error) {
      throw this.handleError(error, 'Error en la búsqueda');
    }
  },

  /**
   * Obtener equipos por estado
   * @param {string} estado - Estado del equipo
   * @returns {Promise} Equipos filtrados por estado
   */
  async obtenerPorEstado(estado) {
    try {
      const response = await apiClient.get(`/equipos/estado/${estado}`);
      return {
        success: true,
        data: response.data.data,
        message: `Equipos en estado ${estado} obtenidos`
      };
    } catch (error) {
      throw this.handleError(error, `Error al obtener equipos en estado ${estado}`);
    }
  },

  /**
   * Obtener equipo por serial
   * @param {string} serial - Serial del equipo
   * @returns {Promise} Equipo encontrado
   */
  async obtenerPorSerial(serial) {
    try {
      const response = await apiClient.get(`/equipos/serial/${serial}`);
      return {
        success: true,
        data: response.data.data,
        message: 'Equipo encontrado por serial'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al buscar por serial');
    }
  },

  // ========================================
  // OPERACIONES ESPECÍFICAS
  // ========================================

  /**
   * Obtener historial de asignaciones de un equipo
   * @param {string} equipoId - ID del equipo
   * @returns {Promise} Historial de asignaciones
   */
  async obtenerHistorialAsignaciones(equipoId) {
    try {
      const response = await apiClient.get(`/equipos/${equipoId}/historial`);
      return {
        success: true,
        data: response.data.data,
        message: 'Historial obtenido exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al obtener historial');
    }
  },

  /**
   * Migrar equipos sin idEquipo (solo para admin)
   * @returns {Promise} Resultado de la migración
   */
  async migrarIdEquipos() {
    try {
      const response = await apiClient.post('/equipos/migrar-ids');
      return {
        success: true,
        data: response.data.data,
        message: 'Migración completada exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error en la migración');
    }
  },

  // ========================================
  // MÉTODOS DE UTILIDAD
  // ========================================

  /**
   * Obtener estadísticas de equipos
   * @returns {Promise} Estadísticas generales
   */
  async obtenerEstadisticas() {
    try {
      const estados = ['Bodega', 'Asignado', 'Reposo', 'Alistamiento', 'Mantenimiento', 'Baja'];
      const promesas = estados.map(estado => this.obtenerPorEstado(estado));
      const resultados = await Promise.all(promesas);
      
      const estadisticas = {};
      estados.forEach((estado, index) => {
        estadisticas[estado] = resultados[index].data.length;
      });

      return {
        success: true,
        data: estadisticas,
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      throw this.handleError(error, 'Error al obtener estadísticas');
    }
  },

  /**
   * Validar si un serial ya existe
   * @param {string} serial - Serial a validar
   * @returns {Promise<boolean>} True si existe, false si no existe
   */
  async validarSerial(serial) {
    try {
      await this.obtenerPorSerial(serial);
      return true; // Si no lanza error, el serial existe
    } catch (error) {
      if (error.status === 404) {
        return false; // Serial no existe
      }
      throw error; // Otro tipo de error
    }
  },

  // ========================================
  // MANEJO DE ERRORES
  // ========================================

  /**
   * Manejar errores de la API
   * @param {Error} error - Error capturado
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {Object} Error formateado
   */
  handleError(error, defaultMessage = 'Error en la operación') {
    const errorInfo = {
      success: false,
      message: defaultMessage,
      status: error.response?.status || 500,
      details: null
    };

    if (error.response?.data) {
      errorInfo.message = error.response.data.message || defaultMessage;
      errorInfo.details = error.response.data.errors || error.response.data.error;
    } else if (error.message) {
      errorInfo.message = error.message;
    }

    // Log del error para debugging
    console.error('🔥 EquipoService Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorInfo.message,
      details: errorInfo.details
    });

    return errorInfo;
  }
};

export default EquipoService;