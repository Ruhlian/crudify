import React, { useState, useEffect } from 'react';
import FormEquipo from './FormEquipo';
import TablaAsignaciones from './TablaAsignaciones';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService'; // Asegúrate que esté importado
import EquipoService from '../services/equipoService';

const Dashboard = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [indexEditando, setIndexEditando] = useState(null);
  const [filtroSede, setFiltroSede] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('');

  const navigate = useNavigate();

  //useEffect
  useEffect(() => {
    const obtenerEquipos = async () => {
      try {
        const res = await EquipoService.obtenerEquipos();
        setAsignaciones(res.data.data.equipos); // Ajusta si tu respuesta difiere
      } catch (error) {
        console.error('Error al cargar equipos:', error);
      }
    };
  
    obtenerEquipos();
  }, []);

  const handleGuardarAsignacion = async (asignacion) => {
    try {
      if (indexEditando !== null) {
        const equipoId = asignaciones[indexEditando]._id;
        const res = await EquipoService.actualizarEquipo(equipoId, asignacion);
        const nuevas = [...asignaciones];
        nuevas[indexEditando] = res.data.data;
        setAsignaciones(nuevas);
      } else {
        const res = await EquipoService.crearEquipo(asignacion);
        setAsignaciones([...asignaciones, res.data.data]);
      }
  
      setMostrarFormulario(false);
      setIndexEditando(null);
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data?.message || error.message));
    }
  };  

  const handleEditar = (index) => {
    setIndexEditando(index);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (index) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar esta asignación?");
    if (!confirmacion) return;
  
    const equipoId = asignaciones[index]._id;
  
    try {
      await EquipoService.eliminarEquipo(equipoId);
      const nuevas = [...asignaciones];
      nuevas.splice(index, 1);
      setAsignaciones(nuevas);
    } catch (error) {
      alert('Error al eliminar: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const handleBusqueda = (e) => setBusqueda(e.target.value);
  const handleFiltroSede = (e) => setFiltroSede(e.target.value);
  const handleFiltroCargo = (e) => setFiltroCargo(e.target.value);
  const handleLogout = async () => {
    await apiService.logout(); // Limpiar token y user del localStorage
    navigate('/login'); // Redirigir al login
  };

  const datosFiltrados = asignaciones.filter((item) => {
    const matchBusqueda = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(busqueda.toLowerCase())
    );
    
    const matchSede = filtroSede ? item.sede === filtroSede : true;
    const matchCargo = filtroCargo ? item.cargo.toLowerCase().includes(filtroCargo.toLowerCase()) : true;

    return matchBusqueda && matchSede && matchCargo;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="logout-button" onClick={handleLogout}>🚪 Cerrar sesión</button>
        <h2 className="titulo">📊 Panel del Administrador</h2>
        <div className="busqueda-area">
          <input
            type="text"
            placeholder="🔍 Buscar..."
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>
      </div>

      <div className="filtros-extra">
        <select value={filtroSede} onChange={handleFiltroSede}>
          <option value="">📍 Filtrar por Sede</option>
          <option value="Connecta 80">Connecta 80</option>
          <option value="Cota">Cota</option>
          <option value="Medellin">Medellín</option>
          <option value="Cali">Cali</option>
          <option value="Bucaramanga">Bucaramanga</option>
          <option value="235">235</option>
          <option value="zona franca">Zona Franca</option>
          <option value="duitama">Duitama</option>
        </select>

        <input
          type="text"
          placeholder="👤 Filtrar por Cargo"
          value={filtroCargo}
          onChange={handleFiltroCargo}
        />
      </div>

      <div className="barra-opciones">
        <button onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setIndexEditando(null);
        }}>
          {mostrarFormulario ? '🔽 Ocultar Formulario' : '➕ Registrar Equipo'}
        </button>
      </div>

      {mostrarFormulario && (
        <FormEquipo
          onGuardar={handleGuardarAsignacion}
          datosEditar={indexEditando !== null ? asignaciones[indexEditando] : null}
        />
      )}

      <TablaAsignaciones
        datos={datosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </div>
  );
};

export default Dashboard;
