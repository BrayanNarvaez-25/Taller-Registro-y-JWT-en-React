import { useNavigate, Link } from "react-router-dom"
import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { API_BASE_url } from "../config/apiConfig";
import MatrixRain from "../components/MatrixRain";
import { IconUser, IconLock, IconAlert } from "../components/Icons";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_BASE_url}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Usuario o contraseña incorrectos')
            }

            const datos = await response.json();

            login(datos.token);
            navigate('/perfil')

        } catch (err) {
            setError(err.message);
        };
    };

    return (
        <div className="auth-shell">
            <MatrixRain />
            <div className="terminal-panel">
                <div className="terminal-dots">
                    <span /><span /><span />
                </div>
                <div className="terminal-header">
                    <span className="icon-wrap"><IconLock /></span>
                    <h1>Iniciar Sesión<span className="cursor-blink">&nbsp;</span></h1>
                </div>
                <form onSubmit={manejarSubmit}>
                    <div className="field">
                        <label><IconUser width="14" height="14" /> Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="usuario_root"
                            required
                        />
                    </div>
                    <div className="field">
                        <label><IconLock width="14" height="14" /> Contraseña</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && (
                        <div className="msg msg--error">
                            <IconAlert width="16" height="16" />
                            <span>{error}</span>
                        </div>
                    )}
                    <button type="submit" className="btn-terminal">
                        Ingresar
                    </button>
                </form>
                <p className="auth-footer-link">
                    ¿No tienes una cuenta? <Link to="/registrar">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    )
};

export default Login;