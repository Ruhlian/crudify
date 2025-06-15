import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin123') {
      onLogin('admin');
    } else if (username === 'invitado' && password === 'invitado123') {
      onLogin('invitado');
    } else {
      alert('❌ Usuario o contraseña incorrectos');
    }
  };

  const ingresarComoInvitado = () => {
    onLogin('invitado');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🔐 Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="👤 Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="🔑 Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-login">Ingresar</button>

        <div className="divider">o</div>

        <button
          type="button"
          className="btn-invitado"
          onClick={ingresarComoInvitado}
        >
          Entrar como Invitado
        </button>
      </form>
    </div>
  );
};

export default Login;
