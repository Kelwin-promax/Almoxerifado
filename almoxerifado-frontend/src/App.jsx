import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produto';
import Usuarios from './components/Usuarios';
import Movimentacoes from './components/Movimentaçoes';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/produtos" element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          } />

          <Route path="/movimentacoes" element={
            <PrivateRoute>
              <Movimentacoes />
            </PrivateRoute>
          } />

          <Route path="/usuarios" element={
            <PrivateRoute requiredRole="admin">
              <Usuarios />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
  );
}

export default App;
