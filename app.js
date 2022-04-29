import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import {GLTFLoader} from './GLTFLoader.js';

function main() {
  const canvas = document.querySelector('#glcanvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  const loader = new GLTFLoader();

  const fov = 75;
  const aspect = 2; 
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 1;

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  let ship;

  loader.load('./assets/going_merry/going_merry.gltf', (gltf) => {
    ship = gltf.scene;
    scene.add(gltf.scene)
  }, undefined, (error) => {
    console.log(error)
  });

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

  const cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);

  function render(time) {
    time *= 0.001;

    cube.rotation.x = time;
    cube.rotation.y = time;

    if (ship) {
      ship.rotation.y = time;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();