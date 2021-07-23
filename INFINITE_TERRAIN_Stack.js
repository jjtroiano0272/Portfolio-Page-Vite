/* Sourced https://stackoverflow.com/questions/14737549/infinite-plane-of-wireframe-squares-in-three-js */

import './styles.css';
import * as THREE from 'three';
import * as SIMPLEX from 'simplex-noise';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Plane } from 'three';

const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let grid;
let scene;
let renderer;

grid = new THREE.GridHelper(200, 10, 0xffffff, 0xffffff);

scene = new THREE.Scene();
scene.add(grid);
scene.fog = new THREE.FogExp2( 0x000000, 0.0128 );

renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(scene.fog.color, 1);

// Recursive animation loop, works like a Game Loop
function animate() {
    const elapsedTime = clock.getElapsedTime();
    

    // So whenever the browser repaints the screen it calls the render method to update UI
    const canvas = renderer.domElement;
    // camera.aspect = document.querySelector('#bg').clientWidth / document.querySelector('#bg').clientHeight;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    canvas
    camera.updateProjectionMatrix();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Entry point
animate();