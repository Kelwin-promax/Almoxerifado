// Este arquivo só reexporta a versão sem cedilha para compatibilidade de imports.
// Substituir reexport por implementação do componente Movimentacoes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarProdutos, registrarMovimentacao } from '../services/api';
import Navbar from './Navbar';
import '../styles/App.css';

function Movimentacoes() {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [movData, setMovData] = useState({ tipo: 'entrada', quantidade: 0 });
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        carregarProdutos();
        // eslint-disable-next-line
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await listarProdutos({ page: 1, size: 100 });
            setProdutos(response.data?.content || []);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const registrar = async () => {
        if (produtoSelecionado === '' && produtoSelecionado !== 0) {
            setMensagem('❌ Selecione um produto');
            return;
        }
        if (movData.quantidade <= 0) {
            setMensagem('❌ Quantidade deve ser maior que zero');
            return;
        }

        setCarregando(true);
        try {
            await registrarMovimentacao({
                produtoId: produtoSelecionado,
                tipo: movData.tipo,
                quantidade: movData.quantidade
            });
            setMensagem('✅ Movimentação registrada com sucesso!');
            setMovData({ tipo: 'entrada', quantidade: 0 });
            setProdutoSelecionado('');
            carregarProdutos();
            setTimeout(() => setMensagem(''), 3000);
        } catch (error) {
            setMensagem('❌ Erro: ' + (error.response?.data || error.message));
        } finally {
            setCarregando(false);
        }
    };

    const produtoAtual = produtos.find(p => p.id === (typeof produtoSelecionado === 'number' ? produtoSelecionado : Number(produtoSelecionado)));

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="header-actions">
                    <h1>Registrar Movimentação</h1>
                </div>

                <div className="mov-form">
                    <div className="form-group">
                        <label>Produto:</label>
                        <select
                            value={produtoSelecionado}
                            onChange={(e) => setProdutoSelecionado(e.target.value === '' ? '' : Number(e.target.value))}
                        >
                            <option value="">Selecione um produto</option>
                            {produtos.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nome} - Estoque: {p.quantidade}
                                </option>
                            ))}
                        </select>
                    </div>

                    {produtoAtual && (
                        <div className="produto-info">
                            <p><strong>Produto:</strong> {produtoAtual.nome}</p>
                            <p><strong>Estoque atual:</strong> {produtoAtual.quantidade} unidades</p>
                            <p><strong>Preço:</strong> R$ {produtoAtual.preco?.toFixed(2)}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tipo de Movimentação:</label>
                        <select
                            value={movData.tipo}
                            onChange={(e) => setMovData({...movData, tipo: e.target.value})}
                        >
                            <option value="entrada">Entrada (adicionar ao estoque)</option>
                            <option value="saida">Saída (retirar do estoque)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantidade:</label>
                        <input
                            type="number"
                            value={movData.quantidade}
                            onChange={(e) => setMovData({...movData, quantidade: parseInt(e.target.value, 10) || 0})}
                            min="1"
                        />
                    </div>

                    <button onClick={registrar} className="btn-primary" disabled={carregando}>
                        {carregando ? 'Registrando...' : 'Registrar Movimentação'}
                    </button>

                    {mensagem && <div className="mensagem">{mensagem}</div>}
                </div>
            </div>
        </>
    );
}

export default Movimentacoes;