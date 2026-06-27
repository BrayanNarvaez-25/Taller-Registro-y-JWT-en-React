import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { API_BASE_url } from "../config/apiConfig";
import MatrixRain from "../components/MatrixRain";
import { IconUser, IconShield, IconLogOut, IconAlert } from "../components/Icons";

function Perfil() {
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [error, setError] = useState('');

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const response = await fetch(`${API_BASE_url}/auth/perfil`, {
                    method : 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar Perfil, inicie sesión nuevamente');
                }

                const datos = await response.json();
                setDatosPerfil(datos);

            } catch (err) {
                setError(err.message);
            }
        };
        cargarPerfil();
    }, [token])

    const manejarLogOut = async () => {
        try {
            await fetch(`${API_BASE_url}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        } catch (err) {
                console.log('Error de red al intentar revocar el token: ' + err)
        }
        logout();
        navigate('/login')
    }

    return (
        <div className="auth-shell">
            <MatrixRain />
            <div className="terminal-panel terminal-panel--wide">
                <div className="terminal-dots">
                    <span /><span /><span />
                </div>
                <div className="terminal-header profile-header-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="icon-wrap"><IconUser /></span>
                        <h2>Perfil de Usuario<span className="cursor-blink">&nbsp;</span></h2>
                    </span>
                    <button onClick={manejarLogOut} className="btn-terminal btn-terminal--danger" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconLogOut width="14" height="14" /> Cerrar Sesión
                    </button>
                    <button onClick={()=> navigate("/vehiculos")} className="btn-terminal btn-terminal--danger" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconLogOut width="14" height="14" /> Gestionar Vehiculo
                    </button>
                </div>

                {error && (
                    <div className="msg msg--error">
                        <IconAlert width="16" height="16" />
                        <span>{error}</span>
                    </div>
                )}

                {datosPerfil && (
                    <div>
                        <div className="profile-row">
                            <span className="key">Mensaje</span>
                            <span className="val">{datosPerfil.Mensaje}</span>
                        </div>
                        <div className="profile-row">
                            <span className="key"><IconUser width="13" height="13" /> Usuario</span>
                            <span className="val">{datosPerfil.Usuario}</span>
                        </div>
                        <div className="profile-row">
                            <span className="key"><IconShield width="13" height="13" /> Rol Detectado</span>
                            <span className="val">{datosPerfil.rol_detecatado}</span>
                        </div>
                        <div className="profile-row">
                            <span className="key">Status</span>
                            <span className="val">{datosPerfil.status}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
};

export default Perfil;