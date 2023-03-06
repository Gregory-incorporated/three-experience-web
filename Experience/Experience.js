import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";

import Sizes from "./Utils/Sizes";

export default class Experience {
  static instance;
  constructor() {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = this.canvas;
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
  }
}
