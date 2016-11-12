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

// === COMPONENTS ===

class Box extends WHS.Box {
  static defaults = {
    material: {
      kind: 'lambert'
    },
    geometry: {
      width: 3,
      height: 1,
      depth: 1
    },
    mass: 0
  }

  constructor (props) {
    super({
      ... Box.defaults,
      material: {
        ...Box.defaults.material,
        color: pick(flatUIHexColors)
      },
      ...props
    })
  }
}

// === World Construction ===

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

const level = ([x, y, z], type) => {
  const rotation = type === 0 ? { x: 0, y: 0, z: 0 } : { x: 0, y: Math.PI/2, z: 0 }
  if (type === 0) {
    new Box({ rotation, position: [x, y, z] }).addTo(world)
    new Box({ rotation, position: [x, y, z - 1] }).addTo(world)
    new Box({ rotation, position: [x, y, z - 2] }).addTo(world)
  } else if (type === 1) {
    new Box({ rotation, position: [x - 1, y, z - 1] }).addTo(world)
    new Box({ rotation, position: [x, y, z - 1] }).addTo(world)
    new Box({ rotation, position: [x + 1, y, z - 1] }).addTo(world)
  }
}

const tower = ([x, y, z], height) => {
  for (let i = y; i < height; i++) {
    level([ x, i + 0.5, z ], i % 2)
  }
}

tower([ 0, 0, 0 ], 10)
tower([ 4, 0, 4 ], 10)

// === START ===
world.start()
world.setControls(new WHS.OrbitControls())
