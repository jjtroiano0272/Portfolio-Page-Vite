/*
  Credit for the original implementation of code: Johan Karlsson (DonKarlssonSan) 2018
  https://codepen.io/DonKarlssonSan/pen/deVYoZ

  That original code does NOT work with current-day Three.js and had to be translated to current methods.
*/
// 0x461e52
// 0xdd517f
// 0xe68e36
// 0x556dc8
// 0x7998ee

import './styles.css';
import * as THREE from 'three';
// import * as SIMPLEX from 'simplex-noise';
// import 'simplex-noise';
import SimplexNoise from 'simplex-noise';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PlaneGeometry } from 'three';
import * as dat from 'dat.gui';
import { GUI } from "three/examples/jsm/libs/dat.gui.module";



let scene;
let camera;
let renderer;
let simplex;
let sides;
let planeMesh;
let geometry;
let xZoom;
let yZoom;
let noiseStrength;
let offset;
let planeVertices;
let flying = 0;

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
  // By zooming y more than x, we get the appearence of flying along a valley
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

// TODO:
function setupFog() {
  scene.fog = new THREE.FogExp2( 0x461e52, 0.14 );
  renderer.setClearColor(0x461e52, 1);
}

function setupPlaneMesh() {
  sides = Math.pow(2, 5);
  // sides = 1;
  geometry = new THREE.PlaneGeometry(40, 40, sides, sides);

  // TODO: geometry.parameters.widthSegments

  let material = new THREE.MeshStandardMaterial({
    roughness: 0.9,
    color: new THREE.Color(0x556DC8),
    wireframe: true
  });

  planeMesh = new THREE.Mesh(geometry, material);
  planeMesh.castShadow = true;
  planeMesh.receiveShadow = true;

  scene.add(planeMesh);
}

function setupSun() {
  let geometry = new THREE.SphereGeometry( 5, 32, 32 );
  let material = new THREE.MeshBasicMaterial({ color: 0xe68e36 } );
  let sun = new THREE.Mesh( geometry, material );
  scene.add(sun);
}

function setupStars() {}

function setupLights() {
  let ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);
  
  let spotLight = new THREE.SpotLight(0xcccccc);
  spotLight.position.set(-30, 60, 60);
  spotLight.castShadow = true;

    var hemisphereLight = new THREE.HemisphereLight(0xe68e36,0xdd517f, .9)
    scene.add(hemisphereLight);
    let sun = new THREE.DirectionalLight(0xe68e36, 0.9);
    sun.position.set( 12, 6, -7 );
    sun.castShadow = true;
    scene.add(sun);

  scene.add(spotLight);
}

function setupEventListeners() {
  window.addEventListener("resize", onWindowResize);
}

function setupDatGUI() {
  // Following along with https://www.youtube.com/watch?v=Q6fx_3rjhWY
  const gui = new dat.GUI();
  gui.add(camera.position, "x", -50, 50, 1);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function undulateVertices(offset) {
    planeVertices = planeMesh.geometry.attributes.position; // Float32Array: 1-dimensional Array
    let numRows = planeVertices.count / sides+1;
    
    for (let i = 0; i < planeVertices.count; i++) {
        let x = planeVertices.getX(i) / xZoom;
        let y = planeVertices.getY(i) / yZoom;
        let noise = simplex.noise2D(x, y+offset) * noiseStrength;
        planeVertices.setZ(i, noise);

        // TODO: x coordinates of the planeMesh increase at a linear rate, towards camera
        let gridDisplacement = -0.120;
        planeVertices.setY( i, planeVertices.getY(i)+gridDisplacement );

        if (planeVertices.getY(i) < camera.position.y ) {
          
        }

        for (let row = 0; row < numRows; row++) {
          planeVertices.getY(row);
          
        }
        
        // let numRows;
        // for (let col = 0; col < planeVertices.count; col++) {
        //   numRows++;
        //   console.log(numRows);
        // }
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

function proceduralGen() {
  planeVertices = planeMesh.geometry.attributes.position;
  let numRows = planeVertices.count / sides+1;

  for (let col = 0; col < numRows; col++) { // iterate over columns
    if ( planeVertices.getY(col) === planeVertices.getY(col++)  ) { // They're in same row; iterate over rows
      let x = planeVertices.getX(col) / xZoom;
      let y = planeVertices.getY(col) / yZoom;
      let noise = simplex.noise2D(x, y+offset) * noiseStrength;
      planeVertices.setZ(col, noise);

      // planeVertices.setY(0, )
    }
    
  }
}

function draw() {
  requestAnimationFrame(draw);
  offset = Date.now() * 0.0004;
  undulateVertices(offset);   // wiggles the geometry
	adjustCameraPos(offset);    // dolly's the camera up & down
  proceduralGen();

  renderer.render(scene, camera);
}





setup();
draw();