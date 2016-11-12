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
  const yRotation = type === 0 ? 0 : Math.PI / 2
  const rotation = { x: 0, y: yRotation, z: 0 }

  const level = {
    rotation: yRotation,
    children: []
  }

  if (type === 0) {
    level.children = [
      new Box({ rotation, position: [x, y, z] }),
      new Box({ rotation, position: [x, y, z - 1] }),
      new Box({ rotation, position: [x, y, z - 2] })
    ]
  } else if (type === 1) {
    level.children = [
      new Box({ rotation, position: [x - 1, y, z - 1] }),
      new Box({ rotation, position: [x, y, z - 1] }),
      new Box({ rotation, position: [x + 1, y, z - 1] })
    ]
  }

  level.children.forEach(component => component.addTo(world))

  return level
}

const tower = ([x, y, z], height) => {
  const levels = []
  for (let i = y; i < height; i++) {
    levels.push(level([ x, i + 0.5, z ], i % 2))
  }

  return { levels }
}

const tower1 = tower([ 0, 0, 0 ], 10)
const tower2 = tower([ 0, 0, 6 ], 10)


console.log(tower2.levels[9])

// === LOOPS ===

new WHS.Loop(function (clock) {
  const box = tower1.levels[9].children[1]

  if (box.position.z > 5) {
    this.stop(world)
  } else {
    box.position.z += clock.getDelta() * 0.5
  }
}).start(world)

new WHS.Loop(function(clock) {
  const delta = clock.getDelta()
  const box = tower2.levels[9].children[1]

  if (box.position.z > 8) {
    box.position.y -= delta * 0.5
  } else {
    box.position.z += delta * 0.5
  }

  if (box.position.y < 0.5) {
    this.stop(world)
  }
}).start(world)


// === START ===
world.start()
world.setControls(new WHS.OrbitControls())
