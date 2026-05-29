import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarProdutos } from '../services/api';
import Navbar from './Navbar';
import '../styles/App.css';

function Dashboard() {
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [totalItens, setTotalItens] = useState(0);
    const [ultimosProdutos, setUltimosProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const response = await listarProdutos({ page: 1, size: 5 });
            const produtos = response.data.content || [];

            setTotalProdutos(response.data.totalElements || 0);
            setTotalItens(produtos.reduce((sum, p) => sum + (p.quantidade || 0), 0));
            setUltimosProdutos(produtos);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                navigate('/login');
            }
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return (
            <>
                <Navbar />
                <div className="container">Carregando...</div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="header-actions">
                    <h1>Dashboard</h1>
                </div>

                <div className="cards-grid">
                    <div className="card">
                        <div className="card-icon">0w0</div>
                        <div className="card-info">
                            <h3>Total de Produtos</h3>
                            <p className="card-number">{totalProdutos}</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-icon">0w0</div>
                        <div className="card-info">
                            <h3>Itens em Estoque</h3>
                            <p className="card-number">{totalItens}</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-icon">0w0</div>
                        <div className="card-info">
                            <h3>Perfil</h3>
                            <p className="card-perfil">{usuario.tipo === 'admin' ? 'Administrador' : 'Operador'}</p>
                        </div>
                    </div>
                </div>

                <div className="ultimos-produtos">
                    <h2>Últimos Produtos Cadastrados</h2>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ultimosProdutos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.nome}</td>
                                <td>{produto.quantidade}</td>
                                <td>R$ {produto.preco?.toFixed(2)}</td>
                            </tr>
                        ))}
                        {ultimosProdutos.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum produto cadastrado</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Dashboard;