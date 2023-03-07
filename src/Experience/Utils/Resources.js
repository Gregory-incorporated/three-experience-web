import * as THREE from "three";

import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience.js";

export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.assets = assets;
    this.items = {};
    this.queue = this.assets.length;
    this.loaded = 0;

    this.setExperience();
    this.setLoaders();
    this.startLoading();
  }

  setExperience() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer;
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    for (const asset of this.assets) {
      if (asset.type === "glbModel") {
        this.loadGltfModel(asset);
      } else if (asset.type === "videoTexture") {
        this.loadVideoTexture(asset);
      }
    }
  }

  loadGltfModel(asset) {
    this.loaders.gltfLoader.load(asset.path, (file) => {
      this.singleAssetLoaded(asset, file);
    });
  }

  loadVideoTexture(asset) {
    const video = document.createElement("video");
    video.src = asset.path;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    // videoTexture.flipY = false;
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.magFilter = THREE.NearestFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.encoding = THREE.sRGBEncoding;

    this.singleAssetLoaded(asset, videoTexture);
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file;
    this.loaded++;
    console.log("singleAssetLoaded", file);

    if (this.loaded === this.queue) {
      console.log("created all");
      this.emit("ready");
    }
  }
}
