import {GLTFLoader} from '../lib/GLTFLoader.js';

class Ship {
  constructor() {
    this.object = null;
    this.speed = 0;
  }

  moveForward(delta) {
    let rotation = this.object.rotation.y// + Math.PI;

    //console.log("COS ",Math.cos(rotation));
    //console.log("SIN ", Math.sin(rotation));
    console.log("ANGLE ", rotation);
    //console.log("X ", this.object.position.x);
    //console.log("Z ", this.object.position.z);
    this.object.position.x += delta * Math.sin(rotation);
    this.object.position.z += delta * Math.cos(rotation);
  }

  load(scene) {
    const loader = new GLTFLoader();
    loader.load('./assets/going_merry/scene.gltf', (gltf) => {
      let object = gltf.scene;
      object.position.y = -1;
      const newScale = 2;
      object.scale.y = newScale;
      object.scale.x = newScale;
      object.scale.z = newScale;
      scene.add(object)
      this.object = object;
    }, undefined, (error) => {
      console.log(error)
    });
  }
}

export {Ship};