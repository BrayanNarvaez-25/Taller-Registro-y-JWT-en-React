import { useNavigate, Link } from "react-router-dom"
import { useState } from "react";
import { API_BASE_url } from "../config/apiConfig";
import MatrixRain from "../components/MatrixRain";
import { IconUser, IconLock, IconShield, IconAlert, IconCheck } from "../components/Icons";

function Registrar() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('USER');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const navigate = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');
        try {
            const response = await fetch(`${API_BASE_url}/auth/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, rol }),
            });

            if (!response.ok) {
                const mensajeError = await response.text();
                throw new Error(mensajeError || 'No se pudo registrar el usuario');
            }

            setExito('Usuario registrado exitosamente. Redirigiendo al login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

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
                    <span className="icon-wrap"><IconShield /></span>
                    <h1>Registrar Usuario<span className="cursor-blink">&nbsp;</span></h1>
                </div>
                <form onSubmit={manejarSubmit}>
                    <div className="field">
                        <label><IconUser width="14" height="14" /> Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="nuevo_usuario"
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
                    <div className="field">
                        <label><IconShield width="14" height="14" /> Rol</label>
                        <select
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    {error && (
                        <div className="msg msg--error">
                            <IconAlert width="16" height="16" />
                            <span>{error}</span>
                        </div>
                    )}
                    {exito && (
                        <div className="msg msg--success">
                            <IconCheck width="16" height="16" />
                            <span>{exito}</span>
                        </div>
                    )}
                    <button type="submit" className="btn-terminal">
                        Registrarse
                    </button>
                </form>
                <p className="auth-footer-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    )
};

export default Registrar;