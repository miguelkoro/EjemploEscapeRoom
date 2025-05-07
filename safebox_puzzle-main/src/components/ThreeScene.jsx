import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Importa GLTFLoader
//import Earth from "../assets/textures/earth.jpg";

import earthTexture from "../assets/images/earth.jpg"; // Importa la imagen local
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Importa OrbitControls
import { sign } from "three/tsl";

//https://sketchfab.com/3d-models/globe-e7ee3a2f112342008df4193e112ccd2c
//https://www.solarsystemscope.com/textures/
const ThreeScene = (props) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const earthRef = useRef(null);

    const rotationAxisRef = useRef(null);


    //const globeGroupRef = useRef(null);
    const controlsRef = useRef(null); // Referencia para OrbitController

    //const inclination = THREE.MathUtils.degToRad(15);
    // Crear el eje inclinado (en coordenadas del mundo)
    //const inclinedAxis = new THREE.Vector3(Math.sin(inclination), Math.cos(inclination), 0).normalize();

    const isDragging = useRef(false); // Estado para detectar si se está arrastrando
    const previousMousePosition = useRef({ x: 0, y: 0 }); // Posición previa del ratón

    
    const coordinates = [
        { country: "Spain", sign:"ES", latitude: 40.2085 , longitude: -3.713 }, // Ecuador
        { country: "Andorra", sign:"AD", latitude: 42.5422699 , longitude: 1.5976721 }, // Ecuador
        { country: "Italy", sign:"IT", latitude: 41.29246 , longitude: 12.5736108 }, // Ecuador
        { country: "France", sign:"FR", latitude: 46.603354 , longitude: 1.888334 }, // Ecuador
        { country: "Portugal", sign:"PT", latitude: 39.399872 , longitude: -8.224454 }, // Ecuador
        { country: "United Kingdom", sign:"GB", latitude: 55.378051 , longitude: -3.435973 }, // Ecuador
        { country: "Germany", sign:"DE", latitude: 51.165691 , longitude: 10.451526 }, // Ecuador
        { country: "Netherlands", sign:"NL", latitude: 52.379189 , longitude: 4.899431 }, // Ecuador
        { country: "Luxembourg", sign:"LU", latitude: 49.6118 , longitude: 6.1319 }, // Ecuador
        { country: "Switzerland", sign:"CH", latitude: 46.8182 , longitude: 8.2275 }, // Ecuador
        { country: "Austria", sign:"AT", latitude: 47.5162 , longitude: 14.5501 }, // Ecuador
        { country: "Ireland", sign:"IE", latitude: 53.4129 , longitude: -8.2439 }, // Ecuador
        { country: "Iceland", sign:"IS", latitude: 64.9631 , longitude: -19.0208 }, // Ecuador
        { country: "Norway", sign:"NO", latitude: 60.472 , longitude: 8.4689 }, // Ecuador
        { country: "Sweden", sign:"SE", latitude: 60.1282 , longitude: 18.6435 }, // Ecuador
        { country: "Finland", sign:"FI", latitude: 61.9241 , longitude: 25.7482 }, // Ecuador
        { country: "Denmark", sign:"DK", latitude: 56.2639 , longitude: 9.5018 }, // Ecuador
        { country: "Estonia", sign:"EE", latitude: 58.5953 , longitude: 25.0136 }, // Ecuador
        { country: "Poland", sign:"PL", latitude: 51.9194 , longitude: 19.1451 }, // Ecuador
        { country: "Czech Republic", sign:"CZ", latitude: 49.8175 , longitude: 15.473 }, // Ecuador
        { country: "Slovakia", sign:"SK", latitude: 48.669 , longitude: 19.699 }, // Ecuador
        { country: "Hungary", sign:"HU", latitude: 47.1625 , longitude: 19.5033 }, // Ecuador
        { country: "Romania", sign:"RO", latitude: 45.9432 , longitude: 24.9668 }, // Ecuador
        { country: "Serbia", sign:"RS", latitude: 44.0165 , longitude: 21.0059 }, // Ecuador
        { country: "Croatia", sign:"HR", latitude: 45.1 , longitude: 15.2 }, // Ecuador
        { country: "Japan", sign:"JP", latitude: 36.2048 , longitude: 138.2529 }, // Ecuador
        { country: "South Korea", sign:"KR", latitude: 35.9078 , longitude: 127.7669 }, // Ecuador
    ]

    const setupControls = () => {

        controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controlsRef.current.enableDamping = true; // Suaviza el movimiento
        controlsRef.current.dampingFactor = 0.05; // Factor de amortiguación
        controlsRef.current.enableZoom = true; // Permite hacer zoom
        controlsRef.current.minDistance = 1.5; // Distancia mínima de la cámara
        controlsRef.current.maxDistance = 3; // Distancia máxima de la cámara
    
        // Restringe el movimiento horizontal (solo permite rotación vertical)
        controlsRef.current.minAzimuthAngle = 0; // Límite izquierdo
        controlsRef.current.maxAzimuthAngle = 0; // Límite derecho
    
        // Permite movimiento vertical limitado
        controlsRef.current.minPolarAngle = Math.PI / 3; // Límite inferior
        controlsRef.current.maxPolarAngle = Math.PI / 1.5; // Límite superior
    };

    // Configuración inicial de la cámara
    const setupCamera = () => {
        cameraRef.current = new THREE.PerspectiveCamera(
            75, props.boxWidth / props.boxHeight, 0.1, 1000 );
        cameraRef.current.position.z = 3;
    };

    // Configuración inicial del renderer
    const setupRenderer = () => {
        rendererRef.current = new THREE.WebGLRenderer({ alpha: true }); // Fondo transparente
        rendererRef.current.setSize(props.boxWidth, props.boxHeight);
        rendererRef.current.toneMappingExposure =1; // Ajusta el exposure (prueba con valores entre 0.5 y 2)
        //rendererRef.current.setClearColor(0x000000, 0); // Fondo transparente
        mountRef.current.appendChild(rendererRef.current.domElement);
    };

    const createEarth = () => {
        const sphereGeometry = new THREE.SphereGeometry(1, 60, 60);
        const sphereTexture = new THREE.TextureLoader().load(earthTexture);
        const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
        
        return new THREE.Mesh(sphereGeometry, sphereMaterial);
    }

    const createPole = (x,y,z) => {
        const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const poleGeometry = new THREE.SphereGeometry(0.05);
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, y, z);
        return pole;
    }

    const createLights = () => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);
    
        const light = new THREE.PointLight(0xffffff, 3);
        light.position.set(-1, -0.5, 2.8);
        sceneRef.current.add(light);
    }

    const createGlobeStand = () => {
        const loader = new GLTFLoader();
        loader.load(
            "/models/Globe.glb", // Ruta al archivo .gltf
            (gltf) => {
                const model = gltf.scene;
                // Recorre todos los materiales del modelo

                model.position.set(0, -1.591, 0); // Posición del modelo
                model.scale.set(8.1, 8.1, 8.1); // Escala del modelo
                model.rotation.y = THREE.MathUtils.degToRad(45); // Rotación inicial del modelo
                sceneRef.current.add(model);
            },
            undefined,
            (error) => {
                console.error("Error al cargar el modelo:", error);
            }
        );
    }

    const addMarkersToSphere = (coordinates, radius) => {
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Color rojo para los marcadores
        const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16); // Pequeña esfera para el marcador
    
        coordinates.forEach(({ latitude, longitude }) => {
            // Convertir coordenadas geográficas a cartesianas
            const {x,y,z} = coordinateToSphere(latitude, longitude, radius);
            // Crear el marcador
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z);    
            // Agregar el marcador al grupo de rotación
            rotationAxisRef.current.add(marker);
        });
    };


    const coordinateToSphere = (latitude, longitude, radius) => {
        const phi = THREE.MathUtils.degToRad(90 - latitude); // Latitud a radianes
        const theta = THREE.MathUtils.degToRad(-longitude + 90); // Longitud a radianes

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return {x,y,z}
    }


    // Configuración inicial de los objetos de la escena
    const setupScene = () => {
        createLights();
    
        // Crear un grupo para inclinar el eje de rotación
        const globeGroup = new THREE.Group();
        globeGroup.rotation.z = THREE.MathUtils.degToRad(18.2); // Inclina el eje de rotación 22.5 grados
        globeGroup.rotation.x = THREE.MathUtils.degToRad(15.1);
        sceneRef.current.add(globeGroup);
    
        // Crear un grupo interno para manejar la rotación de la esfera
        const rotationAxis = new THREE.Group();
        rotationAxisRef.current = rotationAxis; // Guardar referencia al grupo interno
        globeGroup.add(rotationAxis);
    
        // Crear la esfera (earth)
        const earth = createEarth();
        earth.rotation.y = THREE.MathUtils.degToRad(-90); // Ajustar según sea necesario
        rotationAxis.add(earth); // Agregar la esfera al grupo interno
    
        
        // Crear los polos
        globeGroup.add(createPole(0, 1.5, 0)); // Norte
        globeGroup.add(createPole(0, -1.5, 0)); // Sur
            // Crear los marcadores en la esfera
        addMarkersToSphere(coordinates, 1); // Radio de la esfera = 1

        createGlobeStand(); // Crear el soporte del globo
    };

    const handleMouseDown = (event) => {
        isDragging.current = true;
        previousMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
    isDragging.current = false;
    };

    const handleMouseMove = (event) => {
        if (!isDragging.current || !rotationAxisRef.current) return;
        const deltaX = event.clientX - previousMousePosition.current.x;  
        rotationAxisRef.current.rotation.y += deltaX * 0.003;
        previousMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    // Animación
    const animate = () => {
        requestAnimationFrame(animate);
        if (controlsRef.current) {
            controlsRef.current.update(); // Actualiza los controles
        }
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    useEffect(() => {
        // Configuración inicial
        setupCamera();
        setupRenderer();
        setupScene();
        setupControls(); // Configura los controles
        animate();

            // Agregar eventos de ratón
        const canvas = rendererRef.current.domElement;
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);

        // Cleanup
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            rendererRef.current.dispose();
            mountRef.current.removeChild(rendererRef.current.domElement);
        };
    }, []);

    useEffect(() => {
        // Actualiza el tamaño del renderer y la cámara cuando cambian las props
        if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(props.boxWidth, props.boxHeight);
        cameraRef.current.aspect = props.boxWidth / props.boxHeight;
        cameraRef.current.updateProjectionMatrix();
        }
    }, [props.boxWidth, props.boxHeight]);



    return <div ref={mountRef} />;
};

export default ThreeScene;