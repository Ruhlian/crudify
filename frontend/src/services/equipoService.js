import axios from 'axios';

const API_URL = 'http://localhost:5000/api/equipos'; // Ajusta la URL según tu backend

const EquipoService = {
  crearEquipo: (datos) => axios.post(API_URL, datos),
  obtenerEquipos: () => axios.get(API_URL),
  actualizarEquipo: (id, datos) => axios.put(`${API_URL}/${id}`, datos),
  obtenerEquipoPorId: (id) => axios.get(`${API_URL}/${id}`),
  eliminarEquipo: (id) => axios.delete(`${API_URL}/${id}`),
  obtenerPorEstado: (estado) => axios.get(`${API_URL}/estado/${estado}`),
  obtenerHistorialAsignaciones: (equipoId) =>
    axios.get(`${API_URL}/${equipoId}/historial`),
};

export default EquipoService;
