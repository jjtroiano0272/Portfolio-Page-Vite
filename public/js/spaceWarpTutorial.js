/* Following along with https://www.youtube.com/watch?v=Bed1z7f1EI4&t=340s */
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene, camera, renderer;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = Math.PI/2;
    camera.position.z = 1;
    
    // renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.render(scene, camera);
    animate();
}

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();
