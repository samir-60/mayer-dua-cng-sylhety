import * as THREE from 'three';

// Mutable 3D state accessed directly within useFrame across 3D scene components without triggering React re-renders
export const vehicle3DState = {
  position: new THREE.Vector3(0, 0.4, 0),
  headingY: 0,
  speed: 0,
  speedKmh: 0,
};

// Mutable driving input state shared between keyboard listeners and on-screen HUD buttons
export const vehicleInputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
};

