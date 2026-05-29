import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const response = await login(email.trim(), senha);
            const { token, tipo, nome, id } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify({ id, nome, email, tipo }));

            navigate('/dashboard');
        } catch (error) {
            console.error('Erro no login:', error);

            // Se for erro de rede/timeout, mostrar mensagem amigável
            const isNetwork = error?.message?.toLowerCase().includes('network') || error?.code === 'ERR_NETWORK' || error?.message?.toLowerCase().includes('timeout');
            if (isNetwork) {
                setErro('Erro de rede: não foi possível conectar ao backend. Verifique se o servidor está rodando em http://localhost:8080 e se não há bloqueio de CORS. (Se estiver usando Vite, verifique vite.config.js)');
                setCarregando(false);
                return;
            }

            const data = error.response?.data;
            const message =
                data?.message ||
                data?.mensagem ||
                (typeof data === 'string' ? data : null) ||
                error.message ||
                'Erro ao fazer login';
            setErro(message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Sistema Almoxarifado</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                {erro && <div className="erro-mensagem">{erro}</div>}

                <div className="info-acessos">
                    <p><strong>Acessos de teste:</strong></p>
                    <p>Admin: admin@almox.com / admin123</p>
                    <p>Operador: operador@almox.com / operador123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;