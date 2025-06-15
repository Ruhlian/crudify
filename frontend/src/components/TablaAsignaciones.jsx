import React, { useState } from 'react';
import '../styles/TablaAsignaciones.css';

const TablaAsignaciones = ({ datos, onEditar, onEliminar }) => {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const toggleDetalles = () => setMostrarDetalles(!mostrarDetalles);

  return (
    <div className="tabla-wrapper">
      <button onClick={toggleDetalles}>
        {mostrarDetalles ? 'Ocultar detalles' : 'Mostrar todos los campos'}
      </button>

      <table className="tabla-asignaciones">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Usuario</th>
            <th>Cargo</th>
            <th>Sede</th>
            <th>Tipo Equipo</th>
            <th>Marca</th>
            <th>Serial</th>
            <th>Estado</th>
            {mostrarDetalles && (
              <>
                <th>Dirección</th>
                <th>Gerencia</th>
                <th>Modelo</th>
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
              </>
            )}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((dato, index) => (
            <tr key={index}>
              <td>{dato.idUsuario}</td>
              <td>{dato.usuario}</td>
              <td>{dato.cargo}</td>
              <td>{dato.sede}</td>
              <td>{dato.tipoEquipo}</td>
              <td>{dato.marca}</td>
              <td>{dato.serial}</td>
              <td>{dato.estado}</td>
              {mostrarDetalles && (
                <>
                  <td>{dato.direccion}</td>
                  <td>{dato.gerencia}</td>
                  <td>{dato.modelo}</td>
                  <td>{dato.tipoContrato}</td>
                  <td>{dato.estadoActa}</td>
                  <td>{dato.fechaEntrega}</td>
                  <td>{dato.cargadorLaptop}</td>
                  <td>{dato.dockingStation}</td>
                  <td>{dato.cargadorDocking}</td>
                  <td>{dato.monitor}</td>
                  <td>{dato.maleta}</td>
                  <td>{dato.guaya}</td>
                  <td>{dato.adaptador}</td>
                </>
              )}
              <td>
                <button onClick={() => onEditar(index)}>🖊️</button>
                <button onClick={() => onEliminar(index)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsignaciones;
