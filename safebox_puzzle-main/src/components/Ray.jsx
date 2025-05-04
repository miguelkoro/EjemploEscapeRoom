import React, { useRef, useEffect } from "react";
const Ray = (props) => {
    const canvasRef = useRef();
    const animationRef = useRef(); // Referencia para controlar la animación
    let offset = 0; // Desplazamiento horizontal de la onda
    //const canvas = canvasRef.current;

    const drawLine = (ctx, width, height, lineWidth, color)=> {
        ctx.beginPath();
        ctx.strokeStyle = color; // Color de la onda
        ctx.lineWidth = lineWidth;
        const centerX = width / 2; // Centro del canvas

        //Tengo que convertirlas ya que los diales me dan el valor en un rango muy elevado
        const maxAmplitude = props.amplitude * (height / 200); // Amplitud máxima
        const maxWavelength = props.wavelength * (width / 500); // Longitud de onda máxima
        const maxFrequency = props.frequency/1; // Frecuencia máxima

        for (let x = 0; x < width; x++) {
            // Calcular el factor de escala basado en la distancia al centro
            const distanceFromCenter = Math.abs(x - centerX) / centerX; // Normalizado entre 0 y 1
            const scale = 1 - distanceFromCenter; // Más cerca del centro = mayor escala

            // Ajustar amplitud, longitud de onda y frecuencia según el factor de escala
            const scaledAmplitude = maxAmplitude * scale;
            const scaledWavelength = maxWavelength * scale;
            const scaledFrequency = maxFrequency * scale;

            // Calcular la posición vertical (y) de la onda
            const y =
                height / 2 +
                scaledAmplitude *
                Math.sin((2 * Math.PI * scaledFrequency * (x + offset)) / scaledWavelength);

            ctx.lineTo(x, y); // Dibuja la línea de la onda
        }
        ctx.stroke();
        ctx.closePath();
    }

    //Por si en el futuro quiero poner varias ondas separadas
    const drawWave = (ctx, width, height)=> {
        // Dibujar tres ondas separadas horizontalmente
        //const waveCount = 3; // Número de ondas
        //const waveSpacing = width / (waveCount + 1); // Espaciado horizontal entre ondas

         // Crear un gradiente lineal
         const gradient = ctx.createLinearGradient(0, 0, 0, height); // Gradiente horizontal
         gradient.addColorStop(0, "rgb(209, 248, 209)"); // Verde opaco
         gradient.addColorStop(0.5, "rgb(21, 255, 0)"); // Blanco semitransparente
         gradient.addColorStop(1, "rgb(209, 248, 209)"); // Verde opaco
 
         drawLine(ctx, width, height, 6, gradient); // Dibuja la línea con el gradiente
         drawLine(ctx, width, height, 3, "rgba(255, 255, 255, 0.52)"); // Dibuja la línea del medio
    }
   
    const draw = (ctx, width, height) => {
        if (!ctx) return; // Verifica si el contexto es válido
        ctx.clearRect(0, 0, width, height); // Limpia el canvas

        drawWave(ctx, width, height); // Dibuja la onda
    
        offset += 2; // Incrementa el desplazamiento para animar la onda
        animationRef.current = requestAnimationFrame(() =>
          draw(ctx, width, height)
        ); // Solicita el siguiente frame
    };
    
    const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = props.boxWidth * 0.52; // Escala proporcional al ancho del contenedor
    const height = props.boxHeight * 0.5; // Escala proporcional al alto del contenedor
    canvas.width = width;
    canvas.height = height;

    draw(ctx, width, height); // Redibuja la onda con las nuevas dimensiones
    };

    useEffect(() => {
        resizeCanvas(); // Configura el canvas inicialmente
        return () => {
            cancelAnimationFrame(animationRef.current); // Detiene la animación al desmontar el componente
        };
    }, [props.boxWidth, props.boxHeight, props.frequency, props.amplitude, props.wavelength]); // Redibuja la onda cuando cambian los valores
    
    return(<canvas
        ref={canvasRef}
        width={props.boxWidth}
        height={props.boxHeight}
        style={{
            position: "absolute",
            top: "39%",
            transform: "translate(-50%, -50%)",
            left: "49.9%",
            zIndex: 1,
            pointerEvents: "none",
        }}
      ></canvas>
    );
}
export default Ray;