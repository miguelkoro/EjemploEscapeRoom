
import React, {useRef} from 'react'
import { Canvas, useFrame} from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Earth from './threeJSComponents/Earth';
import GlobeStand from './threeJSComponents/GlobeStand';
import Globe from './threeJSComponents/Globe';

const ThreeReact = (props) => {
    return (
        <div style={{ width: props.boxWidth, height: props.boxHeight}}>
            <Canvas>
                <Globe/>
                <ambientLight intensity={0.5} /> {/* Luz ambiental */}
                <directionalLight position={[0, 0, 5]} intensity={1} /> {/* Luz direccional */}
            </Canvas>
        </div>
    )
}
  

export default ThreeReact;