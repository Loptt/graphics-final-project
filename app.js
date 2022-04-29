import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import {OrbitControls} from './lib/OrbitControls.js';
import {GLTFLoader} from './lib/GLTFLoader.js';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';

let ship;
let palms = [];

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
  const near = 2;
  const far = 25;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 10;
  camera.position.y = 2;
  camera.position.x = 1;

  return camera;
}

function configureScene() {
  const scene = new THREE.Scene();
  {
    const color = 0xFFFFFF;
    const sunIntensity = 2;
    const sunLight = new THREE.DirectionalLight(color, sunIntensity);
    sunLight.position.set(-1, 2, 4);
    scene.add(sunLight);

    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0x3daeff;  // brownish orange
    const hemisphereIntensity = 1;
    const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisphereIntensity);
    scene.add(hemisphereLight);

    scene.background = new THREE.Color(skyColor);
  }

  return scene;
}

function loadShip(scene) {
  const loader = new GLTFLoader();
  loader.load('./assets/going_merry/scene.gltf', (gltf) => {
    ship = gltf.scene;
    ship.position.y = 3;
    scene.add(gltf.scene)
  }, undefined, (error) => {
    console.log(error)
  });
}

function loadPalms(scene) {
  const loader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('./assets/palm/palm.mtl', (mtl) => {
    mtl.preload();
    loader.setMaterials(mtl);
    loader.load('./assets/palm/palm.obj', (root) => {
        root.position.y = 3;
        root.position.x = 5;
        root.position.z = 0;
  
        root.rotation.x = 1.5 * Math.PI;
        
        const newScale = 0.003;
        root.scale.y = newScale;
        root.scale.x = newScale;
        root.scale.z = newScale;
  
        scene.add(root);
        palms.push(root);
      });
  });
}

function main() {
  const canvas = document.querySelector('#glcanvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  const loader = new GLTFLoader();
  const camera = configureCamera();
  const scene = configureScene();

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  loadShip(scene);
  loadPalms(scene);

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (ship) {
      ship.rotation.y = time * 0.3;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();