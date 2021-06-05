/* OrbitControls allows us to pan around the scene with our controller (mouse/finger) */
import './style.css';
import * as THREE from './node_modules/three/build/three.min.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';

// Think of a scene as a container
const scene = new THREE.Scene();
// PerspectiveCamera mimicks what human eyeballs see
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
/* This was all math until now. The renderer object renders the actual graphics to see.
renderer needs to know which DOM elements to use to render graphics upon */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
/* Most materials require a light source to bounce off of them to be visible.
In this case, MeshBasicMaterial doesn't need one! */
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
// We must create a mesh by combining the geometry with the material.
const torus = new THREE.Mesh(geometry, material);

// Need to add the defined mesh (geometry + mesh) to the scene then...
// VIDEO: 06:20
scene.add(torus);

const pointLight = new THREE.PointLight(0xFFFFF);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
pointLight.position.set(5,5, 5);

scene.add(pointLight, ambientLight);

// Adds indicators for each, which are normally hidden!
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar () {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(100) );
    star.position.set(x, y, z);
    scene.add(star);
}

// Add 200 stars & set an external image as background
Array(200).fill().forEach(addStar);
const spaceTexture = new THREE.TextureLoader().load('img/space.jpg');
scene.background = spaceTexture;

const jonTexture = new THREE.TextureLoader().load('./img/IMG_7268.jpg');
const jon = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ map: jonTexture })
);
scene.add(jon);

const moonTexture = new THREE.TextureLoader().load('./img/moon_texture.jpg');
const normalTexture = new THREE.TextureLoader().load('./img/normal.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
    })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

jon.position.z = -5;
jon.position.x = 2;

// Scroll animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.0050;
    moon.rotation.y += 0.0075;
    moon.rotation.z += 0.0050;

    jon.rotation.y += 0.010;
    jon.rotation.z += 0.010;

    camera.position.z = t * -0.0100;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}
/* BUG:  setting this property to moveCamera() breaks the scrolling.
I don't know why referencing the moveCamera function as a var lets it work. */
document.body.onscroll = moveCamera;
moveCamera();


// Recursive animation loop, works like a Game Loop
function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.010;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.010;

    moon.rotation.x += 0.005;

    // So whenever the browser repaints the screen it calls the render method to update UI
    renderer.render(scene, camera);
}

// Entry point
animate();