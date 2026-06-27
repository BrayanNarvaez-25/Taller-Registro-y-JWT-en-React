import { useNavigate } from "react-router-dom"
import { API_BASE_url } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import ListaVehiculo from "../components/ListaVehiculos";
import MatrixRain from "../components/MatrixRain";
import { IconCar, IconImage, IconArrowLeft, IconAlert, IconCheck } from "../components/Icons";


function Vehiculos() {

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [succesMsg, setSuccesMsg] = useState("");
    const [listVehiculos, setListaVehiculos] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    const cargarVehiculos = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_url}/auth/vehiculos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("No se pudo obtener la lista de vehiculos");
            }

            const datos = await response.json();
            setListaVehiculos(datos);

        } catch (error) {
            setErrorMsg(error.message);
        }
    },[token])

    useEffect(() => {
        cargarVehiculos();
    }, [cargarVehiculos]);

    const manejarArchivo = (e) => {
        setArchivo(e.target.files[0]);
    }

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccesMsg("");

        if (!archivo) {
            setErrorMsg("Debes seleccionar una foto del vehiculo");
            return;
        }

        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("marca", marca);
        formData.append("modelo", modelo);

        try {

            const response = await fetch(`${API_BASE_url}/auth/vehiculos/registrar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }, body: formData

            });

            if (!response.ok) {
                throw new Error("No se pudo registrar el vehículo");
            }

            setSuccesMsg("Vehiculo registrado con éxito");
            setMarca("");
            setModelo("");
            setArchivo(null);
            cargarVehiculos();

        } catch (error) {
            setErrorMsg(error.message)
        }
    }

    return (
        <div className="page-shell">
            <MatrixRain />

            <div className="page-topbar">
                <button onClick={() => navigate("/perfil")} className="btn-ghost">
                    <IconArrowLeft width="14" height="14" /> Volver al Perfil
                </button>
            </div>

            <div className="page-title">
                <h1><IconCar /> Gestión de Vehículos</h1>
            </div>

            <div className="terminal-panel terminal-panel--wide">
                <div className="terminal-dots">
                    <span /><span /><span />
                </div>
                <div className="terminal-header">
                    <span className="icon-wrap"><IconCar /></span>
                    <h2>Registrar Nuevo Vehículo<span className="cursor-blink">&nbsp;</span></h2>
                </div>

                <form onSubmit={manejarSubmit}>
                    <div className="field">
                        <label><IconCar width="14" height="14" /> Marca</label>
                        <input
                            type="text"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            placeholder="Toyota"
                            required
                        />
                    </div>

                    <div className="field">
                        <label><IconCar width="14" height="14" /> Modelo</label>
                        <input
                            type="text"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            placeholder="Corolla"
                            required
                        />
                    </div>

                    <div className="field">
                        <label><IconImage width="14" height="14" /> Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={manejarArchivo}
                        />
                    </div>

                    {errorMsg && (
                        <div className="msg msg--error">
                            <IconAlert width="16" height="16" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                    {succesMsg && (
                        <div className="msg msg--success">
                            <IconCheck width="16" height="16" />
                            <span>{succesMsg}</span>
                        </div>
                    )}

                    <button type="submit" className="btn-terminal">
                        Registrar Vehículo
                    </button>
                </form>
            </div>

            <ListaVehiculo
                vehiculos={listVehiculos}
            />

        </div>
    )
}

export default Vehiculos