const KEYS = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    RIGHT: "ArrowRight",
    LEFT: "ArrowLeft",
}

const SHIPCONSTANTS = {
    acceleration: 0.002,
    steerRate: Math.PI / 200,
    maxSpeed: 0.75,
    minRotationSpeed: 0.004
}

const ISLANDCONSTANTS = {
    amount: 20,
    maxRadius: 100,
    minRadius: 15,
    minX: -300,
    maxX: 300,
    minZ: -300,
    maxZ: 300,
    maxVegetation: 10,
    vegetationDistance: 5,
    notMin: -30,
    notMax: 30,
}

export {KEYS, SHIPCONSTANTS, ISLANDCONSTANTS}
