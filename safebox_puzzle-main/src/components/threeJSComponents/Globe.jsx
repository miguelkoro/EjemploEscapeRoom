import Earth from './Earth';
import GlobeStand from './GlobeStand';
import { OrbitControls } from '@react-three/drei'
import React, {useRef} from 'react'
import {useFrame} from '@react-three/fiber'

const Globe = (props) => {
    const earthGroupRef = useRef(); // Referencia para rotar la Tierra horizontalmente
    const globalGroupRef = useRef(); // Referencia para inclinar ambos componentes verticalmente
    const controlsRef = useRef(); // Referencia para los OrbitControls

    // Actualizar la rotación horizontal de la Tierra y la inclinación vertical
    useFrame(() => {
        if (controlsRef.current) {
            const azimuthAngle = controlsRef.current.getAzimuthalAngle(); // Rotación horizontal
            const polarAngle = controlsRef.current.getPolarAngle(); 

            if (earthGroupRef.current) {
                // Rotar solo la Tierra horizontalmente (azimuthAngle controla la rotación horizontal)
                earthGroupRef.current.rotation.y = azimuthAngle;
            }

            if (globalGroupRef.current) {
                // Inclinar ambos componentes verticalmente (polarAngle controla la inclinación vertical)
                globalGroupRef.current.rotation.x = polarAngle - Math.PI / 2; // Ajustar para que la inclinación sea relativa
            }
        }
    });


    return (
        <group ref={globalGroupRef}>
            {/* Inclinar ambos componentes verticalmente */}
            <group ref={earthGroupRef}>
                {/* Rotar solo la Tierra horizontalmente */}
                <Earth />
            </group>
            {/* GlobeStand permanece fijo */}
            <GlobeStand />
            <OrbitControls
                ref={controlsRef}
                enableDamping={true} // Suaviza el movimiento
                dampingFactor={0.05} // Factor de amortiguación
                enableZoom={true} // Permite hacer zoom
                minDistance={1.5} // Distancia mínima de la cámara
                maxDistance={3} // Distancia máxima de la cámara
                //minAzimuthAngle = {0} // Límite izquierdo
                //maxAzimuthAngle = {0} // Límite derecho
                minPolarAngle={Math.PI / 3} // Límite inferior (vertical)
                maxPolarAngle={Math.PI / 1.5} // Límite superior (vertical)
            />
        </group>
    );
};

export default Globe;