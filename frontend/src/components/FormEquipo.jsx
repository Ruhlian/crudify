import React, { useState, useEffect } from 'react';
import '../styles/FormEquipo.css';

const FormEquipo = ({ onGuardar, datosEditar }) => {
  const [form, setForm] = useState({
    idUsuario: '',
    tipoEquipo: '',
    usuario: '',
    cargo: '',
    sede: '',
    gerencia: '',
    marca: '',
    modelo: '',
    serial: '',
    estado: '',
    tipoContrato: '',
    estadoActa: '',
    fechaEntrega: '',
    cargadorLaptop: '',
    dockingStation: '',
    cargadorDocking: '',
    monitor: '',
    maleta: '',
    guaya: '',
    adaptador: ''
  });

  useEffect(() => {
    if (datosEditar) {
      setForm(datosEditar);
    }
  }, [datosEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
    setForm({
      idUsuario: '',
      tipoEquipo: '',
      usuario: '',
      cargo: '',
      sede: '',
      gerencia: '',
      marca: '',
      modelo: '',
      serial: '',
      estado: '',
      tipoContrato: '',
      estadoActa: '',
      fechaEntrega: '',
      cargadorLaptop: '',
      dockingStation: '',
      cargadorDocking: '',
      monitor: '',
      maleta: '',
      guaya: '',
      adaptador: ''
    });
  };

  return (
    <div className="form-equipo-container">
      <h3>{datosEditar ? '✏️ Editar Asignación' : '➕ Registrar Asignación de Equipo'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>ID Usuario</label>
            <input name="idUsuario" value={form.idUsuario} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Tipo de Equipo</label>
            <input name="tipoEquipo" value={form.tipoEquipo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Usuario</label>
            <input name="usuario" value={form.usuario} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Cargo</label>
            <input name="cargo" value={form.cargo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Sede</label>
            <select name="sede" value={form.sede} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Connecta 80">Connecta 80</option>
              <option value="Cota">Cota</option>
              <option value="Medellin">Medellín</option>
              <option value="Cali">Cali</option>
              <option value="Bucaramanga">Bucaramanga</option>
              <option value="235">235</option>
              <option value="Zona Franca">Zona Franca</option>
              <option value="Duitama">Duitama</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gerencia</label>
            <input name="gerencia" value={form.gerencia} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Marca</label>
            <input name="marca" value={form.marca} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <input name="modelo" value={form.modelo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Serial</label>
            <input name="serial" value={form.serial} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <input name="estado" value={form.estado} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Tipo de Contrato</label>
            <select name="tipoContrato" value={form.tipoContrato} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Directo">Directo</option>
              <option value="Temporal">Temporal</option>
            </select>
          </div>

          <div className="form-group">
            <label>Estado del Acta</label>
            <select name="estadoActa" value={form.estadoActa} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Ok">Ok</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fecha de Entrega</label>
            <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Cargador Laptop</label>
            <input name="cargadorLaptop" value={form.cargadorLaptop} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Docking Station</label>
            <input name="dockingStation" value={form.dockingStation} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Cargador Docking</label>
            <input name="cargadorDocking" value={form.cargadorDocking} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Monitor</label>
            <input name="monitor" value={form.monitor} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Maleta</label>
            <select name="maleta" value={form.maleta} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Sí">Sí</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div className="form-group">
            <label>Guaya</label>
            <select name="guaya" value={form.guaya} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Sí">Sí</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div className="form-group">
            <label>Adaptador</label>
            <select name="adaptador" value={form.adaptador} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Sí">Sí</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
        </div>

        <button type="submit" className="boton-guardar">
          {datosEditar ? '💾 Guardar Cambios' : '📥 Guardar Asignación'}
        </button>
      </form>
    </div>
  );
};

export default FormEquipo;
