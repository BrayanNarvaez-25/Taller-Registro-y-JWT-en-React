import { useNavigate } from "react-router-dom";
import { API_BASE_url } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import ListaItems from "../components/ListaItems";
import MatrixRain from "../components/MatrixRain";
import { IconImage, IconArrowLeft, IconAlert, IconCheck } from "../components/Icons";

function GestionItems() {
    const [titulo, setTitulo] = useState("");
    const [director, setDirector] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [succesMsg, setSuccesMsg] = useState("");
    const [listaItems, setListaItems] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    const cargarItems = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_url}/auth/items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("No se pudo obtener la lista de películas");
            const datos = await response.json();
            setListaItems(datos);
        } catch (error) {
            setErrorMsg(error.message);
        }
    }, [token]);

    useEffect(() => {
        cargarItems();
    }, [cargarItems]);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccesMsg("");

        if (!archivo) {
            setErrorMsg("Debes seleccionar un poster de la película");
            return;
        }

        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("titulo", titulo);
        formData.append("director", director);

        try {
            const response = await fetch(`${API_BASE_url}/auth/items/registrar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (!response.ok) throw new Error("No se pudo registrar la película");
            setSuccesMsg("Película registrada con éxito");
            setTitulo("");
            setDirector("");
            setArchivo(null);
            cargarItems();
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="page-shell">
            <MatrixRain />

            <div className="page-topbar">
                <button onClick={() => navigate("/perfil")} className="btn-ghost">
                    <IconArrowLeft width="14" height="14" /> Volver al Perfil
                </button>
            </div>

            <div className="page-title">
                <h1>🎬 Gestión de Películas</h1>
            </div>

            <div className="terminal-panel terminal-panel--wide">
                <div className="terminal-dots">
                    <span /><span /><span />
                </div>
                <div className="terminal-header">
                    <span className="icon-wrap">🎬</span>
                    <h2>Registrar Nueva Película<span className="cursor-blink">&nbsp;</span></h2>
                </div>

                <form onSubmit={manejarSubmit}>
                    <div className="field">
                        <label>Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="The Matrix"
                            required
                        />
                    </div>
                    <div className="field">
                        <label>Director</label>
                        <input
                            type="text"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                            placeholder="Lana Wachowski"
                            required
                        />
                    </div>
                    <div className="field">
                        <label><IconImage width="14" height="14" /> Poster</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setArchivo(e.target.files[0])}
                        />
                    </div>

                    {errorMsg && (
                        <div className="msg msg--error">
                            <IconAlert width="16" height="16" /><span>{errorMsg}</span>
                        </div>
                    )}
                    {succesMsg && (
                        <div className="msg msg--success">
                            <IconCheck width="16" height="16" /><span>{succesMsg}</span>
                        </div>
                    )}

                    <button type="submit" className="btn-terminal">
                        Registrar Película
                    </button>
                </form>
            </div>

            <ListaItems items={listaItems} onRecargar={cargarItems} />
        </div>
    );
}

export default GestionItems;