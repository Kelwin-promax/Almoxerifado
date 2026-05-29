import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const isAdmin = usuario.tipo === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Almoxarifado</h2>
            </div>

            <div className="navbar-menu">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/produtos" className="nav-link">Produtos</Link>
                <Link to="/movimentacoes" className="nav-link">Movimentações</Link>
                {isAdmin && (
                    <Link to="/usuarios" className="nav-link">Usuários</Link>
                )}
            </div>

            <div className="navbar-user">
                <span>{usuario.nome}</span>
                <button onClick={handleLogout} className="btn-logout">Sair</button>
            </div>
        </nav>
    );
}

export default Navbar;