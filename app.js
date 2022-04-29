import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import {GLTFLoader} from './GLTFLoader.js';

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function configureCamera() {
  const fov = 75;
  const aspect = 2; 
  const near = 0.1;
  const far = 7;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 1;

  return camera;
}

function configureScene() {
  const scene = new THREE.Scene();
  {
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  return scene;
}

function main() {
  const canvas = document.querySelector('#glcanvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  const loader = new GLTFLoader();
  const camera = configureCamera();
  const scene = configureScene();

  let ship;

  loader.load('./assets/going_merry/going_merry.gltf', (gltf) => {
    ship = gltf.scene;
    scene.add(gltf.scene)
  }, undefined, (error) => {
    console.log(error)
  });

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (ship) {
      ship.rotation.y = time;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();