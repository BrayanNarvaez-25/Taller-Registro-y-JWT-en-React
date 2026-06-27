import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_url } from "../config/apiConfig";
import { IconCar, IconImage } from "./Icons";

function ListaVehiculo({ vehiculos }) {
    const { token } = useAuth();
    const [fotosUrl, setFotosUrl] = useState({});

    useEffect(() => {
        const urlCreadas = [];

        const descargarFotos = async () => {
            const nuevasFotos = {};

            for (const vehiculo of vehiculos) {
                try {
                    const res = await fetch(
                        `${API_BASE_url}/auth/vehiculos/${vehiculo.id}/foto`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (res.ok) {
                        const blob = await res.blob();
                        const urlLocal = URL.createObjectURL(blob);

                        urlCreadas.push(urlLocal);
                        nuevasFotos[vehiculo.id] = urlLocal;
                    }

                } catch (error) {
                    console.log("Fallo al descargar la foto:", error);
                }
            }

            setFotosUrl(nuevasFotos);
        };

        if (vehiculos.length > 0) {
            descargarFotos();
        }

        return () => {
            for (const url of urlCreadas) {
                URL.revokeObjectURL(url);
            }
        };

    }, [vehiculos, token]);

    return (
        <div className="terminal-panel terminal-panel--wide" style={{ marginTop: "24px" }}>
            <div className="terminal-header">
                <span className="icon-wrap"><IconCar /></span>
                <h2>Vehículos Registrados<span className="cursor-blink">&nbsp;</span></h2>
            </div>

            {vehiculos.length === 0 ? (
                <div className="empty-state">
                    <IconCar width="26" height="26" />
                    <p>No hay vehículos registrados</p>
                </div>
            ) : (
                <div className="vehiculo-grid">
                    {vehiculos.map((v) => (
                        <div key={v.id} className="vehiculo-card">
                            <div className="foto-wrap">
                                {fotosUrl[v.id] ? (
                                    <img src={fotosUrl[v.id]} alt="Foto del vehiculo" />
                                ) : (
                                    <span className="foto-placeholder">
                                        <IconImage width="22" height="22" />
                                        Sin foto
                                    </span>
                                )}
                            </div>
                            <div className="info-row">
                                <span className="key">Marca</span>
                                <span className="val">{v.marca}</span>
                            </div>
                            <div className="info-row">
                                <span className="key">Modelo</span>
                                <span className="val">{v.modelo}</span>
                            </div>
                            <div className="info-row">
                                <span className="key">Tipo</span>
                                <span className="val">{v.mimeType}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}

export default ListaVehiculo;