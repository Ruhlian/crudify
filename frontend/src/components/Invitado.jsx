import React, { useState } from 'react';
import '../styles/Dashboard.css';

const Invitado = ({ datos }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroSede, setFiltroSede] = useState('');
  const [filtroCargo, setFiltroCargo] = useState('');

  const handleBusqueda = (e) => setBusqueda(e.target.value);
  const handleFiltroSede = (e) => setFiltroSede(e.target.value);
  const handleFiltroCargo = (e) => setFiltroCargo(e.target.value);

  const datosFiltrados = datos.filter((item) => {
    const matchBusqueda = Object.values(item).some((val) =>
      val.toLowerCase().includes(busqueda.toLowerCase())
    );
    const matchSede = filtroSede ? item.sede === filtroSede : true;
    const matchCargo = filtroCargo ? item.cargo.toLowerCase().includes(filtroCargo.toLowerCase()) : true;
    return matchBusqueda && matchSede && matchCargo;
  });

  return (
    <div className="dashboard-container">
      <h2 className="titulo">👀 Vista de Invitado</h2>

      <div className="filtros-extra">
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={busqueda}
          onChange={handleBusqueda}
        />
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

      <div className="tabla-asignaciones-container">
        <table className="tabla-asignaciones">
          <thead>
            <tr>
              <th>ID Usuario</th>
              <th>Tipo Equipo</th>
              <th>Usuario</th>
              <th>Cargo</th>
              <th>Sede</th>
              <th>Gerencia</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Serial</th>
              <th>Estado</th>
              <th>Tipo Contrato</th>
              <th>Estado Acta</th>
              <th>Fecha Entrega</th>
              <th>Cargador Laptop</th>
              <th>Docking Station</th>
              <th>Cargador Docking</th>
              <th>Monitor</th>
              <th>Maleta</th>
              <th>Guaya</th>
              <th>Adaptador</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item, index) => (
              <tr key={index}>
                <td>{item.idUsuario}</td>
                <td>{item.tipoEquipo}</td>
                <td>{item.usuario}</td>
                <td>{item.cargo}</td>
                <td>{item.sede}</td>
                <td>{item.gerencia}</td>
                <td>{item.marca}</td>
                <td>{item.modelo}</td>
                <td>{item.serial}</td>
                <td>{item.estado}</td>
                <td>{item.tipoContrato}</td>
                <td>{item.estadoActa}</td>
                <td>{item.fechaEntrega}</td>
                <td>{item.cargadorLaptop}</td>
                <td>{item.dockingStation}</td>
                <td>{item.cargadorDocking}</td>
                <td>{item.monitor}</td>
                <td>{item.maleta}</td>
                <td>{item.guaya}</td>
                <td>{item.adaptador}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invitado;
