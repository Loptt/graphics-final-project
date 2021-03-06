import {GLTFLoader} from '../lib/GLTFLoader.js';

class Ship {
  constructor(maxSpeed, minRotationSpeed, acceleration, steerRate) {
    this.object = null;
    this.speed = 0;
    this.orientation = 0;
    this.maxSpeed = maxSpeed;
    this.minRotationSpeed = minRotationSpeed;
    this.acceleration = acceleration;
    this.steerRate = steerRate
    this.assetPath = './assets/going_merry/scene.gltf';
  }

  load(scene) {
    const loader = new GLTFLoader();
    loader.load(this.assetPath, (gltf) => {
      let object = gltf.scene;
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      })
      object.position.y = -3;
      const newScale = 2.7;
      object.scale.y = newScale;
      object.scale.x = newScale;
      object.scale.z = newScale;
      scene.add(object)
      this.object = object;
    }, undefined, (error) => {
      console.log(error)
    });
  }

  moveForward(delta) {
    this.orientation = this.object.rotation.y;
    // Ship's model orientation in x is inverted, so invert before adding to position.
    this.object.position.x += delta * Math.cos(this.orientation) * -1;
    this.object.position.z += delta * Math.sin(this.orientation);
  }

  moveBackward(delta){
    this.orientation = this.object.rotation.y;
    // Ship's model orientation in x is inverted, so invert before adding to position.
    this.object.position.x -= delta * Math.cos(this.orientation) * -1;
    this.object.position.z -= delta * Math.sin(this.orientation);
  }

  accelerate(delta) {
    let newSpeed = this.speed + delta > 0 ? this.speed + delta : 0;

    if (newSpeed > this.maxSpeed) {
      newSpeed = this.maxSpeed;
    }
    this.speed = newSpeed
  }

  steer(delta) {
    if (this.speed < this.minRotationSpeed) {
      return;
    }
    this.object.rotation.y += delta
  }
  
  update(islands) {
    this.moveForward(this.speed);
    let collides = false
    islands.forEach(island => {
      let ierror = island.geometry.parameters.radius * .40
      let ix = island.position.x
      let iz = island.position.z
      if(Math.abs(this.object.position.x - ix) <= ierror && Math.abs(this.object.position.z - iz) <= ierror){
        collides = true || collides
      }
    });
    if(collides){
      this.moveBackward(this.speed)
    }
  }

  isInitialized() {
    return !!this.object
  }
}

export {Ship};