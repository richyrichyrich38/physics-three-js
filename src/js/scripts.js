import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// // Sets the color of the background
// renderer.setClearColor(0x000000);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 20, -30);
orbit.update();

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box)
// box.position.y = 1

// // Sets a 12 by 12 gird helper
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

// // Sets the x, y, and z axes with each having a length of 4
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

// creates the structure of the ground
const groundGeo = new THREE.PlaneGeometry(30, 30)
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh)

// created the physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0)
});

// creates the body of the ground 
const groundBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  // adds mass so able to react with gravity (only placed here as an example)
  // mass: 10,
  // keeps groundBody in place so not affected by world gravity
  type: CANNON.Body.STATIC
});
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)), 
});
world.addBody(boxBody)
// boxBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const timeStep = 1 /60;

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    box.position.copy(boxBody.position);
    box.quaternion.copy(boxBody.quaternion);

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});