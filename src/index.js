import { flatUIHexColors } from './lib/color-utils.js'
import { pick } from './lib/random-utils.js'

// === WORLD ===

const world = new WHS.World({
  stats: 'fps',
  autoresize: 'window',

  gravity: [ 0, -100, 0 ],

  camera: {
    position: [ -5, 14, 10 ],
    near: 0.01,
    far: 1000
  },

  rendering: {
    background: {
      color: 0x162129
    },

    renderer: {
      antialias: true
    }
  },

  shadowmap: {
    type: THREE.PCFSoftShadowMap
  }
})

// === LIGHTING ===

new WHS.AmbientLight({
  light: {
    intensity: 0.5
  }
}).addTo(world)

new WHS.PointLight({
  light: {
    intensity: 0.5,
    distance: 100
  },

  shadowmap: {
    fov: 90
  },

  position: [0, 10, 10]
}).addTo(world)

// === MESHES ===

new WHS.Plane({
  geometry: {
    width: 1000,
    height: 1000
  },

  mass: 0,

  material: {
    color: 0x447F8B,
    kind: 'lambert'
  },

  rotation: {
    x: - Math.PI / 2
  }
}).addTo(world)

const sphere = new WHS.Sphere({
  geometry: {
    radius: 3,
    widthSegments: 32,
    heightSegments: 32
  },

  mass: 10, // Mass of physics object.

  material: {
    color: 0xff00000,
    kind: 'lambert'
  },

  position: [0, 100, 0]
})

const boxMaker = (position, rotation = { x:0, y:0, z:0 }) => new WHS.Box({
  geometry: {
    width: 3,
    height: 1,
    depth: 1
  },
  material: {
    color: pick(flatUIHexColors),
    kind: 'lambert'
  },
  position,
  rotation
})

const base = 0.5
const levelMaker = (height) => {
  const y = base + height

  const rotation = height % 2 === 0 ? { x: 0, y: 0, z: 0 } : { x: 0, y: Math.PI/2, z: 0 }

  if (height % 2 === 0) {
    boxMaker([0, y, 0], rotation).addTo(world)
    boxMaker([0, y, -1], rotation).addTo(world)
    boxMaker([0, y, -2], rotation).addTo(world)
  } else {
    boxMaker([-1, y, -1], rotation).addTo(world)
    boxMaker([0, y, -1], rotation).addTo(world)
    boxMaker([1, y, -1], rotation).addTo(world)
  }
}

for (let i = 0; i < 10; i++) {
  levelMaker(i)
}

// === START ===
world.start()
world.setControls(new WHS.OrbitControls())
