import React from 'react';
import '../styles/ListaEquipos.css';

const ListaEquipos = ({ isAdmin }) => {
  const datosEjemplo = [
    {
      usuario: 'ricsanc',
      nombre: 'Richard Sánchez',
      cargo: 'Ingeniero',
      sede: 'Bogotá',
      laptop: 'ABC123',
      cargadorLaptop: 'DEF456',
      docking: 'GHI789',
      cargadorDocking: 'GHJ234',
      monitor: 'JKL012',
      maleta: 'Sí',
      guaya: 'N/A',
      adaptador: 'N/A',
    },
    {
      usuario: 'anatorr',
      nombre: 'Ana Torres',
      cargo: 'Diseñadora',
      sede: 'Medellín',
      laptop: 'XYZ987',
      cargadorLaptop: 'MNO654',
      docking: 'N/A',
      cargadorDocking: 'N/A',
      monitor: 'QRS321',
      maleta: 'N/A',
      guaya: 'Sí',
      adaptador: 'Sí',
    },
  ];

  return (
    <div className="tabla-equipos-container">
      <h2>Asignaciones de Equipos</h2>
      <table className="tabla-equipos">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Sede</th>
            <th>Laptop</th>
            <th>Cargador Laptop</th>
            <th>Docking</th>
            <th>Cargador Docking</th>
            <th>Monitor</th>
            <th>Maleta</th>
            <th>Guaya</th>
            <th>Adaptador</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datosEjemplo.map((item, index) => (
            <tr key={index}>
              <td>{item.usuario}</td>
              <td>{item.nombre}</td>
              <td>{item.cargo}</td>
              <td>{item.sede}</td>
              <td>{item.laptop}</td>
              <td>{item.cargadorLaptop}</td>
              <td>{item.docking}</td>
              <td>{item.cargadorDocking}</td>
              <td>{item.monitor}</td>
              <td>{item.maleta}</td>
              <td>{item.guaya}</td>
              <td>{item.adaptador}</td>
              {isAdmin && (
                <td>
                  <button className="btn-editar">✏️</button>
                  <button className="btn-eliminar">🗑️</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaEquipos;
