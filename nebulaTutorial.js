import * as THREE from 'three';

// let scene, camera, renderer;
// let cloudParticles = [];

// /* Initalizes all variables for scene, then starts the animation running.
//    Think of this like a 'reset' button as well. */
// function init() {
//     scene = new THREE.Scene();
//     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
//     camera.position.x = 1.16;
//     camera.position.y = -0.12;
//     camera.position.z = 1.00; // TODO: Why the hell are there two values for z?
//     camera.rotation.z = 0.27;
    
//     let ambient = new THREE.AmbientLight(0x555555);
//     scene.add(ambient);
    
//     // renderer = new THREE.WebGLRenderer();
//     renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     scene.fog = new THREE.FogExp2(0x03544e, 0.001);
//     renderer.setClearColor(scene.fog.color);
//     // document.body.appendChild(renderer.domElement);

//     let loader = new THREE.TextureLoader();
//     loader.load( './img/smoke-1.png', function(texture)  {
//         let cloudGeom = new THREE.PlaneBufferGeometry(500, 500);
//         let cloudMaterial = new THREE.MeshLambertMaterial({
//             map: texture,
//             transparent: true
//         });

//         for (let p = 0; p < 50; p++) {
//             let cloud = new THREE.Mesh(cloudGeom, cloudMaterial);
//             cloud.position.set(
//                 Math.random()*800 - 400, 
//                 500, 
//                 Math.random()*500 - 500,
//             );
//             cloud.rotation.x = 1.16;
//             cloud.rotation.y = -.12;
//             cloud.rotation.z = Math.random()*2*Math.PI;
//             cloud.material.opacity = 0.55;
//             cloudParticles.push(cloud);
//             scene.add(cloud);
//         }
//     });

//     let directionalLight = new THREE.DirectionalLight(0xff8c19);
//     directionalLight.position.set(0,0,1);
//     scene.add(directionalLight);

//     let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
//     orangeLight.position.set(200,300,100);
//     scene.add(orangeLight);
//     let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
//     redLight.position.set(100,300,100);
//     scene.add(redLight);
//     let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
//     blueLight.position.set(300,300,200);
//     scene.add(blueLight);


//     // Now that everything has been initialized, let's put it in motion.
//     animate();
// }

// // document.body.appendChild( renderer.domElement );

// function animate() {
//     cloudParticles.forEach(p => {
//         p.rotation.z -= 0.001;
//     });
//     renderer.render( scene, camera );
//     requestAnimationFrame( animate );
// };

// init();


let scene, camera, renderer;
let renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,1,1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    // renderer = new THREE.WebGLRenderer();

    // scene.fog is color of fog
    renderer.setSize(window.innerWidth,window.innerHeight);
    scene.fog = new THREE.FogExp2(0x03544e, 0.001);
    renderer.setClearColor(scene.fog.color);
    // TODO: How to replace appendchild()
    // document.body.appendChild(renderer.domElement);

    let loader = new THREE.TextureLoader();
    // TODO: There might be problems with static asset loading...
    loader.load("./smoke-1.png", function(texture){
        //texture is loaded
        cloudGeo = new THREE.PlaneBufferGeometry(500,500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map:texture,
            transparent: true
        });
        
        for(let p=0; p<50; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
              Math.random()*800 -400,
              500,
              Math.random()*500-500
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*2*Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud);
            scene.add(cloud);
          }      

    });

    
    render();
}

function render() {
    renderer.render(scene,camera);
    requestAnimationFrame(render);
}

init();
