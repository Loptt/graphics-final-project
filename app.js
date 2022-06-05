import * as THREE from 'https://cdn.skypack.dev/three@0.137';
import { OrbitControls } from './lib/OrbitControls.js';
import { GLTFLoader } from './lib/GLTFLoader.js';
import { OBJLoader } from './lib/OBJLoader.js';
import { MTLLoader } from './lib/MTLLoader.js';
import { KEYS, SHIPCONSTANTS } from './constants.js';
import { Ship } from './models/ship.js'

let ship = new Ship(SHIPCONSTANTS.maxSpeed,
  SHIPCONSTANTS.minRotationSpeed, 
  SHIPCONSTANTS.acceleration, 
  SHIPCONSTANTS.steerRate);

let sea;
let palms = [];

let pressedKeys = new Set();

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

function configureMusic(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);
  
  // create a global audio source
  const sound = new THREE.Audio(listener);
  sound.autoplay  = true;
  
  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('assets/sounds/weare.ogg', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.3);
    sound.play();
  });
}

function configurePalm(obj, x, y, z) {
  obj.position.y = y;
  obj.position.x = x;
  obj.position.z = z;

  obj.rotation.x = 1.5 * Math.PI;

  const newScale = 0.004;
  obj.scale.y = newScale;
  obj.scale.x = newScale;
  obj.scale.z = newScale;
}

function loadPalms(scene, x, z, r, max_palms) {
  const loader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('./assets/palm/palm.mtl', (mtl) => {
    mtl.preload();
    loader.setMaterials(mtl);
    loader.load('./assets/palm/palm.obj', (obj) => {
      for (let k = 0; k < max_palms; k++) {
        let palm = obj.clone();
        configurePalm(palm, x + getRandomInt(-r / 2, r / 2), 4, z + getRandomInt(-r / 2, r / 2))
        scene.add(palm);
        palms.push(palm);
      }
    });
  });
}

function genIsland(radious, wSegments, hSegments, x, y, z) {
  const geometry = new THREE.SphereGeometry(radious, wSegments, hSegments, 0, Math.PI * 2, 0, Math.PI / 4);
  const material = new THREE.MeshBasicMaterial({ color: "#CABD97" });
  let sphere = new THREE.Mesh(geometry, material);
  sphere.position.y = y;
  sphere.position.x = x;
  sphere.position.z = z;
  return sphere
}

function loadIslands(scene) {
  let radious, wSegments, hSegments, x, y, z;
  for (let i = 0; i < 8; i++) {
    radious = getRandomInt(15, 40)
    wSegments = getRandomInt(3, 5 + i)
    hSegments = getRandomInt(2, 7 + i)
    x = 25 + getRandomInt(-100, 100)
    y = 10 - radious
    z = 10 + getRandomInt(-100, 100)
    let max_palms = getRandomInt(0, 5);
    for (let k = 0; k < max_palms; k++) {
      loadPalms(scene, x, z, radious, max_palms)
    }
    scene.add(genIsland(radious, wSegments, hSegments, x, y, z));
  }
}

function createFloor(scene) {
  let waterGeo = new THREE.BoxGeometry(1000, 1000, 100, 22, 22);
  let floor = new THREE.Mesh(waterGeo, new THREE.MeshLambertMaterial({
    color: 0x6092c1,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -46;
  floor.receiveShadow = true;
  floor.name = "Floor"
  floor = floor;
  sea = floor;
  scene.add(floor);
}

function animateWaves(time) {
  let vertices = sea.geometry.attributes.position.array;
  var wavespeed = 0.02;
  var wavewidth = 0.6;
  var waveheight = 3;
  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex += 3) {
    // console.log(vertices[vertexIndex+2])
    if (vertices[vertexIndex + 2] > -1) {
      var wave1 = Math.sin((time + (vertices[vertexIndex] / wavewidth) + (vertices[vertexIndex + 1] / wavewidth)) * wavespeed) * waveheight;
      var wave2 = Math.cos((time + (vertices[vertexIndex] / wavewidth) + (vertices[vertexIndex + 1] / wavewidth)) * (wavespeed - 0.02)) * waveheight / 2 + 2;
      vertices[vertexIndex + 2] = 40 + wave1 + wave2;
    }
    // do something with vertex
  }
  sea.geometry.attributes.position.needsUpdate = true;
  sea.geometry.computeVertexNormals();
}

function controlShip(ship, key) {
  switch(key) {
    case KEYS.UP:
      ship.accelerate(SHIPCONSTANTS.acceleration);
      break;
    case KEYS.RIGHT:
      ship.steer(SHIPCONSTANTS.steerRate*-1);
      break;
    case KEYS.DOWN:
      ship.accelerate(SHIPCONSTANTS.acceleration*-1)
      break;
    case KEYS.LEFT:
      ship.steer(SHIPCONSTANTS.steerRate);
      break;
  }
}

function setupKeyListeners() {
  document.onkeydown = (e) => {
    pressedKeys.add(e.code);
  }
  document.onkeyup = (e) => {
    pressedKeys.delete(e.code);
  }
}

function processKeys(pressedKeys) {
  for (const k of pressedKeys) {
    controlShip(ship, k);
  }
}

function main() {
  const canvas = document.querySelector('#glcanvas');
  const renderer = new THREE.WebGLRenderer({ canvas });
  const camera = configureCamera();
  const scene = configureScene();
  configureMusic(camera);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  createFloor(scene);
  loadIslands(scene);
  ship.load(scene);
  
  setupKeyListeners();

  let tick = 0;
  function render(time) {
    time *= 0.001;
    tick++;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    processKeys(pressedKeys);

    if (sea) {
      animateWaves(tick)
    }

    if (ship.isInitialized()) {
      ship.update()
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main();