import { useTexture } from '@react-three/drei'; 

import earthTexture from "../../assets/images/earth.jpg"; // Importa la imagen local
const Earth = () => {
    // Cargar la textura usando useTexture
    const texture = useTexture(earthTexture);

    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 60, 60]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
};
export default Earth;