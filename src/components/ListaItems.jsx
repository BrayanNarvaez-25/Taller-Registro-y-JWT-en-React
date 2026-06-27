import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_url } from "../config/apiConfig";
import { IconImage, IconAlert, IconCheck } from "./Icons";

function ListaItems({ items, onRecargar }) {
    const { token } = useAuth();
    const [fotosUrl, setFotosUrl] = useState({});
    const [editando, setEditando] = useState(null);
    const [formEdit, setFormEdit] = useState({ titulo: "", director: "", file: null });
    const [msgEdit, setMsgEdit] = useState({ error: "", success: "" });

    useEffect(() => {
        const urlCreadas = [];

        const descargarFotos = async () => {
            const nuevasFotos = {};
            for (const item of items) {
                try {
                    const res = await fetch(`${API_BASE_url}/auth/items/${item.id}/foto`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const blob = await res.blob();
                        const urlLocal = URL.createObjectURL(blob);
                        urlCreadas.push(urlLocal);
                        nuevasFotos[item.id] = urlLocal;
                    }
                } catch (err) {
                    console.log("Error descargando foto:", err);
                }
            }
            setFotosUrl(nuevasFotos);
        };

        if (items.length > 0) descargarFotos();

        return () => {
            for (const url of urlCreadas) URL.revokeObjectURL(url);
        };
    }, [items, token]);

    const handleEliminar = async (id) => {
        if (!confirm("¿Eliminar esta película?")) return;
        try {
            const res = await fetch(`${API_BASE_url}/auth/items/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("No se pudo eliminar");
            onRecargar();
        } catch (err) {
            alert(err.message);
        }
    };

    const abrirModal = (item) => {
        setEditando(item.id);
        setFormEdit({ titulo: item.titulo, director: item.director, file: null });
        setMsgEdit({ error: "", success: "" });
    };

    const cerrarModal = () => {
        setEditando(null);
        setMsgEdit({ error: "", success: "" });
    };

    const handleGuardarEdit = async (e) => {
        e.preventDefault();
        setMsgEdit({ error: "", success: "" });

        const data = new FormData();
        data.append("titulo", formEdit.titulo);
        data.append("director", formEdit.director);
        if (formEdit.file) data.append("file", formEdit.file);

        try {
            const res = await fetch(`${API_BASE_url}/auth/items/${editando}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: data
            });
            if (!res.ok) throw new Error("No se pudo actualizar");
            setMsgEdit({ error: "", success: "Película actualizada con éxito" });
            setTimeout(() => {
                cerrarModal();
                onRecargar();
            }, 900);
        } catch (err) {
            setMsgEdit({ error: err.message, success: "" });
        }
    };

    return (
        <div className="terminal-panel terminal-panel--wide" style={{ marginTop: "24px" }}>
            <div className="terminal-header">
                <span className="icon-wrap">🎬</span>
                <h2>Películas Registradas<span className="cursor-blink">&nbsp;</span></h2>
            </div>

            {items.length === 0 ? (
                <div className="empty-state">
                    <IconImage width="26" height="26" />
                    <p>No hay películas registradas</p>
                </div>
            ) : (
                <div className="vehiculo-grid">
                    {items.map((item) => (
                        <div key={item.id} className="vehiculo-card">
                            <div className="foto-wrap">
                                {fotosUrl[item.id] ? (
                                    <img src={fotosUrl[item.id]} alt="Poster" />
                                ) : (
                                    <span className="foto-placeholder">
                                        <IconImage width="22" height="22" />
                                        Sin foto
                                    </span>
                                )}
                            </div>
                            <div className="info-row">
                                <span className="key">Título</span>
                                <span className="val">{item.titulo}</span>
                            </div>
                            <div className="info-row">
                                <span className="key">Director</span>
                                <span className="val">{item.director}</span>
                            </div>
                            <div className="card-actions">
                                <button className="btn-terminal" onClick={() => abrirModal(item)}>
                                    Editar
                                </button>
                                <button className="btn-terminal btn-terminal--danger" onClick={() => handleEliminar(item.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de edición */}
            {editando !== null && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="terminal-dots"><span /><span /><span /></div>
                        <div className="terminal-header">
                            <span className="icon-wrap">✏️</span>
                            <h2>Editar Película<span className="cursor-blink">&nbsp;</span></h2>
                        </div>
                        <form onSubmit={handleGuardarEdit}>
                            <div className="field">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={formEdit.titulo}
                                    onChange={(e) => setFormEdit({ ...formEdit, titulo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label>Director</label>
                                <input
                                    type="text"
                                    value={formEdit.director}
                                    onChange={(e) => setFormEdit({ ...formEdit, director: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label>Nueva foto (opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormEdit({ ...formEdit, file: e.target.files[0] })}
                                />
                            </div>
                            {msgEdit.error && (
                                <div className="msg msg--error">
                                    <IconAlert width="16" height="16" /><span>{msgEdit.error}</span>
                                </div>
                            )}
                            {msgEdit.success && (
                                <div className="msg msg--success">
                                    <IconCheck width="16" height="16" /><span>{msgEdit.success}</span>
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="submit" className="btn-terminal">Guardar</button>
                                <button type="button" className="btn-terminal btn-terminal--danger" onClick={cerrarModal}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaItems;