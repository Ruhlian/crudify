import React, { useState, useEffect } from 'react';
import '../styles/FormEquipo.css';

const camposIniciales = {
  // Campos principales del equipo
  tipoEquipo: '',
  marca: '',
  modelo: '',
  serial: '',
  estado: 'Bodega',
  
  // Accesorios del equipo
  cargadorLaptop: '',
  dockingStation: '',
  cargadorDocking: '',
  monitor: '',
  maleta: '',
  guaya: '',
  adaptador: '',
  
  // Campos adicionales si los necesitas
  observaciones: '',
  ubicacion: ''
};

const FormEquipo = ({ onGuardar, datosEditar, cargando = false }) => {
  const [form, setForm] = useState(camposIniciales);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (datosEditar) {
      // Filtrar solo los campos que pertenecen al equipo
      const datosEquipo = Object.keys(camposIniciales).reduce((acc, key) => {
        acc[key] = datosEditar[key] || camposIniciales[key];
        return acc;
      }, {});
      setForm(datosEquipo);
    } else {
      setForm(camposIniciales);
    }
  }, [datosEditar]);

  const validarCampo = (name, value) => {
    const nuevosErrores = { ...errores };

    switch (name) {
      case 'serial':
        if (!value.trim()) {
          nuevosErrores.serial = 'El serial es obligatorio';
        } else if (value.trim().length < 3) {
          nuevosErrores.serial = 'El serial debe tener al menos 3 caracteres';
        } else {
          delete nuevosErrores.serial;
        }
        break;
      
      case 'tipoEquipo':
        if (!value.trim()) {
          nuevosErrores.tipoEquipo = 'El tipo de equipo es obligatorio';
        } else {
          delete nuevosErrores.tipoEquipo;
        }
        break;
      
      case 'marca':
        if (!value.trim()) {
          nuevosErrores.marca = 'La marca es obligatoria';
        } else {
          delete nuevosErrores.marca;
        }
        break;
      
      case 'modelo':
        if (!value.trim()) {
          nuevosErrores.modelo = 'El modelo es obligatorio';
        } else {
          delete nuevosErrores.modelo;
        }
        break;
      
      default:
        break;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validar el campo en tiempo real
    validarCampo(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos obligatorios
    const camposObligatorios = ['serial', 'tipoEquipo', 'marca', 'modelo'];
    let formularioValido = true;
    
    camposObligatorios.forEach(campo => {
      if (!validarCampo(campo, form[campo])) {
        formularioValido = false;
      }
    });

    if (!formularioValido) {
      return;
    }

    // Limpiar campos vacíos antes de enviar
    const datosLimpios = Object.keys(form).reduce((acc, key) => {
      if (form[key] !== '') {
        acc[key] = form[key];
      }
      return acc;
    }, {});

    onGuardar(datosLimpios);
    
    // Solo limpiar el formulario si no estamos editando
    if (!datosEditar) {
      setForm(camposIniciales);
      setErrores({});
    }
  };

  return (
    <div className="form-equipo-container">
      <h3>{datosEditar ? '✏️ Editar Equipo' : '➕ Registrar Nuevo Equipo'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* Información básica del equipo */}
          <div className="form-section">
            <h4>📋 Información Básica</h4>
            
            <div className="form-group">
              <label>Tipo de Equipo *</label>
              <select 
                name="tipoEquipo" 
                value={form.tipoEquipo} 
                onChange={handleChange} 
                required
                className={errores.tipoEquipo ? 'error' : ''}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Monitor">Monitor</option>
                <option value="Impresora">Impresora</option>
                <option value="Tablet">Tablet</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Proyector">Proyector</option>
                <option value="Otro">Otro</option>
              </select>
              {errores.tipoEquipo && <span className="error-text">{errores.tipoEquipo}</span>}
            </div>

            <div className="form-group">
              <label>Marca *</label>
              <input 
                name="marca" 
                value={form.marca} 
                onChange={handleChange} 
                required
                placeholder="Ej: Dell, HP, Lenovo..."
                className={errores.marca ? 'error' : ''}
              />
              {errores.marca && <span className="error-text">{errores.marca}</span>}
            </div>

            <div className="form-group">
              <label>Modelo *</label>
              <input 
                name="modelo" 
                value={form.modelo} 
                onChange={handleChange} 
                required
                placeholder="Ej: Latitude 5520, ThinkPad X1..."
                className={errores.modelo ? 'error' : ''}
              />
              {errores.modelo && <span className="error-text">{errores.modelo}</span>}
            </div>

            <div className="form-group">
              <label>Serial *</label>
              <input 
                name="serial" 
                value={form.serial} 
                onChange={handleChange} 
                required
                placeholder="Número de serie único"
                className={errores.serial ? 'error' : ''}
              />
              {errores.serial && <span className="error-text">{errores.serial}</span>}
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} required>
                <option value="Bodega">Bodega</option>
                <option value="Asignado">Asignado</option>
                <option value="Reposo">Reposo</option>
                <option value="Alistamiento">Alistamiento</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ubicación</label>
              <select name="ubicacion" value={form.ubicacion} onChange={handleChange}>
                <option value="">Seleccionar ubicación</option>
                <option value="Connecta 80">Connecta 80</option>
                <option value="Cota">Cota</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Bucaramanga">Bucaramanga</option>
                <option value="235">235</option>
                <option value="Zona Franca">Zona Franca</option>
                <option value="Duitama">Duitama</option>
              </select>
            </div>
          </div>

          {/* Accesorios */}
          <div className="form-section">
            <h4>🔌 Accesorios</h4>
            
            {[
              ['Cargador Laptop', 'cargadorLaptop'],
              ['Docking Station', 'dockingStation'],
              ['Cargador Docking', 'cargadorDocking'],
              ['Monitor', 'monitor']
            ].map(([label, name]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <input 
                  name={name} 
                  value={form[name]} 
                  onChange={handleChange}
                  placeholder={`Especificar ${label.toLowerCase()}`}
                />
              </div>
            ))}

            {/* Accesorios Sí/No/N/A */}
            {[
              ['Maleta', 'maleta'],
              ['Guaya', 'guaya'],
              ['Adaptador', 'adaptador']
            ].map(([label, name]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <select name={name} value={form[name]} onChange={handleChange}>
                  <option value="">Seleccionar</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
            ))}
          </div>

          {/* Observaciones */}
          <div className="form-section full-width">
            <h4>📝 Observaciones</h4>
            <div className="form-group">
              <label>Observaciones adicionales</label>
              <textarea 
                name="observaciones" 
                value={form.observaciones} 
                onChange={handleChange}
                rows="3"
                placeholder="Detalles adicionales del equipo..."
              />
            </div>
          </div>

        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="boton-guardar"
            disabled={cargando || Object.keys(errores).length > 0}
          >
            {cargando ? (
              <>⏳ {datosEditar ? 'Actualizando...' : 'Guardando...'}</>
            ) : (
              <>{datosEditar ? '💾 Guardar Cambios' : '📥 Guardar Equipo'}</>
            )}
          </button>
          
          {datosEditar && (
            <button 
              type="button" 
              className="boton-cancelar"
              onClick={() => {
                setForm(camposIniciales);
                setErrores({});
              }}
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormEquipo;