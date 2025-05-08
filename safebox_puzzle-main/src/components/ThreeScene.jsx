import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Importa GLTFLoader
//import Earth from "../assets/textures/earth.jpg";

import earthTexture from "../assets/images/earth.jpg"; // Importa la imagen local
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Importa OrbitControls
import { use } from "react";
import { coordinates } from "../assets/coordinates";


//https://sketchfab.com/3d-models/globe-e7ee3a2f112342008df4193e112ccd2c
//https://www.solarsystemscope.com/textures/
//https://github.com/grafana/worldmap-panel/blob/master/src/data/countries.json
const ThreeScene = (props) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);

    const hasMoved = useRef(false); // Estado para detectar si el ratón se movió
    //const earthRef = useRef(null);

    const [selectedCountries, setSelectedCountries] = useState([]);
    const [curves, setCurves] = useState([]);

    const [lightColor, setLightColor] = useState(0xffffff); // Estado para el color de la luz

    //const [markerPoints, setMarkerPoints] = useState([]);

    const rotationAxisRef = useRef(null);
    const markersGroupRef = useRef(null);
    const curvesGroupRef = useRef(null);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    //const globeGroupRef = useRef(null);
    const controlsRef = useRef(null); // Referencia para OrbitController

    //const inclination = THREE.MathUtils.degToRad(15);
    // Crear el eje inclinado (en coordenadas del mundo)
    //const inclinedAxis = new THREE.Vector3(Math.sin(inclination), Math.cos(inclination), 0).normalize();

    const isDragging = useRef(false); // Estado para detectar si se está arrastrando
    const previousMousePosition = useRef({ x: 0, y: 0 }); // Posición previa del ratón


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
        //rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping; // Ajusta el tono de la escena
        //rendererRef.current.toneMappingExposure =0.5; // Ajusta el exposure (prueba con valores entre 0.5 y 2)
        //rendererRef.current.setClearColor(0x000000, 0); // Fondo transparente
        rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping; // Usar mapeo de tonos ACES para mejor contraste
        rendererRef.current.toneMappingExposure = 1; // Ajusta la exposición (prueba valores entre 0.8 y 1.5)
        rendererRef.current.outputEncoding = THREE.sRGBEncoding;; // Configurar el renderizador para usar sRGB
        mountRef.current.appendChild(rendererRef.current.domElement);
    };

    const createEarth = () => {
        const sphereGeometry = new THREE.SphereGeometry(1, 60, 60);
        const sphereTexture = new THREE.TextureLoader().load(earthTexture, (texture) => {
            texture.encoding = THREE.sRGBEncoding; // Asegúrate de usar sRGB para colores correctos
        });
        //const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
            // Usar MeshStandardMaterial para una mejor representación
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: sphereTexture,
            roughness: 1, // Ajusta la rugosidad para un acabado mate
            metalness: 0, // Sin efecto metálico
        });
        
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
        /*const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);*/
    
        /*const light = new THREE.PointLight(lightColor, 1);
        light.position.set(-1, -0.5, 2.2);
        sceneRef.current.add(light);*/

            // Luz direccional para iluminar el modelo desde un ángulo específico
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Intensidad ajustada a 0.8
        directionalLight.position.set(-0.5, 0.7, 2); // Posición de la luz
        //directionalLight.rotation.y= THREE.MathUtils.degToRad(15); // Rotación de la luz
        sceneRef.current.add(directionalLight);
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
        const markerGeometry = new THREE.SphereGeometry(0.016, 16, 16); // Pequeña esfera para el marcador
    
        //const newMarkers = []; // Array para almacenar los marcadores creados

        coordinates.forEach(({ latitude, longitude, name }) => {
            // Convertir coordenadas geográficas a cartesianas
            const {x,y,z} = coordinateToSphere(latitude, longitude, radius);
            // Crear el marcador
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y, z);    
            // Agregar el nombre del país al marcador
            marker.userData.name = name;
            // Agregar el marcador al grupo de rotación
            markersGroupRef.current.add(marker);

            //newMarkers.push(marker); // Agregar el marcador al array
        });
    };

    const createCurve = (start, end, duration = 2000) => {
        // Calcular los puntos intermedios para crear una curva más adaptada
        const distance = start.distanceTo(end); // Distancia entre los puntos
        let points = [];

        for (let i = 0; i <= 20; i++) {
            // Interpolar entre los puntos inicial y final
            let p = new THREE.Vector3().lerpVectors(start, end, i / 20);

            // Ajustar el radio usando una función seno para crear una curva más pronunciada
            const factor = 1 + Math.sin(Math.PI * (i / 20)) * Math.min(0.5, distance * 0.2); // Ajusta el multiplicador para controlar la altura
            p.normalize().multiplyScalar(1 * factor); // Normalizar y escalar según el factor
            points.push(p);
        }

        // Crear la curva a partir de los puntos generados
        const curve = new THREE.CatmullRomCurve3(points);

        // Crear la geometría del tubo
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            100, // Número de segmentos a lo largo del tubo
            0.005, // Grosor del tubo
            8, // Número de segmentos radiales
            false // No cerrar el tubo
        );

        // Crear el material del tubo
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Color verde

        // Crear el mesh del tubo
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

        // Agregar el tubo al grupo de curvas
        curvesGroupRef.current.add(tubeMesh);
            
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

        // Crear un grupo para los marcadores
        const markersGroup = new THREE.Group();
        markersGroupRef.current = markersGroup; // Guardar referencia al grupo de marcadores
        rotationAxis.add(markersGroup);

        // Crear un grupo para las curvas
        const curvesGroup = new THREE.Group();
        curvesGroupRef.current = curvesGroup; // Guardar referencia al grupo de curvas
        rotationAxis.add(curvesGroup);
    
        // Crear la esfera (earth)
        const earth = createEarth();
        earth.rotation.y = THREE.MathUtils.degToRad(-90); 
        rotationAxis.add(earth); // Agregar la esfera al grupo interno
    
        
        // Crear los polos
        globeGroup.add(createPole(0, 1.1, 0)); // Norte
        globeGroup.add(createPole(0, -1.1, 0)); // Sur
            // Crear los marcadores en la esfera
        addMarkersToSphere(coordinates, 1); // Radio de la esfera = 1

        createGlobeStand(); // Crear el soporte del globo
    };

    const handleMouseDown = (event) => {
        isDragging.current = true;
        hasMoved.current = false; // Reiniciar el estado de movimiento
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

        // Detectar movimiento del ratón
        hasMoved.current = true;
    };

    const handleClick = (event) => {
        if (hasMoved.current) return; // No seleccionar si el ratón se movió
        //if (!isDragging.current || !rotationAxisRef.current) return;
        // Calcular la posición del ratón en coordenadas normalizadas (-1 a +1)
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;    
        // Configurar el raycaster
        raycaster.setFromCamera(mouse, cameraRef.current);     
        // Detectar intersecciones con los marcadores
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
        //console.log("Intersecciones:", markerPoints);    
        if (intersects.length > 0) {
            // Obtener el primer objeto intersectado
            const marker = intersects[0].object;
            //if(!marker.userData)
            if(!marker.userData.name) return; // Si no tiene el nombre del país, no hacer nada{
            // Mostrar el nombre del país en la consola
            setSelectedCountries((prev) => [...prev, marker]);
            console.log(`Marcador clicado: ${marker.userData.name}`);
        }
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
        if (selectedCountries.length < 2) return; // No crear curvas si hay menos de 2 países seleccionados

        // Iterar sobre los países seleccionados y crear curvas entre pares consecutivos
        for (let i = 0; i < selectedCountries.length - 1; i++) {
            const start = selectedCountries[i].position; // Posición del país actual
            const end = selectedCountries[i + 1].position; // Posición del siguiente país

            createCurve(start, end); // Crear la curva entre los dos países

            //setLightColor("0x00ff00"); // Cambia el color de la luz a verde
        }
        //setLightColor(0x00ff00); // Cambia el color de la luz a verde
        
    }, [selectedCountries]); // Dependencia para actualizar el efecto cuando cambie selectedCountries

    useEffect(() => {
        // Encuentra la luz en la escena
        const ambientLight = sceneRef.current.children.find((child) => child.isAmbientLight);    
        if (ambientLight) {
            ambientLight.color.set(lightColor); // Cambia el color de la luz
        }
    }, [lightColor]); // Ejecutar cada vez que cambie lightColor

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
        canvas.addEventListener("click", handleClick); // Agregar evento de clic
        // Cleanup
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("click", handleClick); 
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