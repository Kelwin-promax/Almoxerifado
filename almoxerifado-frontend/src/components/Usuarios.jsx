import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarUsuarios, criarUsuario, deletarUsuario } from '../services/api';
import Navbar from './Navbar';
import '../styles/App.css';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo: 'operador'
    });
    const navigate = useNavigate();

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const response = await listarUsuarios();
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            if (error.response?.status === 403) {
                navigate('/dashboard');
            }
        }
    };

    const salvarUsuario = async () => {
        if (!formData.nome || !formData.email || !formData.senha) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        setCarregando(true);
        try {
            await criarUsuario(formData);
            alert('Usuário criado com sucesso!');
            setShowModal(false);
            carregarUsuarios();
            setFormData({ nome: '', email: '', senha: '', tipo: 'operador' });
        } catch (error) {
            alert('Erro ao criar usuário: ' + (error.response?.data || error.message));
        } finally {
            setCarregando(false);
        }
    };

    const deletarUsuarioHandler = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja deletar o usuário "${nome}"?`)) {
            try {
                await deletarUsuario(id);
                alert('Usuário deletado com sucesso!');
                carregarUsuarios();
            } catch (error) {
                alert('Erro ao deletar usuário: ' + (error.response?.data || error.message));
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="header-actions">
                    <h1>Gerenciar Usuários</h1>
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        + Novo Usuário
                    </button>
                </div>

                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Data Cadastro</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.tipo === 'admin' ? 'Administrador' : 'Operador'}</td>
                            <td>{new Date(usuario.createdAt).toLocaleDateString('pt-BR')}</td>
                            <td>
                                <button
                                    onClick={() => deletarUsuarioHandler(usuario.id, usuario.nome)}
                                    className="btn-delete"
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum usuário cadastrado</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal Novo Usuário */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>➕ Novo Usuário</h2>
                        <input
                            type="text"
                            placeholder="Nome *"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <input
                            type="password"
                            placeholder="Senha *"
                            value={formData.senha}
                            onChange={(e) => setFormData({...formData, senha: e.target.value})}
                        />
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                        >
                            <option value="operador">Operador</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <div className="modal-buttons">
                            <button onClick={salvarUsuario} className="btn-primary" disabled={carregando}>
                                {carregando ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Usuarios;