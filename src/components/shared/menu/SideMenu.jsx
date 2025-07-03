import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './SideMenu.css';

function SideMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
      logout();
      navigate('/');
  };

  return (
    <nav className="side-menu">
      <div className="side-menu-title">Menu</div>      <ul>
        <li>
          <NavLink to="/clientes" className={({ isActive }) => isActive ? 'active' : ''} end>
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink to="/materiais" className={({ isActive }) => isActive ? 'active' : ''}>
            Materiais
          </NavLink>
        </li>
        <li>
          <NavLink to="/usuarios" className={({ isActive }) => isActive ? 'active' : ''}>
            Usuários
          </NavLink>
        </li>
      </ul>
      <div className="logout-section">
        <button 
          className="btn btn-outline-danger logout-btn" 
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </nav>
  );
}

export default SideMenu;
