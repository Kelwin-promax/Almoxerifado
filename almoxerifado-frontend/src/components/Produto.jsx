import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    listarProdutos,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    registrarMovimentacao
} from '../services/api';
import Navbar from './Navbar';
import '../styles/App.css';

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroData, setFiltroData] = useState('');
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showMovModal, setShowMovModal] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        quantidade: 0,
        preco: 0
    });
    const [movData, setMovData] = useState({ tipo: 'entrada', quantidade: 0 });

    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const isAdmin = usuario.tipo === 'admin';

    useEffect(() => {
        carregarProdutos();
    }, [pagina, filtroNome, filtroData]);

    const carregarProdutos = async () => {
        setCarregando(true);
        try {
            const response = await listarProdutos({
                page: pagina,
                size: 10,
                nome: filtroNome || null,
                data: filtroData || null
            });
            setProdutos(response.data.content || []);
            setTotalPaginas(response.data.totalPages || 1);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setCarregando(false);
        }
    };

    const abrirModal = (produto = null) => {
        if (produto) {
            setProdutoEditando(produto);
            setFormData({
                nome: produto.nome,
                descricao: produto.descricao || '',
                quantidade: produto.quantidade,
                preco: produto.preco
            });
        } else {
            setProdutoEditando(null);
            setFormData({ nome: '', descricao: '', quantidade: 0, preco: 0 });
        }
        setShowModal(true);
    };

    const abrirMovModal = (produto) => {
        setProdutoSelecionado(produto);
        setMovData({ tipo: 'entrada', quantidade: 0 });
        setShowMovModal(true);
    };

    const salvarProduto = async () => {
        try {
            if (produtoEditando) {
                await atualizarProduto(produtoEditando.id, formData);
                alert('Produto atualizado com sucesso!');
            } else {
                await criarProduto(formData);
                alert('Produto criado com sucesso!');
            }
            setShowModal(false);
            carregarProdutos();
        } catch (error) {
            alert('Erro ao salvar produto: ' + (error.response?.data || error.message));
        }
    };

    const deletarProdutoHandler = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                await deletarProduto(id);
                alert('Produto deletado com sucesso!');
                carregarProdutos();
            } catch (error) {
                alert('Erro ao deletar produto: ' + (error.response?.data || error.message));
            }
        }
    };

    const registrarMovimentacaoHandler = async () => {
        if (movData.quantidade <= 0) {
            alert('Quantidade deve ser maior que zero');
            return;
        }

        try {
            await registrarMovimentacao({
                produtoId: produtoSelecionado.id,
                tipo: movData.tipo,
                quantidade: movData.quantidade
            });
            alert('Movimentação registrada com sucesso!');
            setShowMovModal(false);
            carregarProdutos();
        } catch (error) {
            alert('Erro ao registrar movimentação: ' + (error.response?.data || error.message));
        }
    };

    const limparFiltros = () => {
        setFiltroNome('');
        setFiltroData('');
        setPagina(1);
    };

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="header-actions">
                    <h1>Produtos</h1>
                    <button onClick={() => abrirModal()} className="btn-primary">
                        + Novo Produto
                    </button>
                </div>

                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por nome..."
                        value={filtroNome}
                        onChange={(e) => { setFiltroNome(e.target.value); setPagina(1); }}
                        className="filtro-input"
                    />
                    <input
                        type="date"
                        value={filtroData}
                        onChange={(e) => { setFiltroData(e.target.value); setPagina(1); }}
                        className="filtro-input"
                    />
                    <button onClick={limparFiltros} className="btn-clear">
                        Limpar Filtros
                    </button>
                </div>

                {carregando ? (
                    <div style={{ textAlign: 'center', color: 'white' }}>Carregando...</div>
                ) : (
                    <>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {produtos.map(produto => (
                                <tr key={produto.id}>
                                    <td>{produto.id}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{produto.quantidade}</td>
                                    <td>R$ {produto.preco?.toFixed(2)}</td>
                                    <td className="acoes">
                                        <button onClick={() => abrirMovModal(produto)} className="btn-mov" title="Movimentar">
                                            mover
                                        </button>
                                        <button onClick={() => abrirModal(produto)} className="btn-edit" title="Editar">
                                            editar
                                        </button>
                                        {isAdmin && (
                                            <button onClick={() => deletarProdutoHandler(produto.id)} className="btn-delete" title="Deletar">
                                                lixeira
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {produtos.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum produto encontrado</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <div className="paginacao">
                            <button onClick={() => setPagina(p => Math.max(1, p-1))} disabled={pagina === 1}>
                                Anterior
                            </button>
                            <span>Página {pagina} de {totalPaginas}</span>
                            <button onClick={() => setPagina(p => Math.min(totalPaginas, p+1))} disabled={pagina === totalPaginas}>
                                Próxima
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal Produto */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</h2>
                        <input
                            type="text"
                            placeholder="Nome *"
                            value={formData.nome}
                            onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        />
                        <textarea
                            placeholder="Descrição"
                            value={formData.descricao}
                            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={formData.quantidade}
                            onChange={(e) => setFormData({...formData, quantidade: parseInt(e.target.value) || 0})}
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Preço"
                            value={formData.preco}
                            onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                        />
                        <div className="modal-buttons">
                            <button onClick={salvarProduto} className="btn-primary">Salvar</button>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Movimentação */}
            {showMovModal && (
                <div className="modal-overlay" onClick={() => setShowMovModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Movimentar: {produtoSelecionado?.nome}</h2>
                        <p><strong>Estoque atual:</strong> {produtoSelecionado?.quantidade}</p>
                        <select
                            value={movData.tipo}
                            onChange={(e) => setMovData({...movData, tipo: e.target.value})}
                        >
                            <option value="entrada">📥 Entrada (adicionar)</option>
                            <option value="saida">📤 Saída (retirar)</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Quantidade"
                            value={movData.quantidade}
                            onChange={(e) => setMovData({...movData, quantidade: parseInt(e.target.value) || 0})}
                        />
                        <div className="modal-buttons">
                            <button onClick={registrarMovimentacaoHandler} className="btn-primary">Registrar</button>
                            <button onClick={() => setShowMovModal(false)} className="btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Produtos;
