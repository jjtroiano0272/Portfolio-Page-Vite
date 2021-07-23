/*
  Johan Karlsson (DonKarlssonSan) 2018
  https://codepen.io/DonKarlssonSan/pen/deVYoZ
  Referencing: 
   * three.js
   * Noise lib
   * OrbitControls
*/

import './styles.css';
import * as THREE from 'three';
// import * as SIMPLEX from 'simplex-noise';
// import 'simplex-noise';
import SimplexNoise from 'simplex-noise';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PlaneGeometry } from 'three';

let scene;
let camera;
let renderer;
let simplex;
let planeMesh;
let geometry;
let xZoom;
let yZoom;
let noiseStrength;
let offset;

function setup() {
  setupNoise();
  setupScene();
  setupRenderer();
  setupCamera();
  setupPlaneMesh();
  setupLights();
  setupEventListeners();
}

function setupNoise() {
  // By zooming y more than x, we get the
  // appearence of flying along a valley
  xZoom = 6;
  yZoom = 18;
  noiseStrength = 1.5;
  simplex = new SimplexNoise( Math.random() );
}

function setupScene() {
  scene = new THREE.Scene();
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,

  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function setupCamera() {
  let res = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, res, 0.1, 1000);
  camera.position.x = 0;
  camera.position.y = -20;
  camera.position.z = 3;
  
  let controls = new OrbitControls(camera, renderer.domElement);
}

function setupPlaneMesh() {
  let side = 32;
  geometry = new THREE.PlaneGeometry(40, 40, side, side);

  let material = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: new THREE.Color(0x556DC8),
    wireframe: true
  });

  planeMesh = new THREE.Mesh(geometry, material);
  planeMesh.castShadow = true;
  planeMesh.receiveShadow = true;

  scene.add(planeMesh);
}

function setupLights() {
  let ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);
  
  let spotLight = new THREE.SpotLight(0xcccccc);
  spotLight.position.set(-30, 60, 60);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function setupEventListeners() {
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function draw() {
  requestAnimationFrame(draw);
  offset = Date.now() * 0.0004;
  adjustVertices(offset);
	adjustCameraPos(offset);
  renderer.render(scene, camera);
}

function adjustVertices(offset) {
    let planeVertices = planeMesh.geometry.attributes.position;
    
    for (let i = 0; i < planeVertices.count; i++) {
        let x = planeVertices.getX(i) / xZoom;
        let y = planeVertices.getY(i) / yZoom;
        let noise = simplex.noise2D(x, y + offset) * noiseStrength;
        planeVertices.setZ(i, noise);
    }
    
    planeVertices.needsUpdate = true;
    planeMesh.geometry.computeVertexNormals();
}

function adjustCameraPos(offset) {  
  let x = camera.position.x / xZoom;
  let y = camera.position.y / yZoom;
  let noise = simplex.noise2D(x, y+offset) * noiseStrength + 1.5; 
  camera.position.z = noise;
}



setup();
draw();