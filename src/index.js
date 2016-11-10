const world = new WHS.World({
  stats: 'fps',
  autoresize: 'window',

  gravity: [ 0, -100, 0 ],

  camera: {
    position: [ 0, 10, 50 ]
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

sphere.addTo(world)

new WHS.Plane({
  geometry: {
    width: 100,
    height: 100
  },

  mass: 0,

  material: {
    color: 0x447F8B,
    kind: 'phong'
  },

  rotation: {
    x: - Math.PI / 2
  }
}).addTo(world)


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

world.start()
world.setControls(new WHS.OrbitControls())
