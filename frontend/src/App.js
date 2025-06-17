import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Invitado from './components/Invitado';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [datosAsignaciones, setDatosAsignaciones] = useState([]); // Datos compartidos

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setDatosAsignaciones([]); // Limpiar datos al cerrar sesión si se desea
  };

  return (
    <div>
      {!userRole ? (
        <Login onLogin={handleLogin} />
      ) : userRole === 'admin' ? (
        <Dashboard
          role={userRole}
          onLogout={handleLogout}
          datos={datosAsignaciones}
          setDatos={setDatosAsignaciones}
        />
      ) : (
        <Invitado
          datos={datosAsignaciones}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
