/* OrbitControls allows us to pan around the scene with our controller (mouse/finger) */
import './styles.css';
import * as THREE from 'three';
// import * as THREE from './vendor/three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Plane } from 'three';

// Think of a scene as a container
// PerspectiveCamera mimicks what human eyeballs see
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/* Boilerplate stuff */
// FIXME: Where did I get this code?
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);


// ****TORUS *********************************************************************
// *******************************************************************************
// We must create a mesh by combining the geometry with the material.
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xFFFFF);
pointLight.position.set(5,5, 5);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight);


// **** PARTICLE GEOMETRY ********************************************************
// *******************************************************************************
// Background particles
const particleGeom = new THREE.BufferGeometry();
const particleCount = 5000;
const positionArray = new Float32Array(particleCount * 3); // Multiple of 3 due to x, y, z axes.

// Place 'particles' at random points in the background
for (let i = 0; i < particleCount*3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 5;
}
particleGeom.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

// These are the particle or 'stars' in the background
const particleMaterial = new THREE.PointsMaterial({
    size: 0.004,
    // map: particleShape,
    transparent: true,
    color: 0x3c1d4e,
    blending: THREE.AdditiveBlending
})
const centralShape = new THREE.Points(geometry, material);
scene.add(centralShape);
const particlesMesh = new THREE.Points(particleGeom, particleMaterial);
scene.add(particlesMesh);

// Mouse controls
document.addEventListener('mousemove', animateParticles);
let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}




const controls = new OrbitControls(camera, renderer.domElement);

// Add 200 stars
function addStar () {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(100) );
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// **** TEXTURE LOADING ********************************************************
// *****************************************************************************
const spaceTexture = new THREE.TextureLoader().load('./img/blue-universe-956981-1500x844.jpg');
scene.background = spaceTexture;

const profileCubeTexture = new THREE.TextureLoader().load('./img/profile_pic_stylized.jpg');
const profileCube = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ map: profileCubeTexture })
);
scene.add(profileCube);
profileCube.position.z = -5;
profileCube.position.x = 2;

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
// Placing objects in the scene
moon.position.z = 30;
moon.position.setX(-10);

// Animations that happen when you scroll
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.0050;
    moon.rotation.y += 0.0075;
    moon.rotation.z += 0.0050;

    profileCube.rotation.y += 0.005;
    profileCube.rotation.z += 0.005;

    camera.position.z = -0.0100*t;
    camera.position.x = -0.0002*t;
    camera.position.y = -0.0002*t;
}
/* BUG:  setting this property to moveCamera() breaks the scrolling.
I don't know why referencing the moveCamera function as a var lets it work. */
document.body.onscroll = moveCamera;
moveCamera();

// Recursive animation loop, works like a Game Loop
function animate() {
    const elapsedTime = clock.getElapsedTime();

    torus.rotation.x += 0.010;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.010;
    
    // profile cube slowly rotates by default
    profileCube.rotation.x -= 0.00040;
    profileCube.rotation.y += 0.00008;
    
    moon.rotation.x += 0.005;
    moon.rotation.y += 0.003;
    
    // Stars move normally but also by mouse movement.
    particlesMesh.rotation.y = -0.1 * elapsedTime;
    if (mouseX > 0) {
        particlesMesh.rotation.x  = -mouseY * (elapsedTime)*0.000008;
        particlesMesh.rotation.y  = -mouseX * (elapsedTime)*0.000008;
    }

    // So whenever the browser repaints the screen it calls the render method to update UI
    const canvas = renderer.domElement;
    // camera.aspect = document.querySelector('#bg').clientWidth / document.querySelector('#bg').clientHeight;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Entry point
animate();