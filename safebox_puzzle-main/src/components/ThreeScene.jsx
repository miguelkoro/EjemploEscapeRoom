import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Importa GLTFLoader
//import Earth from "../assets/textures/earth.jpg";

import earthTexture from "../assets/images/earth.jpg"; // Importa la imagen local
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Importa OrbitControls

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

    const inclination = THREE.MathUtils.degToRad(15);
    // Crear el eje inclinado (en coordenadas del mundo)
    const inclinedAxis = new THREE.Vector3(Math.sin(inclination), Math.cos(inclination), 0).normalize();

    const isDragging = useRef(false); // Estado para detectar si se está arrastrando
    const previousMousePosition = useRef({ x: 0, y: 0 }); // Posición previa del ratón

    const setupControls = () => {
        /*controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controlsRef.current.enableDamping = true; // Suaviza el movimiento
        controlsRef.current.dampingFactor = 0.05; // Factor de amortiguación
        controlsRef.current.enableZoom = true; // Permite hacer zoom
        controlsRef.current.minDistance = 1; // Distancia mínima de la cámara
        controlsRef.current.maxDistance = 10; // Distancia máxima de la cámara

        // Configura los límites de rotación
        controlsRef.current.minPolarAngle = Math.PI / 3; // Límite inferior
        controlsRef.current.maxPolarAngle = Math.PI / 2; // Límite superior*/

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

            // Configura el tone mapping y el exposure
        //rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping; // Mapeo de tonos para materiales PBR
        rendererRef.current.toneMappingExposure =1; // Ajusta el exposure (prueba con valores entre 0.5 y 2)
        //rendererRef.current.setClearColor(0x000000, 0); // Fondo transparente
        mountRef.current.appendChild(rendererRef.current.domElement);
    };

    

    // Configuración inicial de los objetos de la escena
    const setupScene = () => {
        /*const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);

        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        sceneRef.current.add(light);

        const sphereGeometry = new THREE.SphereGeometry(1,60,60);
        //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Verde brillante
        /*const material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable",
            },
            side: THREE.DoubleSide,
            uniforms: {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2() },
                u_texture: { value: new THREE.TextureLoader().load("https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg") },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });*/

            // Crear un grupo para inclinar el eje de rotación
        
        //globeGroup.rotation.z = Math.PI / 12; // Inclina el eje de rotación (30 grados)
        // Crear un grupo para inclinar el eje de rotación
        /*const globeGroup = new THREE.Group();
        globeGroup.rotation.x = inclination; 
        //globeGroup.rotation.z = THREE.MathUtils.degToRad(23.5); // Inclina el eje de rotación
        sceneRef.current.add(globeGroup);*/
        //globeGroupRef.current = globeGroup; 
        //globeGroupRef.add(rotationAxis);
       /* const globeGroup = new THREE.Group();
        globeGroup.rotation.z = THREE.MathUtils.degToRad(22.5); // Inclina el eje de rotación 22.5 grados
        sceneRef.current.add(globeGroup);
        earthRef.current = globeGroup; // Referencia al grupo inclinado

       /* const rotationAxis = new THREE.Group();
        rotationAxisRef.current = rotationAxis;
        //rotationAxis.rotation.z = inclination; // inclinación fija del eje terrestre
        globeGroup.add(rotationAxis); // Agregar el eje de rotación al grupo de la esfera*/

       /* const sphereTexture = new THREE.TextureLoader().load(earthTexture); // Carga la textura local
        const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture }); // Aplica la textura
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        //sphere.position.set(0, 0, 0); // Posición de la esfera
        //sphere.rotation.x = Math.PI / 12; // Rotación inicial de la esfera
        //sphere.rotation.z = THREE.MathUtils.degToRad(10); // inclinación del eje
        //sphere.rotation.z = Math.PI / 12; // Rotación inicial de la esfera
        globeGroup.add(sphere);
        //earthRef.current = globeGroup;

        // Crear un cubo fijo
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rojo
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(2, 0, 0); // Posición del cubo
        sceneRef.current.add(cube);

        // Crear un pin
        /*const pinGeometry = new THREE.SphereGeometry(0.05)//new THREE.CylinderGeometry(0.1, 0.1, 1, 32); // Cilindro delgado
        const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Azul
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.set(1, 0.1, 0); // Posición del pin (en la parte superior de la esfera)
        pin.rotation.z = inclinedAxis;//THREE.MathUtils.degToRad(23.5);
        //pin.rotation.y = Math.PI / 4; // Rotación inicial del pin
        rotationAxis.add(pin);*/

            // Cargar un modelo .gltf
        /*const loader = new GLTFLoader();
        loader.load(
            "/models/GlobeStand/GlobeStand.gltf", // Ruta al archivo .gltf
            (gltf) => {
                const model = gltf.scene;
                // Recorre todos los materiales del modelo

                model.position.set(0.1, -1.6, 0.4); // Posición del modelo
                model.scale.set(8, 8, 8); // Escala del modelo
                model.rotation.y = Math.PI / 4; // Rotación inicial del modelo
                sceneRef.current.add(model);
            },
            undefined,
            (error) => {
                console.error("Error al cargar el modelo:", error);
            }
        );*/

         // Crear un cilindro para visualizar el eje de rotación
       /* const axisGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 32); // Cilindro delgado
        const axisMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rojo
        const axis = new THREE.Mesh(axisGeometry, axisMaterial);
        //axis.rotation.x = Math.PI / 2; // Alinear el cilindro con el eje Y
        axis.position.set(0, 0, 0);
        globeGroup.add(axis); // Agregar el cilindro al grupo


        const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const poleGeometry = new THREE.SphereGeometry(0.05);

        // Norte
        const northPole = new THREE.Mesh(poleGeometry, poleMaterial);
        northPole.position.set(0, 1.5, 0);
        globeGroup.add(northPole);

        // Sur
        const southPole = new THREE.Mesh(poleGeometry, poleMaterial);
        southPole.position.set(0, -1.5, 0);
        globeGroup.add(southPole);*/
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        sceneRef.current.add(ambientLight);
    
        const light = new THREE.PointLight(0xffffff, 3);
        light.position.set(-1, -0.5, 2.8);
        sceneRef.current.add(light);
    
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
        const sphereGeometry = new THREE.SphereGeometry(1, 60, 60);
        const sphereTexture = new THREE.TextureLoader().load(earthTexture);
        const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        rotationAxis.add(sphere); // Agregar la esfera al grupo interno
    
    
        // Crear los polos
        const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const poleGeometry = new THREE.SphereGeometry(0.05);
    
        // Norte
        const northPole = new THREE.Mesh(poleGeometry, poleMaterial);
        northPole.position.set(0, 1.5, 0);
        globeGroup.add(northPole);
    
        // Sur
        const southPole = new THREE.Mesh(poleGeometry, poleMaterial);
        southPole.position.set(0, -1.5, 0);
        globeGroup.add(southPole);

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
        //globeGroupRef.current.rotation.y += deltaX * 0.005; // Rotar la esfera en el eje Y
        
        //const angle = deltaX * 0.005;

            // Crear un quaternion para rotar sobre el eje inclinado (global)
        //const quaternion = new THREE.Quaternion().setFromAxisAngle(inclinedAxis, angle);
        //rotationAxisRef.current.quaternion.premultiply(quaternion);
        //earthRef.current.applyQuaternion(quaternion); // Aplicar la rotación al grupo de la esfera
        //rotationAxisRef.current.applyQuaternion(quaternion);
        //earthRef.current.rotation.y += deltaX * 0.005;
        // Rotar sobre el eje inclinado
        //const quaternion = new THREE.Quaternion().setFromAxisAngle(inclinedAxis, angle);
        //earthRef.current.quaternion.premultiply(quaternion);
        //earthRef.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);    
        rotationAxisRef.current.rotation.y += deltaX * 0.003;

        previousMousePosition.current = { x: event.clientX, y: event.clientY };
    };

    // Animación
    const animate = () => {
        requestAnimationFrame(animate);
        /*if (earthRef.current) {
        //earthRef.current.rotation.x += 0.01;
        earthRef.current.rotation.y += 0.01;
        }*/
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