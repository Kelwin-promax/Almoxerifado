import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10s timeout para falhas de rede claras
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
    (config) => {
        if (!config.headers) {
            config.headers = {};
        }
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// AUTENTICAÇÃO

export const login = async (email, senha) => {
    const attempts = [
        { email, senha },
        { email, password: senha },
        { username: email, password: senha },
        { username: email, senha }
    ];

    let lastError;
    for (const payload of attempts) {
        try {
            const resp = await api.post('/auth/login', payload);
            return resp;
        } catch (error) {
            lastError = error;
            // se for erro de rede, interrompe e propaga para front mostrar mensagem específica
            if (error.message && error.message.toLowerCase().includes('network')) {
                throw error;
            }
            // continuar tentando outros formatos
        }
    }
    // lançar o último erro se todas tentativas falharem
    throw lastError;
};

// USUÁRIOS

export const listarUsuarios = () => api.get('/auth/usuarios');
export const criarUsuario = (usuario) => api.post('/auth/usuarios', usuario);
export const deletarUsuario = (id) => api.delete(`/auth/usuarios/${id}`);

// PRODUTOS

export const listarProdutos = (params) => api.get('/produtos', { params });
export const buscarProduto = (id) => api.get(`/produtos/${id}`);
export const criarProduto = (produto) => api.post('/produtos', produto);
export const atualizarProduto = (id, produto) => api.put(`/produtos/${id}`, produto);
export const deletarProduto = (id) => api.delete(`/produtos/${id}`);


// MOVIMENTAÇÕES

export const registrarMovimentacao = (data) => api.post('/movimentacoes', data);
export const historicoProduto = (produtoId) => api.get(`/movimentacoes/produto/${produtoId}`);
export const listarMovimentacoes = (page, size) => api.get('/movimentacoes', { params: { page, size } });

export default api;