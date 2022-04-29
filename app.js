import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import {OrbitControls} from './lib/OrbitControls.js';
import {GLTFLoader} from './lib/GLTFLoader.js';
import {OBJLoader} from './lib/OBJLoader.js';
import {MTLLoader} from './lib/MTLLoader.js';

let ship;
let palms = [];

// Retorna un entero aleatorio entre min (incluido) y max (excluido)
// ¡Usando Math.round() te dará una distribución no-uniforme!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


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
  const far = 1250;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 10;
  camera.position.y = 2;
  camera.position.x = 25;

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
    const newScale = 2;
        ship.scale.y = newScale;
        ship.scale.x = newScale;
        ship.scale.z = newScale;
    scene.add(gltf.scene)
  }, undefined, (error) => {
    console.log(error)
  });
}

function loadPalms(scene,x,y,z) {
  const loader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('./assets/palm/palm.mtl', (mtl) => {
    mtl.preload();
    loader.setMaterials(mtl);
    loader.load('./assets/palm/palm.obj', (root) => {
        root.position.y = y;
        root.position.x = x;
        root.position.z = z;
  
        root.rotation.x = 1.5 * Math.PI;
        
        const newScale = 0.004;
        root.scale.y = newScale;
        root.scale.x = newScale;
        root.scale.z = newScale;
  
        scene.add(root);
        palms.push(root);
      });
  });
}

function genIsland(radious, wSegments, hSegments, x,y,z) {
  const geometry = new THREE.SphereGeometry( radious, wSegments, hSegments, 0, Math.PI * 2, 0, Math.PI/4);
  const material = new THREE.MeshBasicMaterial( { color: "#CABD97" } );
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.y = y;
  sphere.position.x = x;
  sphere.position.z = z;
  return sphere
}

function loadIslands(scene) {
  let radious, wSegments, hSegments, x, y, z;
  for(let i = 0; i < 7; i++){
    radious = getRandomInt(12,40)
    wSegments = getRandomInt(3,radious)
    hSegments = getRandomInt(2,radious)
    x = 25 + getRandomInt(-100,100)
    y= 3 - radious
    z= 10 + getRandomInt(-100,100)
    let max_palms = getRandomInt(0,10);
    for(let k = 0; k< max_palms;k++){
      loadPalms(scene,x+ getRandomInt(-radious/2,radious/2),2,z+getRandomInt(-radious/2,radious/2))
    }
    scene.add( genIsland(radious,wSegments,hSegments,x,y,z));
  }
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
  loadPalms(scene,3,5,0);
  loadIslands(scene);

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