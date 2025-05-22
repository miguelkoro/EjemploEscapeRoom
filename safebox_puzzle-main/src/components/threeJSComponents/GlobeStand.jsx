import { useGLTF } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei'
const GlobeStand = () => {
    const { scene } = useGLTF('/models/Globe.glb'); // Carga el modelo GLB

    // Configurar posición, escala y rotación del modelo
    return (
        <>
        <primitive
            object={scene}
            position={[0, -1.591, 0]}
            scale={[8.1, 8.1, 8.1]}
            rotation={[0, Math.PI / 4, 0]} // Rotación en radianes
        />
        </>
    );
};
export default GlobeStand;