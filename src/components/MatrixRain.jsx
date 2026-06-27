import { useEffect, useRef } from "react";

function MatrixRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let columnas = [];
        let intervalId;

        const caracteres = '01アイウエオカキクケコサシスセソタチツテト';
        const tamanioFuente = 14;

        const configurar = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const totalColumnas = Math.floor(canvas.width / tamanioFuente);
            columnas = new Array(totalColumnas).fill(0);
        };

        const dibujar = () => {
            ctx.fillStyle = 'rgba(2, 8, 4, 0.18)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#39ff6a';
            ctx.font = `${tamanioFuente}px monospace`;

            columnas.forEach((y, i) => {
                const caracter = caracteres[Math.floor(Math.random() * caracteres.length)];
                const x = i * tamanioFuente;
                ctx.fillText(caracter, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    columnas[i] = 0;
                } else {
                    columnas[i] = y + tamanioFuente;
                }
            });
        };

        configurar();
        intervalId = setInterval(dibujar, 50);
        window.addEventListener('resize', configurar);

        return () => {
            window.removeEventListener('resize', configurar);
            clearInterval(intervalId);
        };
    }, []);

    return <canvas ref={canvasRef} className="matrix-rain" />;
};

export default MatrixRain;