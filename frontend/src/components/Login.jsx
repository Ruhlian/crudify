import React, { useState } from 'react';
import apiService from '../services/apiService';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }
  
    setLoading(true);
    setError('');
  
    // 👇 Aquí mapeamos identifier como email
    const loginData = {
      email: formData.identifier,
      password: formData.password
    };
  
    try {
      const response = await apiService.login(loginData);
  
      if (response.success) {
        onLogin(response.data.user.rol, response.data.user);
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };  

  const ingresarComoInvitado = () => {
    // Crear usuario invitado temporal
    const invitadoUser = {
      id: 'invitado',
      idUsuario: 'invitado',
      nombre: 'Usuario Invitado',
      email: 'invitado@sistema.com',
      rol: 'invitado',
      cargo: 'Invitado'
    };
    
    onLogin('invitado', invitadoUser);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔐 Iniciar Sesión</h2>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="input-group">
          <input
            type="text"
            name="identifier"
            placeholder="👤 Usuario o Email"
            value={formData.identifier}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="🔑 Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-login"
          disabled={loading}
        >
          {loading ? '⏳ Iniciando sesión...' : 'Ingresar'}
        </button>

        <div className="divider">o</div>

        <button
          type="button"
          className="btn-invitado"
          onClick={ingresarComoInvitado}
          disabled={loading}
        >
          Entrar como Invitado
        </button>

        <div className="demo-credentials">
          <h4>Credenciales de prueba:</h4>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Usuario:</strong> user / user123</p>
        </div>
      </form>
    </div>
  );
};

export default Login;